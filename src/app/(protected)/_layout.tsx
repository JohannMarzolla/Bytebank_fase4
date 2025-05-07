import {
  createDrawerNavigator,
  DrawerNavigationOptions,
} from "@react-navigation/drawer";
import { useAuth } from "@/application/contexts/AuthContext";
import Transacoes from "./Transacoes";
import Home from "./Home";
import Logout from "./Logout";

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
    <Drawer.Navigator screenOptions={customScreenOptions}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Transações" component={Transacoes} />
      <Drawer.Screen name="Sair" component={Logout} />
    </Drawer.Navigator>
  );
}
