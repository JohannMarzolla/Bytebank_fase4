import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "@/shared/constants/colors";

type LoadingConfig = {
  visible: boolean;
  message?: string;
};

let setLoadingState: React.Dispatch<React.SetStateAction<LoadingConfig>>;

const GlobalLoading = () => {
  const [loading, setLoading] = useState<LoadingConfig>({ visible: false });

  useEffect(() => {
    setLoadingState = setLoading;
  }, []);

  if (!loading.visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.fiap.green} />
        <Text style={styles.message}>{loading.message || "Carregando..."}</Text>
      </View>
    </View>
  );
};

export default GlobalLoading;

// API global
export const Loading = {
  show: (message?: string) => {
    setLoadingState?.({ visible: true, message });
  },
  hide: () => {
    setLoadingState?.({ visible: false });
  },
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});
