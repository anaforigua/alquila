import React, { useState } from 'react';
import { AlquilerInput, TipoServicioCodigo } from '../types';
import { SERVICIOS_DISPONIBLES } from '../core/calculator/alquilaPcCalculator';
import { TwoLayerSecurityEngine } from '../core/security/twoLayerSecurity';
import {
  IconComputer,
  IconCalendar,
  IconCalendarPlus,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  ImageServiceCity,
  ImageServiceDelivery,
  ImageServiceCampus
} from './Icons';

interface FuturisticPastelFormProps {
  inputData: AlquilerInput;
  onChangeInput: (updated: Partial<AlquilerInput>) => void;
  onCalcular: () => void;
  cargando: boolean;
}

export const FuturisticPastelForm: React.FC<FuturisticPastelFormProps> = ({
  inputData,
  onChangeInput,
  onCalcular,
  cargando
}) => {
  const security = TwoLayerSecurityEngine.getInstance();
  const [paso, setPaso] = useState<1 | 2 | 3>(1);

  const handleNombre = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const sanitized = security.sanitizeAndValidateDOMInput(raw, 'Nombre Cliente');
    onChangeInput({ nombreCliente: sanitized.safeValue });
  };

  const modificar = (campo: 'equipos' | 'diasIniciales' | 'diasAdicionales', delta: number, min: number) => {
    const actual = inputData[campo] || 0;
    const nuevo = Math.max(min, actual + delta);
    onChangeInput({ [campo]: nuevo });
  };

  return (
    <div className="neo-card">
      {/* Stepper Superior */}
      <div className="neo-stepper-nav">
        <button
          type="button"
          className={`neo-step-item ${paso === 1 ? 'active' : ''}`}
          onClick={() => setPaso(1)}
        >
          <span className="neo-badge-step">1</span>
          <span>Cliente</span>
        </button>

        <button
          type="button"
          className={`neo-step-item ${paso === 2 ? 'active' : ''}`}
          onClick={() => setPaso(2)}
        >
          <span className="neo-badge-step">2</span>
          <span>Equipos y Días</span>
        </button>

        <button
          type="button"
          className={`neo-step-item ${paso === 3 ? 'active' : ''}`}
          onClick={() => setPaso(3)}
        >
          <span className="neo-badge-step">3</span>
          <span>Lugar</span>
        </button>
      </div>

      <div className="neo-step-body">
        {/* PASO 1: DATOS CLIENTE */}
        {paso === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--pastel-mint-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Paso 1 de 3
              </span>
              <h2 className="neo-step-title">¿A nombre de quién hacemos el alquiler?</h2>
              <p className="neo-step-desc">
                Escriba su nombre y apellido completo para generar su liquidación oficial SENA.
              </p>
            </div>

            <div className="neo-field-group">
              <label htmlFor="nombreCliente">Nombre y Apellidos del Cliente:</label>
              <input
                id="nombreCliente"
                type="text"
                value={inputData.nombreCliente}
                onChange={handleNombre}
                placeholder="Ejemplo: Carlos Arturo Restrepo"
                className="neo-input-text"
                autoComplete="name"
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Validado y sanitizado de forma segura en el DOM.
              </span>
            </div>

            <div className="neo-nav-footer" style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="neo-btn-nav next"
                onClick={() => {
                  if (!inputData.nombreCliente.trim()) {
                    alert('Por favor ingrese su nombre para continuar.');
                    return;
                  }
                  setPaso(2);
                }}
              >
                <span>Siguiente: Equipos y Días</span>
                <IconArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* PASO 2: EQUIPOS Y DÍAS */}
        {paso === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--pastel-mint-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Paso 2 de 3
              </span>
              <h2 className="neo-step-title">¿Cuántos computadores y por cuánto tiempo?</h2>
              <p className="neo-step-desc">
                Presione los botones táctiles grandes + y - para ajustar las cantidades sin escribir.
              </p>
            </div>

            <div className="neo-counters-grid">
              {/* Computadores */}
              <div className="neo-counter-card">
                <div style={{ color: 'var(--pastel-mint-deep)' }}>
                  <IconComputer size={36} />
                </div>
                <div className="neo-counter-title">Computadores</div>
                <span className="neo-counter-tag">Mínimo 1</span>
                <div className="neo-counter-controls">
                  <button type="button" className="neo-btn-math" onClick={() => modificar('equipos', -1, 1)} aria-label="Disminuir equipos">-</button>
                  <span className="neo-val-display">{inputData.equipos}</span>
                  <button type="button" className="neo-btn-math plus" onClick={() => modificar('equipos', 1, 1)} aria-label="Aumentar equipos">+</button>
                </div>
              </div>

              {/* Días Iniciales */}
              <div className="neo-counter-card">
                <div style={{ color: '#0369a1' }}>
                  <IconCalendar size={36} />
                </div>
                <div className="neo-counter-title">Días Iniciales</div>
                <span className="neo-counter-tag">$35.000 COP / día</span>
                <div className="neo-counter-controls">
                  <button type="button" className="neo-btn-math" onClick={() => modificar('diasIniciales', -1, 1)} aria-label="Disminuir días">-</button>
                  <span className="neo-val-display">{inputData.diasIniciales}</span>
                  <button type="button" className="neo-btn-math plus" onClick={() => modificar('diasIniciales', 1, 1)} aria-label="Aumentar días">+</button>
                </div>
              </div>

              {/* Días Adicionales */}
              <div className="neo-counter-card">
                <div style={{ color: '#b45309' }}>
                  <IconCalendarPlus size={36} />
                </div>
                <div className="neo-counter-title">Días Adicionales</div>
                <span className="neo-counter-tag adic">$34.300 COP / día</span>
                <div className="neo-counter-controls">
                  <button type="button" className="neo-btn-math" onClick={() => modificar('diasAdicionales', -1, 0)} aria-label="Disminuir adicionales">-</button>
                  <span className="neo-val-display">{inputData.diasAdicionales}</span>
                  <button type="button" className="neo-btn-math plus" onClick={() => modificar('diasAdicionales', 1, 0)} aria-label="Aumentar adicionales">+</button>
                </div>
              </div>
            </div>

            <div className="neo-nav-footer">
              <button type="button" className="neo-btn-nav prev" onClick={() => setPaso(1)}>
                <IconArrowLeft />
                <span>Anterior</span>
              </button>
              <button type="button" className="neo-btn-nav next" onClick={() => setPaso(3)}>
                <span>Siguiente: Lugar de Uso</span>
                <IconArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: LUGAR DE ENTREGA */}
        {paso === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--pastel-mint-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Paso 3 de 3
              </span>
              <h2 className="neo-step-title">¿Dónde va a utilizar los computadores?</h2>
              <p className="neo-step-desc">
                Seleccione la opción correspondiente a su necesidad:
              </p>
            </div>

            <div className="neo-services-list">
              {([1, 2, 3] as TipoServicioCodigo[]).map((cod) => {
                const s = SERVICIOS_DISPONIBLES[cod];
                const seleccionado = inputData.tipoServicio === cod;

                return (
                  <button
                    key={cod}
                    type="button"
                    className={`neo-service-option ${seleccionado ? 'selected' : ''}`}
                    onClick={() => onChangeInput({ tipoServicio: cod })}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ flexShrink: 0 }}>
                        {cod === 1 && <ImageServiceCity />}
                        {cod === 2 && <ImageServiceDelivery />}
                        {cod === 3 && <ImageServiceCampus />}
                      </div>
                      <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                          {s.nombre}
                        </div>
                        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                          {s.descripcion}
                        </div>
                      </div>
                    </div>

                    <span className="neo-service-badge">
                      {cod === 1 && 'Sin recargo'}
                      {cod === 2 && 'Domicilio: $60.725 COP'}
                      {cod === 3 && 'Descuento esp.: $60.725 COP'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="neo-nav-footer">
              <button type="button" className="neo-btn-nav prev" onClick={() => setPaso(2)}>
                <IconArrowLeft />
                <span>Anterior</span>
              </button>
              <button
                type="button"
                className="neo-btn-nav next"
                disabled={cargando}
                onClick={onCalcular}
              >
                <IconCheck />
                <span>{cargando ? 'Procesando...' : 'Calcular Factura Oficial SENA'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
