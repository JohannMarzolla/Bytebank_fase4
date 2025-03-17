import { formatarData } from "@/app/utils/FormatarData";
import IconButton from "@/components/ui/IconButton";
import { colors } from "@/constants/Colors";
import { Transacao } from "@/models/Transacao";
import { useState } from "react";
import { Text, View } from "react-native";
import CustomModal from "./Modal/Modal";

export interface TransacaoItemOptions {
  transacao: Transacao;
}

export default function TransacaoItem({ transacao }: TransacaoItemOptions) {
  const dataFormatada = formatarData(new Date(transacao.date));
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("edit");

  function abrirModal(type: string) {
    setModalType(type);
    setOpenModal(true);
  }

  return (
    <View className="bg-white p-4 rounded shadow-md mb-4">
      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-800 font-medium capitalize">
          {transacao.tipoTransacao}
        </Text>
        <Text className="text-gray-500 text-xs">{dataFormatada}</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="text-gray-800 font-semibold text-lg">
          R$ {transacao.valor}
        </Text>
        <View className="flex-row space-x-4">
          <IconButton
            onPress={() => abrirModal("edit")}
            iconProps={{ name: "edit", color: colors.fiap.green, size: 24 }}
          />
          <IconButton
            iconProps={{ name: "delete", color: colors.fiap.red, size: 24 }}
            onPress={() => abrirModal("delete")}
          />
        </View>
      </View>

      {transacao.fileName && (
        <Text className="text-gray-500 text-sm">{transacao.fileName}</Text>
      )}

      <CustomModal
        onClose={() => setOpenModal(false)}
        visible={openModal}
        transacao={transacao}
        type={modalType}
      />
    </View>
  );
}
