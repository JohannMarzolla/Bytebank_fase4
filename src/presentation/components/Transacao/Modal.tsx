import { useTransacoes } from "@/presentation/contexts/TransacoesContext";
import { Transacao } from "@/domain/models/Transacao";
import React from "react";
import { Modal, View, Text } from "react-native";
import FormEditarTransacao from "@/presentation/components/Transacao/FormEditarNovaTransacao";
import Button from "@/presentation/components/ui/Button";
import { formatarMoeda } from "@/shared/utils/formatarMoeda";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  transacao: Transacao;
  type: string;
}

export default function CustomModal({
  visible,
  onClose,
  transacao,
  type,
}: CustomModalProps) {
  const { deletarTransacao } = useTransacoes();

  function handleDelete(transacao: Transacao) {
    deletarTransacao(transacao);
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
          {type === "edit" ? (
            <>
              <Text className="text-xl font-bold mb-4">Editar Transação</Text>
              <FormEditarTransacao transacao={transacao} />
            </>
          ) : (
            <>
              <Text className="text-xl font-bold mb-4">
                Deseja excluir esta transação?
              </Text>

              <Text className="text-lg mb-5">
                Valor: {formatarMoeda(transacao.valor)}
              </Text>
              <Button
                text="Confirmar"
                color="green"
                onPress={() => handleDelete(transacao)}
              />
            </>
          )}

          <View className="pt-3">
            <Button text="Fechar" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
