import { createContext, useState, useRef } from 'react';
import Overlay from '../components/Overlay/Overlay';
import { View } from 'react-native';
const ModalContext = createContext();

const ModalProvider = ({ children }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState("success");
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const modalOnConfirmRef = useRef(null);

    const openModal = ({ title, type, message, onConfirm }) => {
        setModalType(type);
        setModalMessage(message);
        setModalVisible(true);
        setModalTitle(title);
        modalOnConfirmRef.current = onConfirm;
        console.log('Modal opened with onConfirm:', typeof onConfirm);
    };
    
    const closeModal = () => {
        setModalVisible(false);
        modalOnConfirmRef.current = null;
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
                    onConfirm={modalOnConfirmRef.current}
                />
            </View>
        </ModalContext.Provider>
    )
}

export {ModalContext, ModalProvider}