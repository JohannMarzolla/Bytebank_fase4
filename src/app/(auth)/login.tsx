import { View, Text, Image } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/forms/Input";
import { LoginFormErrors, LoginFormModel } from "@/models/LoginFormModel";
import { ShowToast } from "@/components/ui/Toast";

export default function Login() {
  const { login } = useAuth();
  const [values, setValues] = useState<LoginFormModel>(new LoginFormModel());
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [loginRunning, setLoginRunning] = useState(false);

  function handleOnChange(field: string, value: any) {
    setValues(new LoginFormModel({ ...values, [field]: value }));
  }

  const onConfirm = async () => {
    if (!loginRunning) {
      setLoginRunning(true);

      const { isValid, errors } = values.validate();
      setErrors(errors);

      if (isValid) {
        const isAuthenticated = await login(values.email, values.password);
        if (isAuthenticated) {
          router.replace("/(protected)/profile");
        } else {
          ShowToast("error", "O usuário informado está incorreto.");
        }
      }
      setLoginRunning(false);
    }
  };

  return (
    <View className="flex-1 bg-fiap-white items-center py-12">
      <Image
        className="mb-8"
        source={require("../../assets/images/ilustracao-login.png")}
        style={{ height: 240 }}
        resizeMode="contain"
      />

      <Text className="font-bold text-xl pb-4">Login</Text>

      <View className="w-full px-12">
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
      </View>

      <Button color="orange" text="Acessar" onPress={onConfirm} />

      <Link href="/signup" className="mt-4 text-fiap-gray">
        Não possui uma conta? Crie clicando aqui
      </Link>
    </View>
  );
}
