<template>
  <div>
    <nav>
      <div>
        <h1>PulsePoint</h1>
        <button @click="logout">Logga ut</button>
      </div>
    </nav>

    <!-- Inloggat läge -->
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useStorage } from "@vueuse/core";

// Hämta token från localStorage (via VueUse)
const token = useStorage("token", "");

const router = useRouter();

// Logga ut-funktion: ta bort token och navigera till login
const logout = () => {
  token.value = "";
  router.push("/");
};
</script>

<style scoped></style>
