import { ref, computed } from 'vue'

type Phonetic = {
  text?: string
  audio?: string
}

type Meaning = {
  partOfSpeech?: string
  definitions?: Array<{
    definition: string
    example?: string
    synonyms?: string[]
    antonyms?: string[]
  }>
  synonyms?: string[]
  antonyms?: string[]
}

type Entry = {
  word: string
  phonetic?: string
  phonetics?: Phonetic[]
  origin?: string
  meanings?: Meaning[]
}

/**
 * PUBLIC_INTERFACE
 * useDictionary composable to fetch word definitions from a public dictionary API.
 * - Uses runtime public env NUXT_PUBLIC_API_BASE if set; otherwise defaults to https://api.dictionaryapi.dev
 * - Provides abortable fetch and reactive loading/error/data states.
 */
export function useDictionary() {
  /** This is a public function. */
  const config = useRuntimeConfig()
  const base =
    (config.public?.apiBase as string | undefined) ||
    (process.client ? (window as any)?.NUXT_PUBLIC_API_BASE : undefined) ||
    'https://api.dictionaryapi.dev'

  const loading = ref(false)
  const error = ref<string | null>(null)
  const entries = ref<Entry[] | null>(null)
  const controller = ref<AbortController | null>(null)

  const hasResults = computed(() => !!entries.value && entries.value.length > 0)

  async function search(term: string) {
    // PUBLIC_INTERFACE
    /** Fetch definitions for the provided term. Aborts previous request if still in-flight. */
    error.value = null
    entries.value = null

    const trimmed = term.trim()
    if (!trimmed) {
      error.value = 'Please enter a word to search.'
      return
    }

    // Abort previous request to handle rapid input
    if (controller.value) {
      try {
        controller.value.abort()
      } catch {
        // ignore
      }
    }
    controller.value = new AbortController()

    loading.value = true
    try {
      // Dictionary API: https://api.dictionaryapi.dev/api/v2/entries/en/<word>
      const url = `${base.replace(/\/+$/, '')}/api/v2/entries/en/${encodeURIComponent(trimmed)}`
      const res = await fetch(url, {
        signal: controller.value.signal,
        headers: {
          Accept: 'application/json',
        },
      })

      if (!res.ok) {
        // API returns 404 JSON payload for not found
        let message = `Error ${res.status}`
        try {
          const j = await res.json()
          if (j?.title === 'No Definitions Found') {
            message = 'No definitions found for this word.'
          } else if (j?.message) {
            message = j.message
          }
        } catch {
          // ignore JSON parse
        }
        throw new Error(message)
      }

      const data = (await res.json()) as Entry[]
      entries.value = Array.isArray(data) ? data : []
      if (!entries.value.length) {
        error.value = 'No definitions found for this word.'
      }
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        // Swallow aborts
        return
      }
      error.value = e?.message || 'Failed to fetch definitions.'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    entries,
    hasResults,
    search,
  }
}
