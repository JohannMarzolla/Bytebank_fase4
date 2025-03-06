import { colors } from "@/constants/Colors";
import { useTransacoes } from "@/context/TransacoesContext";
import { Transacao } from "@/models/Transacao";
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet} from "react-native";
import FormEditarTransacao from "../FormEditarNovaTransacao";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  transacao: Transacao;
  type: string;
}

export default function CustomModal({ visible, onClose, transacao, type }: CustomModalProps) {
    const {deletarTransacao} = useTransacoes()
  
    function handleDelete(transacao: Transacao){
        deletarTransacao(transacao)
        console.log("handle delete modal")
        onClose()
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
              <Text style={styles.texto}>Valor: R$ {transacao.valor}</Text>
              <TouchableOpacity onPress={()=> handleDelete(transacao)} style={styles.confirmButton}>
                <Text>Confirmar Exclusão</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text>Fechar</Text>
          </TouchableOpacity>
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
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    marginBottom: 10,
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
