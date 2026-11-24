import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración moderna Vite para ALQUILAPC SENA
// Forzado a 127.0.0.1 para garantizar privacidad total sin exponer puertos a redes públicas
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // Solo accesible en la máquina local privada
    port: 3000,
    open: true
  }
});
