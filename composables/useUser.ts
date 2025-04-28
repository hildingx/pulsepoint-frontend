// composables/useUser.ts
import { useStorage } from "@vueuse/core";
import { useRouter } from "vue-router";
import { computed, watch } from "vue";
import type { UserData } from "@/types/auth";

export function useUser() {
  const token = useStorage("token", "");
  const router = useRouter();

  const { data, pending, error } = useFetch<UserData>(
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
      router.push("/");
    }
  });

  const user = computed(() => data.value);

  return {
    user,
    pending,
    error,
  };
}
