import ModalWrapper from "@/components/ModalWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Touchable,
  TouchableOpacity,
  Alert,
} from "react-native";
import Headers from "@/components/Header";
import BackButton from "@/components/BackButton";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import * as Icons from "phosphor-react-native";
import Typo from "@/components/typo";
import Input from "@/components/input";
import { User } from "firebase/auth";
import { TransactionType, UserDataType, WalletType } from "@/types";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/authContext";
import { createOrUpdateWallet, deleteWallet } from "@/services/walletServices"; // Add this import at the top
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import transaction from "../(tabs)/transaction";
import ImageUpload from "@/components/ImageUpload";
import { Dropdown } from "react-native-element-dropdown";

const TransactionModal = () => {
  const { user, updateUserData } = useAuth();
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    date: new Date(),
    category: "",
    walletId: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const oldTransaction: { name: string; image: string; id: string } =
    useLocalSearchParams();
  // console.log("oldTransaction:", oldTransaction);

  // useEffect(() => {
  //   if (oldTransaction?.id) {
  //     setTransaction({
  //       name: oldTransaction?.name,
  //       image: oldTransaction?.image,
  //     });
  //   }
  // }, []);

  const onSubmit = async () => {
    //   let { name, image } = transaction;
    //   if (!name.trim()) {
    //     Alert.alert("Wallet", "Please enter transaction name");
    //     return;
    //   }
    //   const data: WalletType = {
    //     name,
    //     image,
    //     uid: user?.uid,
    //   };
    //   // todo: include transaction id if updating
    //   if (oldTransaction?.id) data.id = oldTransaction?.id;
    //   setLoading(true);
    //   const res = await createOrUpdateWallet(data);
    //   setLoading(false);
    //   // console.log("result:", res);
    //   if (res.success) {
    //     router.back();
    //   } else {
    //     Alert.alert("Wallet", res.msg);
    //   }
    // };
    // const onDelete = async () => {
    //   // console.log("deleting transaction: ", oldTransaction?.id);
    //   if (!oldTransaction?.id) return;
    //   setLoading(true);
    //   const res = await deleteWallet(oldTransaction?.id);
    //   setLoading(false);
    //   if (res.success) {
    //     router.back();
    //   } else {
    //     Alert.alert("Wallet", res.msg);
    //   }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this transaction?\n This action cannot be undone. ",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel delete"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => onDelete(),
          style: "destructive",
        },
      ]
    );
  };

  const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
    { label: "Item 5", value: "5" },
    { label: "Item 6", value: "6" },
    { label: "Item 7", value: "7" },
    { label: "Item 8", value: "8" },
  ];
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  return (
    <ModalWrapper>
      <View style={styles.container}>
        {/* <Headers
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        /> */}

        <Headers
          title=""
          leftIcon={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: scale(70),
              }}
            >
              <BackButton />
              <Text
                style={{
                  fontSize: verticalScale(24),
                  fontWeight: "bold",
                  color: colors.white,
                }}
              >
                {oldTransaction?.id ? "Update Transaction" : "New Transaction"}
              </Text>
            </View>
          }
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Type</Typo>
            {/* drop down here */}
            <Dropdown
              style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "Select item" : "..."}
              searchPlaceholder="Search..."
              value={value}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setValue(item.value);
                setIsFocus(false);
              }}
              // renderLeftIcon={() => (
              //   <AntDesign
              //     style={styles.icon}
              //     color={isFocus ? "blue" : "black"}
              //     name="Safety"
              //     size={20}
              //   />
              // )}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Transaction Icon</Typo>
            {/* image input */}
            <ImageUpload
              onClear={() => setTransaction({ ...transaction, image: null })}
              file={transaction.image}
              onSelect={(file) =>
                setTransaction({ ...transaction, image: file })
              }
              placeholder="Upload Image"
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        {oldTransaction?.id && !loading && (
          <Button
            onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"} size={18}>
            {oldTransaction?.id ? "Update Wallet" : "Add Wallet"}
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  form: {
    gap: spacingY._20,
    paddingVertical: spacingY._15,
    paddingBottom: spacingY._40,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(20),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  iosDropDown: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    fontSize: verticalScale(14),
    borderWidth: 1,
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  androidDropDown: {
    // flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    fontSize: verticalScale(14),
    color: colors.white,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    // paddingHorizontal: spacingX._15,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
  },
  dateInput: {
    flexDirection: "row",
    height: verticalScale(54),
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  iosDatePicker: {
    backgroundColor: "red",
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._15,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropdownContainer: {
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15,
  },
  dropdownItemText: {
    color: colors.white,
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownPlaceholder: {
    color: colors.white,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
  },
});
