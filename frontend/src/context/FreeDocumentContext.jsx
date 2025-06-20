import React, { createContext, useContext, useState, useEffect } from 'react';
import vocabularyService from '../api/vocabularyService';
import grammarService from '../api/grammarService';

const FreeDocumentContext = createContext();

export const useFreeDocument = () => {
  const context = useContext(FreeDocumentContext);
  if (!context) {
    throw new Error('useFreeDocument must be used within a FreeDocumentProvider');
  }
  return context;
};

export const FreeDocumentProvider = ({ children }) => {
  const [vocabLessons, setVocabLessons] = useState({});
  const [kanjiLessons, setKanjiLessons] = useState({});
  const [grammarLessons, setGrammarLessons] = useState({});
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadCompleted, setPreloadCompleted] = useState(false);

  // Preload tất cả lessons cho các levels
  const preloadAllLessons = async () => {
    if (preloadCompleted) return;
    
    setIsPreloading(true);
    const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
    
    try {
      // Preload Vocabulary lessons
      for (const level of levels) {
        const vocabData = await getAllVocabLessons(level);
        setVocabLessons(prev => ({ ...prev, [level]: vocabData }));
        
        const kanjiData = await getAllKanjiLessons(level);
        setKanjiLessons(prev => ({ ...prev, [level]: kanjiData }));
        
        const grammarData = await getAllGrammarLessons(level);
        setGrammarLessons(prev => ({ ...prev, [level]: grammarData }));
      }
      
      setPreloadCompleted(true);
    } catch (error) {
      console.error('Lỗi khi preload lessons:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  // Get all vocabulary lessons for a level
  const getAllVocabLessons = async (level) => {
    let allLessons = [];
    let pageNumber = 1;

    while (true) {
      try {
        const response = await vocabularyService.getLessons({ level, lessonNumber: pageNumber });

        if (!response || response.length === 0) {
          break;
        }

        const formattedLessons = {
          title: `Bài ${pageNumber}`,
          image: 'https://newwindows.edu.vn/wp-content/uploads/2023/09/5-3-1024x1024.png',
          grammars: response || [],
          lessonNumber: pageNumber,
          wordsCount: response.length,
        };

        allLessons.push(formattedLessons);
        pageNumber++;
      } catch (error) {
        console.error(`Lỗi khi lấy vocab lesson ${pageNumber} cho ${level}:`, error);
        break;
      }
    }

    return allLessons;
  };

  // Get all kanji lessons for a level
  const getAllKanjiLessons = async (level) => {
    let allLessons = [];
    let pageNumber = 1;

    while (true) {
      try {
        const response = await vocabularyService.getLessons({ level, lessonNumber: pageNumber });

        if (!response || response.length === 0) {
          break;
        }

        const formattedLessons = {
          title: `Bài ${pageNumber}`,
          image: 'https://saigontimestravel.com/wp-content/uploads/2024/01/du-lich-nhat-ban-thang-5-1.jpg',
          vocabularies: response || [],
          lessonNumber: pageNumber,
          kanjiCount: response.length,
        };

        allLessons.push(formattedLessons);
        pageNumber++;
      } catch (error) {
        console.error(`Lỗi khi lấy kanji lesson ${pageNumber} cho ${level}:`, error);
        break;
      }
    }

    return allLessons;
  };

  // Get all grammar lessons for a level
  const getAllGrammarLessons = async (level) => {
    let allLessons = [];
    let pageNumber = 1;

    while (true) {
      try {
        const response = await grammarService.getLessons({ level, lessonNumber: pageNumber });

        if (!response || response.length === 0) {
          break;
        }

        const formattedLessons = {
          title: `Bài ${pageNumber}`,
          image: 'https://honya.vn/uploads/images/aio/__thumbs/7-3.jpg/7-3__600x600.jpg',
          grammars: response || [],
          lessonNumber: pageNumber,
          grammarCount: response.length,
        };

        allLessons.push(formattedLessons);
        pageNumber++;
      } catch (error) {
        console.error(`Lỗi khi lấy grammar lesson ${pageNumber} cho ${level}:`, error);
        break;
      }
    }

    return allLessons;
  };

  // Get cached lessons
  const getVocabLessons = (level) => {
    return vocabLessons[level] || [];
  };

  const getKanjiLessons = (level) => {
    return kanjiLessons[level] || [];
  };

  const getGrammarLessons = (level) => {
    return grammarLessons[level] || [];
  };

  // Refresh specific level data
  const refreshLevelData = async (level) => {
    setIsPreloading(true);
    try {
      const vocabData = await getAllVocabLessons(level);
      setVocabLessons(prev => ({ ...prev, [level]: vocabData }));
      
      const kanjiData = await getAllKanjiLessons(level);
      setKanjiLessons(prev => ({ ...prev, [level]: kanjiData }));
      
      const grammarData = await getAllGrammarLessons(level);
      setGrammarLessons(prev => ({ ...prev, [level]: grammarData }));
    } catch (error) {
      console.error('Lỗi khi refresh data:', error);
    } finally {
      setIsPreloading(false);
    }
  };

  // Preload khi component mount
  useEffect(() => {
    preloadAllLessons();
  }, []);

  const value = {
    // Data
    vocabLessons,
    kanjiLessons,  
    grammarLessons,
    
    // States
    isPreloading,
    preloadCompleted,
    
    // Methods
    getVocabLessons,
    getKanjiLessons,
    getGrammarLessons,
    refreshLevelData,
    preloadAllLessons,
  };

  return (
    <FreeDocumentContext.Provider value={value}>
      {children}
    </FreeDocumentContext.Provider>
  );
};

export default FreeDocumentContext; 