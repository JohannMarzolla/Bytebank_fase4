import { View, Image, Text, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { useAuth } from "@/presentation/contexts/AuthContext";
import {
  SignupFormErrors,
  SignupFormModel,
} from "@/domain/models/SignupFormModel";
import InputCheckbox from "@/presentation/components/ui/InputCheckbox";
import Input from "@/presentation/components/ui/Input";
import Button from "@/presentation/components/ui/Button";

export default function Signup() {
  const { signUp } = useAuth();
  const [values, setValues] = useState<SignupFormModel>(new SignupFormModel());
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [signupRunning, setSignupRunning] = useState(false);

  function handleOnChange(field: string, value: any) {
    setValues(new SignupFormModel({ ...values, [field]: value }));
  }

  const onConfirm = async () => {
    if (!signupRunning) {
      setSignupRunning(true);

      const { isValid, errors } = values.validate();
      setErrors(errors);

      if (isValid) {
        await signUp(values.email, values.password);
      }

      setSignupRunning(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-fiap-white">
      <View className="items-center py-12">
        <Image
          className="mb-8"
          source={require("@/assets/images/ilustracao-nova-conta.png")}
          style={{ height: 210 }}
          resizeMode="contain"
        />

        <Text className="font-bold text-xl pb-5 px-11">
          Preencha os campos abaixo para criar sua conta corrente!
        </Text>

        <View className="w-full px-12">
          {/* <Input
            className="pb-5"
            type="string"
            label="Nome"
            placeholder="Digite seu nome completo"
            value={values.nome}
            error={errors.nome}
            onValueChanged={(value) => handleOnChange("nome", value)}
          /> */}

          <Input
            className="pb-5"
            type="email"
            label="Email"
            placeholder="Digite seu email"
            value={values.email}
            error={errors.email}
            onValueChanged={(value) => handleOnChange("email", value)}
          />

          <Input
            className="pb-5"
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            value={values.password}
            error={errors.password}
            onValueChanged={(value) => handleOnChange("password", value)}
          />

          <InputCheckbox
            className="pb-7"
            label="Li e estou ciente quanto às condições de tratamento dos meus dados conforme descrito na Política de Privacidade do banco."
            error={errors.termoAceito}
            onValueChanged={(value) => handleOnChange("termoAceito", value)}
          />
        </View>

        <Button color="orange" text="Criar conta" onPress={onConfirm} />

        <Link href="/login" className="mt-4 text-fiap-gray">
          Já possui uma conta? Acesse clicando aqui
        </Link>
      </View>
    </ScrollView>
  );
}
