<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-800">
      Välkommen till din dashboard
    </h2>

    <!-- Laddar användardata -->
    <p v-if="!user" class="text-gray-600">Laddar användardata...</p>

    <template v-else>
      <!-- Manager-vy -->
      <div v-if="isManager" class="bg-white p-4 rounded shadow">
        <ManagerStats />
      </div>

      <!-- Vanlig användare -->
      <div v-else class="bg-white p-4 rounded shadow">
        <p v-if="entriesLoading" class="text-gray-600">
          Laddar dina tidigare registreringar…
        </p>

        <p v-if="fetchError" class="text-red-600 font-medium" role="alert">
          Kunde inte hämta hälsodata. Försök igen senare.
        </p>

        <template v-else-if="!entriesLoading">
          <div v-if="hasSubmittedToday" class="space-y-2">
            <h3 class="text-green-700 text-lg font-semibold">
              Fantastiskt jobbat!
            </h3>
            <p class="text-gray-700">
              Du har registrerat din hälsa för idag. Vi ses imorgon igen!
            </p>
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

definePageMeta({ layout: "default", middleware: "auth" });

// Typ: endast datum för hälsoposter
interface HealthEntryDateOnly {
  date: string;
}

// Auth-data från composable
const { user, token } = useUser();

// State
const entries = ref<HealthEntryDateOnly[]>([]);
const hasSubmittedToday = ref(false);
const entriesLoading = ref(true);
const fetchError = ref(false);

// Hämtar användarens hälsodata
async function fetchEntries(): Promise<void> {
  entriesLoading.value = true;
  fetchError.value = false;

  if (!token.value) {
    entries.value = [];
    hasSubmittedToday.value = false;
    return;
  }

  try {
    const data = await $fetch<HealthEntryDateOnly[]>(
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
    fetchError.value = true;
  } finally {
    entriesLoading.value = false;
  }
}

// Kollar om användaren har registrerat hälsa idag
function evaluateToday(): void {
  const today = DateTime.local().toISODate();
  hasSubmittedToday.value = entries.value.some(
    (e) => DateTime.fromISO(e.date).toISODate() === today
  );
}

// Kör alltid vid sidladdning
onMounted(fetchEntries);

// Kör om användaren loggar in/ut
watch(token, () => {
  fetchEntries();
});

// När användaren skickar in formuläret
async function onSubmitted(): Promise<void> {
  await fetchEntries();
}

// Kollar om användaren har rollen "manager"
const isManager = computed(
  () => user.value?.roles.includes("manager") ?? false
);
</script>
