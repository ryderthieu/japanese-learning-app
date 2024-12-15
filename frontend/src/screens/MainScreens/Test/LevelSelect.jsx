import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

export default function JLPTLevelScreen() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isSelectingTest, setIsSelectingTest] = useState(false);
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);

  const levels = ["N5", "N4", "N3", "N2", "N1"];
  const tests = ["Đề 1", "Đề 2", "Đề 3"];
  const sections = ["Từ vựng", "Ngữ pháp", "Đọc hiểu", "Nghe"];
  const questions = [
    { id: "1", question: "Câu hỏi 1: Chọn đáp án đúng", options: ["A", "B", "C", "D"] },
    { id: "2", question: "Câu hỏi 2: Nghĩa của từ này là gì?", options: ["A", "B", "C", "D"] },
    { id: "3", question: "Câu hỏi 3: Điền từ thích hợp", options: ["A", "B", "C", "D"] },
  ];

  const handleLevelSelect = (level) => {
    setSelectedLevel(level);
    setIsSelectingTest(true);
  };

  const handleTestSelect = (test) => {
    setSelectedTest(test);
    setIsTakingTest(true);
  };

  const handleSectionStart = (section) => {
    setCurrentSection(section);
  };

  const renderQuestion = ({ item }) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{item.question}</Text>
      {item.options.map((option, index) => (
        <TouchableOpacity key={index} style={styles.optionButton}>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>
        {currentSection
          ? `Phần Thi: ${currentSection}`
          : isTakingTest
          ? `Chọn Phần Thi (${selectedLevel} - ${selectedTest})`
          : isSelectingTest
          ? `Chọn Đề Thi (${selectedLevel})`
          : "Chọn Cấp Độ JLPT"}
      </Text>

      {/* Main Section */}
      <View style={styles.levelContainer}>
        {!isSelectingTest && !isTakingTest && !currentSection
          ? levels.map((level, index) => (
              <TouchableOpacity
                key={index}
                style={styles.levelButton}
                onPress={() => handleLevelSelect(level)}
              >
                <Text style={styles.levelText}>{level}</Text>
              </TouchableOpacity>
            ))
          : isTakingTest && !currentSection
          ? sections.map((section, index) => (
              <TouchableOpacity
                key={index}
                style={styles.levelButton}
                onPress={() => handleSectionStart(section)}
              >
                <Text style={styles.levelText}>{section}</Text>
              </TouchableOpacity>
            ))
          : !currentSection
          ? tests.map((test, index) => (
              <TouchableOpacity
                key={index}
                style={styles.levelButton}
                onPress={() => handleTestSelect(test)}
              >
                <Text style={styles.levelText}>{test}</Text>
              </TouchableOpacity>
            ))
          : (
            <FlatList
              data={questions}
              renderItem={renderQuestion}
              keyExtractor={(item) => item.id}
            />
          )}
      </View>

      {/* Footer Button */}
      {(isSelectingTest || isTakingTest || currentSection) && (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            if (currentSection) setCurrentSection(null);
            else if (isTakingTest) setIsTakingTest(false);
            else setIsSelectingTest(false);
          }}
        >
          <Text style={styles.startText}>Quay lại</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F7FF", // Nền xanh dương nhạt
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF91AF", // Hồng pastel
    marginBottom: 20,
  },
  levelContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 20,
  },
  levelButton: {
    backgroundColor: "#87CEEB", // Xanh dương
    padding: 20,
    margin: 10,
    borderRadius: 15,
    width: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  levelText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#FF91AF", // Hồng pastel
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  startText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  questionContainer: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: "100%",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: "#E6F7FF",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
    color: "#333333",
  },
});
