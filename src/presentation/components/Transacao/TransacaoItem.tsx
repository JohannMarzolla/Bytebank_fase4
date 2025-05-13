import IconButton from "@/presentation/components/ui/IconButton";
import { colors } from "@/shared/constants/colors";
import { Transacao } from "@/domain/models/Transacao";
import { useState } from "react";
import { Text, View } from "react-native";
import { formatarData } from "@/shared/utils/formatarData";
import TransacaoDeletarModal from "./TransacaoDeletarModal";
import TransacaoEditarModal from "./TransacaoEditarModal";

export interface TransacaoItemOptions {
  transacao: Transacao;
}

export default function TransacaoItem({ transacao }: TransacaoItemOptions) {
  const dataFormatada = formatarData(new Date(transacao.date));
  const [openConfirmarDeletarModal, setOpenConfirmarDeletarModal] =
    useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  function abrirModal(type: "edit" | "delete") {
    setOpenEditModal(type === "edit");
    setOpenConfirmarDeletarModal(type === "delete");
  }

  function fecharModal() {
    setOpenEditModal(false);
    setOpenConfirmarDeletarModal(false);
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

      <TransacaoDeletarModal
        onClose={() => fecharModal()}
        onOpen={() => abrirModal("delete")}
        visible={openConfirmarDeletarModal}
        transacao={transacao}
      />
      <TransacaoEditarModal
        onClose={() => fecharModal()}
        onOpen={() => abrirModal("edit")}
        visible={openEditModal}
        transacao={transacao}
      />
    </View>
  );
}
