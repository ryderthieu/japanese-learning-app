import React, { useState, useCallback } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { VocabularyCard } from "../../../components/Card/Card";
import LottieView from 'lottie-react-native';
import vocabularyService from "../../../api/vocabularyService";

const Dictionary = () => {
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (text) => {
        setSearchText(text);

        if (text.trim() === '') {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await vocabularyService.searchVocabulary({ query: text });
            setResults(response);
        } catch (err) {
            console.log(err);
            setError('Không tìm thấy kết quả nào hoặc có lỗi kết nối.');
        } finally {
            setLoading(false);
        }
    };

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
        <View className="flex-1 bg-gray-100 p-4">
            <View className="flex-row items-center bg-white rounded-lg shadow-md p-3 mb-4">
                <Icon name="search" size={20} color="#1E3A8A" className="mr-2" />
                <TextInput
                    placeholder="Nhập từ (Kanji, Hiragana, Romanji hoặc nghĩa)..."
                    value={searchText}
                    onChangeText={handleSearch}
                    className="flex-1 text-base text-gray-800"
                />
            </View>

            {loading && <Text className="text-center text-gray-500">Đang tìm kiếm...</Text>}

            {error && <Text className="text-center text-red-500">{error}</Text>}

            {searchText === '' ? (
                <View className="">
                    <Text className="text-center text-gray-500 mt-4 mb-[150px]">Vui lòng nhập từ để tra cứu.</Text>

                    <LottieView
                        source={require('../../../assets/animate/search.json')}
                        autoPlay
                        loop
                        style = {{width: 300, height: 300, alignSelf: 'center'}}
                        speed={3}
                    />
                </View>
            ) : results.length > 0 ? (
                <FlatList
                    data={results}
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
            ) : (
                !loading && (
                    <Text className="text-gray-500 text-center mt-4">Không tìm thấy kết quả nào.</Text>
                )
            )}
        </View>
    );
};

export default Dictionary;
