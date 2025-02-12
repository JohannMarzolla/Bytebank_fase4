import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { TransacoesProvider } from "@/context/TransacoesContext";
import Toast from "react-native-toast-message";
import "react-native-reanimated";

// Import your global CSS file
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // Redireciona para a página de login
      // router.replace("/login"); // Rota baseada na estrutura de arquivos
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <AuthProvider>
        <TransacoesProvider>
          <Stack>
            <Stack.Screen
              name="(auth)/login"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/signup"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </TransacoesProvider>
      </AuthProvider>
      <Toast />
    </>
  );
}
