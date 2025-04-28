<template>
  <div>
    <h2>Välkommen till din dashboard</h2>

    <!-- Laddar -->
    <p v-if="pending">Laddar användardata...</p>

    <!-- Fel -->
    <p v-else-if="error">Något gick fel: {{ error.message }}</p>

    <!-- Visa användarnamn -->
    <p v-else-if="user">
      Inloggad som: {{ user.userName }}
      <br />
      Ditt namn är: {{ user.firstName }}
      {{ user.lastName }}
      <br />
      Din roll är: {{ user.roles.join(", ") }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";

interface UserData {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  workplaceId: number;
  roles: string[];
}

definePageMeta({
  layout: "default",
});

const router = useRouter();
const token = useStorage("token", "");

// Om ingen token finns – redirecta direkt
if (!token.value) {
  router.push("/");
}

// useFetch körs automatiskt och hämtar användarinfo
const { data, pending, error } = await useFetch<UserData>(
  "http://localhost:5036/api/auth/me",
  {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    // Förhindra SSR, eftersom token bara finns i localStorage
    server: false,
  }
);

// Redirecta till login om error uppstår
watch(error, (err) => {
  if (err) {
    router.push("/");
  }
});

// Skapa en computed för enkel åtkomst till användardata
const user = computed(() => data.value);
</script>
