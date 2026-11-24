import React from 'react';
import { AlquilerLiquidacion } from '../types';
import { formatearMonedaColombiana } from '../core/calculator/alquilaPcCalculator';
import { IconSpeaker, IconPrinter, IconLogoSena } from './Icons';

interface FuturisticPastelReceiptProps {
  liquidacion: AlquilerLiquidacion;
  onImprimir: () => void;
  onLeerVoz: () => void;
  isSpeaking: boolean;
}

export const FuturisticPastelReceipt: React.FC<FuturisticPastelReceiptProps> = ({
  liquidacion,
  onImprimir,
  onLeerVoz,
  isSpeaking
}) => {
  const subtotalEquipos = liquidacion.valorAlquilerInicial + liquidacion.valorDiasAdicionales;
  const tieneDescuento = liquidacion.tipoServicioCodigo === 3 && liquidacion.descuentoFormulaEfectivo > 0;
  const subtotalConDescuento = subtotalEquipos - (tieneDescuento ? liquidacion.descuentoFormulaEfectivo : 0);

  return (
    <div id="seccionFacturaSena" className="neo-receipt-card seccion-imprimible">
      {/* Cabecera del Comprobante Oficial */}
      <div className="neo-receipt-header">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <IconLogoSena className="w-12 h-12" />
        </div>
        <span className="neo-tag-official">
          Comprobante Oficial SENA • CGMLTI
        </span>
        <h3 className="neo-receipt-title" style={{ fontSize: '2.2rem' }}>ALQUILAPC</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Liquidación Oficial de Alquiler de Computadores
        </p>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '0.4rem' }}>
          Folio: <strong style={{ color: '#0f172a' }}>{liquidacion.folioAuditoria}</strong> • Fecha: <strong>{new Date(liquidacion.fechaLiquidacion).toLocaleDateString('es-CO')}</strong>
        </div>
      </div>

      {/* Resumen del Cliente y Modalidad */}
      <div className="neo-receipt-client-box">
        <div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)' }}>Cliente:</span>
          <strong style={{ fontSize: '1.15rem', color: '#0f172a' }}>{liquidacion.nombreCliente}</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)' }}>Modalidad:</span>
          <strong style={{ color: '#047857' }}>{liquidacion.tipoServicioNombre}</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)' }}>Cantidad:</span>
          <strong>{liquidacion.equipos} computadores</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)' }}>Tiempo de Uso:</span>
          <strong>
            {liquidacion.diasIniciales} días iniciales {liquidacion.diasAdicionales > 0 ? `y ${liquidacion.diasAdicionales} adicionales` : ''}
          </strong>
        </div>
      </div>

      {/* Tabla Limpia de Rubros (Estrictamente con valores positivos, sin signos + ni -) */}
      <table className="neo-table-breakdown">
        <tbody>
          {/* Rubro 1: Alquiler Inicial */}
          <tr>
            <td>
              <div style={{ fontWeight: 800, color: '#0f172a' }}>Alquiler Inicial</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {liquidacion.equipos} equipos × {liquidacion.diasIniciales} días × ${liquidacion.valorDiaBase.toLocaleString('es-CO')}
              </div>
            </td>
            <td className="amount">{formatearMonedaColombiana(liquidacion.valorAlquilerInicial)}</td>
          </tr>

          {/* Rubro 2: Días Adicionales */}
          {liquidacion.diasAdicionales > 0 && (
            <tr>
              <td>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>Días Adicionales</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {liquidacion.equipos} equipos × {liquidacion.diasAdicionales} días × ${liquidacion.valorDiaAdicional.toLocaleString('es-CO')}
                </div>
              </td>
              <td className="amount">{formatearMonedaColombiana(liquidacion.valorDiasAdicionales)}</td>
            </tr>
          )}

          {/* Rubro 3: Descuento Especial SENA (Explicado en positivo como ahorro aplicado) */}
          {tieneDescuento && (
            <tr style={{ background: '#f0fdf4' }}>
              <td style={{ color: '#047857' }}>
                <div style={{ fontWeight: 800 }}>Ahorro Especial por Uso en Instalaciones SENA</div>
                <div style={{ fontSize: '0.8rem', color: '#065f46' }}>
                  Subtotal ({formatearMonedaColombiana(subtotalEquipos)}) menos descuento de ({formatearMonedaColombiana(liquidacion.descuentoFormulaEfectivo)}) = {formatearMonedaColombiana(subtotalConDescuento)}
                </div>
              </td>
              <td className="amount" style={{ color: '#047857' }}>
                {formatearMonedaColombiana(liquidacion.descuentoFormulaEfectivo)}
              </td>
            </tr>
          )}

          {/* Rubro 4: Domicilio Logístico (Mostrado en valor positivo limpio, sin signo +) */}
          {liquidacion.valorDomicilio > 0 && (
            <tr>
              <td>
                <div style={{ fontWeight: 800, color: '#0f172a' }}>Transporte y Logística Fuera de Ciudad</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tarifa fija de transporte logístico</div>
              </td>
              <td className="amount">{formatearMonedaColombiana(liquidacion.valorDomicilio)}</td>
            </tr>
          )}

          {/* Gran Total Neto a Pagar */}
          <tr className="total-highlight">
            <td>
              <div>TOTAL A PAGAR:</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.85, textTransform: 'none' }}>
                Liquidación oficial sin recargos ocultos
              </div>
            </td>
            <td className="amount">{formatearMonedaColombiana(liquidacion.totalPagar)}</td>
          </tr>
        </tbody>
      </table>

      {/* Botones de Acción (Ocultos automáticamente al imprimir) */}
      <div className="no-imprimir" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button
          type="button"
          className="neo-btn-action voice"
          onClick={onLeerVoz}
        >
          <IconSpeaker />
          <span>{isSpeaking ? 'Detener Lectura de Voz' : 'Escuchar Resumen por Voz'}</span>
        </button>

        <button
          type="button"
          className="neo-btn-action print"
          onClick={onImprimir}
        >
          <IconPrinter />
          <span>Imprimir Factura Oficial (Solo Comprobante)</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem' }}>
        Factura generada electrónicamente por el SENA. Gracias por utilizar nuestros servicios.
      </div>
    </div>
  );
};
