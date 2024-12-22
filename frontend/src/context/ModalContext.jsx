import { createContext, useState } from 'react';
import Overlay from '../components/Overlay/Overlay';
import { View } from 'react-native';
const ModalContext = createContext();

const ModalProvider = ({ children }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState("success");
    const [modalMessage, setModalMessage] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [modalOnConfirm, setModalOnConfirm] = useState(null);
    const openModal = ({ title, type, message, onConfirm }) => {
        setModalType(type);
        setModalMessage(message);
        setModalVisible(true);
        setModalTitle(title)
        setModalOnConfirm(onConfirm)
        console.log('hello', onConfirm)
    };
    const closeModal = () => setModalVisible(false)

    return (
        <ModalContext.Provider value={{openModal, closeModal}}>
            {children}
            <View className='absolute top-1/2 left-1/2'>
                <Overlay
                    isVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    type={modalType}
                    message={modalMessage}
                    title={modalTitle}
                    onConfirm={modalOnConfirm}
                />
            </View>
        </ModalContext.Provider>
    )
}

export {ModalContext, ModalProvider}