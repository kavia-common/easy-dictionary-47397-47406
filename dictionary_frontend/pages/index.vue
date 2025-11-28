<template>
  <main>
    <section class="search-shell" aria-label="Search dictionary">
      <form class="search-row" @submit.prevent="onSubmit">
        <label class="search-input" :aria-busy="loading ? 'true' : 'false'">
          <span aria-hidden="true" style="color: var(--color-primary); font-weight: 700;">🔎</span>
          <input
            ref="inputEl"
            v-model="query"
            type="search"
            inputmode="search"
            name="q"
            autocomplete="off"
            placeholder="Type a word, e.g. serendipity"
            aria-label="Type a word to search definitions"
            @input="onInput"
          />
        </label>

        <button class="search-btn" type="submit" :disabled="loading || !query.trim()">
          <span v-if="!loading">Search</span>
          <span v-else class="loading"><span class="spinner" aria-hidden="true"></span> Loading</span>
        </button>
      </form>
      <p class="helper">
        <span aria-hidden="true">💡</span>
        Try words like “eloquent”, “ubiquitous”, or “ocean”.
      </p>
    </section>

    <section class="results" aria-live="polite" aria-atomic="false">
      <div v-if="!loading && !error && !hasResults" class="state info">
        Start by searching for a word to see definitions, phonetics, and examples.
      </div>

      <div v-if="error" class="state error" role="alert">
        {{ error }}
      </div>

      <div v-if="hasResults">
        <DefinitionCard v-for="(e, i) in entries" :key="`entry-${i}-${e.word}`" :entry="e" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
/**
 * Home page for the dictionary app.
 * - Debounced input with abortable fetch via useDictionary composable.
 * - Handles states: initial info, loading spinner, error (not found/network), and results.
 */
const { loading, error, entries, hasResults, search } = useDictionary()

const query = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

let debounceTimer: number | undefined

function onInput() {
  // debounce to avoid overwhelming API during typing
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    if (query.value.trim().length >= 2) {
      search(query.value)
    }
  }, 400)
}

function onSubmit() {
  window.clearTimeout(debounceTimer)
  if (query.value.trim()) {
    search(query.value)
  } else {
    // force an error message for empty submit
    search(' ')
  }
}

onMounted(() => {
  // focus input for accessibility/convenience
  inputEl.value?.focus()
})
</script>

<style scoped>
main {
  display: grid;
  gap: 1rem;
}
</style>
