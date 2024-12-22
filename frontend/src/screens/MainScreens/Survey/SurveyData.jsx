const SurveyData = [
    {
      id: 1,
      question: "Bạn đã từng học tiếng Nhật trước đây chưa?",
      options: [
        { id: 1, icon: require("../../../assets/images/CheckYourLevel/work.png"), text: "Có, đã từng học" },
        { id: 2, icon: require("../../../assets/images/CheckYourLevel/studyAbroad.png"), text: "Tôi chưa từng học tiếng Nhật" },
      ],
    },
    {
        id: 2,
        question: "Mục đích học tiếng Nhật của bạn là gì?",
        options: [
          { id: 1, icon: require("../../../assets/images/CheckYourLevel/work.png"), text: "Bổ trợ công việc" },
          { id: 2, icon: require("../../../assets/images/CheckYourLevel/studyAbroad.png"), text: "Đi du học" },
          { id: 3, icon: require("../../../assets/images/CheckYourLevel/subject.png"), text: "Môn học bắt buộc" },
          { id: 4, icon: require("../../../assets/images/CheckYourLevel/learn.png"), text: "Học thêm 1 ngôn ngữ mới" },
          { id: 5, icon: require("../../../assets/images/CheckYourLevel/travel.png"), text: "Đi du lịch" },
        ],
      },
      {
        id: 3,
        question: "Trình độ tiếng Nhật của bạn ở mức nào?",
        options: [
          { id: 1, icon: require("../../../assets/images/CheckYourLevel/work.png"), text: "Tôi mới học tiếng Nhật" },
          { id: 2, icon: require("../../../assets/images/CheckYourLevel/studyAbroad.png"), text: "Tôi biết một vài từ thông dụng" },
          { id: 3, icon: require("../../../assets/images/CheckYourLevel/subject.png"), text: "Tôi có thể giao tiếp cơ bản" },
          { id: 4, icon: require("../../../assets/images/CheckYourLevel/learn.png"), text: "Tôi có thể nói về nhiều chủ đề" },
          { id: 5, icon: require("../../../assets/images/CheckYourLevel/travel.png"), text: "Tôi tự tin giao tiếp tốt" },
        ],
      },
      {
        id: 4,
        question: "Bạn đã từng học giáo trình nào?",
        options: [
          { id: 1, icon: require("../../../assets/images/CheckYourLevel/work.png"), text: "Minna no Nihongo" },
          { id: 2, icon: require("../../../assets/images/CheckYourLevel/studyAbroad.png"), text: "Minato" },
          { id: 3, icon: require("../../../assets/images/CheckYourLevel/subject.png"), text: "Somatome" },
          { id: 4, icon: require("../../../assets/images/CheckYourLevel/learn.png"), text: "Mimi kara oboeru" },
          { id: 5, icon: require("../../../assets/images/CheckYourLevel/travel.png"), text: "Giáo trình khác" },
        ],
      },
      {
        id: 5,
        question: "Thời gian bạn dành ra mỗi ngày để học tiếng Nhật?",
        options: [
          { id: 1, icon: require("../../../assets/images/CheckYourLevel/work.png"), text: "10 phút" },
          { id: 2, icon: require("../../../assets/images/CheckYourLevel/studyAbroad.png"), text: "20 phút" },
          { id: 3, icon: require("../../../assets/images/CheckYourLevel/subject.png"), text: "30 phút" },
          { id: 4, icon: require("../../../assets/images/CheckYourLevel/learn.png"), text: "60 phút" },
          { id: 5, icon: require("../../../assets/images/CheckYourLevel/travel.png"), text: "Tùy hứng" },
        ],
      },
  ];
  export default SurveyData;
  