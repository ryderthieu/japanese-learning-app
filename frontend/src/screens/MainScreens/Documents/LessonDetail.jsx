import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import YouTube from 'react-native-youtube-iframe';
import { GrammarCard, VocabularyCard } from '../../../components/Card/Card';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { ModalContext } from '../../../context/ModalContext';
import lessonService from '../../../api/lessonService';
import userService from '../../../api/userService';

const LessonDetail = ({ route }) => {
    const navigation = useNavigation();
    const { lesson } = route.params;
    const [videoEnded, setVideoEnded] = useState(false);
    const [isMarkingComplete, setIsMarkingComplete] = useState(false);
    const { token } = useContext(AuthContext);
    const { openModal } = useContext(ModalContext);
    const [lessonDetail, setLessonDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessonDetail = async () => {
            try {
                const data = await lessonService.getLessonDetail(lesson._id);
                console.log('Dữ liệu bài học nhận được:', data);
                console.log('Từ vựng:', data.vocabulary);
                console.log('Ngữ pháp:', data.grammar);
                setLessonDetail(data);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết bài học:', error);
                openModal({ type: 'error', message: error.response?.data?.message || 'Có lỗi xảy ra' });
            } finally {
                setLoading(false);
            }
        };
        fetchLessonDetail();
    }, [lesson._id]);

    const markLessonComplete = async () => {
        if (isMarkingComplete) return; // Tránh gọi API nhiều lần
        
        try {
            setIsMarkingComplete(true);
            console.log('Đánh dấu bài học đã hoàn thành:', lesson._id);
            
            // Gọi cả 2 API song song để đảm bảo dữ liệu được đồng bộ
            const promises = [
                lessonService.changeLessonStatus({ 
                    lessonId: lesson._id, 
                    isCompleted: true 
                }),
                userService.addCompletedLesson(lesson._id)
            ];
            
            await Promise.all(promises);
            
            console.log('Đánh dấu hoàn thành thành công');
            
            // Tự động quay lại trang trước
            navigation.goBack();
            
        } catch (error) {
            console.error('Lỗi khi đánh dấu hoàn thành:', error);
            
            // Xử lý lỗi chi tiết hơn
            let errorMessage = 'Không thể đánh dấu bài học đã hoàn thành';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            openModal({ 
                type: 'error', 
                message: errorMessage
            });
        } finally {
            setIsMarkingComplete(false);
        }
    };

    const handleVideoStateChange = (state) => {
        console.log('Trạng thái video:', state);
        
        if (state === 'ended' && !videoEnded) {
            setVideoEnded(true);
            markLessonComplete();
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-lg text-gray-600">Đang tải dữ liệu...</Text>
            </View>
        );
    }

    if (!lessonDetail) {
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
                    videoId={lessonDetail.videoId}
                    play={true}
                    height={250}
                    width="100%"
                    className="rounded-lg shadow-lg"
                    onChangeState={handleVideoStateChange}
                />
                
                {/* Hiển thị trạng thái khi đang đánh dấu hoàn thành */}
                {isMarkingComplete && (
                    <View className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center rounded-lg">
                        <View className="bg-white p-4 rounded-lg items-center">
                            <Text className="text-lg font-semibold text-blue-600 mb-2">
                                Đang lưu tiến độ...
                            </Text>
                            <Text className="text-gray-600">Vui lòng đợi</Text>
                        </View>
                    </View>
                )}
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-blue-600 mb-4">Từ vựng</Text>
                    {lessonDetail.vocabulary && lessonDetail.vocabulary.length > 0 ? (
                        lessonDetail.vocabulary.map((word, index) => {
                            console.log(`Từ vựng ${index}:`, word);
                            return (
                                <VocabularyCard item={word} key={index} />
                            );
                        })
                    ) : (
                        <View>
                            <Text className="text-gray-500">Không có từ vựng cho bài học này</Text>
                            {lessonDetail.vocabulary && (
                                <Text className="text-xs text-gray-400 mt-1">
                                    Số lượng từ vựng: {lessonDetail.vocabulary.length}
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                <View className="mb-6">
                    <Text className="text-2xl font-bold text-blue-600 mb-4">Ngữ pháp</Text>
                    {lessonDetail.grammar && lessonDetail.grammar.length > 0 ? (
                        lessonDetail.grammar.map((grammarItem, index) => (
                            <GrammarCard item={grammarItem} key={index} />
                        ))
                    ) : (
                        <View>
                            <Text className="text-gray-500">Không có ngữ pháp cho bài học này</Text>
                            {lessonDetail.grammar && (
                                <Text className="text-xs text-gray-400 mt-1">
                                    Số lượng ngữ pháp: {lessonDetail.grammar.length}
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default LessonDetail;
