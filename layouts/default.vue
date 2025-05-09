<template>
  <div>
    <!-- Navigationsfält -->
    <nav
      class="bg-blue-600 text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div class="flex items-center gap-6">
        <h1 class="text-xl font-semibold">PulsePoint</h1>
        <ul class="flex gap-4 text-sm">
          <li>
            <NuxtLink to="/dashboard" class="hover:underline">Hem</NuxtLink>
          </li>
          <li v-if="!isManager">
            <NuxtLink to="/graphs" class="hover:underline">Statistik</NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Användarinformation och logga ut -->
      <div v-if="user" class="text-sm text-white/90">
        <p>
          Inloggad som <strong>{{ user.userName }}</strong
          ><br />
          Roll: {{ user.roles.join(", ") }}
        </p>
        <button
          @click="logout"
          class="mt-2 bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition"
        >
          Logga ut
        </button>
      </div>
    </nav>

    <!-- Huvudinnehåll -->
    <main class="p-6 bg-gray-50 min-h-screen">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user } = useUser();
const { logout } = useAuth();

// Kollar om användaren har rollen "manager"
const isManager = computed(
  () => user.value?.roles.includes("manager") ?? false
);
</script>
