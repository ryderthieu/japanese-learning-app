import { StyleSheet, View } from "react-native";
import React from "react";
import Animated, { interpolate, useAnimatedStyle, Extrapolation } from "react-native-reanimated";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("screen");

const Pagination = ({ items, paginationIndex, scrollX }) => {
  return (
    <View style={styles.container}>
      {items.map((_, index) => {
        const pgAnimationStyle = useAnimatedStyle(() => {
          const dotWidth = interpolate(
            scrollX.value % (items.length * width),
            [(index - 1) * width, index * width, (index + 1) * width],
            [8, 20, 8],
            Extrapolation.CLAMP
          );
          return {
            width: dotWidth,
          };
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              pgAnimationStyle,
              { backgroundColor: paginationIndex === index ? "#222" : "#aaa" },
            ]}
          />
        );
      })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    backgroundColor: "#aaa",
    height: 8,
    width: 8,
    marginHorizontal: 2,
    borderRadius: 8,
  },
});
