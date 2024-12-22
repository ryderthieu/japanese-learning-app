import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { GrammarCard } from "../../../components/Card/Card";

const GrammarLessonDetail = ({ route }) => {
  const { lesson } = route.params; // Lấy dữ liệu bài học từ tham số route
  const [data, setData] = useState(lesson.grammars); // Từ vựng của bài học

  useEffect(() => {
    // Bạn có thể xử lý thêm nếu cần khi chuyển sang màn hình này
    setData(lesson.grammars); // Cập nhật từ vựng của bài học
  }, [lesson]);

  return (
    <View className="px-3">

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
        <View className="px-3">
          {data.map((grammarItem, index) => (
            <GrammarCard item={grammarItem} key={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default GrammarLessonDetail;
