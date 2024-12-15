import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const dictionaryData = [
    {
        kanji: "私",
        hiragana: "わたし",
        romanji: "watashi",
        meaning: "Tôi",
        exampleSentence: "私は学生です。",
        exampleMeaning: "Tôi là học sinh."
    },
    {
        kanji: "食べる",
        hiragana: "たべる",
        romanji: "taberu",
        meaning: "Ăn",
        exampleSentence: "ご飯を食べる。",
        exampleMeaning: "Ăn cơm."
    },
    {
        kanji: "学校",
        hiragana: "がっこう",
        romanji: "gakkou",
        meaning: "Trường học",
        exampleSentence: "学校に行きます。",
        exampleMeaning: "Tôi đi đến trường."
    },
    {
        kanji: "車",
        hiragana: "くるま",
        romanji: "kuruma",
        meaning: "Xe hơi",
        exampleSentence: "車を運転する。",
        exampleMeaning: "Lái xe hơi."
    }
];

const Dictionary = () => {
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = (text) => {
        setSearchText(text);

        // Lọc dữ liệu dựa trên từ nhập vào (Kanji, Hiragana, Romanji, hoặc nghĩa)
        const filteredResults = dictionaryData.filter((word) =>
            word.kanji.includes(text) ||
            word.hiragana.includes(text) ||
            word.romanji.includes(text.toLowerCase()) ||
            word.meaning.includes(text)
        );

        setResults(filteredResults);
    };

    return (
        <View className="flex-1 bg-blue-50 p-4">
            {/* Thanh tìm kiếm */}
            <View className="flex-row items-center bg-white rounded-lg shadow-md p-3 mb-4">
                <Icon name="search" size={20} color="#1E3A8A" className="mr-2" />
                <TextInput
                    placeholder="Nhập từ (Kanji, Hiragana, Romanji hoặc nghĩa)..."
                    value={searchText}
                    onChangeText={handleSearch}
                    className="flex-1 text-base text-gray-800"
                />
            </View>

            {/* Hiển thị kết quả */}
            {results.length > 0 ? (
                <FlatList
                    data={results}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View className="bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 border-pink-400">
                            <Text className="text-xl font-bold text-blue-800">{item.kanji} ({item.hiragana})</Text>
                            <Text className="text-pink-600 mt-1 italic">{item.romanji}</Text>
                            <Text className="text-gray-700 mt-2">{item.meaning}</Text>
                            <Text className="text-gray-400 mt-2 italic">
                                {item.exampleSentence} - {item.exampleMeaning}
                            </Text>
                        </View>
                    )}
                />
            ) : (
                searchText !== '' && (
                    <Text className="text-gray-500 text-center mt-4">Không tìm thấy kết quả nào.</Text>
                )
            )}
        </View>
    );
};

export default Dictionary;
