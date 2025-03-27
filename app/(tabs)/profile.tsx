import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/typo";
import { useAuth } from "@/contexts/authContext";
import { Image } from "expo-image";
import { getProfileImage } from "@/services/imageService";
import { accountOptionType } from "@/types";
import * as Icons from "phosphor-react-native";
import index from "..";
import Animated, { FadeInDown } from "react-native-reanimated";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();
  const accountOptions: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <Icons.User size={26} color={colors.white} weight="fill" />,
      routeName: "/(modals)/profileModel",
      bgColor: "#6366f1",
    },
    {
      title: "Settings",
      icon: <Icons.GearSix size={26} color={colors.white} weight="fill" />,
      // routeName: "/(modals)/profileModel",
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: <Icons.Lock size={26} color={colors.white} weight="fill" />,
      // routeName: "/(modals)/profileModel",
      bgColor: colors.neutral600,
    },
    {
      title: "Log Out",
      icon: <Icons.Power size={26} color={colors.white} weight="fill" />,
      // routeName: "/(modals)/profileModel",
      bgColor: "#e11d48",
    },
  ];
  const handleLogout = async () => {
    await signOut(auth);
  };
  const showLogoutAlert = () => {
    Alert.alert("Conferm", "Are you sure you want to log out", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel logout"),
        style: "cancel",
      },
      {
        text: "Log Out",
        onPress: () => handleLogout(),
        style: "destructive",
      },
    ]);
  };
  const handlePress = (item: accountOptionType) => {
    if (item.title == "Log Out") {
      showLogoutAlert();
    }
    if (item.routeName) router.push(item.routeName);
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Header component */}
        <Header title="Profile" style={{ marginBottom: spacingY._10 }} />
        {/* User info */}
        <View style={styles.userInfo}>
          {/* Avatar */}
          <View>
            {/* user image */}
            <Image
              source={getProfileImage(user?.image)} // fetch the image
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          {/* Name and Email */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>
        {/* Account options */}
        <View style={styles.accountOptions}>
          {accountOptions.map((item, index) => {
            return (
              <Animated.View
                key={index.toString()}
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(14)}
                style={styles.listItem}
              >
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => handlePress(item)}
                >
                  {/* Icon */}
                  <View
                    style={[
                      styles.listIcon,
                      { backgroundColor: item?.bgColor },
                    ]}
                  >
                    {item.icon && item.icon}
                  </View>
                  <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
                    {item.title}
                  </Typo>
                  <Icons.CaretRight
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.white}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._10,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: spacingY._35,
  },
  accountOptions: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
