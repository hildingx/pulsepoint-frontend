<template>
  <div>
    <h2>Välkommen till din dashboard</h2>

    <!-- Laddar -->
    <p v-if="userPending">Laddar användardata...</p>

    <!-- Fel -->
    <p v-else-if="userError">Något gick fel: {{ error.message }}</p>

    <template v-if="!userPending && user">
      <!-- Visa managers egen dashboard direkt -->
      <div v-if="isManager">
        <h3>Statistik för din arbetsplats (manager)</h3>
        <!-- managerdata -->
      </div>

      <!-- Visa användarvy först när data är laddad -->
      <!-- Vänta tills entries är laddade -->
      <template v-else-if="!entriesPending">
        <div v-if="hasSubmittedToday">
          <h3>Fantastiskt jobbat!</h3>
          <p>Du har registrerat din hälsa för idag. Vi ses imorgon igen!</p>
        </div>
        <div v-else>
          <HealthForm @submitted="refreshEntries" />
        </div>

        <div>
          <h3>Din hälsodata</h3>

          <select v-model="selectedRange">
            <option value="7">Senaste veckan</option>
            <option value="30">Senaste månaden</option>
            <option value="365">Senaste året</option>
          </select>
          <br />
          <HealthGraph
            :entries="sortedFilteredEntries ?? []"
            valueKey="mood"
            title="Humör över tid"
          />

          <HealthGraph
            :entries="sortedFilteredEntries ?? []"
            valueKey="sleep"
            title="Sömn över tid"
          />

          <HealthGraph
            :entries="sortedFilteredEntries ?? []"
            valueKey="stress"
            title="Stress över tid"
          />

          <HealthGraph
            :entries="sortedFilteredEntries ?? []"
            valueKey="activity"
            title="Fysisk aktivitet över tid"
          />

          <HealthGraph
            :entries="sortedFilteredEntries ?? []"
            valueKey="nutrition"
            title="Kost över tid"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useUser } from "@/composables/useUser"; // Importera auth composable
import { useTodayEntry } from "@/composables/useTodayEntry";
import HealthForm from "@/components/HealthForm.vue"; // Importera komponenten
import HealthEntryList from "@/components/HealthEntryList.vue"; // Importera komponenten

definePageMeta({
  layout: "default",
});

const { user } = useUser();
const userPending = computed(() => user.value === null);
const userError = ref(null);
const {
  entries,
  pending: entriesPending,
  error: entriesError,
  refresh,
} = await useHealthEntries();

const isManager = computed(() => user.value?.roles.includes("manager"));

const refreshEntries = async () => {
  await refresh(); // <-- från useFetch
};

const selectedRange = ref(30); // default: 30 dagar

const sortedFilteredEntries = computed(() => {
  const allEntries = entries.value ?? [];

  // Filtrera på valt intervall (t.ex. 7 dagar)
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - selectedRange.value);

  const filtered = allEntries.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoff;
  });

  // Sortera på datum (äldst först)
  return filtered.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
});

const { hasSubmittedToday } = useTodayEntry(entries); // Använd composable för att kolla om användaren har registrerat sin hälsa idag
</script>
