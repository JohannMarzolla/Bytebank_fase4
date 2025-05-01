import { View, Image, Text, ScrollView } from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  CadastroUsuarioErrors,
  CadastroUsuarioModel,
} from "@/domain/models/CadastroUsuarioModel";
import InputCheckbox from "@/presentation/components/ui/InputCheckbox";
import Input from "@/presentation/components/ui/Input";
import Button from "@/presentation/components/ui/Button";
import { AuthService } from "@/application/services/AuthService";
import { ShowToast } from "@/presentation/components/ui/Toast";

export default function CadastroUser() {
  const [values, setValues] = useState<CadastroUsuarioModel>(
    new CadastroUsuarioModel()
  );
  const [errors, setErrors] = useState<CadastroUsuarioErrors>({});
  const [saveRunning, setSaveRunning] = useState(false);

  function handleOnChange(field: string, value: any) {
    setValues(new CadastroUsuarioModel({ ...values, [field]: value }));
  }

  const onConfirm = async () => {
    if (!saveRunning) {
      setSaveRunning(true);

      const { isValid, errors } = values.validate();
      setErrors(errors);

      if (isValid) {
        await cadastrar(values.email, values.password);
      }

      setSaveRunning(false);
    }
  };

  const cadastrar = async (email: string, password: string) => {
    try {
      await AuthService.createUser(email, password);
      ShowToast(
        "success",
        "Conta cadastrada com sucesso.",
        "Efetue o login para acessar a conta."
      );
      router.replace("/login");
    } catch (error) {
      if (error instanceof Error) {
        ShowToast("error", error.message || "Erro ao cadastrar a conta.");
      }
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
