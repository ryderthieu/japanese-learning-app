# Frontend API Services Documentation

## Tổng quan

Tài liệu này mô tả các API services trong frontend đã được cập nhật để hỗ trợ hệ thống JLPT mới.

## Services Available

### 1. userService
Quản lý người dùng và thông tin JLPT.

#### JLPT Functions:
- `getJLPTStats()` - Lấy thống kê JLPT
- `updateJLPTInfo(jlptData)` - Cập nhật thông tin JLPT
- `getStudyProgress()` - Lấy tiến độ học tập
- `updateStudySettings(settings)` - Cập nhật cài đặt học tập
- `getTestHistory(page, limit)` - Lấy lịch sử làm bài thi
- `getSectionStats()` - Lấy thống kê theo section
- `saveQuestion(questionId)` - Lưu câu hỏi
- `unsaveQuestion(questionId)` - Bỏ lưu câu hỏi

### 2. questionService
Quản lý câu hỏi JLPT.

#### Core Functions:
- `getAllQuestions(filters)` - Lấy tất cả câu hỏi
- `getQuestionById(id)` - Lấy câu hỏi theo ID
- `createQuestion(questionData)` - Tạo câu hỏi mới
- `updateQuestion(id, questionData)` - Cập nhật câu hỏi
- `deleteQuestion(id)` - Xóa câu hỏi

#### Filter Functions:
- `getQuestionsByLevel(level, filters)` - Lấy câu hỏi theo level
- `getQuestionsBySection(section, filters)` - Lấy câu hỏi theo section
- `getQuestionsByType(type, filters)` - Lấy câu hỏi theo type
- `getQuestionsByDifficulty(difficulty, filters)` - Lấy câu hỏi theo độ khó

#### Special Functions:
- `getRandomQuestions(count, filters)` - Lấy câu hỏi ngẫu nhiên
- `searchQuestions(query, filters)` - Tìm kiếm câu hỏi
- `getQuestionStats()` - Lấy thống kê câu hỏi
- `importQuestions(fileData)` - Import câu hỏi từ file
- `exportQuestions(filters)` - Export câu hỏi

### 3. testService
Quản lý bài thi JLPT.

#### Core Functions:
- `getAllTests(filters)` - Lấy tất cả bài thi
- `getTestById(id)` - Lấy bài thi theo ID
- `createTest(testData)` - Tạo bài thi mới
- `updateTest(id, testData)` - Cập nhật bài thi
- `deleteTest(id)` - Xóa bài thi

#### Test Management:
- `createTestFromTemplate(templateData)` - Tạo bài thi từ template
- `getTestTemplates(level)` - Lấy template bài thi
- `startTest(testId)` - Bắt đầu làm bài thi
- `submitTest(testId, answers)` - Nộp bài thi
- `saveTestProgress(testId, progress)` - Lưu tiến độ bài thi

#### Results & Analysis:
- `getTestResult(testId)` - Lấy kết quả bài thi
- `getTestAnalysis(testId)` - Lấy phân tích chi tiết
- `getTestQuestions(testId)` - Lấy câu hỏi của bài thi

#### User Functions:
- `getActiveTest()` - Lấy bài thi đang làm
- `pauseTest(testId)` - Dừng bài thi
- `resumeTest(testId)` - Tiếp tục bài thi
- `getRemainingTime(testId)` - Lấy thời gian còn lại
- `getUserTestHistory(page, limit)` - Lấy lịch sử bài thi
- `getCompletedTests(page, limit)` - Lấy bài thi đã hoàn thành
- `getIncompleteTests(page, limit)` - Lấy bài thi chưa hoàn thành

### 4. vocabularyService
Quản lý từ vựng JLPT.

#### JLPT Functions:
- `getVocabularyByJLPTLevel(level, filters)` - Lấy từ vựng theo level
- `getVocabularyByJLPTSection(section, filters)` - Lấy từ vựng theo section
- `getVocabularyByJLPTType(type, filters)` - Lấy từ vựng theo type
- `getRandomJLPTVocabulary(count, filters)` - Lấy từ vựng ngẫu nhiên
- `searchJLPTVocabulary(query, filters)` - Tìm kiếm từ vựng
- `getJLPTVocabularyStats()` - Lấy thống kê từ vựng
- `getLearnedJLPTVocabulary(filters)` - Lấy từ vựng đã học
- `markVocabularyAsLearned(vocabularyId)` - Đánh dấu đã học
- `unmarkVocabularyAsLearned(vocabularyId)` - Bỏ đánh dấu đã học
- `getDifficultJLPTVocabulary(filters)` - Lấy từ vựng khó

### 5. grammarService
Quản lý ngữ pháp JLPT.

#### JLPT Functions:
- `getGrammarByJLPTLevel(level, filters)` - Lấy ngữ pháp theo level
- `getGrammarByJLPTSection(section, filters)` - Lấy ngữ pháp theo section
- `getGrammarByJLPTType(type, filters)` - Lấy ngữ pháp theo type
- `getRandomJLPTGrammar(count, filters)` - Lấy ngữ pháp ngẫu nhiên
- `searchJLPTGrammar(query, filters)` - Tìm kiếm ngữ pháp
- `getJLPTGrammarStats()` - Lấy thống kê ngữ pháp
- `getLearnedJLPTGrammar(filters)` - Lấy ngữ pháp đã học
- `markGrammarAsLearned(grammarId)` - Đánh dấu đã học
- `unmarkGrammarAsLearned(grammarId)` - Bỏ đánh dấu đã học
- `getDifficultJLPTGrammar(filters)` - Lấy ngữ pháp khó
- `getGrammarStructures(filters)` - Lấy cấu trúc ngữ pháp
- `getGrammarExamples(grammarId, filters)` - Lấy ví dụ ngữ pháp

### 6. courseService
Quản lý khóa học JLPT.

#### JLPT Functions:
- `getCoursesByJLPTLevel(level, filters)` - Lấy khóa học theo level
- `getCoursesByJLPTSection(section, filters)` - Lấy khóa học theo section
- `getCoursesByJLPTType(type, filters)` - Lấy khóa học theo type
- `searchJLPTCourses(query, filters)` - Tìm kiếm khóa học
- `getJLPTCourseStats()` - Lấy thống kê khóa học
- `getEnrolledJLPTCourses(filters)` - Lấy khóa học đã đăng ký
- `getRecommendedJLPTCourses(filters)` - Lấy khóa học được đề xuất
- `getJLPTCourseProgress(courseId)` - Lấy tiến độ khóa học
- `updateJLPTCourseProgress(courseId, progressData)` - Cập nhật tiến độ
- `getJLPTCourseLessons(courseId, filters)` - Lấy bài học của khóa học
- `getJLPTCourseTests(courseId, filters)` - Lấy bài thi của khóa học

### 7. lessonService
Quản lý bài học JLPT.

#### JLPT Functions:
- `getLessonsByJLPTLevel(level, filters)` - Lấy bài học theo level
- `getLessonsByJLPTSection(section, filters)` - Lấy bài học theo section
- `getLessonsByJLPTType(type, filters)` - Lấy bài học theo type
- `getLessonsByCourseAndJLPT(courseId, filters)` - Lấy bài học theo course
- `searchJLPTLessons(query, filters)` - Tìm kiếm bài học
- `getJLPTLessonStats()` - Lấy thống kê bài học
- `getCompletedJLPTLessons(filters)` - Lấy bài học đã hoàn thành
- `getIncompleteJLPTLessons(filters)` - Lấy bài học chưa hoàn thành
- `markLessonAsCompleted(lessonId)` - Đánh dấu đã hoàn thành
- `unmarkLessonAsCompleted(lessonId)` - Bỏ đánh dấu đã hoàn thành
- `getJLPTLessonProgress(lessonId)` - Lấy tiến độ bài học
- `updateJLPTLessonProgress(lessonId, progressData)` - Cập nhật tiến độ
- `getJLPTLessonQuestions(lessonId, filters)` - Lấy câu hỏi của bài học
- `getJLPTLessonTests(lessonId, filters)` - Lấy bài thi của bài học

## Cách sử dụng

### Import services:
```javascript
import { 
  userService, 
  questionService, 
  testService,
  vocabularyService,
  grammarService,
  courseService,
  lessonService 
} from '../api';
```

### Ví dụ sử dụng:
```javascript
// Lấy thống kê JLPT của user
const stats = await userService.getJLPTStats();

// Lấy câu hỏi theo level N5
const questions = await questionService.getQuestionsByLevel('N5', {
  type: 'vocabulary',
  page: 1,
  limit: 10
});

// Bắt đầu làm bài thi
const test = await testService.startTest(testId);

// Lấy từ vựng theo JLPT level
const vocabulary = await vocabularyService.getVocabularyByJLPTLevel('N3', {
  section: 'moji_goi',
  page: 1,
  limit: 20
});
```

## Filters Parameters

Các service đều hỗ trợ các filter parameters sau:

### Common Filters:
- `level`: JLPT level (N1, N2, N3, N4, N5)
- `section`: JLPT section (moji_goi, bunpou, dokkai, choukai)
- `type`: Question type (vocabulary, grammar, reading, listening)
- `difficulty`: Difficulty level (easy, medium, hard)
- `page`: Page number for pagination
- `limit`: Number of items per page
- `search`: Search query

### Specific Filters:
- `status`: Test status (active, completed, paused)
- `format`: Export format (pdf, excel, csv)

## Error Handling

Tất cả các service đều trả về Promise và có thể xử lý lỗi bằng try-catch:

```javascript
try {
  const data = await userService.getJLPTStats();
  console.log(data);
} catch (error) {
  console.error('Error:', error.response?.data || error.message);
}
```

## Authentication

Các service sẽ tự động sử dụng token authentication từ `apiClient`. Đảm bảo user đã đăng nhập trước khi sử dụng các API endpoints. 