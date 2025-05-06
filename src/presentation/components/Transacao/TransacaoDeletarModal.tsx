import { useTransacoes } from "@/presentation/contexts/TransacoesContext";
import { Transacao } from "@/domain/models/Transacao";
import React from "react";
import { Modal, View, Text } from "react-native";
import Button from "@/presentation/components/ui/Button";
import { formatarMoeda } from "@/shared/utils/formatarMoeda";
import TransacaoEditarForm from "./TransacaoEditarForm";

interface TransacaoConfirmarDeletarModalProps {
  visible: boolean;
  transacao: Transacao;
  onClose: () => void;
}

export default function TransacaoDeletarModal({
  visible,
  transacao,
  onClose,
}: TransacaoConfirmarDeletarModalProps) {
  const { deletarTransacao } = useTransacoes();

  async function handleDelete(transacao: Transacao) {
    await deletarTransacao(transacao);
    onClose();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-5 rounded-lg elevation-md w-[90%]">
          <Text className="text-xl font-bold mb-4">
            Deseja excluir esta transação?
          </Text>

          <TransacaoEditarForm transacao={transacao} readOnly={true} />

          <View className="flex gap-3 pt-7">
            <Button
              text="Confirmar"
              color="green"
              onPress={() => handleDelete(transacao)}
            />
            <Button text="Fechar" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
