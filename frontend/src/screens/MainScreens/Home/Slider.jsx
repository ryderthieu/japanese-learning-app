import React, { useEffect, useRef, useState } from "react";
import { Text, View, Image, ScrollView, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SliderItem from "./SliderItem";
import Pagination from "./Pagination";
import SliderData from "./SliderData";
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue, useDerivedValue, scrollTo } from "react-native-reanimated";

const { width } = Dimensions.get("screen");

const Slider = ({ itemList }) => {
  const scrollX = useSharedValue(0);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [data, setData] = useState(itemList);
  const ref = useAnimatedRef();
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const interval = useRef(null);
  const offset = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  useEffect(() => {
    if (isAutoPlay) {
      interval.current = setInterval(() => {
        offset.value = offset.value + width;
      }, 2000);
    } else {
      clearInterval(interval.current);
    }
    return () => {
      clearInterval(interval.current);
    };
  }, [isAutoPlay, offset, width]);

  useDerivedValue(() => {
    scrollTo(ref, offset.value, 0, true);
  });

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems[0]?.index !== undefined && viewableItems[0]?.index !== null) {
      setPaginationIndex(viewableItems[0].index % itemList.length);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <View>
      <Animated.FlatList
        ref={ref}
        data={data}
        renderItem={({ item, index }) => (
          <SliderItem item={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        onEndReached={() => setData([...data, ...itemList])}
        onEndReachedThreshold={0.5}
        onScrollBeginDrag={() => {
          setIsAutoPlay(false);
        }}
        onScrollEndDrag={() => {
          setIsAutoPlay(true);
        }}
      />
      <Pagination items={itemList} scrollX={scrollX} paginationIndex={paginationIndex} />
    </View>
  );
};

export default Slider;
