import { defineEventHandler } from 'h3'

/**
 * PUBLIC_INTERFACE
 * Health/landing endpoint for container health checks.
 * Returns a simple JSON payload quickly to signal readiness.
 */
export default defineEventHandler(() => {
  /** This is a public function. */
  return { status: 'ok', name: 'dictionary_frontend', path: '/', ready: true }
})
