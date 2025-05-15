import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { useAuth } from "@/presentation/contexts/AuthContext";
import Transacoes from "./Transacoes";
import Home from "./Home";
import Logout from "./Logout";
import { TransacaoProvider } from "@/presentation/contexts/TransacaoContext";

const Drawer = createDrawerNavigator();

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const customScreenOptions: DrawerNavigationOptions = {
    headerStyle: { backgroundColor: "#004D61" },
    headerTintColor: "white",
    headerTitleAlign: "center",
  };

  return (
    <TransacaoProvider>
      <Drawer.Navigator screenOptions={customScreenOptions}>
        <Drawer.Screen name="Home" component={Home} />
        <Drawer.Screen name="Transações" component={Transacoes} />
        <Drawer.Screen name="Sair" component={Logout} />
      </Drawer.Navigator>
    </TransacaoProvider>
  );
}
