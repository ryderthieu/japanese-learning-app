import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    // Cấu hình xử lý thông báo
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Xử lý thông báo khi nhận được trong foreground
    this.foregroundSubscription = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Thông báo nhận được:', notification);
      }
    );

    // Xử lý khi người dùng tương tác với thông báo
    this.responseSubscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Người dùng tương tác:', response);
        // Không cần gọi scheduleNextDayReminder vì chúng ta sẽ sử dụng setTimeout
      }
    );
  }

  async initialize() {
    try {
      // Yêu cầu quyền thông báo
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      if (status !== 'granted') {
        console.log('Quyền thông báo chưa được cấp!');
        return false;
      }

      // Cấu hình kênh thông báo cho Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('study-reminders', {
          name: 'Study Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#EC4899',
        });
      }

      return true;
    } catch (error) {
      console.error('Lỗi khi khởi tạo thông báo:', error);
      return false;
    }
  }

  async createStudyReminder(time) {
    try {
      // Hủy thông báo cũ nếu có
      await this.cancelStudyReminder();

      // Parse thời gian từ string "HH:mm"
      const [hours, minutes] = time.split(':').map(Number);

      // Tính toán thời gian cho thông báo tiếp theo
      const now = new Date();
      const scheduledTime = new Date(now);
      scheduledTime.setHours(hours, minutes, 0, 0);

      // Nếu thời gian đã qua trong ngày, đặt cho ngày mai
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      // Tính số giây từ hiện tại đến thời điểm thông báo
      const secondsFromNow = Math.floor((scheduledTime.getTime() - now.getTime()) / 1000);

      // Tạo thông báo
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Đến giờ học rồi! 📚',
          body: 'Hãy dành thời gian để ôn tập và nâng cao trình độ tiếng Nhật của bạn.',
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          color: '#EC4899',
          data: { time },
        },
        trigger: {
          seconds: secondsFromNow,
          channelId: Platform.OS === 'android' ? 'study-reminders' : undefined,
        },
      });

      // Kiểm tra thông báo đã lên lịch
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('Thông báo đã lên lịch:', scheduledNotifications);
      console.log('Sẽ thông báo lúc:', scheduledTime.toLocaleString());
      console.log('Số giây chờ:', secondsFromNow);

      return notificationId;
    } catch (error) {
      console.error('Lỗi khi tạo thông báo:', error);
      throw error;
    }
  }

  async cancelStudyReminder() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  cleanup() {
    // Hủy đăng ký các listeners khi không cần thiết nữa
    if (this.foregroundSubscription) {
      this.foregroundSubscription.remove();
    }
    if (this.responseSubscription) {
      this.responseSubscription.remove();
    }
  }
}

const notificationService = new NotificationService();
export default notificationService; 