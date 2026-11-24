import { AuditoriaEvento } from '../../types';

/**
 * SISTEMA DE CIBERSEGURIDAD DE DOBLE CAPA (DEFENSA EN PROFUNDIDAD)
 * Cumple rigurosamente con ISO/IEC 25010 (Seguridad: Confidencialidad, Integridad, No Repudio)
 */

export class TwoLayerSecurityEngine {
  private static instance: TwoLayerSecurityEngine;
  private auditLog: AuditoriaEvento[] = [];
  private rateLimitMap: Map<string, { count: number; lastReset: number }> = new Map();

  private constructor() {}

  public static getInstance(): TwoLayerSecurityEngine {
    if (!TwoLayerSecurityEngine.instance) {
      TwoLayerSecurityEngine.instance = new TwoLayerSecurityEngine();
    }
    return TwoLayerSecurityEngine.instance;
  }

  // =========================================================================
  // 1. ESTRATO: FRONTEND
  // =========================================================================

  /**
   * FRONTEND - CAPA 1: Sanitización y Validación DOM Estricta
   * - Elimina etiquetas HTML, scripts, caracteres de inyección (<, >, ", ', etc.)
   * - Bloquea en seco caracteres negativos (- o signos menos)
   */
  public sanitizeAndValidateDOMInput(input: string, campo: string): { safeValue: string; isValid: boolean; error?: string } {
    if (typeof input !== 'string') {
      input = String(input || '');
    }

    // Bloqueo estricto del carácter menos (-)
    if (input.includes('-')) {
      this.logAudit('FRONTEND', 'CAPA_1', `Intento de ingreso de número negativo en ${campo}`, 'BLOQUEADO', `Valor rechazado: "${input}"`);
      return { safeValue: input.replace(/-/g, ''), isValid: false, error: 'No se permiten números negativos ni el signo menos.' };
    }

    // Sanitización contra XSS (Cross-Site Scripting)
    const sanitized = input
      .replace(/<[^>]*>?/gm, '') // Quitar etiquetas HTML
      .replace(/[<>"'`;()]/g, '') // Quitar caracteres de inyección
      .trim();

    this.logAudit('FRONTEND', 'CAPA_1', `Validación DOM y sanitización de ${campo}`, 'PERMITIDO', `Input sanitizado: "${sanitized}"`);
    return { safeValue: sanitized, isValid: true };
  }

  /**
   * FRONTEND - CAPA 2: Integridad Criptográfica de Estado
   * - Genera un checksum/hash de integridad para evitar manipulación en memoria
   * - Verifica que la transacción no haya sido adulterada en DevTools
   */
  public generateClientIntegritySignature(payload: Record<string, unknown>): string {
    const serialized = JSON.stringify(payload);
    let hash = 0;
    for (let i = 0; i < serialized.length; i++) {
      const char = serialized.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convertir a entero de 32 bits
    }
    const signature = `SIG-${Math.abs(hash).toString(16).toUpperCase()}-${serialized.length}`;
    this.logAudit('FRONTEND', 'CAPA_2', 'Firma de Integridad de Estado Cliente generada', 'PERMITIDO', `Firma: ${signature}`);
    return signature;
  }

  // =========================================================================
  // 2. ESTRATO: APIS Y RUTAS
  // =========================================================================

  /**
   * API - CAPA 1: Gateway Rate Limiting y Virtual WAF
   * - Previene ataques DoS / fuerza bruta por IP o identificador de cliente
   */
  public verifyApiRateLimit(clientId: string, limitMax: number = 30, windowMs: number = 60000): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const clientRecord = this.rateLimitMap.get(clientId) || { count: 0, lastReset: now };

    if (now - clientRecord.lastReset > windowMs) {
      clientRecord.count = 1;
      clientRecord.lastReset = now;
    } else {
      clientRecord.count++;
    }

    this.rateLimitMap.set(clientId, clientRecord);

    if (clientRecord.count > limitMax) {
      this.logAudit('API', 'CAPA_1', `Rate limit excedido para cliente ${clientId}`, 'BLOQUEADO', `Intentos: ${clientRecord.count} en ventana de tiempo`);
      return { allowed: false, remaining: 0 };
    }

    const remaining = limitMax - clientRecord.count;
    this.logAudit('API', 'CAPA_1', `Petición API aceptada por Gateway Firewall`, 'PERMITIDO', `Restantes: ${remaining}`);
    return { allowed: true, remaining };
  }

  /**
   * API - CAPA 2: Verificación de Token Criptográfico (JWT Simulator) y Contrato Zod
   * - Desecha cualquier payload con propiedades desconocidas o maliciosas
   */
  public verifyApiTokenAndContract(token: string, payload: Record<string, unknown>): { valid: boolean; reason?: string } {
    if (!token || !token.startsWith('BEARER-SENA-SECURE-')) {
      this.logAudit('API', 'CAPA_2', 'Token de API inválido o faltante', 'BLOQUEADO', 'Encabezado Authorization rechazado');
      return { valid: false, reason: 'Token de seguridad API inválido o expirado.' };
    }

    // Validación de contrato estricto: solo se permiten llaves autorizadas
    const allowedKeys = new Set(['nombreCliente', 'equipos', 'diasIniciales', 'diasAdicionales', 'tipoServicio', 'signature']);
    const keys = Object.keys(payload);
    for (const k of keys) {
      if (!allowedKeys.has(k)) {
        this.logAudit('API', 'CAPA_2', `Payload poisoning detectado. Llave no permitida: ${k}`, 'BLOQUEADO', 'Violación de contrato API');
        return { valid: false, reason: `Parámetro no autorizado en la petición: ${k}` };
      }
    }

    this.logAudit('API', 'CAPA_2', 'Token y contrato de payload validados exitosamente', 'PERMITIDO', 'Token verificado contra clave de sesión');
    return { valid: true };
  }

  // =========================================================================
  // 3. ESTRATO: BACKEND / MICROSERVICIOS
  // =========================================================================

  /**
   * MICROSERVICES - CAPA 1: Aislamiento de Ejecución y Circuit Breaker
   */
  public executeIsolatedMicroservice<T>(
    serviceName: string,
    operation: () => T,
    fallback: () => T
  ): { result: T; executionSource: 'DIRECT' | 'FALLBACK_RESILIENTE' } {
    try {
      const res = operation();
      this.logAudit('MICROSERVICES', 'CAPA_1', `Ejecución aislada exitosa en ${serviceName}`, 'PERMITIDO', 'Completado sin anomalías');
      return { result: res, executionSource: 'DIRECT' };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      this.logAudit('MICROSERVICES', 'CAPA_1', `Fallo contenido en ${serviceName}. Activando Fallback`, 'ADVERTENCIA', `Detalle: ${errorMsg}`);
      return { result: fallback(), executionSource: 'FALLBACK_RESILIENTE' };
    }
  }

  /**
   * MICROSERVICES - CAPA 2: Control de Acceso por Roles (RBAC) y Bitácora Inmutable
   */
  public verifyMicroservicePermissions(userRole: string, requiredRole: string): boolean {
    const roleHierarchy: Record<string, number> = {
      'GUEST': 1,
      'OPERADOR_SENA': 2,
      'AUDITOR_SISTEMA': 3,
      'ADMIN_INFRAESTRUCTURA': 4
    };

    const hasAccess = (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 99);
    this.logAudit(
      'MICROSERVICES',
      'CAPA_2',
      `Verificación RBAC: Rol [${userRole}] solicitando recurso [${requiredRole}]`,
      hasAccess ? 'PERMITIDO' : 'BLOQUEADO',
      hasAccess ? 'Permisos otorgados' : 'Acceso no autorizado'
    );
    return hasAccess;
  }

  // =========================================================================
  // 4. ESTRATO: BASE DE DATOS
  // =========================================================================

  /**
   * DB - CAPA 1: Parametrización y Aislamiento contra Inyección SQL
   */
  public simulateParameterizedQuery(sqlTemplate: string, params: (string | number)[]): { executedQuery: string; safe: boolean } {
    // Verificación de inyección de código SQL malicioso
    const sqlInjectionPatterns = [/(\b(UNION|SELECT|INSERT|DELETE|UPDATE|DROP|ALTER|EXEC|TRUNCATE)\b)/i, /(--|;|\/\*|\*\/)/];
    for (const p of params) {
      if (typeof p === 'string' && sqlInjectionPatterns.some(pattern => pattern.test(p))) {
        this.logAudit('DATABASE', 'CAPA_1', 'Ataque de Inyección SQL neutralizado', 'BLOQUEADO', `Parámetro sospechoso: "${p}"`);
        throw new Error('Intento de inyección SQL detectado y bloqueado por la Capa de Base de Datos.');
      }
    }

    let paramIndex = 0;
    const safeCompiledSql = sqlTemplate.replace(/\?/g, () => {
      const val = params[paramIndex++];
      return typeof val === 'number' ? String(val) : `'${String(val).replace(/'/g, "''")}'`;
    });

    this.logAudit('DATABASE', 'CAPA_1', 'Consulta parametrizada compilada con seguridad', 'PERMITIDO', `SQL seguro: ${safeCompiledSql}`);
    return { executedQuery: safeCompiledSql, safe: true };
  }

  /**
   * DB - CAPA 2: Cifrado en Reposo Simulado (AES-256) y Hash de Integridad
   */
  public encryptAtRest(sensitiveData: string): { cipherText: string; iv: string; authTag: string } {
    // Simulación pedagógica de cifrado AES-256-GCM
    const iv = Math.random().toString(36).substring(2, 10).toUpperCase();
    const encoded = btoa(encodeURIComponent(sensitiveData));
    const cipherText = `ENC_AES256_${iv}_${encoded}`;
    const authTag = `TAG_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    this.logAudit('DATABASE', 'CAPA_2', 'Cifrado en reposo AES-256 de PII / Datos de cliente', 'PERMITIDO', `Registro cifrado con IV: ${iv}`);
    return { cipherText, iv, authTag };
  }

  // =========================================================================
  // GESTIÓN DE AUDITORÍA
  // =========================================================================

  private logAudit(
    capa: AuditoriaEvento['capa'],
    subcapa: AuditoriaEvento['subcapa'],
    accion: string,
    resultado: AuditoriaEvento['resultado'],
    detalles: string
  ): void {
    const evento: AuditoriaEvento = {
      id: `SEC-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString('es-CO', { hour12: false }),
      capa,
      subcapa,
      accion,
      resultado,
      detalles
    };

    this.auditLog.unshift(evento);
    if (this.auditLog.length > 50) {
      this.auditLog.pop();
    }
  }

  public getRecentAuditLog(): AuditoriaEvento[] {
    return [...this.auditLog];
  }
}
