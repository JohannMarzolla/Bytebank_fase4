import { useTransacaoContext } from "@/presentation/contexts/TransacaoContext";
import { Transacao } from "@/domain/models/Transacao";
import React from "react";
import { Modal, View, Text } from "react-native";
import Button from "@/presentation/components/ui/Button";
import TransacaoEditarForm from "./TransacaoEditarForm";
import { Loading } from "@/presentation/components/ui/Loading";

interface TransacaoConfirmarDeletarModalProps {
  visible: boolean;
  transacao: Transacao;
  onClose: () => void;
  onOpen: () => void;
}

export default function TransacaoDeletarModal({
  visible,
  transacao,
  onClose,
  onOpen,
}: TransacaoConfirmarDeletarModalProps) {
  const { remove } = useTransacaoContext();

  async function handleDelete(transacao: Transacao) {
    onClose();

    Loading.show();
    if (transacao.id) await remove(transacao.id);
    Loading.hide();
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

          <TransacaoEditarForm
            transacao={transacao}
            toDelete={true}
            onSubmit={onClose}
            onError={onOpen}
          />

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
