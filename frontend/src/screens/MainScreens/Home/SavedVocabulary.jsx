import React, { useState, useCallback } from 'react';
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

  const renderItem = useCallback(({ item }) => (
    <View className="mb-6">
      <VocabularyCard item={item} />
    </View>
  ), []);

  const keyExtractor = useCallback((item) => item._id?.toString() || Math.random().toString(), []);

  const getItemLayout = useCallback((data, index) => ({
    length: 200,
    offset: 200 * index,
    index,
  }), []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 pt-4 px-5">
      <View className="mb-4">
        <DropDownPicker
          open={open}
          value={selectedLevel}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedLevel}
          setItems={setItems}
          placeholder="Chọn trình độ"
          dropDownDirection="BOTTOM"
          containerStyle={{ height: 50 }}
          style={{ backgroundColor: 'white', borderColor: '#ddd' }}
          itemStyle={{
            justifyContent: 'flex-start',
          }}
        />
      </View>

      <FlatList
        data={filteredVocabulary}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={5}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default SavedVocabulary;
