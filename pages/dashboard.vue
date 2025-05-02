<template>
  <div>
    <h2>Välkommen till din dashboard</h2>

    <!-- Laddar -->
    <p v-if="userPending">Laddar användardata...</p>

    <!-- Fel -->
    <p v-else-if="userError">Något gick fel: {{ userError }}</p>

    <!-- Visa när användaren är laddad -->
    <template v-if="!userPending && user">
      <!-- Manager-vy -->
      <div v-if="isManager">
        <h3>Statistik för din arbetsplats (manager)</h3>
        <!-- (Här ska managerdata visas – kommer senare) -->
      </div>

      <!-- Användarvy -->
      <template v-else-if="!entriesPending">
        <div v-if="hasSubmittedToday">
          <h3>Fantastiskt jobbat!</h3>
          <p>Du har registrerat din hälsa för idag. Vi ses imorgon igen!</p>
        </div>
        <div v-else>
          <HealthForm @submitted="refreshEntries" />
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useUser } from "@/composables/useUser";
import { useTodayEntry } from "@/composables/useTodayEntry";
import HealthForm from "@/components/HealthForm.vue";
import { useHealthEntries } from "@/composables/useHealthEntries";

definePageMeta({
  layout: "default",
});

// Användardata
const { user } = useUser();
const userPending = computed(() => user.value === null);
const userError = ref(null);

// Hämtning av entries
const {
  entries,
  pending: entriesPending,
  error: entriesError,
  refresh,
} = await useHealthEntries();

// Rollcheck
const isManager = computed(() => user.value?.roles.includes("manager"));

// Refresh vid ny registrering
const refreshEntries = async () => {
  await refresh();
};

// Dagens entry
const { hasSubmittedToday } = useTodayEntry(entries);
</script>
