import React, { useEffect, useRef, useState } from "react";
import { Text, View, Image, ScrollView, Dimensions } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SliderItem from "./SliderItem";
import Pagination from "./Pagination";
import Animated, { useAnimatedRef, useAnimatedScrollHandler, useSharedValue, useDerivedValue, scrollTo } from "react-native-reanimated";

const { width } = Dimensions.get("screen");

const Slider = ({ itemList }) => {
  const scrollX = useSharedValue(0); // Theo dõi vị trí cuộn ngang.
  const [paginationIndex, setPaginationIndex] = useState(0); // Vị trí phân trang hiện tại.
  const [data, setData] = useState(itemList); // Dữ liệu hiển thị trong slider.
  const ref = useAnimatedRef(); // Tham chiếu đến FlatList.
  const [isAutoPlay, setIsAutoPlay] = useState(true); // Điều khiển tính năng tự động phát.
  const interval = useRef(null); // Lưu interval của autoplay.
  const offset = useSharedValue(0); // Theo dõi vị trí cuộn để tự động phát.

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x; // Lưu vị trí cuộn ngang.
    },
    onMomentumEnd: (e) => {
      offset.value = e.contentOffset.x;
    },
  });

  useEffect(() => {
    if (isAutoPlay) {
      interval.current = setInterval(() => {
        offset.value = offset.value + width; // Di chuyển đến item tiếp theo.
      }, 2000);
    } else {
      clearInterval(interval.current); // Dừng autoplay nếu isAutoPlay = false.
    }
    return () => {
      clearInterval(interval.current);  // Clear interval khi component bị hủy.
    };
  }, [isAutoPlay, offset, width]);

  useDerivedValue(() => {
    scrollTo(ref, offset.value, 0, true); // Cuộn slider đến vị trí tính toán từ offset.
  });

  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems[0]?.index !== undefined && viewableItems[0]?.index !== null) {
      setPaginationIndex(viewableItems[0].index % itemList.length); 
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Item nào xuất hiện hơn 50% thì được tính là "visible".
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
        onEndReached={() => setData([...data, ...itemList])} // Tải thêm dữ liệu.
        onEndReachedThreshold={0.5}
        onScrollBeginDrag={() => {
          setIsAutoPlay(false);           // Tạm dừng autoplay khi người dùng cuộn.
        }}
        onScrollEndDrag={() => {
          setIsAutoPlay(true);          // Bật lại autoplay khi dừng cuộn.
        }}
      />
      <Pagination items={itemList} scrollX={scrollX} paginationIndex={paginationIndex} />
    </View>
  );
};

export default Slider;
