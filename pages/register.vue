<template>
  <div>
    <h2>Skapa konto</h2>

    <form v-if="!success" @submit.prevent="handleRegister">
      <div>
        <label for="firstName">Förnamn</label>
        <input id="firstName" v-model="firstName" required />
      </div>

      <div>
        <label for="lastName">Efternamn</label>
        <input id="lastName" v-model="lastName" required />
      </div>

      <div>
        <label for="username">Användarnamn</label>
        <input id="username" v-model="username" required />
      </div>

      <div>
        <label for="password">Lösenord</label>
        <input id="password" type="password" v-model="password" required />
      </div>

      <div>
        <label for="workplace">Arbetsplats</label>
        <select id="workplace" v-model="workplaceId" required>
          <option disabled value="">Välj arbetsplats</option>
          <option v-for="wp in workplaces" :key="wp.id" :value="wp.id">
            {{ wp.name }}
          </option>
        </select>
      </div>

      <button type="submit">Registrera</button>
    </form>

    <p v-if="success" style="color: green">
      Kontot har skapats! Du kan nu logga in.
    </p>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  layout: "auth",
});

// Formfält
const username = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const workplaceId = ref<number | "">("");

const { register, registerSuccess: success, registerError: error } = useAuth();

const handleRegister = () => {
  if (!workplaceId.value) return;

  register({
    username: username.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value,
    workplaceId: workplaceId.value,
  });
};

// Typ för arbetsplatser
interface Workplace {
  id: number;
  name: string;
}

// Hämta arbetsplatser
const { data: workplacesData } = await useFetch<Workplace[]>(
  "http://localhost:5036/api/workplaces",
  {
    server: false,
  }
);

const workplaces = computed(() => workplacesData.value ?? []);
</script>
