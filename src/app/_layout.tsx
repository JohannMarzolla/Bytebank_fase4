import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider } from "@/application/contexts/AuthContext";
import { TransacoesProvider } from "@/application/contexts/TransacoesContext";
import { GraficosProvider } from "@/application/contexts/GraficosContext";
import Toast from "react-native-toast-message";
import "react-native-reanimated";

// Import your global CSS file
import "./global.css";
import GlobalLoading from "@/presentation/components/ui/Loading";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <AuthProvider>
        <GraficosProvider>
          <TransacoesProvider>
            <Stack>
              <Stack.Screen
                name="(auth)/login"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(auth)/cadastro-usuario"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(protected)"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>
          </TransacoesProvider>
        </GraficosProvider>
      </AuthProvider>
      <Toast />
      <GlobalLoading />
    </>
  );
}
