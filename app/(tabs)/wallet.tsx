import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import { useAuth } from "@/contexts/authContext";
import Loading from "@/components/Loading";
import WalletListItem from "@/components/WalletListItem";

const wallet = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: wallets,
    error,
    loading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  // console.log("wallets:", wallets.length);
  const getTotalBalance = () =>
    wallets.reduce((total, item) => {
      total = total + (item.amount || 0);
      return total;
    }, 0);
  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        {/* balance View */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typo size={45} fontWeight={"500"}>
              ₹{getTotalBalance()?.toFixed(2)}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total Balance
            </Typo>
          </View>
        </View>
        {/* wallets */}
        <View style={styles.wallets}>
          {/* header */}
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"500"}>
              My Wallets
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/walletModal")}
            >
              <Icons.PlusCircle
                weight="fill"
                color={colors.primary}
                size={verticalScale(33)}
              />
            </TouchableOpacity>
          </View>
          {/* todo : wallets list */}
          {loading && <Loading />}
          <FlatList
            data={wallets}
            contentContainerStyle={styles.listStyle}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <WalletListItem item={item} index={index} router={router} />
              );
            }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: spacingY._10,
  },
  wallets: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingY._20,
    paddingTop: spacingX._25,
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
});
