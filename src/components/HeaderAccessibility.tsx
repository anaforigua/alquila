import React from 'react';

interface HeaderAccessibilityProps {
  fontSizeLevel: number;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  onSpeakSummary: () => void;
  isSpeaking: boolean;
}

export const HeaderAccessibility: React.FC<HeaderAccessibilityProps> = ({
  fontSizeLevel,
  onIncreaseFontSize,
  onDecreaseFontSize,
  highContrast,
  onToggleHighContrast,
  onSpeakSummary,
  isSpeaking
}) => {
  return (
    <header className="bg-emerald-800 text-white shadow-md p-4 sm:p-6 rounded-2xl mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Identidad institucional SENA */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner text-emerald-900 font-extrabold text-2xl">
            💻
          </div>
          <div>
            <span className="text-xs tracking-wider uppercase bg-emerald-700 text-emerald-100 px-3 py-1 rounded-full font-semibold">
              SENA • CGMLTI ADSI 2020 - ISO 25010
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              ALQUILAPC • Sistema de Alquiler de Computadores
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base">
              Diseño amigable y simplificado para personas mayores de 60 años
            </p>
          </div>
        </div>

        {/* Barra de Herramientas de Accesibilidad para Adultos Mayores */}
        <div className="flex flex-wrap items-center gap-2 bg-emerald-900/60 p-2 rounded-xl border border-emerald-600/40">
          <span className="text-xs font-medium text-emerald-200 hidden sm:inline px-1">
            Accesibilidad:
          </span>

          {/* Reducir tamaño de letra */}
          <button
            onClick={onDecreaseFontSize}
            disabled={fontSizeLevel <= 0}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold rounded-lg text-sm transition-all disabled:opacity-40 min-h-[44px] min-w-[44px]"
            title="Hacer la letra más pequeña"
            aria-label="Disminuir tamaño de letra"
          >
            A-
          </button>

          {/* Aumentar tamaño de letra */}
          <button
            onClick={onIncreaseFontSize}
            disabled={fontSizeLevel >= 3}
            className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold rounded-lg text-base transition-all disabled:opacity-40 min-h-[44px] min-w-[44px]"
            title="Hacer la letra más grande"
            aria-label="Aumentar tamaño de letra"
          >
            A+
          </button>

          {/* Alto contraste */}
          <button
            onClick={onToggleHighContrast}
            className={`px-3 py-2 font-bold rounded-lg text-sm transition-all flex items-center gap-1 min-h-[44px] ${
              highContrast ? 'bg-amber-400 text-gray-900' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}
            title="Cambiar a modo de alto contraste para mejorar visibilidad"
            aria-label="Alternar modo de alto contraste"
          >
            👁️ {highContrast ? 'Contraste Activo' : 'Alto Contraste'}
          </button>

          {/* Lector de voz */}
          <button
            onClick={onSpeakSummary}
            className={`px-3 py-2 font-bold rounded-lg text-sm transition-all flex items-center gap-1 min-h-[44px] ${
              isSpeaking ? 'bg-red-500 animate-pulse text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title="Escuchar en voz alta el resumen de la factura"
            aria-label="Escuchar liquidación con asistente de voz"
          >
            🔊 {isSpeaking ? 'Detener Voz' : 'Leer en Voz Alta'}
          </button>
        </div>
      </div>
    </header>
  );
};
