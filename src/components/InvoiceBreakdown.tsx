import React from 'react';
import { AlquilerLiquidacion } from '../types';
import { formatearMonedaColombiana } from '../core/calculator/alquilaPcCalculator';

interface InvoiceBreakdownProps {
  liquidacion: AlquilerLiquidacion;
  onImprimir: () => void;
  diagnosticoBroker?: string[];
}

export const InvoiceBreakdown: React.FC<InvoiceBreakdownProps> = ({
  liquidacion,
  onImprimir,
  diagnosticoBroker = []
}) => {
  return (
    <article className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-emerald-700/20 space-y-6 relative overflow-hidden">
      {/* Sello de agua oficial SENA */}
      <div className="absolute right-4 top-4 text-emerald-100 text-8xl font-black select-none pointer-events-none opacity-30">
        SENA
      </div>

      {/* Encabezado oficial SENA */}
      <div className="border-b-2 border-dashed border-gray-300 pb-4 text-center">
        <p className="text-xs tracking-widest text-emerald-800 font-black uppercase">
          **************** SENA PRUEBAS DE SOFTWARE 2020 ************
        </p>
        <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-1">
          ANÁLISIS Y DESARROLLO DE SISTEMAS DE INFORMACIÓN CGMLTI
        </p>
        <h2 className="text-3xl sm:text-4xl font-black text-emerald-900 tracking-wider mt-2">
          A L Q U I L A P C
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs sm:text-sm text-gray-500 font-mono">
          <span>Folio: <strong className="text-gray-800">{liquidacion.folioAuditoria}</strong></span>
          <span>•</span>
          <span>Fecha: <strong>{new Date(liquidacion.fechaLiquidacion).toLocaleString('es-CO')}</strong></span>
        </div>
      </div>

      {/* Si hubo respuesta desde Broker en contingencia */}
      {diagnosticoBroker.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-xl text-blue-900 text-sm">
          <div className="font-bold flex items-center gap-2">
            <span>🛡️</span> Resiliencia de Broker Activada:
          </div>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            {diagnosticoBroker.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Datos del Cliente y Servicio */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-base sm:text-lg">
        <div>
          <span className="text-gray-500 block text-xs uppercase font-bold">Nombre del Cliente:</span>
          <span className="font-black text-gray-900 text-xl">{liquidacion.nombreCliente}</span>
        </div>
        <div>
          <span className="text-gray-500 block text-xs uppercase font-bold">Tipo de Servicio:</span>
          <span className="font-bold text-emerald-800">{liquidacion.tipoServicioNombre}</span>
        </div>
        <div>
          <span className="text-gray-500 block text-xs uppercase font-bold">Número de Equipos:</span>
          <span className="font-bold text-gray-900">{liquidacion.equipos} computadores</span>
        </div>
        <div>
          <span className="text-gray-500 block text-xs uppercase font-bold">Tiempo de Uso:</span>
          <span className="font-bold text-gray-900">
            {liquidacion.diasIniciales} días iniciales + {liquidacion.diasAdicionales} adicionales
          </span>
        </div>
      </div>

      {/* Tabla de liquidación matemática exacta de Python */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-800 text-white text-sm sm:text-base">
              <th className="p-4 font-bold">Concepto Liquidado</th>
              <th className="p-4 font-bold text-center">Fórmula Base</th>
              <th className="p-4 font-bold text-right">Monto (COP)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-base sm:text-lg">
            <tr className="hover:bg-gray-50">
              <td className="p-4">
                <span className="font-bold text-gray-900">Valor Alquiler Inicial</span>
                <span className="text-xs text-gray-500 block">Tarifa: ${liquidacion.valorDiaBase.toLocaleString('es-CO')} por día</span>
              </td>
              <td className="p-4 text-center font-mono text-sm text-gray-600">
                {liquidacion.equipos} eq × {liquidacion.diasIniciales} d × ${liquidacion.valorDiaBase.toLocaleString('es-CO')}
              </td>
              <td className="p-4 text-right font-bold text-gray-900">
                {formatearMonedaColombiana(liquidacion.valorAlquilerInicial)}
              </td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-4">
                <span className="font-bold text-gray-900">Valor Días Adicionales</span>
                <span className="text-xs text-gray-500 block">Tarifa: ${liquidacion.valorDiaAdicional.toLocaleString('es-CO')} por día</span>
              </td>
              <td className="p-4 text-center font-mono text-sm text-gray-600">
                {liquidacion.equipos} eq × {liquidacion.diasAdicionales} d × ${liquidacion.valorDiaAdicional.toLocaleString('es-CO')}
              </td>
              <td className="p-4 text-right font-bold text-gray-900">
                {formatearMonedaColombiana(liquidacion.valorDiasAdicionales)}
              </td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-4">
                <span className="font-bold text-gray-900">Descuentos Especiales</span>
                <span className="text-xs text-emerald-700 block">
                  {liquidacion.tipoServicioCodigo === 3
                    ? 'Descuento especial por establecimiento ($71.225 - $10.500)'
                    : 'Descuento informativo ($10.500)'}
                </span>
              </td>
              <td className="p-4 text-center font-mono text-sm text-emerald-700">
                {liquidacion.tipoServicioCodigo === 3 ? '- $ 60.725 COP' : '$ 0 COP aplicados al total'}
              </td>
              <td className="p-4 text-right font-bold text-emerald-800">
                {formatearMonedaColombiana(liquidacion.descuentoVisual)}
              </td>
            </tr>

            <tr className="hover:bg-gray-50">
              <td className="p-4">
                <span className="font-bold text-gray-900">Costo Domicilio y Transporte</span>
                <span className="text-xs text-gray-500 block">
                  {liquidacion.tipoServicioCodigo === 2 ? 'Fuera de la ciudad (estricto celda SENA)' : 'Sin recargo'}
                </span>
              </td>
              <td className="p-4 text-center font-mono text-sm text-gray-600">
                {liquidacion.tipoServicioCodigo === 2 ? '+ $ 60.725 COP' : '$ 0 COP'}
              </td>
              <td className="p-4 text-right font-bold text-gray-900">
                {formatearMonedaColombiana(liquidacion.valorDomicilio)}
              </td>
            </tr>
          </tbody>

          {/* Gran Total */}
          <tfoot>
            <tr className="bg-emerald-50 border-t-3 border-emerald-600">
              <td colSpan={2} className="p-5 text-right font-black text-xl sm:text-2xl text-emerald-950">
                TOTAL A PAGAR:
              </td>
              <td className="p-5 text-right font-black text-2xl sm:text-4xl text-emerald-900">
                {formatearMonedaColombiana(liquidacion.totalPagar)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pie de factura y botones de acción */}
      <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left text-sm text-gray-600">
          <p className="font-bold text-emerald-900">Factura generada por el S E N A</p>
          <p>¡Gracias por utilizar nuestros servicios...!</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Firma criptográfica: {liquidacion.firmaCriptografica.substring(0, 32)}...
          </p>
        </div>

        <button
          onClick={onImprimir}
          className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl shadow transition-all flex items-center gap-2 min-h-[48px]"
        >
          <span>🖨️</span> Imprimir / Guardar Factura
        </button>
      </div>
    </article>
  );
};
