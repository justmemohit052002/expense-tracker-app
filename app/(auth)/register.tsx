import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/typo";
import { spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import React, { useRef } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { colors } from "@/constants/theme";
import BackButton from "@/components/BackButton";
import Input from "@/components/input";
import * as Icons from "phosphor-react-native";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";
const Register = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Sign up", "Please fill all the fields");
      return;
    }
    setIsLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current
    );
    setIsLoading(false);
    console.log("register result", res);
    if (!res.success) {
      Alert.alert("Sign up", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            let's
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Get Started
          </Typo>
        </View>
        {/* Form */}
        <View style={styles.from}>
          <Typo size={16} color={colors.textLighter}>
            Creat an account to track all your expanses
          </Typo>
          {/* Input fields */}
          <Input
            placeholder="Enter your name"
            onChangeText={(value) => {
              nameRef.current = value;
            }}
            icon={
              <Icons.User
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="regular"
              />
            }
          />

          <Input
            placeholder="Enter your email"
            onChangeText={(value) => {
              emailRef.current = value;
            }}
            icon={
              <Icons.At
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="regular"
              />
            }
          />

          <Input
            placeholder="Enter your password"
            secureTextEntry={true}
            onChangeText={(value) => {
              passwordRef.current = value;
            }}
            icon={
              <Icons.Lock
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="regular"
              />
            }
          />

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Sign Up
            </Typo>
          </Button>
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Typo size={15}>Already have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typo size={15} fontWeight={"700"} color={colors.primary}>
              Log In
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingY._20,
  },
  welecomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  from: {
    gap: spacingY._20,
  },
  forgetPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
