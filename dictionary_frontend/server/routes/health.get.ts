import { defineEventHandler } from 'h3'

/**
 * PUBLIC_INTERFACE
 * Dedicated health endpoint for fast readiness/liveness checks.
 * Always returns quickly with a simple JSON payload.
 */
export default defineEventHandler(() => {
  /** This is a public function. */
  return { status: 'ok', name: 'dictionary_frontend', path: '/health', ready: true }
})
