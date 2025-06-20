const mongoose = require('mongoose');
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
const createSampleStudyData = () => {
  const today = new Date();
  const last30Days = [];
  
  // Tạo dữ liệu 30 ngày với pattern thực tế
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // 80% khả năng học, weekends ít hơn
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const studyChance = isWeekend ? 0.6 : 0.8;
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

  // Đảm bảo có streak tốt để test
  if (currentStreak < 10) {
    // Thiết lập 15 ngày gần nhất là học để có streak 15
    for (let i = last30Days.length - 15; i < last30Days.length; i++) {
      if (i >= 0) last30Days[i] = true;
    }
    currentStreak = 15;
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
  longestStreak = Math.max(longestStreak, currentStreak + 5);

  // Thống kê tuần này (7 ngày gần nhất) - ĐẢM BẢO TẤT CẢ 7 NGÀY ĐỀU HỌC
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    last7Days.push(true); // Đặt tất cả 7 ngày đều học
  }
  
  // Cập nhật lại 7 ngày cuối trong last30Days
  for (let i = 0; i < 7; i++) {
    last30Days[last30Days.length - 7 + i] = true;
  }
  
  const weeklyDaysStudied = 7; // Chắc chắn 7 ngày
  const weeklyTotalTime = weeklyDaysStudied * (35 + Math.random() * 20); // 35-55 phút/ngày
  const weeklyGoalsAchieved = 7;

  // Thống kê tháng này
  const monthlyDaysStudied = last30Days.filter(day => day).length;
  const monthlyTotalTime = monthlyDaysStudied * (30 + Math.random() * 25);
  const monthlyGoalsAchieved = last30Days.filter(day => day).length;

  // Thời gian học hôm nay
  const todayStudied = last30Days[last30Days.length - 1];
  const todayStudyTime = todayStudied ? Math.floor(25 + Math.random() * 40) : 0;

  return {
    totalStudyTime: Math.floor(monthlyTotalTime + Math.random() * 800), // Tổng thời gian học
    currentStreak,
    longestStreak,
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
  };
};

// Hàm chính để cập nhật user
const updateExistingUser = async () => {
  try {
    await connectDB();

    const userEmail = '22521396@gm.uit.edu.vn';
    console.log(`\n🔄 Updating study data for ${userEmail}...`);
    
    // Tìm user trong database
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      console.log(`   ❌ User ${userEmail} not found in database`);
      console.log('   💡 Hãy đảm bảo user này đã được tạo trong hệ thống');
      return;
    }

    console.log(`   ✅ Found user: ${user.fullName || user.email}`);

    // Tạo dữ liệu study progress mới
    const studyProgressData = createSampleStudyData();

    // Đảm bảo studySettings tồn tại
    if (!user.studySettings) {
      user.studySettings = {
        studyDuration: 30,
        reminder: {
          enabled: true,
          time: '08:00'
        }
      };
    }

    // Cập nhật study progress
    user.studyProgress = studyProgressData;
    
    await user.save();
    
    console.log(`   ✅ Successfully updated study data!`);
    console.log(`   📊 Current Streak: ${user.studyProgress.currentStreak} days`);
    console.log(`   🏆 Longest Streak: ${user.studyProgress.longestStreak} days`);
    console.log(`   ⏱️  Today Study Time: ${user.studyProgress.todayStudyTime} minutes`);
    console.log(`   📅 Weekly Days: ${user.studyProgress.weeklyStats.daysStudied}/7`);
    console.log(`   📈 Monthly Days: ${user.studyProgress.monthlyStats.daysStudied}/30`);

    // Tính màu sắc streak để show
    let streakColor = 'Xám';
    if (user.studyProgress.currentStreak >= 30) streakColor = 'Đỏ cam';
    else if (user.studyProgress.currentStreak >= 14) streakColor = 'Cam';
    else if (user.studyProgress.currentStreak >= 7) streakColor = 'Vàng đậm';
    else if (user.studyProgress.currentStreak >= 1) streakColor = 'Vàng nhạt';

    console.log(`   🎨 Streak Color: ${streakColor}`);
    console.log(`\n🎉 Study data updated successfully!`);
    console.log(`\n💡 Bây giờ bạn có thể login với email: ${userEmail}`);
    console.log(`   và vào Home → Thống kê chi tiết để xem dữ liệu mới!`);
    
  } catch (error) {
    console.error('❌ Error updating user data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Chạy script
if (require.main === module) {
  updateExistingUser();
}

module.exports = { updateExistingUser }; 