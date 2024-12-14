import { View, FlatList, TouchableOpacity, Text } from "react-native";

const lessons = [
    {
        id: 1, title: 'Ngữ pháp Minna 1 - Bài 1', videoUrl: 'YBI4nM5HC4c', vocabulary: [
            {
                kanji: "私",
                hiragana: "わたし",
                meaning: "Tôi",
                exampleSentence: "私は山田です。",
                exampleMeaning: "Tôi là Yamada"
            },
            {
                kanji: "食べる",
                hiragana: "たべる",
                meaning: "Ăn",
                exampleSentence: "ご飯を食べる。",
                exampleMeaning: "Ăn cơm"
            },
            {
                kanji: "学校",
                hiragana: "がっこう",
                meaning: "Trường học",
                exampleSentence: "学校に行きます。",
                exampleMeaning: "Tôi đi đến trường"
            }
        ],
        grammar: [
            {
                rule: "Vます + たい: Mong muốn làm gì đó.",
                example: "日本に行きたいです。 (Tôi muốn đi Nhật Bản)"
            },
            {
                rule: "Vて + ください: Hãy làm gì đó.",
                example: "ドアを開けてください。 (Hãy mở cửa)"
            }
        ]
    },
    { id: 2, title: 'Bài 2: Thực hành', videoUrl: '8GaOeIUHvfc', vocabulary: ['từ vựng 3'], grammar: ['ngữ pháp 2'] },
];

const Lessons = ({ route, navigation }) => {
    const { course } = route.params;

    return (
        <View className="flex-1 p-4">
            <Text className="text-xl font-bold mb-4">{course.title}</Text>
            <FlatList
                data={lessons}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LessonDetail', { lesson: item })}
                        className="mb-4"
                    >
                        <View className="bg-white p-4 rounded-xl shadow-lg">
                            <Text className="text-lg font-bold">{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default Lessons;
