import { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import "./global.css"
import { AuthProvider } from "./src/context/AuthContext";
import MainStack from "./src/navigations/MainStack";
import { LoadingProvider } from "./src/context/LoadingContext";
import { ModalProvider } from "./src/context/ModalContext";
import notificationService from './src/services/NotificationService';

export default function App() {
  useEffect(() => {
    // Khởi tạo notification service
    notificationService.initialize().then(success => {
      if (!success) {
        console.log('Không thể khởi tạo thông báo');
      }
    });

    // Cleanup khi unmount
    return () => {
      notificationService.cleanup();
    };
  }, []);

  return (
    <NavigationContainer>
      <LoadingProvider>
        <ModalProvider>
          <AuthProvider>
            <MainStack />
          </AuthProvider>
        </ModalProvider>
      </LoadingProvider>
    </NavigationContainer>
  );
}

