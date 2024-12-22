import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { VocabularyCard } from '../../../components/Card/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';

const SavedVocabulary = ({ route }) => {
  const { savedVocabulary } = route.params;

  // Trạng thái để lưu trình độ đã chọn
  const [selectedLevel, setSelectedLevel] = useState('all'); // Mặc định là tất cả
  const [open, setOpen] = useState(false); // Trạng thái mở/đóng dropdown
  const [items, setItems] = useState([
    { label: 'Tất cả', value: 'all' },
    { label: 'N5', value: 'N5' },
    { label: 'N4', value: 'N4' },
    { label: 'N3', value: 'N3' },
    { label: 'N2', value: 'N2' },
    { label: 'N1', value: 'N1' },
  ]);

  // Lọc từ vựng theo trình độ
  const filteredVocabulary = selectedLevel === 'all' 
    ? savedVocabulary 
    : savedVocabulary.filter(item => item.level === selectedLevel);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-4 px-5">


      {/* Bộ lọc trình độ */}
      <View className="mb-4">
        <DropDownPicker
          open={open} // Kiểm soát trạng thái mở/đóng dropdown
          value={selectedLevel} // Giá trị được chọn
          items={items} // Các mục trong dropdown
          setOpen={setOpen} // Hàm để thay đổi trạng thái mở/đóng
          setValue={setSelectedLevel} // Hàm để thay đổi giá trị đã chọn
          setItems={setItems} // Hàm để thay đổi danh sách các mục (nếu cần)
          placeholder="Chọn trình độ"
          dropDownDirection="BOTTOM"
          containerStyle={{ height: 50 }}
          style={{ backgroundColor: 'white', borderColor: '#ddd' }}
          itemStyle={{
            justifyContent: 'flex-start',
          }}
        />
      </View>

      {/* FlatList hiển thị các thẻ từ vựng */}
      <FlatList
        data={filteredVocabulary}
        renderItem={({ item }) => (
          <View className="mb-6">
            <VocabularyCard item={item} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 100 }} // Thêm khoảng cách dưới để tránh che khuất
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
      />
    </SafeAreaView>
  );
};

export default SavedVocabulary;
