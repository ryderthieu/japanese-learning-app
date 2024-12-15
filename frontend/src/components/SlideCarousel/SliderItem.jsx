import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
const { width } = Dimensions.get("screen");
const SliderItem = ({ item, index, scrollX }) => {
  const rnAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-width * 0.25, 0, width * 0.25],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.itemContainer, rnAnimatedStyle]}>
      <Image source={item.image} style={{ width: 300, height: 200, borderRadius: 20 }} />
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.background}>
        <View style={{ gap: 10 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};
export default SliderItem;
const styles = StyleSheet.create({
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    width: width,
  },
  background: {
    position: "absolute",
    height: 200,
    width: 300,
    padding: 20,
    borderRadius: 20,
    justifyContent: "flex-end",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  description: {
    color: "#fff",
    fontSize: 12,
    letterSpacing: 1.2,
  },
});