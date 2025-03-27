import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ActivityIndicatorProps,
} from "react-native";
import { colors } from "@/constants/theme";

const Loading = ({
  size = "large",
  color = colors.primary,
}: ActivityIndicatorProps) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
