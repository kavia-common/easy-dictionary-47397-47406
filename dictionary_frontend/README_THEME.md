# Ocean Dictionary Frontend

- Framework: Nuxt 3
- Theme: Ocean Professional (blue primary with amber accents)
- Env: Uses `NUXT_PUBLIC_API_BASE` if provided; defaults to `https://api.dictionaryapi.dev`

## Run

- Development: `npm run dev`
- Build: `npm run build` then `npm run preview`

## Notes

- Home page at `/` with a centered search bar.
- Debounced search and abortable fetch to avoid overlapping requests.
- Displays phonetics (text and audio), part of speech, definitions, examples, and synonyms.
- Error handling includes "not found" and generic network errors.

## Healthcheck

- The container exposes a fast health endpoint at `/health` that returns `{ status: "ok", ready: true }` to satisfy platform health checks.
- The root path `/` serves the Nuxt application (home page).
- The dev server binds to `0.0.0.0` on port `3000` by default. Override via `NUXT_PUBLIC_PORT`, `PORT`, or `NITRO_PORT`.
