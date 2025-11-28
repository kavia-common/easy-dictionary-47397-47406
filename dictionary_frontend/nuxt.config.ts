/* https://nuxt.com/docs/api/configuration/nuxt-config
 * Nuxt configuration for the Ocean Dictionary frontend.
 * - Exposes NUXT_PUBLIC_API_BASE as runtime public config for composables.
 * - Ensures dev server binds to 0.0.0.0:3000 (or env PORT/NITRO_PORT) to work in containerized CI.
 */
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  // Disable Nuxt devtools to reduce startup overhead in CI/containers
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      // Mirror port for client-side needs if required by env
      port: process.env.NUXT_PUBLIC_PORT || process.env.PORT || process.env.NITRO_PORT || '3000',
      // Healthcheck path exposed for container platforms
      healthcheckPath: process.env.NUXT_PUBLIC_HEALTHCHECK_PATH || '/',
    },
  },
  app: {
    head: {
      title: 'Ocean Dictionary',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Search word definitions with a clean Ocean-themed interface.' },
        { name: 'theme-color', content: '#2563EB' },
      ],
      link: [
        { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>∑</text></svg>' },
      ],
    },
  },
  // Nitro runtime and server binding
  nitro: {
    // Avoid extra dev proxy features
    devProxy: false as unknown as undefined,
    // Force node preset by default for predictable container startup
    preset: process.env.NITRO_PRESET || 'node',
    // Explicitly bind Nitro to host/port in dev and fail fast on conflicts
    devServer: {
      host: '0.0.0.0',
      port: Number(process.env.NUXT_PUBLIC_PORT || process.env.NITRO_PORT || process.env.PORT || 3000),
      https: false,
    },
    routeRules: {
      "/**": {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    },
    // Disable timing/telemetry-like overhead in nitro if present
    experimental: {
      tasks: false,
    } as any,
  },
  // Ensure Vite dev server binds correctly inside containers and doesn't switch ports
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: Number(process.env.NUXT_PUBLIC_PORT || process.env.PORT || process.env.NITRO_PORT || 3000),
      strictPort: true,
    },
    // Speed up startup by skipping TS type checking on start and disabling telemetry
    define: {
      'process.env.NUXT_TELEMETRY_DISABLED': JSON.stringify('1'),
      'process.env.NUXT_TYPE_CHECK': JSON.stringify('0'),
    },
    // Avoid generating source maps in dev unless explicitly enabled
    build: {
      sourcemap: process.env.NUXT_PUBLIC_ENABLE_SOURCE_MAPS === '1',
    },
    css: {
      devSourcemap: false,
    },
  },
  // Also guide Nuxt dev server to use the same port/host.
  devServer: {
    host: '0.0.0.0',
    port: Number(process.env.NUXT_PUBLIC_PORT || process.env.PORT || process.env.NITRO_PORT || 3000),
  },
  // Disable Nuxt telemetry entirely
  telemetry: false,
  // Disable type checking during dev start for faster boot (can still run separately)
  typescript: {
    // PUBLIC_INTERFACE
    /** Disable type checking on build/start to speed up dev boot; CI can run tsc separately if needed. */
    typeCheck: false,
  },
  // Avoid heavy build analysis and source maps in dev by default
  build: {
    analyze: false,
    sourcemap: process.env.NUXT_PUBLIC_ENABLE_SOURCE_MAPS === '1',
  },
});
