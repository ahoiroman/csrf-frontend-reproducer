# CSRF Reproducer (Nuxt)

This will demonstrate the cookie behavior after upgrading to nuxt 3.8.0

Make sure you installed the API backend installed before!

1. Set up your webserver to serve the API-backend on a subdomain of the same domain as the Nuxt frontend (e.g. web.example.test, api.example.test)
2. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`
3. Adapt the values for `NUXT_PUBLIC_FRONTEND_URL`and `NUXT_PUBLIC_BACKEND_URL`, e.g. `NUXT_PUBLIC_FRONTEND_URL=http://web.csrf.test` and `NUXT_PUBLIC_BACKEND_URL=http://api.csrf.test`
4. Run `npm run dev`