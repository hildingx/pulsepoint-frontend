<!-- layouts/auth.vue -->
<template>
  <div
    class="min-h-screen relative flex items-center justify-center bg-gray-100 px-4"
  >
    <!-- App-namn -->
    <h1
      class="absolute top-20 text-3xl font-extrabold text-sky-700 font-playfair w-full text-center"
    >
      PulsePoint
    </h1>
    <main
      class="w-full max-w-md p-6 bg-white rounded-xl shadow-md mt-32 md:mt-0"
    >
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts"></script>
