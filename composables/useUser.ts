// composables/useUser.ts
import { useStorage } from "@vueuse/core";
import { watchEffect } from "vue";
import type { UserData } from "@/types/auth";

/**
 * Returnerar global användarstate och token.
 * Om token finns men user saknas, hämtas användarinfo från /auth/me
 */
export function useUser(): {
  user: Ref<UserData | null>;
  token: Ref<string>;
} {
  const user = useState<UserData | null>("user", () => null);
  const token = useStorage("token", "");

  /**
   * Hämtar användarinfo om det behövs
   */
  const fetchUser = async () => {
    if (user.value || !token.value) return;

    try {
      const res = await $fetch<UserData>("http://localhost:5036/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      user.value = res;
    } catch (err) {
      console.error("Misslyckades hämta användardata", err);
      token.value = "";
      user.value = null;

      // Navigera till startsida på klient-sidan
      if (import.meta.client) {
        navigateTo("/");
      }
    }
  };

  // Trigga vid förändringar av token/user
  watchEffect(fetchUser);

  return {
    user,
    token,
  };
}
