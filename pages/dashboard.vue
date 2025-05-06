<template>
  <div>
    <h2>Välkommen till din dashboard</h2>

    <!-- Laddar användardata -->
    <p v-if="!user">Laddar användardata...</p>

    <template v-else>
      <!-- Manager-vy -->
      <div v-if="isManager">
        <h3>Statistik för din arbetsplats (manager)</h3>
        <ManagerStats />
      </div>

      <div v-else>
        <!-- Visa laddningsmeddelande under anropet -->
        <p v-if="entriesLoading">Laddar dina tidigare registreringar…</p>

        <!-- När vi är klara med hämtningen -->
        <template v-else>
          <div v-if="hasSubmittedToday">
            <h3>Fantastiskt jobbat!</h3>
            <p>Du har registrerat din hälsa för idag. Vi ses imorgon igen!</p>
          </div>
          <div v-else>
            <HealthForm @submitted="onSubmitted" />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { DateTime } from "luxon";
import { useUser } from "@/composables/useUser";
import HealthForm from "@/components/HealthForm.vue";
import ManagerStats from "@/components/ManagerStats.vue";

definePageMeta({ layout: "default" });

// state & refs
const { user, token } = useUser();
const entries = ref<{ date: string }[]>([]);
const hasSubmittedToday = ref(false);
const entriesLoading = ref(true);

async function fetchEntries() {
  entriesLoading.value = true;
  // om ingen token, töm och avbryt
  if (!token.value) {
    entries.value = [];
    hasSubmittedToday.value = false;
    return;
  }

  try {
    // No-store för att undvika cache
    const data = await $fetch<{ date: string }[]>(
      "http://localhost:5036/api/healthentries",
      {
        headers: { Authorization: `Bearer ${token.value}` },
        cache: "no-store",
      }
    );
    entries.value = data;
    evaluateToday();
  } catch (err) {
    console.error("Fetch entries failed", err);
    entries.value = [];
    hasSubmittedToday.value = false;
  } finally {
    entriesLoading.value = false;
  }
}

function evaluateToday() {
  const today = DateTime.local().toISODate();
  hasSubmittedToday.value = entries.value.some(
    (e) => DateTime.fromISO(e.date).toISODate() === today
  );
}

// Kör alltid vid mount
onMounted(fetchEntries);

// Kör på varenda token-ändring (login <-> logout)
watch(token, () => {
  fetchEntries();
});

// När formuläret skickas
async function onSubmitted() {
  await fetchEntries();
}

// Rollcheck
const isManager = computed(
  () => user.value?.roles.includes("manager") ?? false
);
</script>
