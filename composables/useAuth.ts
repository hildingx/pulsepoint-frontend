// composables/useAuth.ts
import { useStorage } from "@vueuse/core";
import { useState } from "#app";
import type { UserData } from "~/types/auth";

// Typ för registrering
interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  workplaceId: number;
}

export function useAuth() {
  const token = useStorage("token", "");
  const error = ref("");
  const registerError = ref("");
  const registerSuccess = ref(false);

  // Delad global state för inloggad användare
  const user = useState<UserData | null>("user", () => null);

  /**
   * Logga in användare och hämta användarinfo
   */
  const login = async (username: string, password: string): Promise<void> => {
    try {
      // Skicka login-request
      const res = await $fetch<{ token: string }>(
        "http://localhost:5036/api/auth/login",
        {
          method: "POST",
          body: { username, password },
        }
      );

      token.value = res.token;
      error.value = "";

      // Hämta användarinfo efter inloggning
      await fetchUser();

      // Gå vidare till dashboard
      await navigateTo("/dashboard");
    } catch (err: any) {
      error.value =
        err?.data?.message ||
        "Inloggning misslyckades. Kontrollera dina uppgifter.";
      console.error(err);
    }
  };

  /**
   * Hämta användardata från /auth/me
   */
  const fetchUser = async (): Promise<void> => {
    try {
      const userData = await $fetch<UserData>(
        "http://localhost:5036/api/auth/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
      user.value = userData;
    } catch (err) {
      console.error("Kunde inte hämta användardata", err);
      user.value = null;
    }
  };

  /**
   * Registrera ny användare
   */
  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      await $fetch("http://localhost:5036/api/auth/register", {
        method: "POST",
        body: data,
      });

      registerSuccess.value = true;
      registerError.value = "";
    } catch (err: any) {
      registerError.value = err?.data?.message || "Registrering misslyckades.";
      registerSuccess.value = false;
      console.error(err);
    }
  };

  /**
   * Logga ut användaren och töm state
   */
  const logout = (): void => {
    token.value = "";
    user.value = null;
    navigateTo("/");
  };

  return {
    token,
    login,
    logout,
    error,
    register,
    registerError,
    registerSuccess,
    user,
  };
}
