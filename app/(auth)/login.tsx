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
const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const router = useRouter();
  const { login: loginUser } = useAuth();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Please fill all the fields");
      return;
    }
    // console.log("email:", emailRef.current);
    // console.log("password:", passwordRef.current);
    // console.log("good to go!");

    setIsLoading(true);
    const res = await loginUser(emailRef.current, passwordRef.current);
    setIsLoading(false);
    if (!res.success) {
      Alert.alert("Login", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Welcome Back
          </Typo>
        </View>
        {/* Form */}
        <View style={styles.from}>
          <Typo size={16} color={colors.textLighter}>
            Login now to track all your expanses
          </Typo>
          {/* Input fields */}
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
          <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>
            Forgot Password?
          </Typo>
          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"700"} color={colors.black} size={21}>
              Login
            </Typo>
          </Button>
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Typo size={15}>Don't have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/register")}>
            <Typo size={15} fontWeight={"700"} color={colors.primary}>
              Sign up
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

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
