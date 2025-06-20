import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { questionService } from '../../../api';

const JLPTMiniTest = ({ navigation }) => {
  const route = useRoute();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [error, setError] = useState(null);

  // Lấy dữ liệu từ API
  useEffect(() => {
    fetchMiniTest();
  }, [route.params?.level]);

  const fetchMiniTest = async () => {
    try {
      setLoading(true);
      const level = route.params?.level || 'N3';
      
      // Lấy câu hỏi ngẫu nhiên từ API
      const response = await questionService.getRandomQuestions(3, {
        level: level,
        type: 'moji_goi'  // Ngữ pháp và từ vựng
      });

      if (response.success && response.questions.length > 0) {
        const testData = {
          title: `Mini Test ${level} - Ngữ pháp và Từ vựng`,
          questions: response.questions.map(q => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          }))
        };
        setTest(testData);
      } else {
        // Fallback với mock data nếu API không có dữ liệu
        const sampleTest = {
          title: `Mini Test ${level} - Ngữ pháp và Từ vựng`,
          questions: [
            {
              question: 'この薬を飲めば、熱が（　　　）でしょう。',
              options: ['下がる', '下げる', '下がれる', '下げられる'],
              correctAnswer: 0,
            },
            {
              question: '彼女は日本語が（　　　）上手です。',
              options: ['とても', 'あまり', 'ずいぶん', 'わりと'],
              correctAnswer: 2,
            },
            {
              question: '先生に（　　　）、宿題を出しました。',
              options: ['言われて', '言って', '話されて', '話して'],
              correctAnswer: 0,
            },
          ],
        };
        setTest(sampleTest);
      }
    } catch (error) {
      console.error('Error loading mini test:', error);
      setError('Không thể tải bài thi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === test.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < test.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F472B6" />
        <Text style={styles.loadingText}>Đang tải bài thi...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#F472B6' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!test) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không thể tải bài thi. Vui lòng thử lại sau.</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#F472B6' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Kết quả</Text>
        <Text style={styles.score}>
          Điểm số: {score}/{test.questions.length}
        </Text>
        <TouchableOpacity style={styles.button} onPress={restartTest}>
          <Text style={styles.buttonText}>Làm lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#F472B6' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{test.title}</Text>
      <Text style={styles.progress}>
        Câu {currentQuestion + 1}/{test.questions.length}
      </Text>
      
      <View style={styles.questionContainer}>
        <Text style={styles.question}>
          {test.questions[currentQuestion].question}
        </Text>
        
        {test.questions[currentQuestion].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  progress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  questionContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    lineHeight: 24,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F472B6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default JLPTMiniTest; 