import React, { useContext, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import YouTube from 'react-native-youtube-iframe';
import { GrammarCard, VocabularyCard } from '../../../components/Card/Card';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { ModalContext } from '../../../context/ModalContext';
import userService from '../../../api/userService';

const LessonDetail = ({ route }) => {
    const navigation = useNavigation()
    const { lesson } = route.params;
    const [videoEnded, setVideoEnded] = useState(false);
    const {token} = useContext(AuthContext)
    const {openModal} = useContext(ModalContext)

    const markLessonComplete = async () => {
        try {
            await userService.addCompletedLesson(lesson._id);
            navigation.goBack()
        } catch (error) {
            openModal({type: 'error', message: error.response?.data?.message || 'Có lỗi xảy ra'})
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
