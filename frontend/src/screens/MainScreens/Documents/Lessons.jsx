import { View, FlatList, TouchableOpacity, Text, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
const lessons = [
    {
        id: 1, title: 'Ngữ pháp Minna 1 - Bài 1', isCompleted:true, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
    {
        id: 2, title: 'Ngữ pháp Minna 1 - Bài 2', isCompleted:true, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
    },{
        id: 3, title: 'Ngữ pháp Minna 1 - Bài 3', isCompleted:true, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
    },{
        id: 4, title: 'Ngữ pháp Minna 1 - Bài 4', isCompleted:true, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
    {
        id: 5, title: 'Ngữ pháp Minna 1 - Bài 5', isCompleted:true, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
    {
        id: 6, title: 'Ngữ pháp Minna 1 - Bài 6', isCompleted:true, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
    {
        id: 7, title: 'Ngữ pháp Minna 1 - Bài 7', isCompleted:true, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
    {
        id: 8, title: 'Ngữ pháp Minna 1 - Bài 8', isCompleted:true, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
];

const Lessons = ({ route, navigation }) => {
    const { course } = route.params;

    return (
        <View className="flex-1 bg-gray-100 p-4">
            {/* Tiêu đề khóa học */}
            <Text className="text-2xl font-bold text-gray-800 mb-4">{course.title}</Text>
            <FlatList
                data={lessons}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LessonDetail', { lesson: item })}
                        className="mb-4"
                    >
                        <View className="bg-white p-4 rounded-xl shadow-lg flex-row items-center">
                            {/* Thumbnail bài học */}
                            <Image
                                source={{ uri: `https://img.youtube.com/vi/${item.videoUrl}/hqdefault.jpg` }}
                                className="w-20 h-16 rounded-lg mr-4"
                                resizeMode="cover"
                            />
                            <View className="flex-1">
                                <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
                                {item.isCompleted ? (
                                    <Text className="text-primary text-sm mt-1">Đã học xong</Text>
                                ) : (
                                    <Text className="text-gray-400 text-sm mt-1">Chưa học</Text>
                                )}
                            </View>
                            {/* Biểu tượng nếu đã học xong */}
                            {item.isCompleted && (
                                <View className="bg-secondary rounded-full p-1">
                                    <Icon name="checkmark-outline" color={'white'} size={20} />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default Lessons;
