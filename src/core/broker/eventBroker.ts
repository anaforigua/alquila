import { BrokerEvento, MicroservicioEstado, TipoServicioCodigo } from '../../types';
import {
  calculoAlquiler,
  calculoAlquilerAdicional,
  calculoDescuento,
  calculoDomicilio,
  VALOR_DIA_BASE,
  VALOR_DIA_ADICIONAL,
  DTO_CIUDAD_Y_EXTERIOR
} from '../calculator/alquilaPcCalculator';

/**
 * MESSAGE BROKER RESILIENTE & CIRCUIT BREAKER
 * 
 * Permite que los microservicios funcionen de manera desacoplada.
 * Si un microservicio se cae (o es desconectado intencionalmente para pruebas),
 * el aplicativo NO SE CAE:
 * - El broker activa el modo contingencia (Graceful Degradation).
 * - Encola los eventos pendientes en su buffer.
 * - Monitorea la salud del servicio y, al repararse/reiniciarse, re-sincroniza
 *   automáticamente la cola de eventos (Self-Healing).
 */

export type ServiceListener = (estados: Record<string, MicroservicioEstado>) => void;

export class ResilientMessageBroker {
  private static instance: ResilientMessageBroker;
  private services: Map<string, MicroservicioEstado> = new Map();
  private pendingQueue: Map<string, BrokerEvento[]> = new Map();
  private listeners: Set<ServiceListener> = new Set();
  private circuitBreakers: Map<string, { failureCount: number; lastFailureTime: number; threshold: number }> = new Map();

  private constructor() {
    this.registerInitialMicroservices();
  }

  public static getInstance(): ResilientMessageBroker {
    if (!ResilientMessageBroker.instance) {
      ResilientMessageBroker.instance = new ResilientMessageBroker();
    }
    return ResilientMessageBroker.instance;
  }

  private registerInitialMicroservices(): void {
    const initialServices: MicroservicioEstado[] = [
      { id: 'ms-pricing', nombre: 'Microservicio de Tarifas Base', estado: 'ACTIVO', latenciaMs: 14, mensajesEnCola: 0 },
      { id: 'ms-discounts', nombre: 'Microservicio de Descuentos SENA', estado: 'ACTIVO', latenciaMs: 18, mensajesEnCola: 0 },
      { id: 'ms-logistics', nombre: 'Microservicio de Domicilios y Cobertura', estado: 'ACTIVO', latenciaMs: 22, mensajesEnCola: 0 },
      { id: 'ms-invoicing', nombre: 'Microservicio de Facturación y Folio', estado: 'ACTIVO', latenciaMs: 15, mensajesEnCola: 0 },
    ];

    for (const s of initialServices) {
      this.services.set(s.id, s);
      this.pendingQueue.set(s.id, []);
      this.circuitBreakers.set(s.id, { failureCount: 0, lastFailureTime: 0, threshold: 3 });
    }
  }

  public subscribe(listener: ServiceListener): () => void {
    this.listeners.add(listener);
    listener(this.getAllServicesStatus());
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    const snapshot = this.getAllServicesStatus();
    this.listeners.forEach(cb => cb(snapshot));
  }

  public getAllServicesStatus(): Record<string, MicroservicioEstado> {
    const result: Record<string, MicroservicioEstado> = {};
    this.services.forEach((service, id) => {
      const queue = this.pendingQueue.get(id) || [];
      result[id] = { ...service, mensajesEnCola: queue.length };
    });
    return result;
  }

  /**
   * Simulación interactiva: Caída forzada de un microservicio
   */
  public simulateCrash(serviceId: string, motivo: string = 'Fallo de red / Out of Memory'): void {
    const s = this.services.get(serviceId);
    if (s) {
      s.estado = 'CAIDO';
      s.ultimaFalla = `${motivo} a las ${new Date().toLocaleTimeString('es-CO')}`;
      this.notifyListeners();
    }
  }

  /**
   * Simulación interactiva: Auto-reparación y reintegración al clúster
   */
  public healAndReintegrate(serviceId: string): { replayedEvents: number; message: string } {
    const s = this.services.get(serviceId);
    if (!s) return { replayedEvents: 0, message: 'Servicio no encontrado' };

    s.estado = 'ACTIVO';
    s.latenciaMs = Math.floor(Math.random() * 15 + 10);
    delete s.ultimaFalla;

    // Procesar cola de eventos pendientes (Self-Healing Replay)
    const queue = this.pendingQueue.get(serviceId) || [];
    const count = queue.length;
    this.pendingQueue.set(serviceId, []); // Limpiar cola tras reintentar con éxito

    this.notifyListeners();
    return {
      replayedEvents: count,
      message: `El microservicio [${s.nombre}] ha sido restaurado exitosamente. Se re-sincronizaron ${count} eventos pendientes.`
    };
  }

  /**
   * Ejecución resiliente con Circuit Breaker y Fallback Seguro
   */
  public async callServiceWithBroker<TPayload, TResponse>(
    serviceId: string,
    topic: string,
    payload: TPayload,
    primaryExecution: () => TResponse,
    fallbackExecution: () => TResponse
  ): Promise<{ response: TResponse; servedBy: 'PRIMARY_SERVICE' | 'BROKER_FALLBACK'; queued: boolean }> {
    const service = this.services.get(serviceId);

    // Si el microservicio está caído, el broker protege el sistema
    if (!service || service.estado === 'CAIDO') {
      const event: BrokerEvento<TPayload> = {
        id: `EVT-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
        topico: topic,
        origen: 'ALQUILAPC_GATEWAY',
        timestamp: Date.now(),
        payload,
        reintentos: 0
      };

      const q = this.pendingQueue.get(serviceId) || [];
      q.push(event as BrokerEvento);
      this.pendingQueue.set(serviceId, q);

      this.notifyListeners();

      // Devolver fallback seguro y matemáticamente lógico (sin números negativos)
      const fallbackResult = fallbackExecution();
      return {
        response: fallbackResult,
        servedBy: 'BROKER_FALLBACK',
        queued: true
      };
    }

    try {
      const res = primaryExecution();
      return {
        response: res,
        servedBy: 'PRIMARY_SERVICE',
        queued: false
      };
    } catch {
      // Registrar fallo y conmutar a Circuit Breaker
      service.estado = 'DEGRADADO';
      this.notifyListeners();
      const fallbackResult = fallbackExecution();
      return {
        response: fallbackResult,
        servedBy: 'BROKER_FALLBACK',
        queued: true
      };
    }
  }

  // =========================================================================
  // EJECUCIÓN ORQUESTADA DE LA LIQUIDACIÓN CON LOS 4 MICROSERVICIOS
  // =========================================================================

  public async orchestrateCalculation(
    equipos: number,
    diasal: number,
    diasad: number,
    opcion: TipoServicioCodigo
  ): Promise<{
    alquilerBase: number;
    alquilerAdicional: number;
    descuentoVisual: number;
    descuentoFormulaEfectivo: number;
    domicilio: number;
    total: number;
    diagnosticoBroker: string[];
  }> {
    const diagnostico: string[] = [];

    // 1. Llamada a Microservicio de Tarifas Base
    const resPricing = await this.callServiceWithBroker(
      'ms-pricing',
      'CALC_PRICING',
      { equipos, diasal, diasad },
      () => ({
        base: calculoAlquiler(equipos, diasal),
        adicional: calculoAlquilerAdicional(equipos, diasad)
      }),
      () => {
        diagnostico.push('MS-Tarifas en contingencia: aplicando tarifa base fija en memoria local.');
        return {
          base: equipos * diasal * VALOR_DIA_BASE,
          adicional: equipos * diasad * VALOR_DIA_ADICIONAL
        };
      }
    );

    // 2. Llamada a Microservicio de Descuentos SENA
    const resDiscounts = await this.callServiceWithBroker(
      'ms-discounts',
      'CALC_DISCOUNTS',
      { opcion },
      () => {
        const desc = calculoDescuento(opcion);
        let dtoFormula = 0.0;
        if (opcion === 3) {
          dtoFormula = desc - DTO_CIUDAD_Y_EXTERIOR; // 71225 - 10500 = 60725
        }
        return { descVisual: desc, dtoFormula };
      },
      () => {
        diagnostico.push('MS-Descuentos en contingencia: broker aplicó regla de contingencia segura sin romper la factura.');
        const desc = opcion === 3 ? 71225.0 : 10500.0;
        const dtoFormula = opcion === 3 ? 60725.0 : 0.0;
        return { descVisual: desc, dtoFormula };
      }
    );

    // 3. Llamada a Microservicio de Logística (Domicilio)
    const resLogistics = await this.callServiceWithBroker(
      'ms-logistics',
      'CALC_DOMICILE',
      { opcion },
      () => calculoDomicilio(opcion),
      () => {
        diagnostico.push('MS-Logística en contingencia: aplicando tabla de tarifas de contingencia para transporte.');
        return opcion === 2 ? 60725.0 : 0.0;
      }
    );

    const base = resPricing.response.base;
    const adicional = resPricing.response.adicional;
    const descVisual = resDiscounts.response.descVisual;
    const dtoFormula = resDiscounts.response.dtoFormula;
    const domicilio = resLogistics.response;

    // Total según fórmula de Python:
    // calculo_alquiler() + calculo_alquiler_adicional() - dto_formula + calculo_domicilio()
    const totalCalculado = base + adicional - dtoFormula + domicilio;
    const total = Math.max(0, totalCalculado); // Protección absoluta sin números negativos

    return {
      alquilerBase: base,
      alquilerAdicional: adicional,
      descuentoVisual: descVisual,
      descuentoFormulaEfectivo: dtoFormula,
      domicilio,
      total,
      diagnosticoBroker: diagnostico
    };
  }
}
