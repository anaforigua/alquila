# ALQUILAPC • Sistema Web Resiliente de Alquiler de Computadores SENA

Aplicación web desarrollada en **React + TypeScript + DOM Sanitizado**, diseñada conforme al modelo de calidad **ISO/IEC 25010 y 25001 (SQuaRE)**, con **doble capa de ciberseguridad** transversal, arquitectura desacoplada basada en **Message Broker & Circuit Breaker** y diseño optimizado para **adultos mayores de 60 años**.

Basado fielmente en el programa de pruebas de software SENA ADSI CGMLTI.

---

## 1. Reglas de Negocio y Fórmulas Exactas (Fidelidad a Python)

El motor de cálculo (`src/core/calculator/alquilaPcCalculator.ts`) replica exactamente las constantes y funciones del código Python original:

- **Tarifa Base por Día**: `$ 35.000 COP` (`vdia = 35000`)
- **Tarifa Días Adicionales**: `$ 34.300 COP` (`vdia_adicional = 34300`)
- **Cálculo Alquiler Base**: `equipos * diasal * vdia`
- **Cálculo Alquiler Adicional**: `equipos * diasad * vdia_adicional`
- **Descuento Adicional**: `calculo_alquiler_adicional() * 0.02`
- **Tipos de Servicio**:
  1. *Dentro de la Ciudad*: Domicilio = `$ 0`, Descuento Visual = `$ 10.500`, Descuento en fórmula = `$ 0`.
  2. *Fuera de la Ciudad*: Domicilio = `$ 60.725` (celda estricta SENA), Descuento Visual = `$ 10.500`, Descuento en fórmula = `$ 0`.
  3. *Dentro del Establecimiento*: Domicilio = `$ 0`, Descuento Visual = `$ 71.225`, Descuento en fórmula = `71.225 - 10.500 = $ 60.725`.
- **Total a Pagar**:
  $$\text{Total} = \text{Alquiler Base} + \text{Alquiler Adicional} - \text{dto\_formula} + \text{Domicilio}$$
- **Validación Estricta**: No se admiten números negativos bajo ninguna circunstancia.

---

## 2. Matriz de Ciberseguridad de Doble Capa

| Estrato | Capa 1 | Capa 2 |
| :--- | :--- | :--- |
| **Frontend** | Sanitización DOM y bloqueo de negativos y caracteres XSS. | Firma criptográfica de integridad de estado cliente. |
| **APIs y Rutas** | Gateway Rate Limiting y Virtual WAF anti-DoS. | Token criptográfico de sesión y contrato Zod estricto. |
| **Microservicios** | Message Broker desacoplado con Circuit Breaker. | RBAC con mínimo privilegio y bitácora de auditoría inmutable. |
| **Base de Datos** | Consultas 100% parametrizadas anti-SQL Injection. | Cifrado en reposo AES-256 de datos del cliente (PII). |

---

## 3. Arquitectura Resiliente: Message Broker

Si cualquiera de los 4 microservicios se cae:
1. El **Message Broker** intercepta la falla y activa el **Circuit Breaker**.
2. La aplicación **NO se bloquea ni se cae**: activa el modo contingencia segura.
3. Las peticiones se encolan en el buffer de eventos.
4. Al recuperarse el microservicio, el broker ejecuta un **Self-Healing Replay** y re-integra el servicio sin pérdida de información.

---

## 4. Diseño Accesible para Mayores de 60 Años

- Tipografía de alta legibilidad con selector de escala de fuentes (A- / A+).
- Modo de alto contraste con proporción superior a 7:1.
- Botones grandes con altura mínima de 48px y soporte táctil.
- Lector de voz integrado (SpeechSynthesis) para personas con dificultades visuales.
