<template>
  <div class="text-center space-y-4">
    <h1 class="text-4xl font-bold text-red-600">404 - Sidan hittades inte</h1>
    <p class="text-gray-600">
      Sidan du söker existerar inte eller har flyttats.
    </p>
    <NuxtLink
      to="/"
      class="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Gå till startsidan
    </NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});
</script>
