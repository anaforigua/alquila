import React from 'react';
import { MicroservicioEstado } from '../types';

interface BrokerMonitorProps {
  servicios: Record<string, MicroservicioEstado>;
  onSimularCaida: (id: string) => void;
  onReparar: (id: string) => void;
}

export const BrokerMonitor: React.FC<BrokerMonitorProps> = ({
  servicios,
  onSimularCaida,
  onReparar
}) => {
  const listaServicios = Object.values(servicios);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-2xl border-2 border-slate-700 space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="text-xl font-extrabold text-white">
              Panel del Message Broker & Microservicios (Resiliencia Activa)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Arquitectura desacoplada: Si un microservicio se cae, el aplicativo sigue funcionando en modo contingencia sin detenerse.
          </p>
        </div>
        <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-3 py-1 rounded-full border border-slate-700">
          ISO 25010 • Fiabilidad & Tolerancia a Fallos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listaServicios.map((ms) => {
          const estaActivo = ms.estado === 'ACTIVO';
          const estaCaido = ms.estado === 'CAIDO';

          return (
            <div
              key={ms.id}
              className={`p-4 rounded-2xl border transition-all ${
                estaActivo
                  ? 'bg-slate-800/80 border-slate-700'
                  : 'bg-red-950/40 border-red-700 ring-2 ring-red-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-base text-white flex items-center gap-2">
                    <span>{estaActivo ? '🟢' : '🔴'}</span>
                    {ms.nombre}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {ms.id}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    estaActivo
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-red-900 text-red-200 border border-red-700 animate-pulse'
                  }`}
                >
                  {ms.estado}
                </span>
              </div>

              {/* Métricas del servicio */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/50 text-xs">
                <div>
                  <span className="text-slate-400 block">Latencia:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {estaActivo ? `${ms.latenciaMs} ms` : 'DESCONECTADO'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Eventos en Cola:</span>
                  <span className={`font-mono font-bold ${ms.mensajesEnCola > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                    {ms.mensajesEnCola} en buffer
                  </span>
                </div>
              </div>

              {/* Registro de falla */}
              {ms.ultimaFalla && (
                <div className="mt-2 text-xs text-red-300 bg-red-950/60 p-2 rounded-lg border border-red-800/50 font-mono">
                  ⚠️ {ms.ultimaFalla}
                </div>
              )}

              {/* Botones interactivos de simulación de fallo y auto-reparación */}
              <div className="mt-3 pt-2 flex gap-2">
                {estaActivo ? (
                  <button
                    onClick={() => onSimularCaida(ms.id)}
                    className="w-full py-2 px-3 bg-red-600/80 hover:bg-red-600 active:bg-red-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 min-h-[38px]"
                  >
                    <span>⚡</span> Simular Caída de Servicio
                  </button>
                ) : (
                  <button
                    onClick={() => onReparar(ms.id)}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 min-h-[38px]"
                  >
                    <span>🔄</span> Reparar y Reintegrar (Self-Healing)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
