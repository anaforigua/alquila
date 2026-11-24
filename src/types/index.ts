/**
 * Modelos de datos para ALQUILAPC - SENA
 * Basado estrictamente en especificaciones ADSI CGMLTI e ISO/IEC 25010
 */

export type TipoServicioCodigo = 1 | 2 | 3;

export interface TipoServicioInfo {
  codigo: TipoServicioCodigo;
  nombre: string;
  descripcion: string;
  costoDomicilio: number;
  descuentoBase: number;
  icono: string;
}

export interface AlquilerInput {
  nombreCliente: string;
  equipos: number;       // Estrictamente entero > 0 (sin negativos)
  diasIniciales: number; // Estrictamente entero > 0 (sin negativos)
  diasAdicionales: number; // Estrictamente entero >= 0 (sin negativos)
  tipoServicio: TipoServicioCodigo;
}

export interface AlquilerLiquidacion {
  // Datos del cliente y servicio
  nombreCliente: string;
  tipoServicioCodigo: TipoServicioCodigo;
  tipoServicioNombre: string;
  
  // Parámetros numéricos base
  equipos: number;
  diasIniciales: number;
  diasAdicionales: number;

  // Tarifas fijas del sistema SENA
  valorDiaBase: number;          // $35.000 COP
  valorDiaAdicional: number;     // $34.300 COP

  // Desgloses calculados (fieles a Python)
  valorAlquilerInicial: number;       // equipos * diasal * vdia
  valorDiasAdicionales: number;       // equipos * diasad * vdia_adicional
  descuentoAdicionalCalculado: number; // valorDiasAdicionales * 0.02
  descuentoVisual: number;            // 10.500 o 71.225
  descuentoFormulaEfectivo: number;   // 0.0 o (71.225 - 10.500 = 60.725)
  valorDomicilio: number;             // 60.725 (fuera ciudad) o 0.0
  totalPagar: number;                 // Total neto final

  // Metadatos y firma de auditoría
  fechaLiquidacion: string;
  folioAuditoria: string;
  firmaCriptografica: string;
}

export interface MicroservicioEstado {
  id: string;
  nombre: string;
  estado: 'ACTIVO' | 'DEGRADADO' | 'CAIDO';
  latenciaMs: number;
  mensajesEnCola: number;
  ultimaFalla?: string;
}

export interface BrokerEvento<T = unknown> {
  id: string;
  topico: string;
  origen: string;
  timestamp: number;
  payload: T;
  reintentos: number;
}

export interface AuditoriaEvento {
  id: string;
  timestamp: string;
  capa: 'FRONTEND' | 'API' | 'MICROSERVICES' | 'DATABASE';
  subcapa: 'CAPA_1' | 'CAPA_2';
  accion: string;
  resultado: 'PERMITIDO' | 'BLOQUEADO' | 'ADVERTENCIA';
  detalles: string;
}
