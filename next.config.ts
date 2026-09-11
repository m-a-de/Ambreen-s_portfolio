import type { NextConfig } from "next";

const productionContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://www.google-analytics.com https://*.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const developmentContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:4001 http://127.0.0.1:4001 https://www.googletagmanager.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline' http://localhost:4001 http://127.0.0.1:4001",
  "img-src 'self' data: blob: https://images.unsplash.com https://www.google-analytics.com https://*.google-analytics.com",
  "font-src 'self' data: http://localhost:4001 http://127.0.0.1:4001",
  "connect-src 'self' http://localhost:4001 ws://localhost:4001 http://127.0.0.1:4001 ws://127.0.0.1:4001 https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const productionAdminContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://www.google-analytics.com https://*.google-analytics.com https://assets.tina.io https://assets.tinajs.io https://*.tina.io https://s3.us-east-1.amazonaws.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://challenges.cloudflare.com https://identity.tinajs.io https://identity-v2.tinajs.io https://content.tinajs.io https://assets.tinajs.io https://assets.tina.io https://*.tina.io https://s3.us-east-1.amazonaws.com",
  "frame-src https://challenges.cloudflare.com",
  "form-action 'self' https://identity.tinajs.io https://identity-v2.tinajs.io https://*.tina.io",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const sharedSecurityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/admin",
        destination: "/admin/index.html",
      },
    ];
  },

  async headers() {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Content-Security-Policy",
              value: developmentContentSecurityPolicy,
            },
            ...sharedSecurityHeaders,
          ],
        },
      ];
    }

    return [
      {
        source: "/admin",
        headers: [
          {
            key: "Content-Security-Policy",
            value: productionAdminContentSecurityPolicy,
          },
          ...sharedSecurityHeaders,
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: productionAdminContentSecurityPolicy,
          },
          ...sharedSecurityHeaders,
        ],
      },
      {
        source: "/((?!admin(?:/|$)).*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: productionContentSecurityPolicy,
          },
          ...sharedSecurityHeaders,
        ],
      },
    ];
  },
};

export default nextConfig;
