const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../models/user');

// Kết nối database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Tạo dữ liệu mẫu cho study progress
const createSampleStudyData = (email) => {
  const today = new Date();
  const last30Days = [];
  
  // Tạo dữ liệu 30 ngày với pattern thực tế
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // 70% khả năng học, weekends ít hơn
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const studyChance = isWeekend ? 0.5 : 0.7;
    const studied = Math.random() < studyChance;
    
    last30Days.push(studied);
  }

  // Tính streak hiện tại
  let currentStreak = 0;
  for (let i = last30Days.length - 1; i >= 0; i--) {
    if (last30Days[i]) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Tính longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  for (let studied of last30Days) {
    if (studied) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Thống kê tuần này (7 ngày gần nhất)
  const last7Days = last30Days.slice(-7);
  const weeklyDaysStudied = last7Days.filter(day => day).length;
  const weeklyTotalTime = weeklyDaysStudied * (25 + Math.random() * 20); // 25-45 phút/ngày
  const weeklyGoalsAchieved = last7Days.filter(day => day).length;

  // Thống kê tháng này
  const monthlyDaysStudied = last30Days.filter(day => day).length;
  const monthlyTotalTime = monthlyDaysStudied * (25 + Math.random() * 20);
  const monthlyGoalsAchieved = last30Days.filter(day => day).length;

  // Thời gian học hôm nay
  const todayStudied = last30Days[last30Days.length - 1];
  const todayStudyTime = todayStudied ? Math.floor(20 + Math.random() * 40) : 0;

  return {
    email,
    studyProgress: {
      totalStudyTime: Math.floor(monthlyTotalTime + Math.random() * 500), // Tổng thời gian học
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak + Math.floor(Math.random() * 10)),
      todayStudyTime,
      lastStudyDate: todayStudied ? today : null,
      lastUpdateDate: today,
      weeklyStats: {
        totalTime: Math.floor(weeklyTotalTime),
        daysStudied: weeklyDaysStudied,
        goalsAchieved: weeklyGoalsAchieved,
        weekStartDate: new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000))
      },
      monthlyStats: {
        totalTime: Math.floor(monthlyTotalTime),
        daysStudied: monthlyDaysStudied,
        goalsAchieved: monthlyGoalsAchieved,
        monthStartDate: new Date(today.getFullYear(), today.getMonth(), 1)
      },
      last30Days
    },
    studySettings: {
      studyDuration: 30,
      reminder: {
        enabled: true,
        time: '08:00'
      }
    }
  };
};

// Hàm chính để thêm dữ liệu
const addSampleData = async () => {
  try {
    await connectDB();

    // Danh sách các scenarios khác nhau
    const scenarios = [
      {
        email: 'user1@test.com',
        name: 'Nguyễn Văn An - Newbie',
        scenario: 'newbie', // Streak thấp, mới bắt đầu
        password: '123456' // Password đơn giản để test
      },
      {
        email: 'user2@test.com', 
        name: 'Trần Thị Bình - Consistent',
        scenario: 'consistent', // Streak trung bình, ổn định
        password: '123456'
      },
      {
        email: 'user3@test.com',
        name: 'Lê Văn Cường - Pro',
        scenario: 'pro', // Streak cao, chuyên nghiệp
        password: '123456'
      }
    ];

    for (let scenario of scenarios) {
      console.log(`\n🔄 Processing ${scenario.name}...`);
      
      // Tìm user trong database
      let user = await User.findOne({ email: scenario.email });
      
      if (!user) {
        console.log(`   ❌ User ${scenario.email} not found. Creating sample user...`);
        
        // Hash password trước khi lưu
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(scenario.password, saltRounds);
        
        // Tạo user mới nếu chưa có
        user = new User({
          email: scenario.email,
          password: hashedPassword, // Mật khẩu đã hash
          fullName: scenario.name.split(' - ')[0],
          hasCompletedInitialSurvey: true,
          jlptLevel: 'N5',
          targetLevel: 'N4'
        });
        
        await user.save();
        console.log(`   ✅ Created user ${scenario.email} with password: ${scenario.password}`);
      } else {
        console.log(`   ✅ User ${scenario.email} already exists. Password: ${scenario.password}`);
      }

      // Tạo dữ liệu study progress tùy theo scenario
      let sampleData;
      
      switch (scenario.scenario) {
        case 'newbie':
          sampleData = createSampleStudyData(scenario.email);
          // Điều chỉnh cho newbie: streak thấp, ít ngày học
          sampleData.studyProgress.currentStreak = Math.floor(Math.random() * 3); // 0-2 ngày
          sampleData.studyProgress.longestStreak = Math.floor(Math.random() * 5) + 1; // 1-5 ngày
          sampleData.studyProgress.last30Days = sampleData.studyProgress.last30Days.map((_, i) => 
            i >= 25 ? Math.random() < 0.3 : false // Chỉ học 5 ngày gần nhất với tỷ lệ thấp
          );
          break;
          
        case 'consistent':
          sampleData = createSampleStudyData(scenario.email);
          // Điều chỉnh cho consistent: streak trung bình
          sampleData.studyProgress.currentStreak = Math.floor(Math.random() * 8) + 5; // 5-12 ngày
          sampleData.studyProgress.longestStreak = Math.floor(Math.random() * 10) + 10; // 10-19 ngày
          break;
          
        case 'pro':
          sampleData = createSampleStudyData(scenario.email);
          // Điều chỉnh cho pro: streak cao
          sampleData.studyProgress.currentStreak = Math.floor(Math.random() * 20) + 25; // 25-44 ngày
          sampleData.studyProgress.longestStreak = Math.floor(Math.random() * 15) + 50; // 50-64 ngày
          sampleData.studyProgress.last30Days = sampleData.studyProgress.last30Days.map(() => 
            Math.random() < 0.9 // 90% khả năng học mỗi ngày
          );
          break;
      }

      // Cập nhật user với dữ liệu mới
      user.studyProgress = sampleData.studyProgress;
      user.studySettings = sampleData.studySettings;
      
      await user.save();
      
      console.log(`   ✅ Updated study data for ${scenario.name}`);
      console.log(`   📊 Current Streak: ${user.studyProgress.currentStreak} days`);
      console.log(`   🏆 Longest Streak: ${user.studyProgress.longestStreak} days`);
      console.log(`   ⏱️  Today Study Time: ${user.studyProgress.todayStudyTime} minutes`);
      console.log(`   📅 Weekly Days: ${user.studyProgress.weeklyStats.daysStudied}/7`);
      console.log(`   📈 Monthly Days: ${user.studyProgress.monthlyStats.daysStudied}/30`);
    }

    console.log('\n🎉 Sample study data added successfully!');
    console.log('\n📝 Test với các tài khoản:');
    console.log('   👶 Newbie: user1@test.com');
    console.log('   📚 Consistent: user2@test.com'); 
    console.log('   🏆 Pro: user3@test.com');
    console.log('\n🔑 Password cho tất cả tài khoản: 123456');
    console.log('\n💡 Bây giờ bạn có thể login để test màn hình thống kê!');
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Chạy script
if (require.main === module) {
  addSampleData();
}

module.exports = { addSampleData, createSampleStudyData }; 