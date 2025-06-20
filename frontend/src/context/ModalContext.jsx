import { createContext, useState, useRef } from 'react';
import Overlay from '../components/Overlay/Overlay';
import { View } from 'react-native';
const ModalContext = createContext();

const ModalProvider = ({ children }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState("success");
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [confirmText, setConfirmText] = useState("");
    const [cancelText, setCancelText] = useState("");
    const modalOnConfirmRef = useRef(null);
    const modalOnCancelRef = useRef(null);

    const openModal = ({ 
        title, 
        type, 
        message, 
        onConfirm, 
        onCancel,
        confirmText = "Xác nhận",
        cancelText = "Hủy"
    }) => {
        setModalType(type);
        setModalMessage(message);
        setModalVisible(true);
        setModalTitle(title);
        setConfirmText(confirmText);
        setCancelText(cancelText);
        modalOnConfirmRef.current = onConfirm;
        modalOnCancelRef.current = onCancel;
        console.log('Modal opened with onConfirm:', typeof onConfirm);
    };
    
    const closeModal = () => {
        setModalVisible(false);
        modalOnConfirmRef.current = null;
        modalOnCancelRef.current = null;
    };

    return (
        <ModalContext.Provider value={{openModal, closeModal}}>
            {children}
            <View className='absolute top-1/2 left-1/2'>
                <Overlay
                    isVisible={modalVisible}
                    onClose={closeModal}
                    type={modalType}
                    message={modalMessage}
                    title={modalTitle}
                    confirmText={confirmText}
                    cancelText={cancelText}
                    onConfirm={modalOnConfirmRef.current}
                    onCancel={modalOnCancelRef.current}
                />
            </View>
        </ModalContext.Provider>
    )
}

export {ModalContext, ModalProvider}