// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: ['@nuxt/ui'],
    runtimeConfig: {
        public: {
            frontendUrl: '',
            backendUrl: '',
            apiVersion: '',
        }
    },
    routeRules: {
        '/api/v1/**': {
            proxy: `${process.env.NUXT_PUBLIC_BACKEND_URL}/api/${process.env.NUXT_PUBLIC_API_VERSION}/**`,
        },
        '/web/**': {
            proxy: `${process.env.NUXT_PUBLIC_BACKEND_URL}/**`,
        },
        '/csrf': {
            proxy: `${process.env.NUXT_PUBLIC_BACKEND_URL}/sanctum/csrf-cookie`,
        },
    },
    imports: {
        dirs: ["./utils"],
    },
})
