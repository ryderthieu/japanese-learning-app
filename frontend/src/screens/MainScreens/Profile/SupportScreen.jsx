import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const faq = [
  { id: 1, question: 'Ứng dụng hỗ trợ những khóa học nào?', answer: 'Ứng dụng cung cấp cả khóa học miễn phí và khóa học có phí. Khóa học miễn phí bao gồm các bài học cơ bản, còn khóa học có phí cung cấp các bài học nâng cao và chuyên sâu.' },
  { id: 2, question: 'Làm thế nào để thanh toán khóa học có phí?', answer: 'Bạn có thể thanh toán qua thẻ tín dụng, thẻ ghi nợ hoặc ví điện tử. Sau khi thanh toán, bạn sẽ có quyền truy cập vào tất cả các bài học trong khóa học.' },
  { id: 3, question: 'Làm sao để tra từ điển trong ứng dụng?', answer: 'Bạn chỉ cần nhấn vào biểu tượng từ điển trên giao diện chính và nhập từ hoặc cụm từ cần tra.' },
  { id: 4, question: 'Ứng dụng có thi thử không?', answer: 'Ứng dụng cung cấp các bài thi thử giúp bạn kiểm tra khả năng và chuẩn bị cho các kỳ thi chính thức như JLPT.' },
  { id: 5, question: 'Làm sao để theo dõi tiến độ học tập?', answer: 'Bạn có thể theo dõi tiến độ học tập của mình trong phần "Tiến độ" trên giao diện chính. Ứng dụng sẽ hiển thị các bài học bạn đã hoàn thành và điểm số thi thử.' },
  { id: 6, question: 'Ứng dụng có hỗ trợ học ngoại ngữ khác không?', answer: 'Hiện tại, ứng dụng chỉ hỗ trợ học tiếng Nhật, nhưng chúng tôi có kế hoạch phát triển thêm các ngôn ngữ khác trong tương lai.' }
];

const SupportScreen = () => {
  const [expanded, setExpanded] = useState({});

  const handleToggleAnswer = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+84977093753');
  };
  const handleEmailSupport = () => {
    Linking.openURL('mailto:22521396@gm.uit.edu.vn?subject=Hỗ trợ khách hàng&body=Vui lòng nhập nội dung cần hỗ trợ:');
  };
  const handleFacebookSupport = () => {
    Linking.openURL('https://www.facebook.com/yourPageName');
  };

  return (
    <ScrollView className="flex-1 bg-white p-5">
      <Text className="text-xl font-bold text-pink-500 mb-4">Các câu hỏi thường gặp</Text>
      {faq.map((item) => (
        <TouchableOpacity
          key={item.id}
          className="bg-gray-50 p-4 rounded-lg shadow mb-3"
          onPress={() => handleToggleAnswer(item.id)}
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-semibold">{item.question}</Text>
            <Icon
              name={expanded[item.id] ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={20}
              color="gray"
            />
          </View>
          {expanded[item.id] && (
            <View className="mt-3">
              <Text className="text-base text-gray-600">{item.answer}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      <Text className="text-xl font-bold mt-4 mb-2 text-pink-500">Liên hệ với chúng tôi</Text>
      <View className="bg-gray-50 p-4 rounded-lg shadow mb-4">
        <TouchableOpacity className="flex-row items-center mb-3" onPress={handleCallSupport}>
          <Icon name="call-outline" size={20} color="#F490AF" />
          <Text className="ml-2 text-base text-pink-600 font-bold">Điện thoại:</Text>
          <Text className="ml-2 text-base text-pink-600"> +84 977 093 753</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center mb-3" onPress={handleEmailSupport}>
          <Icon name="mail-outline" size={20} color="#F490AF" />
          <Text className="ml-2 text-base text-pink-600 font-bold">Email:</Text>
          <Text className="ml-2 text-base text-pink-600"> 22521396@gm.uit.edu.vn</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center" onPress={handleFacebookSupport}>
          <Icon name="logo-facebook" size={20} color="#1877F3" />
          <Text className="ml-2 text-base text-blue-600 font-bold">Facebook:</Text>
          <Text className="ml-2 text-base text-blue-600"> Sakura Japanese</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SupportScreen; 