<template>
  <div>
    <NuxtRouteAnnouncer />
    <div class="container">
      <header class="header" aria-label="App header">
        <div class="logo" aria-hidden="true">∑</div>
        <div class="brand">
          <p class="brand-title">Ocean Dictionary</p>
          <p class="brand-subtitle">Search word meanings, phonetics, and examples</p>
        </div>
      </header>

      <NuxtPage />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Root application shell for Ocean-themed dictionary.
 * Loads global theme styles and hosts Nuxt pages.
 */
</script>

<style>
@import url('/assets/css/theme.css');
</style>
