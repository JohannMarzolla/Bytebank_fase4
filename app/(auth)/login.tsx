import { View, Text, Button, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {

  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Login</Text>

      <TextInput 
        placeholder="Email" 
        style={{ borderWidth: 1, marginBottom: 16, padding: 8 }} 
        value={email}  
        onChangeText={setEmail}
      />
      
      <TextInput 
        placeholder="Password" 
        secureTextEntry 
        style={{ borderWidth: 1, marginBottom: 16, padding: 8 }} 
        value={password}
        onChangeText={setPassword}  
      />

      <Button title="Login" onPress={() => { 
        
        const isAuthenticated = login(email, password)
        if (isAuthenticated) {
          router.replace('/(protected)/profile') 
        }

      }} />
      <Link href="/signup" style={{ marginTop: 16 }}>Don't have an account? Sign up</Link>
    </View>
  );
}