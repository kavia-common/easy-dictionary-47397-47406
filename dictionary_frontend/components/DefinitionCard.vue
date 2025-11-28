<template>
  <article class="card" :aria-label="`Definition for ${entry.word}`">
    <header class="word-header">
      <h3 class="word-title">{{ entry.word }}</h3>
      <div class="badges">
        <span
          v-for="(phon, idx) in safePhonetics"
          :key="`phon-${idx}`"
          class="badge"
        >
          <span v-if="phon.text">{{ phon.text }}</span>
          <button
            v-if="phon.audio"
            class="audio-btn small"
            type="button"
            @click="play(phon.audio!)"
            :aria-label="`Play pronunciation for ${entry.word}`"
          >
            ▶︎ Audio
          </button>
        </span>
      </div>
    </header>

    <section
      v-for="(m, mi) in entry.meanings || []"
      :key="`m-${mi}-${m.partOfSpeech}`"
      class="section"
    >
      <p class="section-title">
        Part of speech: <strong>{{ m.partOfSpeech || '—' }}</strong>
      </p>

      <div v-for="(d, di) in m.definitions || []" :key="`d-${di}`" class="definition">
        <p style="margin: 0; font-weight: 600;">{{ d.definition }}</p>
        <p v-if="d.example" class="small" style="margin: .25rem 0 0;">
          Example: “{{ d.example }}”
        </p>
        <div v-if="d.synonyms?.length" class="synonyms" style="margin-top: .35rem;">
          <span class="synonym" v-for="(s, si) in d.synonyms" :key="`syn-${si}`">{{ s }}</span>
        </div>
      </div>

      <div v-if="m.synonyms?.length" class="section" aria-label="Synonyms">
        <p class="section-title">Synonyms</p>
        <div class="synonyms">
          <span class="synonym" v-for="(s, si) in m.synonyms" :key="`ms-${si}`">{{ s }}</span>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
/**
 * Renders a dictionary entry with phonetics, audio, meanings, definitions, examples, and synonyms.
 */
type Phonetic = { text?: string; audio?: string }
type Meaning = {
  partOfSpeech?: string
  definitions?: Array<{ definition: string; example?: string; synonyms?: string[] }>
  synonyms?: string[]
}
type Entry = {
  word: string
  phonetic?: string
  phonetics?: Phonetic[]
  meanings?: Meaning[]
}

const props = defineProps<{
  entry: Entry
}>()

const safePhonetics = computed<Phonetic[]>(() => {
  const p = props.entry.phonetics || []
  const items = p.length ? p : (props.entry.phonetic ? [{ text: props.entry.phonetic }] : [])
  // Unique by text+audio
  const seen = new Set<string>()
  return items.filter(ph => {
    const key = `${ph.text ?? ''}|${ph.audio ?? ''}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, 3)
})

function play(url: string) {
  try {
    const audio = new Audio(url)
    audio.play().catch(() => {
      // ignore play errors (autoplay policies etc.)
    })
  } catch {
    // ignore
  }
}
</script>
