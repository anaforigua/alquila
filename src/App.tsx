import React, { useState, useEffect } from 'react';
import { AlquilerInput, AlquilerLiquidacion } from './types';
import { FuturisticPastelForm } from './components/FuturisticPastelForm';
import { FuturisticPastelReceipt } from './components/FuturisticPastelReceipt';
import { IconLogoSena } from './components/Icons';
import { ResilientMessageBroker } from './core/broker/eventBroker';
import { TwoLayerSecurityEngine } from './core/security/twoLayerSecurity';
import { validarEntradaAlquiler } from './core/calculator/alquilaPcCalculator';

export const App: React.FC = () => {
  const broker = ResilientMessageBroker.getInstance();
  const security = TwoLayerSecurityEngine.getInstance();

  const [inputData, setInputData] = useState<AlquilerInput>({
    nombreCliente: '',
    equipos: 1,
    diasIniciales: 1,
    diasAdicionales: 0,
    tipoServicio: 1
  });

  const [liquidacion, setLiquidacion] = useState<AlquilerLiquidacion | null>(null);
  const [cargando, setCargando] = useState(false);

  // Escala de fuentes 100% funcional para personas de 60+ años (Rango: 15px a 27px)
  const [escala, setEscala] = useState<number>(19);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sincronizar dinámicamente con la variable CSS raíz para que TODO el documento escale
  useEffect(() => {
    document.documentElement.style.setProperty('--font-base-size', `${escala}px`);
  }, [escala]);

  const handleInputChange = (updated: Partial<AlquilerInput>) => {
    setInputData((prev) => ({ ...prev, ...updated }));
  };

  // Botones funcionales de aumento y disminución de letra
  const aumentarLetra = () => {
    setEscala((actual) => Math.min(27, actual + 2));
  };

  const disminuirLetra = () => {
    setEscala((actual) => Math.max(15, actual - 2));
  };

  // Cálculo procesado en background a través del Message Broker y 2 capas de ciberseguridad
  const handleCalcular = async () => {
    const validacion = validarEntradaAlquiler(inputData);
    if (!validacion.valido) {
      alert(validacion.errores.join('\n'));
      return;
    }

    setCargando(true);

    try {
      // Doble capa de ciberseguridad invisible al usuario
      const signature = security.generateClientIntegritySignature(inputData as unknown as Record<string, unknown>);
      security.verifyApiTokenAndContract('BEARER-SENA-SECURE-TOKEN-2020', {
        nombreCliente: inputData.nombreCliente,
        equipos: inputData.equipos,
        diasIniciales: inputData.diasIniciales,
        diasAdicionales: inputData.diasAdicionales,
        tipoServicio: inputData.tipoServicio,
        signature
      });

      // El Message Broker gestiona internamente la resiliencia entre microservicios
      const resBroker = await broker.orchestrateCalculation(
        inputData.equipos,
        inputData.diasIniciales,
        inputData.diasAdicionales,
        inputData.tipoServicio
      );

      // Cifrado y base de datos segura
      security.encryptAtRest(`Cliente: ${inputData.nombreCliente} | Total: ${resBroker.total}`);

      const liq: AlquilerLiquidacion = {
        nombreCliente: inputData.nombreCliente.trim(),
        tipoServicioCodigo: inputData.tipoServicio,
        tipoServicioNombre:
          inputData.tipoServicio === 1
            ? 'Dentro de la Ciudad'
            : inputData.tipoServicio === 2
            ? 'Fuera de la ciudad'
            : 'Dentro del Establecimiento',
        equipos: inputData.equipos,
        diasIniciales: inputData.diasIniciales,
        diasAdicionales: inputData.diasAdicionales,
        valorDiaBase: 35000,
        valorDiaAdicional: 34300,
        valorAlquilerInicial: resBroker.alquilerBase,
        valorDiasAdicionales: resBroker.alquilerAdicional,
        descuentoAdicionalCalculado: resBroker.alquilerAdicional * 0.02,
        descuentoVisual: resBroker.descuentoVisual,
        descuentoFormulaEfectivo: resBroker.descuentoFormulaEfectivo,
        valorDomicilio: resBroker.domicilio,
        totalPagar: resBroker.total,
        fechaLiquidacion: new Date().toISOString(),
        folioAuditoria: `SENA-2020-${Math.floor(Math.random() * 9000 + 1000)}`,
        firmaCriptografica: `HMAC-${signature}`
      };

      setLiquidacion(liq);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`No pudimos procesar la liquidación: ${msg}`);
    } finally {
      setCargando(false);
    }
  };

  const handleLeerVoz = () => {
    if (!('speechSynthesis' in window)) {
      alert('Su navegador no soporta síntesis de voz.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cliente = liquidacion ? liquidacion.nombreCliente : inputData.nombreCliente || 'Estimado usuario';
    const totalTexto = liquidacion ? `${liquidacion.totalPagar.toLocaleString('es-CO')} pesos colombianos` : 'aún por calcular';

    const texto = `Hola ${cliente}. Su solicitud en ALQUILAPC tiene un total de ${totalTexto}. Los computadores y días seleccionados fueron procesados con éxito por el sistema oficial del SENA.`;

    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'es-CO';
    u.rate = 0.9;
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="neo-container">
      
      {/* Cabecera Neo-Futurista Pastel con Logo Vectorial */}
      <header className="neo-header">
        <div className="neo-brand">
          <IconLogoSena />
          <div>
            <span className="neo-pill-tag">SENA • CGMLTI ADSI 2020</span>
            <h1 className="neo-title">ALQUILAPC</h1>
            <p className="neo-subtitle">Alquiler de Computadores </p>
          </div>
        </div>

        {/* Barra de accesibilidad funcional: A- y A+ (Sin botón de contraste) */}
        <div className="neo-accessibility-bar">
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', padding: '0 0.35rem' }}>
            Tamaño de Letra ({escala}px):
          </span>
          <button
            type="button"
            className="neo-btn-icon"
            onClick={disminuirLetra}
            disabled={escala <= 15}
            title="Hacer letra más pequeña"
            aria-label="Disminuir tamaño de fuente"
          >
            A -
          </button>
          <button
            type="button"
            className="neo-btn-icon"
            onClick={aumentarLetra}
            disabled={escala >= 27}
            title="Hacer letra más grande"
            aria-label="Aumentar tamaño de fuente"
          >
            A +
          </button>
        </div>
      </header>

      {/* Distribución Principal: Responsiva para >= 1026px y <= 720px */}
      <main className="neo-grid-layout">
        
        <FuturisticPastelForm
          inputData={inputData}
          onChangeInput={handleInputChange}
          onCalcular={handleCalcular}
          cargando={cargando}
        />

        {liquidacion ? (
          <FuturisticPastelReceipt
            liquidacion={liquidacion}
            onImprimir={() => window.print()}
            onLeerVoz={handleLeerVoz}
            isSpeaking={isSpeaking}
          />
        ) : (
          <div className="neo-card" style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #ecfdf5 0%, #ede9fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #a7f3d0' }}>
              <IconLogoSena className="w-12 h-12" />
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              Su Factura Oficial Aparecerá Aquí
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '340px', lineHeight: 1.5 }}>
              Complete los tres sencillos pasos a la izquierda y presione el botón para calcular su total oficial.
            </p>
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #faf5ff 100%)', border: '1px solid #c4b5fd', borderRadius: '16px', padding: '1.25rem', width: '100%', textAlign: 'left', fontSize: '0.9rem' }}>
              <strong style={{ color: '#047857', display: 'block', marginBottom: '0.25rem' }}>Tarifas Oficiales SENA:</strong>
              <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <li>Día normal: $ 35.000 COP</li>
                <li>Días adicionales: $ 34.300 COP</li>
                <li>Domicilio fuera de ciudad: $ 60.725 COP</li>
              </ul>
            </div>
          </div>
        )}

      </main>

      <footer style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem 0' }}>
        ALQUILAPC • Servicio Nacional de Aprendizaje SENA • Centro de Gestión de Mercados CGMLTI
      </footer>

    </div>
  );
};
