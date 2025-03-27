import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Typo from "./typo";
import { colors, spacingY } from "@/constants/theme";

const HomeCard = () => {
  return (
    <View>
      <Typo>Homecard</Typo>
    </View>
  );
};

export default HomeCard;
const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "space-between",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
});
