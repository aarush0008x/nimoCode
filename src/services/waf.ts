export interface WafLogEntry {
  id: string;
  timestamp: string;
  threatType: 'XSS' | 'SQLi' | 'RCE' | 'RateLimit' | 'PathTraversal';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  ipAddress: string;
  endpoint: string;
  blockedPayload: string;
}

const WAF_STORAGE_KEY = 'nimocode_waf_logs_v1';

// Threat Signature Patterns
const THREAT_PATTERNS = {
  XSS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onerror=/gi,
    /onload=/gi,
    /<iframe/gi,
    /eval\s*\(/gi
  ],
  SQLi: [
    /UNION\s+SELECT/gi,
    /DROP\s+TABLE/gi,
    /INSERT\s+INTO/gi,
    /--\s*$/gm,
    /'\s*OR\s*'1'='1/gi,
    /;\s*SHUTDOWN/gi
  ],
  RCE: [
    /child_process/gi,
    /require\s*\(\s*['"]child_process['"]\s*\)/gi,
    /process\.env/gi,
    /__import__\s*\(\s*['"]os['"]\s*\)/gi,
    /system\s*\(\s*['"]/gi,
    /exec\s*\(\s*['"]/gi
  ],
  PathTraversal: [
    /\.\.\//g,
    /\.\.\\/g,
    /\/etc\/passwd/gi,
    /c:\\windows\\system32/gi
  ]
};

// Rate limiter memory store
const requestTracker: Record<string, number[]> = {};

export const waf = {
  // Scans input string for malicious patterns
  inspectInput: (input: string, endpoint: string = 'general'): { safe: boolean; threatType?: WafLogEntry['threatType']; payload?: string } => {
    if (!input || typeof input !== 'string') return { safe: true };

    // 1. Check XSS
    for (const pattern of THREAT_PATTERNS.XSS) {
      if (pattern.test(input)) {
        waf.logThreat('XSS', 'HIGH', endpoint, input);
        return { safe: false, threatType: 'XSS', payload: input.slice(0, 80) };
      }
    }

    // 2. Check SQLi
    for (const pattern of THREAT_PATTERNS.SQLi) {
      if (pattern.test(input)) {
        waf.logThreat('SQLi', 'CRITICAL', endpoint, input);
        return { safe: false, threatType: 'SQLi', payload: input.slice(0, 80) };
      }
    }

    // 3. Check RCE
    for (const pattern of THREAT_PATTERNS.RCE) {
      if (pattern.test(input)) {
        waf.logThreat('RCE', 'CRITICAL', endpoint, input);
        return { safe: false, threatType: 'RCE', payload: input.slice(0, 80) };
      }
    }

    // 4. Check Path Traversal
    for (const pattern of THREAT_PATTERNS.PathTraversal) {
      if (pattern.test(input)) {
        waf.logThreat('PathTraversal', 'MEDIUM', endpoint, input);
        return { safe: false, threatType: 'PathTraversal', payload: input.slice(0, 80) };
      }
    }

    return { safe: true };
  },

  // Rate Limiting (max 40 requests per 60 seconds per IP/client)
  checkRateLimit: (clientId: string = 'client_local'): boolean => {
    const now = Date.now();
    if (!requestTracker[clientId]) {
      requestTracker[clientId] = [];
    }

    // Keep requests within last 60s
    requestTracker[clientId] = requestTracker[clientId].filter(ts => now - ts < 60000);
    requestTracker[clientId].push(now);

    if (requestTracker[clientId].length > 40) {
      waf.logThreat('RateLimit', 'HIGH', 'api_rate_limiter', `Client ${clientId} exceeded 40 reqs/min`);
      return false; // Rate limit exceeded
    }

    return true; // OK
  },

  // Log detected threat to persistent log store
  logThreat: (threatType: WafLogEntry['threatType'], severity: WafLogEntry['severity'], endpoint: string, payload: string) => {
    const logs = waf.getLogs();
    const newLog: WafLogEntry = {
      id: `waf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString(),
      threatType,
      severity,
      ipAddress: '192.168.1.104 (Protected)',
      endpoint,
      blockedPayload: payload.slice(0, 100)
    };

    const updated = [newLog, ...logs].slice(0, 50); // Keep last 50 logs
    localStorage.setItem(WAF_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('nimocode_waf_update'));
  },

  getLogs: (): WafLogEntry[] => {
    try {
      const data = localStorage.getItem(WAF_STORAGE_KEY);
      return data ? JSON.parse(data) : [
        {
          id: 'waf-demo-1',
          timestamp: '09:42:15 AM',
          threatType: 'XSS',
          severity: 'HIGH',
          ipAddress: '192.168.1.104',
          endpoint: '/api/discussions',
          blockedPayload: '<script>alert("xss")</script>'
        },
        {
          id: 'waf-demo-2',
          timestamp: '09:38:02 AM',
          threatType: 'SQLi',
          severity: 'CRITICAL',
          ipAddress: '192.168.1.104',
          endpoint: '/api/auth/login',
          blockedPayload: "' OR '1'='1"
        }
      ];
    } catch {
      return [];
    }
  },

  clearLogs: () => {
    localStorage.removeItem(WAF_STORAGE_KEY);
    window.dispatchEvent(new Event('nimocode_waf_update'));
  }
};
