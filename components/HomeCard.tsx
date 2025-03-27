import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Typo from "./typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { ImageBackground } from "expo-image";
import { scale, verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";

const HomeCard = () => {
  return (
    <ImageBackground
      source={require("../assets/images/card.png")}
      contentFit="fill" // Changed from resizeMode to contentFit
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          {/* total balance */}
          <View style={styles.totalBalanceRow}>
            <Typo color={colors.neutral800} size={17} fontWeight={"500"}>
              Total Balance
            </Typo>
            <Icons.DotsThreeOutline
              size={verticalScale(23)}
              color={colors.black}
              weight="fill"
            />
          </View>
          <Typo color={colors.black} size={30} fontWeight={"bold"}>
            ₹ 1,23,456.78
          </Typo>
        </View>
        {/* total expense and income */}
        <View style={styles.stats}>
          {/* income */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowDown
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.green} fontWeight={"600"}>
                ₹ 35233
              </Typo>
            </View>
          </View>
          {/* Expense */}
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Icons.ArrowUp
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                Expense
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo size={17} color={colors.rose} fontWeight={"600"}>
                ₹ 25320
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;
const styles = StyleSheet.create({
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  container: {
    padding: spacingX._20,
    width: "100%",
    height: "100%", // Add this
    justifyContent: "space-between",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacingY._30, // Add this
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
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
