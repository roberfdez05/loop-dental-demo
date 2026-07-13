import type { NextConfig } from "next";

/**
 * Sin 'strict-dynamic'/nonce a propósito: se probó (verificado con curl +
 * Playwright contra `next start`) que Next.js 16 + Turbopack no propaga el
 * nonce por request a sus propios <script> de hidratación en este setup,
 * lo que rompía la app por completo en producción. `script-src`/`style-src`
 * necesitan 'unsafe-inline' porque Next inyecta el payload de hidratación
 * (`self.__next_f.push(...)`) inline y Framer Motion anima escribiendo el
 * atributo `style` vía JS. Sigue bloqueando la carga de cualquier script,
 * estilo, imagen, fuente o conexión de origen externo, y el framing.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
