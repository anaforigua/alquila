import React from 'react';
import { AuditoriaEvento } from '../types';

interface SecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventos: AuditoriaEvento[];
}

export const SecurityAuditModal: React.FC<SecurityAuditModalProps> = ({
  isOpen,
  onClose,
  eventos
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-emerald-600 overflow-hidden">
        {/* Cabecera */}
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">
                Auditoría de Ciberseguridad • Doble Capa Transversal
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200">
                Norma ISO/IEC 25010 §4.2.5 • Confidencialidad, Integridad y No Repudio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-emerald-200 text-3xl font-black p-2 min-w-[44px] min-h-[44px]"
            aria-label="Cerrar modal de auditoría"
          >
            ✕
          </button>
        </div>

        {/* Resumen de las 2 Capas por Estrato */}
        <div className="p-5 bg-emerald-50 border-b border-emerald-100 overflow-x-auto text-xs sm:text-sm">
          <h4 className="font-extrabold text-emerald-950 mb-2">
            Matriz de Defensa en Profundidad (2 Capas Activas):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
              <span className="font-bold text-emerald-900 block">1. FRONTEND</span>
              <p className="text-gray-700 mt-1"><strong>Capa 1:</strong> Sanitización DOM & Bloqueo de Negativos.</p>
              <p className="text-gray-700 mt-1"><strong>Capa 2:</strong> Firma de Integridad de Estado Cliente.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
              <span className="font-bold text-emerald-900 block">2. APIS Y RUTAS</span>
              <p className="text-gray-700 mt-1"><strong>Capa 1:</strong> Gateway Rate Limiting & Firewall.</p>
              <p className="text-gray-700 mt-1"><strong>Capa 2:</strong> Token Criptográfico & Contrato Zod.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
              <span className="font-bold text-emerald-900 block">3. MICROSERVICIOS</span>
              <p className="text-gray-700 mt-1"><strong>Capa 1:</strong> Message Broker & Circuit Breaker.</p>
              <p className="text-gray-700 mt-1"><strong>Capa 2:</strong> RBAC & Bitácora Inmutable.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm">
              <span className="font-bold text-emerald-900 block">4. BASE DE DATOS</span>
              <p className="text-gray-700 mt-1"><strong>Capa 1:</strong> Consultas Parametrizadas Anti-SQLi.</p>
              <p className="text-gray-700 mt-1"><strong>Capa 2:</strong> Cifrado AES-256 en Reposo.</p>
            </div>
          </div>
        </div>

        {/* Bitácora de Eventos Registrados */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          <h4 className="font-bold text-gray-800 text-base flex items-center justify-between">
            <span>Bitácora de Seguridad en Vivo ({eventos.length} registros):</span>
            <span className="text-xs text-gray-500 font-normal">Actualización automática</span>
          </h4>

          {eventos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No se han registrado eventos de seguridad aún.</p>
          ) : (
            <div className="space-y-2">
              {eventos.map((evt) => (
                <div
                  key={evt.id}
                  className={`p-3 rounded-xl border text-xs sm:text-sm font-mono flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                    evt.resultado === 'BLOQUEADO'
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : evt.resultado === 'ADVERTENCIA'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-white border">
                        {evt.capa} • {evt.subcapa}
                      </span>
                      <span>{evt.accion}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{evt.detalles}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`px-2 py-1 rounded text-[11px] font-extrabold ${
                        evt.resultado === 'BLOQUEADO'
                          ? 'bg-red-600 text-white'
                          : evt.resultado === 'ADVERTENCIA'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-700 text-white'
                      }`}
                    >
                      {evt.resultado}
                    </span>
                    <span className="text-gray-400 text-xs">{evt.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="bg-gray-100 p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-base min-h-[44px]"
          >
            Entendido y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
