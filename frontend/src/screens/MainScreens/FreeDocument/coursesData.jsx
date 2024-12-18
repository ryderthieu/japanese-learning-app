const coursesData = [
    {
        id: 1,
        title: 'N5 - Nhập môn',
        description: 'Khóa học dành cho người mới bắt đầu học tiếng Nhật, bao gồm bảng chữ cái, ngữ pháp và từ vựng cơ bản.',
        image: require("./FreeResources/FR1.png"),
        status: 'completed'
    },
    {
        id: 2,
        title: 'N4 - Giao tiếp',
        description: 'Học các mẫu câu giao tiếp và từ vựng cần thiết cho cuộc sống thường ngày, chuẩn bị nền tảng vững chắc.',
        image: require("./FreeResources/FR2.png"),
        progress: '45',
        status: 'in-progress',
    },
    {
        id: 3,
        title: 'N3 - Trung cấp',
        description: 'Khóa học tập trung vào việc nâng cao khả năng ngữ pháp và từ vựng để đọc hiểu các đoạn văn đơn giản.',
        image: require("./FreeResources/FR3.png"),
        status: 'not-learned'
    },
    {
        id: 4,
        title: 'N2 - Chuyên sâu',
        description: 'Tăng cường kỹ năng đọc hiểu và nghe hiểu các tài liệu phức tạp, phục vụ công việc và học thuật.',
        image: require("./FreeResources/FR4.png"),
        status: 'not-learned'
    },
    {
        id: 5,
        title: 'N1 - Thành thạo',
        description: 'Khóa học cao cấp giúp bạn làm chủ tiếng Nhật ở trình độ cao nhất, đọc hiểu văn bản học thuật và làm việc chuyên nghiệp.',
        image: require("./FreeResources/FR5.png"),
        status: 'not-learned'
    },
    {
        id: 6,
        title: 'Học Kanji từ N5 đến N1',
        description: 'Tổng hợp các bài học Kanji từ cơ bản đến nâng cao với mẹo ghi nhớ và thực hành hiệu quả.',
        image: require("./FreeResources/FR6.png"),
        status: 'not-learned'
    },
    {
        id: 7,
        title: 'Luyện thi JLPT N5-N4',
        description: 'Khóa học cung cấp các đề luyện thi, bài kiểm tra mô phỏng và mẹo làm bài cho kỳ thi JLPT N5 và N4.',
        image: require("./FreeResources/FR7.png"),
        status: 'not-learned'
    },
    {
        id: 8,
        title: 'Luyện thi JLPT N3-N2',
        description: 'Tăng cường kỹ năng làm bài thi và luyện tập các dạng đề khó, chuẩn bị cho kỳ thi JLPT N3 và N2.',
        image: require("./FreeResources/FR8.png"),
        status: 'not-learned'
    },
    {
        id: 9,
        title: 'Luyện thi JLPT N1',
        description: 'Khóa học dành riêng cho những ai đang chuẩn bị kỳ thi JLPT N1 với các tài liệu chuyên sâu.',
        image: require("./FreeResources/FR9.png"),
        status: 'not-learned'
    },
    {
        id: 10,
        title: 'Kỹ năng giao tiếp',
        description: 'Phát triển khả năng giao tiếp tự nhiên, phù hợp với các tình huống thực tế từ N5 đến N1.',
        image: require("./FreeResources/FR10.png"),
        status: 'not-learned'
    }
];

export default coursesData