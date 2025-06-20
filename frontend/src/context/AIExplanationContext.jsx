import React, { createContext, useContext, useState } from 'react';

const AIExplanationContext = createContext();

export const useAIExplanation = () => {
    const context = useContext(AIExplanationContext);
    if (!context) {
        throw new Error('useAIExplanation must be used within AIExplanationProvider');
    }
    return context;
};

export const AIExplanationProvider = ({ children }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [explanation, setExplanation] = useState('');
    const [currentItem, setCurrentItem] = useState(null);
    const [explanationType, setExplanationType] = useState(''); // 'vocabulary' or 'grammar'

    const showExplanation = (item, type) => {
        console.log('🎪 Context - showExplanation called:', { item, type });
        setCurrentItem(item);
        setExplanationType(type);
        setIsModalVisible(true);
        console.log('🎪 Context - Modal state set to visible');
    };

    const hideExplanation = () => {
        console.log('🎪 Context - hideExplanation called');
        setIsModalVisible(false);
        setExplanation('');
        setCurrentItem(null);
        setExplanationType('');
    };

    const value = {
        // State
        isModalVisible,
        isLoading,
        explanation,
        currentItem,
        explanationType,
        
        // Actions
        showExplanation,
        hideExplanation,
        setIsLoading,
        setExplanation
    };

    return (
        <AIExplanationContext.Provider value={value}>
            {children}
        </AIExplanationContext.Provider>
    );
}; 