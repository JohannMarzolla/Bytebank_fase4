import { colors } from "@/shared/constants/colors";
import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, Modal } from "react-native";

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

  return (
    <Modal
      visible={loading.visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white rounded-2xl px-8 py-6 items-center shadow-lg">
          <ActivityIndicator size="large" color={colors.fiap.green} />
          <Text className="text-lg text-gray-800 mt-4 font-semibold">
            {loading.message || "Carregando..."}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default GlobalLoading;

// A API global:
export const Loading = {
  show: (message?: string) => {
    setLoadingState?.({ visible: true, message });
  },
  hide: () => {
    setLoadingState?.({ visible: false });
  },
};
