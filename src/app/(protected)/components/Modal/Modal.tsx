import { colors } from "@/constants/Colors";
import { useTransacoes } from "@/context/TransacoesContext";
import { Transacao } from "@/models/Transacao";
import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import FormEditarTransacao from "../FormEditarNovaTransacao";
import Button from "@/components/ui/Button";
import { formatarMoeda } from "@/app/utils/FormatarMoeda";

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
    console.log("handle delete modal");
    onClose();
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {type === "edit" ? (
            <>
              <Text style={styles.title}>Editar Transação</Text>
              <FormEditarTransacao transacao={transacao} />
            </>
          ) : (
            <>
              <Text style={styles.title}>Deseja excluir esta transação?</Text>
              <Text style={styles.texto}>
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: `${90}%`,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  texto: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.fiap.red,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.fiap.green,
    borderRadius: 5,
    alignItems: "center",
  },
});
