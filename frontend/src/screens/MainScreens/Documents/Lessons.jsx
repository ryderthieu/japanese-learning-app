import { View, FlatList, TouchableOpacity, Text, Image, Modal, Button } from "react-native";
import { useState, useEffect, useContext } from 'react';
import Icon from 'react-native-vector-icons/Ionicons'
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useIsFocused } from "@react-navigation/native";
import BASE_URL from "../../../api/config";
import { ModalContext } from "../../../context/ModalContext";
const Lessons = ({ route, navigation }) => {
    const isFocus = useIsFocused()
    const {token} = useContext(AuthContext)
    const {openModal} = useContext(ModalContext)
    const { course } = route.params;
    const [modalVisible, setModalVisible] = useState(false); // Trạng thái mở modal 
    const [filter, setFilter] = useState("all"); // Bộ lọc: tất cả, đã học, chưa học
    const [lessons, setLessons] = useState([])
    const [filteredLessons, setFilteredLessons] = useState(lessons); // Danh sách bài học đã lọc
    const [open, setOpen] = useState(false); // Trạng thái mở dropdown
    const [items, setItems] = useState([
        { label: "Tất cả", value: "all" },
        { label: "Đã học", value: "completed" }, 
        { label: "Chưa học", value: "incomplete" },
    ]);

    useEffect(() => {
        const getLesson = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/get-course-lessons/${course._id}`, {
                    headers: {
                        'Authorization': `Bear ${token}` 
                        }
                })
                setLessons(response.data.lessons)
                setFilteredLessons(response.data.lessons)
            } catch (error) {
                openModal({type: 'error', message: error.response.data.message})
            }
        };
    
        getLesson();
    }, [isFocus]); 
    
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
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LessonDetail', { lesson: item })}
                        className="mb-4"
                    >
                        <View className="bg-white p-4 rounded-xl shadow-lg flex-row items-center">
                            <Image
                                source={{ uri: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` }}
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
