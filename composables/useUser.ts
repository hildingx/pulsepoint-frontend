// composables/useUser.ts
import { useStorage } from "@vueuse/core";
import { computed, watch } from "vue";
import type { UserData } from "@/types/auth";

export async function useUser() {
  const token = useStorage("token", "");

  const { data, pending, error } = await useLazyFetch<UserData>(
    "http://localhost:5036/api/auth/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      server: false,
    }
  );

  // Om det blir 401 eller annat fel – logga ut användaren
  watch(error, (err) => {
    if (err) {
      token.value = "";
      navigateTo("/");
    }
  });

  const user = computed(() => data.value);

  return {
    user,
    pending,
    error,
  };
}
