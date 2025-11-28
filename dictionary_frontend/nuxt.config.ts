/* https://nuxt.com/docs/api/configuration/nuxt-config
 * Nuxt configuration for the Ocean Dictionary frontend.
 * - Exposes NUXT_PUBLIC_API_BASE as runtime public config for composables.
 * - Sets dev server to 0.0.0.0:3000 to work in container.
 */
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
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
  nitro: {
    routeRules: {
      "/**": {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
    },
  },
  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: 3000,
    },
  },
});
