import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text } from 'react-native';
import { Slot } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const Drawer = createDrawerNavigator();

function HomeScreen() {
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View>
      <Text>Profile Screen</Text>
    </View>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // ou redirecionar para uma tela de login
  }

  return (
    <Drawer.Navigator >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Protected" component={ProtectedLayout} />
    </Drawer.Navigator>
  );
}

function ProtectedLayout() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Protected Layout</Text>
      <Slot />
    </View>
  );
}
