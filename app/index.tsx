import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  let logo;
  try {
    logo = require("../assets/images/logo.avif");
  } catch (e) {
    logo = null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.navigate("/booking")}>
        {logo ? (
          <Image source={logo} style={styles.image} />
        ) : (
          <Text>Logo not found</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  image: { width: 150, height: 150, resizeMode: "contain" },
});
