import { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import "./global.css"
import { AuthProvider } from "./src/context/AuthContext";
import MainStack from "./src/navigations/MainStack";
import { LoadingProvider } from "./src/context/LoadingContext";
import { ModalProvider } from "./src/context/ModalContext";
import { AIExplanationProvider } from "./src/context/AIExplanationContext";
import { FreeDocumentProvider } from "./src/context/FreeDocumentContext";
import { AIExplanationModal } from "./src/components/Modal/AIExplanationModal";
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
    <LoadingProvider>
      <ModalProvider>
        <AIExplanationProvider>
          <FreeDocumentProvider>
            <NavigationContainer>
              <AuthProvider>
                <MainStack />
              </AuthProvider>
            </NavigationContainer>
            <AIExplanationModal />
          </FreeDocumentProvider>
        </AIExplanationProvider>
      </ModalProvider>
    </LoadingProvider>
  );
}

