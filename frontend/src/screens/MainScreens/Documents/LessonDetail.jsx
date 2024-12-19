import React, { useContext, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import YouTube from 'react-native-youtube-iframe';
import { GrammarCard, VocabularyCard } from '../../../components/Card/Card';
import axios from 'axios';  // Để thực hiện API request
import { AuthContext } from '../../../context/AuthContext';

const LessonDetail = ({ route }) => {
    const { lesson } = route.params;
    const [videoEnded, setVideoEnded] = useState(false);
    const {token} = useContext(AuthContext)
    const markLessonComplete = async () => {
        try {
            await axios.post(`http://192.168.1.47:3000/api/user/add-completed-lesson/${lesson._id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                    }
            });
            console.log('sucess')
        } catch (error) {
            console.error('Đánh dấu hoàn thành thất bại:', error);
        }
    };

    const handleVideoStateChange = (state) => {
        if (state === 'ended' && !videoEnded) {
            setVideoEnded(true);
            markLessonComplete();
        }
    };

    if (!lesson) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-lg text-gray-600">Không có dữ liệu bài học</Text>
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View>
                <YouTube
                    videoId={lesson.videoId}
                    play={true}
                    height={250}
                    width="100%"
                    className="rounded-lg shadow-lg"
                    onChangeState={handleVideoStateChange}
                />
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-blue-600 mb-4">Từ vựng</Text>
                    {lesson.vocabulary ? (
                        lesson.vocabulary.map((word, index) => (
                            <VocabularyCard item={word} key={index} />
                        ))
                    ) : (
                        <Text className="text-gray-500">Không có từ vựng cho bài học này</Text>
                    )}
                </View>

                <View className="mb-6">
                    <Text className="text-2xl font-bold text-blue-600 mb-4">Ngữ pháp</Text>
                    {lesson.grammar ? (
                        lesson.grammar.map((grammarItem, index) => (
                            <GrammarCard item={grammarItem} key={index} />
                        ))
                    ) : (
                        <Text className="text-gray-500">Không có ngữ pháp cho bài học này</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default LessonDetail;
