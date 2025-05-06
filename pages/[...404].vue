<template>
  <div>
    <h1>404 - Sidan hittades inte</h1>
    <p>Sidan du söker existerar inte.</p>
    <NuxtLink to="/"> Gå till startsidan </NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});
</script>
