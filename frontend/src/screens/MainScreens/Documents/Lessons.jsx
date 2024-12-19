import { View, FlatList, TouchableOpacity, Text, Image, Modal, Button } from "react-native";
import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'
import DropDownPicker from "react-native-dropdown-picker";

const lessons = [
    {
        id: 1, title: 'Ngữ pháp Minna 1 - Bài 1', isCompleted: true, videoUrl: 'psZ1g9fMfeo', vocabulary: [
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
        id: 2, title: 'Ngữ pháp Minna 1 - Bài 2', isCompleted: true, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
    }, {
        id: 3, title: 'Ngữ pháp Minna 1 - Bài 3', isCompleted: true, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
    }, {
        id: 4, title: 'Ngữ pháp Minna 1 - Bài 4', isCompleted: false, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
        id: 5, title: 'Ngữ pháp Minna 1 - Bài 5', isCompleted: false, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
        id: 6, title: 'Ngữ pháp Minna 1 - Bài 6', isCompleted: false, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
        id: 7, title: 'Ngữ pháp Minna 1 - Bài 7', isCompleted: false, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
        id: 8, title: 'Ngữ pháp Minna 1 - Bài 8', isCompleted: false, videoUrl: 'YBI4nM5HC4c', vocabulary: [
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
    const [modalVisible, setModalVisible] = useState(false); // Trạng thái mở modal 
    const [filter, setFilter] = useState("all"); // Bộ lọc: tất cả, đã học, chưa học
    const [filteredLessons, setFilteredLessons] = useState(lessons); // Danh sách bài học đã lọc

    const [open, setOpen] = useState(false); // Trạng thái mở dropdown
    const [items, setItems] = useState([
        { label: "Tất cả", value: "all" },
        { label: "Đã học", value: "completed" }, 
        { label: "Chưa học", value: "incomplete" },
    ]);
    const handleFilter = () => {
        if (filter === "all") {
            setFilteredLessons(lessons);
        } else if (filter === "completed") {
            setFilteredLessons(lessons.filter((lesson) => lesson.isCompleted));
        } else if (filter === "incomplete") {
            setFilteredLessons(lessons.filter((lesson) => !lesson.isCompleted));
        }
    };
    return (
        <View className="flex-1 bg-gray-100 p-4">
            <DropDownPicker
                open={open}
                value={filter}
                items={items}
                setOpen={setOpen}
                setValue={setFilter}
                setItems={setItems}
                placeholder="Chọn bộ lọc"
                onChangeValue={handleFilter}
                style={{ marginBottom: 10,  borderWidth: 0, width: '35%'}}
                dropDownContainerStyle = {{borderWidth: 0, width: '35%'}}
                textStyle = {{ fontSize: 16, color: 'gray'}}
            />
            <FlatList
                data={filteredLessons}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LessonDetail', { lesson: item })}
                        className="mb-4"
                    >
                        <View className="bg-white p-4 rounded-xl shadow-lg flex-row items-center">
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
