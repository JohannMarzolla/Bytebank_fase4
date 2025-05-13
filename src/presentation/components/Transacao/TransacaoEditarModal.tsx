import { Transacao } from "@/domain/models/Transacao";
import React from "react";
import { Modal, View, Text } from "react-native";
import Button from "@/presentation/components/ui/Button";
import TransacaoEditarForm from "@/presentation/components/Transacao/TransacaoEditarForm";

interface TransacaoEditarModalProps {
  transacao: Transacao;
  visible: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export default function TransacaoEditarModal({
  visible,
  transacao,
  onClose,
  onOpen,
}: TransacaoEditarModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-5 rounded-lg elevation-md w-[90%]">
          <Text className="text-xl font-bold mb-4">Editar Transação</Text>

          <TransacaoEditarForm
            transacao={transacao}
            onSubmit={onClose}
            onError={onOpen}
          />

          <View className="pt-3">
            <Button text="Fechar" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
