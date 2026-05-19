import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ── Performance ────────────────────────────────────────────
  // Compress responses for production
  compress: true,

  // Tree-shake heavy packages to reduce bundle size
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "recharts",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
    ],
  },

  // ── Security Headers ────────────────────────────────────────
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            // CSP — practical policy that allows Next.js dev tooling.
            // NOTE: 'unsafe-inline' for styles is required for Next.js/Radix.
            // 'unsafe-eval' is needed for Next.js dev mode only (hot reload).
            // TODO: Replace 'unsafe-inline' with nonce-based CSP once Next.js
            //       supports it natively for App Router.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + Next.js inline scripts
              `script-src 'self'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
              // Styles: self + inline (required for Radix/Tailwind runtime)
              "style-src 'self' 'unsafe-inline'",
              // Images: self, data URIs, Supabase storage
              `img-src 'self' data: blob:${process.env.NEXT_PUBLIC_SUPABASE_URL ? ` ${process.env.NEXT_PUBLIC_SUPABASE_URL}` : ""}`,
              // Fonts: self
              "font-src 'self'",
              // Connect: self, Supabase, Square
              `connect-src 'self'${process.env.NEXT_PUBLIC_SUPABASE_URL ? ` ${process.env.NEXT_PUBLIC_SUPABASE_URL} wss://${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname}` : ""} https://connect.squareup.com https://connect.squareupsandbox.com`,
              // Frames: none
              "frame-src 'none'",
              // Object: none
              "object-src 'none'",
              // Base URI: self only
              "base-uri 'self'",
              // Form action: self only
              "form-action 'self'",
              // Upgrade insecure requests in production
              ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
