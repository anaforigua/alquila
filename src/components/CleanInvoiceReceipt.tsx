import React from 'react';
import { AlquilerLiquidacion } from '../types';
import { formatearMonedaColombiana } from '../core/calculator/alquilaPcCalculator';

interface CleanInvoiceReceiptProps {
  liquidacion: AlquilerLiquidacion;
  onImprimir: () => void;
  onLeerVoz: () => void;
  isSpeaking: boolean;
}

export const CleanInvoiceReceipt: React.FC<CleanInvoiceReceiptProps> = ({
  liquidacion,
  onImprimir,
  onLeerVoz,
  isSpeaking
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-emerald-900/10 space-y-6 relative overflow-hidden transition-all duration-300">
      
      {/* Sello de agua sutil SENA */}
      <div className="absolute right-3 top-2 text-emerald-950 font-black text-7xl select-none pointer-events-none opacity-5 tracking-tighter">
        SENA
      </div>

      {/* Cabecera de la Factura Oficial */}
      <div className="border-b-2 border-dashed border-slate-200 pb-5 text-center">
        <div className="inline-block bg-emerald-100 text-emerald-900 text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider mb-2">
          Factura Oficial SENA • CGMLTI
        </div>
        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          ALQUILAPC
        </h3>
        <p className="text-sm font-semibold text-slate-500 mt-1">
          Comprobante de Liquidación de Alquiler de Computadores
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs font-mono text-slate-400">
          <span>Folio: <strong className="text-slate-700">{liquidacion.folioAuditoria}</strong></span>
          <span>•</span>
          <span>Fecha: <strong>{new Date(liquidacion.fechaLiquidacion).toLocaleDateString('es-CO')}</strong></span>
        </div>
      </div>

      {/* Resumen del Cliente */}
      <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-base">
        <div>
          <span className="text-xs uppercase font-extrabold text-slate-400 block">Cliente:</span>
          <span className="font-black text-slate-900 text-lg sm:text-xl block">{liquidacion.nombreCliente}</span>
        </div>
        <div>
          <span className="text-xs uppercase font-extrabold text-slate-400 block">Modalidad:</span>
          <span className="font-extrabold text-emerald-800 text-base sm:text-lg block">{liquidacion.tipoServicioNombre}</span>
        </div>
        <div>
          <span className="text-xs uppercase font-extrabold text-slate-400 block">Cantidad:</span>
          <span className="font-bold text-slate-800">{liquidacion.equipos} computadores</span>
        </div>
        <div>
          <span className="text-xs uppercase font-extrabold text-slate-400 block">Tiempo de uso:</span>
          <span className="font-bold text-slate-800">
            {liquidacion.diasIniciales} días iniciales {liquidacion.diasAdicionales > 0 ? `+ ${liquidacion.diasAdicionales} adicionales` : ''}
          </span>
        </div>
      </div>

      {/* Tabla Limpia de Rubros */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
              <th className="p-3 sm:p-4">Concepto</th>
              <th className="p-3 sm:p-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-base sm:text-lg">
            <tr>
              <td className="p-3 sm:p-4">
                <span className="font-bold text-slate-900 block">Alquiler Inicial</span>
                <span className="text-xs text-slate-500">
                  {liquidacion.equipos} equipos × {liquidacion.diasIniciales} días
                </span>
              </td>
              <td className="p-3 sm:p-4 text-right font-extrabold text-slate-800">
                {formatearMonedaColombiana(liquidacion.valorAlquilerInicial)}
              </td>
            </tr>

            {liquidacion.diasAdicionales > 0 && (
              <tr>
                <td className="p-3 sm:p-4">
                  <span className="font-bold text-slate-900 block">Días Adicionales</span>
                  <span className="text-xs text-slate-500">
                    {liquidacion.equipos} equipos × {liquidacion.diasAdicionales} días
                  </span>
                </td>
                <td className="p-3 sm:p-4 text-right font-extrabold text-slate-800">
                  {formatearMonedaColombiana(liquidacion.valorDiasAdicionales)}
                </td>
              </tr>
            )}

            <tr>
              <td className="p-3 sm:p-4">
                <span className="font-bold text-emerald-800 block">Descuento Especial SENA</span>
                <span className="text-xs text-emerald-600">
                  {liquidacion.tipoServicioCodigo === 3 ? 'Descuento aplicado en sede' : 'Tarifa preferencial SENA'}
                </span>
              </td>
              <td className="p-3 sm:p-4 text-right font-extrabold text-emerald-700">
                - {formatearMonedaColombiana(liquidacion.tipoServicioCodigo === 3 ? liquidacion.descuentoFormulaEfectivo : 0)}
              </td>
            </tr>

            {liquidacion.valorDomicilio > 0 && (
              <tr>
                <td className="p-3 sm:p-4">
                  <span className="font-bold text-slate-900 block">Transporte Logístico Fuera de Ciudad</span>
                  <span className="text-xs text-slate-500">Tarifa fija de transporte</span>
                </td>
                <td className="p-3 sm:p-4 text-right font-extrabold text-slate-800">
                  + {formatearMonedaColombiana(liquidacion.valorDomicilio)}
                </td>
              </tr>
            )}
          </tbody>

          {/* Gran Total */}
          <tfoot>
            <tr className="bg-emerald-50 border-t-2 border-emerald-600">
              <td className="p-4 sm:p-5 font-black text-xl sm:text-2xl text-emerald-950">
                TOTAL NETO A PAGAR:
              </td>
              <td className="p-4 sm:p-5 text-right font-black text-2xl sm:text-3xl text-emerald-900">
                {formatearMonedaColombiana(liquidacion.totalPagar)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Botones de Acción para el Usuario */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={onLeerVoz}
          className={`flex-1 py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow transition-all min-h-[52px] ${
            isSpeaking ? 'bg-amber-500 text-slate-900' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          <span>{isSpeaking ? '⏹️ Detener' : '🔊 Escuchar Resumen'}</span>
        </button>

        <button
          type="button"
          onClick={onImprimir}
          className="flex-1 py-4 px-6 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-black text-base sm:text-lg rounded-2xl shadow transition-all flex items-center justify-center gap-2 min-h-[52px]"
        >
          <span>🖨️ Imprimir Factura</span>
        </button>
      </div>

      <div className="text-center pt-2 text-xs text-slate-400 font-medium border-t border-slate-100">
        Factura generada electrónicamente por el Sistema SENA ALQUILAPC. ¡Gracias por confiar en nuestros servicios!
      </div>
    </div>
  );
};
