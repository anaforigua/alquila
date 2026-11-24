import React, { useState } from 'react';
import { AlquilerInput, AlquilerLiquidacion, TipoServicioCodigo } from '../types';
import { SERVICIOS_DISPONIBLES, VALOR_DIA_BASE, VALOR_DIA_ADICIONAL } from '../core/calculator/alquilaPcCalculator';
import { TwoLayerSecurityEngine } from '../core/security/twoLayerSecurity';

interface AlquilaPcSeniorFormProps {
  inputData: AlquilerInput;
  onChangeInput: (updated: Partial<AlquilerInput>) => void;
  onCalcular: () => void;
  cargando: boolean;
}

export const AlquilaPcSeniorForm: React.FC<AlquilaPcSeniorFormProps> = ({
  inputData,
  onChangeInput,
  onCalcular,
  cargando
}) => {
  const security = TwoLayerSecurityEngine.getInstance();
  const [pasoActivo, setPasoActivo] = useState<1 | 2 | 3>(1);

  // Manejo de cambios en el nombre con sanitización DOM invisible
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const sanitized = security.sanitizeAndValidateDOMInput(raw, 'Nombre Cliente');
    onChangeInput({ nombreCliente: sanitized.safeValue });
  };

  // Controles de incremento y decremento con botones táctiles (imposible ingresar negativos)
  const incrementar = (campo: 'equipos' | 'diasIniciales' | 'diasAdicionales', step: number = 1) => {
    onChangeInput({ [campo]: (inputData[campo] || 0) + step });
  };

  const decrementar = (campo: 'equipos' | 'diasIniciales' | 'diasAdicionales', minPermitido: number) => {
    const actual = inputData[campo] || 0;
    if (actual > minPermitido) {
      onChangeInput({ [campo]: actual - 1 });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300">
      
      {/* Barra superior de pasos para guiar al adulto mayor */}
      <div className="bg-emerald-900 text-white p-6 sm:p-8">
        <span className="text-emerald-200 text-sm font-semibold tracking-wider uppercase block mb-1">
          Asistente de Alquiler Paso a Paso
        </span>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          Solicitud de Alquiler de Computadores
        </h2>
        <p className="text-emerald-100 text-base sm:text-lg mt-1">
          Complete la información siguiendo los tres sencillos pasos.
        </p>

        {/* Indicador de progreso visual */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6">
          <button
            type="button"
            onClick={() => setPasoActivo(1)}
            className={`py-3 px-2 sm:px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
              pasoActivo === 1
                ? 'bg-white text-emerald-950 shadow-lg scale-102'
                : 'bg-emerald-800/80 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-black">1</span>
            <span className="hidden sm:inline">Cliente</span>
          </button>

          <button
            type="button"
            onClick={() => setPasoActivo(2)}
            className={`py-3 px-2 sm:px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
              pasoActivo === 2
                ? 'bg-white text-emerald-950 shadow-lg scale-102'
                : 'bg-emerald-800/80 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-black">2</span>
            <span className="hidden sm:inline">Equipos y Días</span>
          </button>

          <button
            type="button"
            onClick={() => setPasoActivo(3)}
            className={`py-3 px-2 sm:px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
              pasoActivo === 3
                ? 'bg-white text-emerald-950 shadow-lg scale-102'
                : 'bg-emerald-800/80 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <span className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-black">3</span>
            <span className="hidden sm:inline">Lugar de Entrega</span>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-10 space-y-8">
        
        {/* =================================================================== */}
        {/* PASO 1: DATOS DEL CLIENTE */}
        {/* =================================================================== */}
        {pasoActivo === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-emerald-700 font-extrabold text-sm uppercase tracking-wider block mb-1">
                Paso 1 de 3
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                ¿A nombre de quién registramos el servicio?
              </h3>
              <p className="text-slate-600 text-base sm:text-lg mt-1">
                Escriba su nombre y apellido completo para generar su factura oficial.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
              <label htmlFor="nombreCliente" className="block text-lg sm:text-xl font-black text-slate-800">
                Nombre y Apellidos del Cliente:
              </label>
              <input
                id="nombreCliente"
                type="text"
                value={inputData.nombreCliente}
                onChange={handleNombreChange}
                placeholder="Ejemplo: Carlos Arturo Restrepo"
                autoComplete="name"
                className="w-full text-xl sm:text-2xl p-4 sm:p-5 rounded-2xl border-2 border-slate-300 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none bg-white font-bold text-slate-900 transition-all shadow-sm"
              />
              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
                <span>🔒</span> Sus datos están protegidos y sanitizados contra cualquier alteración.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (!inputData.nombreCliente.trim()) {
                    alert('Por favor ingrese su nombre para continuar.');
                    return;
                  }
                  setPasoActivo(2);
                }}
                className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xl rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 min-h-[56px]"
              >
                <span>Continuar al Paso 2</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PASO 2: CANTIDAD DE EQUIPOS Y TIEMPO DE ALQUILER */}
        {/* =================================================================== */}
        {pasoActivo === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-emerald-700 font-extrabold text-sm uppercase tracking-wider block mb-1">
                Paso 2 de 3
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                ¿Cuántos computadores necesita y por cuántos días?
              </h3>
              <p className="text-slate-600 text-base sm:text-lg mt-1">
                Puede usar los botones grandes <strong>+</strong> y <strong>-</strong> para ajustar fácilmente las cantidades.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Control 1: Cantidad de Equipos */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-4">
                <div>
                  <span className="text-3xl block mb-1">🖥️</span>
                  <h4 className="text-lg font-black text-slate-900">Computadores</h4>
                  <p className="text-xs text-slate-500 font-semibold">Mínimo 1 equipo</p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => decrementar('equipos', 1)}
                    className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-300 hover:border-emerald-600 active:bg-slate-100 text-2xl font-black text-slate-800 flex items-center justify-center shadow-sm transition-all"
                    aria-label="Quitar un equipo"
                  >
                    -
                  </button>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-950 w-16 text-center tabular-nums">
                    {inputData.equipos}
                  </span>
                  <button
                    type="button"
                    onClick={() => incrementar('equipos', 1)}
                    className="w-14 h-14 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-2xl font-black text-white flex items-center justify-center shadow-md transition-all"
                    aria-label="Agregar un equipo"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Control 2: Días Iniciales */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-4">
                <div>
                  <span className="text-3xl block mb-1">📅</span>
                  <h4 className="text-lg font-black text-slate-900">Días Iniciales</h4>
                  <p className="text-xs text-emerald-700 font-bold">$35.000 COP / día</p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => decrementar('diasIniciales', 1)}
                    className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-300 hover:border-emerald-600 active:bg-slate-100 text-2xl font-black text-slate-800 flex items-center justify-center shadow-sm transition-all"
                    aria-label="Quitar un día"
                  >
                    -
                  </button>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-950 w-16 text-center tabular-nums">
                    {inputData.diasIniciales}
                  </span>
                  <button
                    type="button"
                    onClick={() => incrementar('diasIniciales', 1)}
                    className="w-14 h-14 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-2xl font-black text-white flex items-center justify-center shadow-md transition-all"
                    aria-label="Agregar un día"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Control 3: Días Adicionales */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-4">
                <div>
                  <span className="text-3xl block mb-1">➕</span>
                  <h4 className="text-lg font-black text-slate-900">Días Adicionales</h4>
                  <p className="text-xs text-amber-700 font-bold">$34.300 COP / día</p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => decrementar('diasAdicionales', 0)}
                    disabled={inputData.diasAdicionales <= 0}
                    className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-300 hover:border-emerald-600 active:bg-slate-100 disabled:opacity-40 text-2xl font-black text-slate-800 flex items-center justify-center shadow-sm transition-all"
                    aria-label="Quitar día adicional"
                  >
                    -
                  </button>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-950 w-16 text-center tabular-nums">
                    {inputData.diasAdicionales}
                  </span>
                  <button
                    type="button"
                    onClick={() => incrementar('diasAdicionales', 1)}
                    className="w-14 h-14 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-2xl font-black text-white flex items-center justify-center shadow-md transition-all"
                    aria-label="Agregar día adicional"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setPasoActivo(1)}
                className="px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-lg rounded-2xl transition-all"
              >
                ⬅ Regresar
              </button>
              <button
                type="button"
                onClick={() => setPasoActivo(3)}
                className="px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xl rounded-2xl shadow-lg transition-all flex items-center gap-3"
              >
                <span>Continuar al Paso 3</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PASO 3: LUGAR DE ENTREGA Y CONFIRMACIÓN */}
        {/* =================================================================== */}
        {pasoActivo === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-emerald-700 font-extrabold text-sm uppercase tracking-wider block mb-1">
                Paso 3 de 3
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                ¿Dónde va a utilizar los computadores?
              </h3>
              <p className="text-slate-600 text-base sm:text-lg mt-1">
                Seleccione la opción que mejor describa su necesidad:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {([1, 2, 3] as TipoServicioCodigo[]).map((cod) => {
                const s = SERVICIOS_DISPONIBLES[cod];
                const activo = inputData.tipoServicio === cod;

                return (
                  <button
                    key={cod}
                    type="button"
                    onClick={() => onChangeInput({ tipoServicio: cod })}
                    className={`p-6 rounded-3xl text-left border-3 transition-all min-h-[140px] flex flex-col justify-between ${
                      activo
                        ? 'border-emerald-600 bg-emerald-50/90 ring-4 ring-emerald-200/60 shadow-lg scale-102'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-4xl">{s.icono}</span>
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${
                        activo ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        Opción {cod}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xl font-black text-slate-900">{s.nombre}</h4>
                      <p className="text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                        {s.descripcion}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs font-bold text-emerald-800">
                      {cod === 1 && '✓ Sin recargo de domicilio'}
                      {cod === 2 && '🚚 Domicilio seguro: $60.725 COP'}
                      {cod === 3 && '⭐ Descuento especial: $60.725 COP'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPasoActivo(2)}
                className="w-full sm:w-auto px-6 py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-lg rounded-2xl transition-all"
              >
                ⬅ Regresar al Paso 2
              </button>

              <button
                type="button"
                onClick={onCalcular}
                disabled={cargando}
                className="w-full sm:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-xl sm:text-2xl rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 min-h-[64px]"
              >
                {cargando ? (
                  <>
                    <span className="animate-spin text-2xl">⏳</span>
                    <span>Generando su Factura...</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">🧾</span>
                    <span>Calcular y Ver Mi Factura SENA</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
