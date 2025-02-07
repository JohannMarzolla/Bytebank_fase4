import { View, Text, TextInput, Image } from "react-native";
import { Link } from "expo-router";
import { router } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/forms/Input";
import { LoginFormErrors, LoginFormModel } from "@/models/LoginFormModel";

export default function Login() {
  const { login } = useAuth();
  const [values, setValues] = useState<LoginFormModel>(new LoginFormModel());
  const [errors, setErrors] = useState<LoginFormErrors>({});

  function handleOnChange(field: string, value: any) {
    setValues(new LoginFormModel({ ...values, [field]: value }));
  }

  const onPressLogin = async () => {
    const { isValid, errors } = values.validate();
    setErrors(errors);

    if (isValid) {
      const isAuthenticated = await login(values.email, values.password);
      if (isAuthenticated) {
        router.replace("/(protected)/profile");
      }
    }
  };

  return (
    <View className="items-center w-full bg-fiap-white">
      <Image
        className="my-8"
        source={require("../../assets/images/ilustracao-login.png")}
        style={{ height: 240 }}
        resizeMode="contain"
      />

      <Text className="font-bold text-xl pb-4">Login</Text>

      <View className="flex items-center w-full px-12 pb-12">
        <Input
          className="pb-5"
          type="email"
          label="Email"
          value={values.email}
          placeholder="Digite seu email"
          error={errors.email}
          onValueChanged={(value) => handleOnChange("email", value)}
        ></Input>

        <Input
          className="pb-6"
          type="password"
          label="Senha"
          value={values.password}
          placeholder="Digite sua senha"
          error={errors.password}
          onValueChanged={(value) => handleOnChange("password", value)}
        ></Input>

        <View className="flex-row gap-3">
          <Button
            color="green"
            text="Criar conta"
            onPress={() => router.replace("/signup")}
          />
          <Button color="orange" text="Acessar" onPress={onPressLogin} />
        </View>
      </View>
    </View>
  );
}
