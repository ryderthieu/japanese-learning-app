import React, { useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { GrammarCard } from '../../../components/Card/Card';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';

const SavedGrammar = ({ route }) => {
  const { savedGrammar } = route.params;
  const [selectedLevel, setSelectedLevel] = useState('all'); 
  const [open, setOpen] = useState(false); 
  const [items, setItems] = useState([
    { label: 'Tất cả', value: 'all' },
    { label: 'N5', value: 'N5' },
    { label: 'N4', value: 'N4' },
    { label: 'N3', value: 'N3' },
    { label: 'N2', value: 'N2' },
    { label: 'N1', value: 'N1' },
  ]);

  const filteredGrammar = selectedLevel === 'all' 
    ? savedGrammar
    : savedGrammar.filter(item => item.level === selectedLevel);

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
        data={filteredGrammar}
        renderItem={({ item }) => (
          <View className="mb-6">
            <GrammarCard item={item} />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false} 
      />
    </SafeAreaView>
  );
};

export default SavedGrammar;
