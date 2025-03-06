import { formatarData } from "@/app/utils/FormatarData";
import IconButton from "@/components/ui/IconButton";
import { colors } from "@/constants/Colors";
import { Transacao } from "@/models/Transacao";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import CustomModal from "./Modal/Modal";


export interface TransacaoItemOptions {
  transacao: Transacao;
}

export default function TransacaoItem({ transacao }: TransacaoItemOptions) {

  const dataFormatada = formatarData(new Date(transacao.date));
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("edit");

  function abrirModal(type : string){
    setModalType(type);
    setOpenModal(true)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tipoTransacao}>{transacao.tipoTransacao}</Text>
        <Text style={styles.data}>{dataFormatada}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.valor}>R$ {transacao.valor}</Text>
        <View style={styles.actions}>
        <IconButton
        onPress={()=> abrirModal("edit")}
          iconProps={{ name: 'edit', color: colors.fiap.green, size: 24 }}
        />
        <IconButton
          iconProps={{ name: 'delete', color: colors.fiap.red, size: 24 }}
          onPress={() => abrirModal("delete")}
        />
        </View>

        <CustomModal onClose={()=> setOpenModal(false)} visible={openModal} transacao={transacao} type={modalType}></CustomModal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tipoTransacao: {
    textTransform: "capitalize",
    color: "#374151",
    fontWeight: "500",
  },
  data: {
    color: "#6B7280",
    fontSize: 12,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  valor: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 18,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  editar: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "500",
  },
  excluir: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "500",
  },
});