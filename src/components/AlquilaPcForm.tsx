import React from 'react';
import { AlquilerInput, TipoServicioCodigo } from '../types';
import { SERVICIOS_DISPONIBLES, VALOR_DIA_BASE, VALOR_DIA_ADICIONAL } from '../core/calculator/alquilaPcCalculator';
import { TwoLayerSecurityEngine } from '../core/security/twoLayerSecurity';

interface AlquilaPcFormProps {
  inputData: AlquilerInput;
  onChangeInput: (updated: Partial<AlquilerInput>) => void;
  onCalcular: () => void;
  cargando: boolean;
  erroresValidacion: string[];
}

export const AlquilaPcForm: React.FC<AlquilaPcFormProps> = ({
  inputData,
  onChangeInput,
  onCalcular,
  cargando,
  erroresValidacion
}) => {
  const security = TwoLayerSecurityEngine.getInstance();

  /**
   * Previene en seco el ingreso de números negativos o teclas inválidas en el DOM
   */
  const handleKeyDownSinNegativos = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Bloquear el signo menos '-', 'e', '+', '.'
    if (e.key === '-' || e.key === 'Minus' || e.key === 'e' || e.key === '+' || e.key === '.') {
      e.preventDefault();
    }
  };

  /**
   * Sanitización en tiempo real de entradas de texto
   */
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const sanitized = security.sanitizeAndValidateDOMInput(raw, 'Nombre del Cliente');
    onChangeInput({ nombreCliente: sanitized.safeValue });
  };

  /**
   * Manejador de valores enteros estrictamente no negativos
   */
  const handleNumeroPositivoChange = (campo: keyof AlquilerInput, valorString: string, minPermitido: number) => {
    // Eliminar cualquier signo menos por si fue pegado desde el portapapeles
    const limpio = valorString.replace(/-/g, '');
    const num = parseInt(limpio, 10);

    if (isNaN(num)) {
      onChangeInput({ [campo]: minPermitido });
    } else {
      onChangeInput({ [campo]: Math.max(minPermitido, num) });
    }
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-100 space-y-6">
      <div className="border-b border-emerald-100 pb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 flex items-center gap-3">
          <span>📝</span> Ingrese los Datos del Alquiler
        </h2>
        <p className="text-gray-600 text-base sm:text-lg mt-1">
          Complete cada casilla con calma. Las casillas no aceptan valores negativos para su total tranquilidad.
        </p>
      </div>

      {/* Alertas de validación preventivas */}
      {erroresValidacion.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl" role="alert">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-bold text-amber-900 text-lg">Por favor revise estos datos:</h4>
              <ul className="list-disc list-inside text-amber-800 mt-1 space-y-1 text-base">
                {erroresValidacion.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); onCalcular(); }} className="space-y-6">
        {/* Campo 1: Nombre del cliente */}
        <div>
          <label htmlFor="nombreCliente" className="block text-lg sm:text-xl font-bold text-gray-800 mb-2">
            1. Nombre y Apellido del Cliente:
          </label>
          <input
            id="nombreCliente"
            type="text"
            value={inputData.nombreCliente}
            onChange={handleNombreChange}
            placeholder="Ejemplo: Carlos Arturo Restrepo"
            required
            className="w-full text-lg sm:text-xl p-4 rounded-xl border-2 border-gray-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none transition-all shadow-sm bg-gray-50/50"
          />
          <span className="text-sm text-gray-500 mt-1 block">
            Protegido contra inyecciones y caracteres no permitidos (Capa 1 DOM).
          </span>
        </div>

        {/* Bloque de dos columnas para Equipos y Días */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Equipos */}
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
            <label htmlFor="equipos" className="block text-lg font-bold text-emerald-950 mb-1">
              🖥️ Cantidad de Equipos:
            </label>
            <span className="text-xs text-gray-500 block mb-2">Mínimo 1 equipo (sin negativos)</span>
            <input
              id="equipos"
              type="number"
              min="1"
              step="1"
              value={inputData.equipos || ''}
              onKeyDown={handleKeyDownSinNegativos}
              onChange={(e) => handleNumeroPositivoChange('equipos', e.target.value, 1)}
              required
              className="w-full text-xl sm:text-2xl font-bold text-center p-3 rounded-xl border-2 border-emerald-300 focus:border-emerald-600 bg-white shadow-inner"
            />
          </div>

          {/* Días Iniciales */}
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200">
            <label htmlFor="diasIniciales" className="block text-lg font-bold text-blue-950 mb-1">
              📅 Días de Alquiler:
            </label>
            <span className="text-xs text-blue-700 block mb-2">Tarifa: ${VALOR_DIA_BASE.toLocaleString('es-CO')} c/u</span>
            <input
              id="diasIniciales"
              type="number"
              min="1"
              step="1"
              value={inputData.diasIniciales || ''}
              onKeyDown={handleKeyDownSinNegativos}
              onChange={(e) => handleNumeroPositivoChange('diasIniciales', e.target.value, 1)}
              required
              className="w-full text-xl sm:text-2xl font-bold text-center p-3 rounded-xl border-2 border-blue-300 focus:border-blue-600 bg-white shadow-inner"
            />
          </div>

          {/* Días Adicionales */}
          <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-200">
            <label htmlFor="diasAdicionales" className="block text-lg font-bold text-purple-950 mb-1">
              ➕ Días Adicionales:
            </label>
            <span className="text-xs text-purple-700 block mb-2">Tarifa reducida: ${VALOR_DIA_ADICIONAL.toLocaleString('es-CO')}</span>
            <input
              id="diasAdicionales"
              type="number"
              min="0"
              step="1"
              value={inputData.diasAdicionales}
              onKeyDown={handleKeyDownSinNegativos}
              onChange={(e) => handleNumeroPositivoChange('diasAdicionales', e.target.value, 0)}
              required
              className="w-full text-xl sm:text-2xl font-bold text-center p-3 rounded-xl border-2 border-purple-300 focus:border-purple-600 bg-white shadow-inner"
            />
          </div>
        </div>

        {/* Selección del Tipo de Servicio (Botones grandes táctiles) */}
        <div>
          <label className="block text-lg sm:text-xl font-bold text-gray-800 mb-3">
            2. Seleccione el Tipo de Servicio Ofrecido:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {([1, 2, 3] as TipoServicioCodigo[]).map((cod) => {
              const serv = SERVICIOS_DISPONIBLES[cod];
              const seleccionado = inputData.tipoServicio === cod;
              return (
                <button
                  key={cod}
                  type="button"
                  onClick={() => onChangeInput({ tipoServicio: cod })}
                  className={`p-5 rounded-2xl border-3 text-left transition-all min-h-[96px] flex flex-col justify-between ${
                    seleccionado
                      ? 'border-emerald-600 bg-emerald-50 ring-4 ring-emerald-200 shadow-md scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-3xl">{serv.icono}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      seleccionado ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      Opción [{cod}]
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg sm:text-xl text-gray-900 leading-snug">
                      {serv.nombre}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {serv.descripcion}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón Principal de Liquidación */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={cargando}
            className="w-full py-5 px-8 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xl sm:text-2xl rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 min-h-[64px]"
          >
            {cargando ? (
              <>
                <span className="animate-spin text-2xl">⚙️</span>
                <span>Procesando a través del Message Broker...</span>
              </>
            ) : (
              <>
                <span className="text-3xl">🧾</span>
                <span>Calcular y Generar Factura SENA</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
