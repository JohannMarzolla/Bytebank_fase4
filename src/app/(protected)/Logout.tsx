import { useEffect } from "react";
import { router } from "expo-router";
import { useAuth } from "@/presentation/contexts/AuthContext";

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    router.replace("/(auth)/login");
  }, []);

  return null;
}
