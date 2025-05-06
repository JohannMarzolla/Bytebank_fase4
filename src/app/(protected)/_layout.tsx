import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { useAuth } from "@/presentation/contexts/AuthContext";
import Transacoes from "./Transacoes";
import Home from "./Home";
import { router } from "expo-router";

const Drawer = createDrawerNavigator();

export default function App() {
  const { logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const customScreenOptions: DrawerNavigationOptions = {
    headerStyle: { backgroundColor: "#004D61" },
    headerTintColor: "white",
    headerTitleAlign: "center",
  };

  return (
    <Drawer.Navigator screenOptions={customScreenOptions}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Transações" component={Transacoes} />
      <Drawer.Screen
        name="Sair"
        component={() => null}
        listeners={{
          focus: () => {
            logout();
            router.replace("/(auth)/login");
          },
        }}
      />
    </Drawer.Navigator>
  );
}
