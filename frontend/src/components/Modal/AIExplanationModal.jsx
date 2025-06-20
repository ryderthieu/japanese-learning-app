import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAIExplanation } from '../../context/AIExplanationContext';
import aiService from '../../api/aiService';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// const explain = `1. Ý nghĩa và cách sử dụng:
// \"Động từ thể từ điển + 間に\" được sử dụng để diễn đạt hành động xảy ra trong khoảng thời gian giữa hai sự kiện hoặc thời điểm cụ thể. Ngữ pháp này thường được dùng để chỉ ra thời gian hoặc khoảng thời gian mà hành động xảy ra.

// 2. Cấu trúc ngữ pháp:
// [Động từ thể từ điển] + 間に

// 3. Ví dụ minh họa:
// - 昼ご飯を食べている間に、友達から電話がかかってきた。
// (Khi đang ăn trưa, bạn bè gọi điện thoại.)
// - 日本に留学している間に、日本語が上達しました。
// (Trong thời gian du học ở Nhật, tiếng Nhật của tôi đã tiến triển.)
// - 映画を見ている間に、眠ってしまった。
// (Trong lúc đang xem phim, tôi đã ngủ gục.)

// 4. Lưu ý về cách sử dụng:
// Ngữ pháp này có thể được sử dụng trong cả văn viết và văn nói. Nó mang tính chất chính xác về thời gian và thường dùng trong các tình huống mô tả hành động xảy ra trong một khoảng thời gian cụ thể.

// 5. Ngữ pháp tương tự hoặc cần phân biệt:
// Một ngữ pháp tương tự là \"間をおいて\", được sử dụng để mô tả việc có một khoảng thời gian giữa hai hành động hoặc sự kiện. Tuy nhiên, \"間に\" thường chỉ ra thời gian hành động xảy ra, trong khi \"間をおいて\" thường chỉ ra sự chênh lệch thời gian giữa hai hành động.`
export const AIExplanationModal = () => {
    const { 
        isModalVisible, 
        isLoading, 
        explanation, 
        currentItem, 
        explanationType,
        hideExplanation,
        setIsLoading,
        setExplanation
    } = useAIExplanation();

    console.log('🔄 AIExplanationModal render:', { isModalVisible, currentItem, explanationType });

    useEffect(() => {
        if (isModalVisible && currentItem && explanationType) {
            fetchExplanation();
        }
    }, [isModalVisible, currentItem, explanationType]);

    const fetchExplanation = async () => {
        if (!currentItem) return;

        setIsLoading(true);
        setExplanation('');
        try {
            let result;
            
            if (explanationType === 'vocabulary') {
                const word = currentItem.kanji || currentItem.word;
                result = await aiService.explainVocabulary(word, currentItem.level || 'N5');
            } else if (explanationType === 'grammar') {
                result = await aiService.explainGrammar(currentItem.rule, currentItem.level || 'N5');
            } else if (explanationType === 'question') {
                // Sử dụng explainAnswer để giải thích câu hỏi JLPT một cách chuyên nghiệp
                const correctOption = currentItem.options?.find(opt => opt.isCorrect);
                
                const questionData = {
                    questionText: currentItem.questionText,
                    options: currentItem.options,
                    correctAnswer: correctOption?.text || 'Không xác định',
                    userAnswer: null, // Có thể thêm sau nếu cần
                    type: currentItem.section || currentItem.type,
                    level: currentItem.level || 'N5',
                    section: currentItem.section || currentItem.type
                };
                
                result = await aiService.explainAnswer(questionData);
            }

            if (result?.success) {
                setExplanation(result.data?.explanation || result.data?.answer || 'Không có giải thích chi tiết.');
            } else {
                setExplanation('Có lỗi xảy ra khi lấy giải thích. Vui lòng thử lại.');
            }
        } catch (error) {
            setExplanation('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
        } finally {
            setIsLoading(false);
        }
    };

    const getItemTitle = () => {
        if (!currentItem) return '';
        
        if (explanationType === 'vocabulary') {
            return currentItem.kanji || currentItem.word || 'Từ vựng';
        } else if (explanationType === 'grammar') {
            return currentItem.rule || 'Ngữ pháp';
        } else if (explanationType === 'question') {
            return `Câu hỏi ${currentItem.questionNumber || ''}`;
        }
        return '';
    };

    const getItemSubtitle = () => {
        if (!currentItem) return '';
        
        if (explanationType === 'vocabulary') {
            return currentItem.meaning || '';
        } else if (explanationType === 'grammar') {
            return currentItem.meaning || '';
        } else if (explanationType === 'question') {
            const sectionNames = {
                'moji_goi': '文字・語彙 (Từ vựng)',
                'bunpou': '文法 (Ngữ pháp)', 
                'dokkai': '読解 (Đọc hiểu)',
                'choukai': '聴解 (Nghe hiểu)'
            };
            return sectionNames[currentItem.section || currentItem.type] || 'Câu hỏi JLPT';
        }
        return '';
    };

    const getSectionName = (section) => {
        const sectionNames = {
            'moji_goi': '文字・語彙 (Từ vựng)',
            'bunpou': '文法 (Ngữ pháp)', 
            'dokkai': '読解 (Đọc hiểu)',
            'choukai': '聴解 (Nghe hiểu)'
        };
        return sectionNames[section] || 'Câu hỏi JLPT';
    };

    const formatExplanation = (text) => {
        if (!text) return '';
        
        // Tách các phần theo số thứ tự
        const sections = text.split(/(\d+\.\s)/).filter(Boolean);
        const formattedSections = [];
        
        for (let i = 0; i < sections.length; i += 2) {
            if (sections[i] && sections[i + 1]) {
                const number = sections[i];
                const content = sections[i + 1];
                formattedSections.push({ number, content });
            }
        }
        
        return formattedSections.length > 0 ? formattedSections : [{ number: '', content: text }];
    };

    const formatVocabularyExplanation = (text) => {
        if (!text) return [];
        
        const lines = text.split('\n').filter(line => line.trim());
        const sections = [];
        let currentSection = null;
        
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            
            if (trimmedLine.match(/^\d+\./)) {
                // Dòng bắt đầu bằng số (1., 2., 3., ...)
                const match = trimmedLine.match(/^(\d+\.\s*)(.+)$/);
                if (match) {
                    const number = match[1];
                    const content = match[2];
                    
                    // Lưu section trước đó nếu có
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    
                    // Tạo section mới
                    currentSection = {
                        number: number.trim(),
                        content: content,
                        type: 'main'
                    };
                }
            } else if (trimmedLine.startsWith('-') && currentSection) {
                // Ví dụ thuộc về section hiện tại
                const exampleContent = trimmedLine.substring(1).trim();
                
                // Nếu là section "Ví dụ câu sử dụng" (section số 3)
                if (currentSection.number === '3.') {
                    // Xử lý format đặc biệt cho ví dụ
                    const nextLine = lines[index + 1]?.trim();
                    const lineAfterNext = lines[index + 2]?.trim();
                    
                    // Kiểm tra nếu có đủ 3 dòng: câu Nhật, romaji, nghĩa
                    if (nextLine && lineAfterNext && 
                        nextLine.startsWith('-') && 
                        lineAfterNext.startsWith('-')) {
                        
                        const japaneseSentence = exampleContent;
                        const romaji = nextLine.substring(1).trim();
                        const vietnamese = lineAfterNext.substring(1).trim();
                        
                        // Format: Câu Nhật (Romaji)\nNghĩa tiếng Việt
                        const formattedExample = `${japaneseSentence} (${romaji})\n${vietnamese}`;
                        
                        if (currentSection.content === currentSection.content.match(/^.+$/)?.[0]) {
                            // Nếu chưa có ví dụ nào, thay thế content
                            currentSection.content = formattedExample;
                        } else {
                            // Nếu đã có ví dụ, thêm với khoảng cách
                            currentSection.content += '\n\n' + formattedExample;
                        }
                        
                        // Bỏ qua 2 dòng tiếp theo vì đã xử lý
                        lines.splice(index + 1, 2);
                    }
                } else {
                    // Các section khác thì nối bình thường
                    currentSection.content += '\n• ' + exampleContent;
                }
            } else if (trimmedLine && !trimmedLine.match(/^\d+\./) && currentSection && !trimmedLine.startsWith('-')) {
                // Nội dung bổ sung - nối vào section hiện tại (chỉ khi không phải dấu -)
                currentSection.content += '\n' + trimmedLine;
            }
        });
        
        // Thêm section cuối cùng
        if (currentSection) {
            sections.push(currentSection);
        }
        
        return sections;
    };

    const highlightKanjiWithHanViet = (text) => {
        // Regex để tìm pattern: Kanji (PHIÊN_ÂM_HÁN_VIỆT)
        const kanjiPattern = /([一-龯]+)\s*\(([A-ZÁÀẠẢÃĂẰẮẶẲẴÂẦẤẬẨẪĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ\s]+)\)/g;
        
        return text.replace(kanjiPattern, (match, kanji, hanviet) => {
            return `<span style="font-weight: bold; color: #FF4081;">${kanji}</span> <span style="color: #3B82F6; font-size: 0.9em;">(${hanviet})</span>`;
        });
    };

    const parseTextWithKanji = (text) => {
        // Tách text thành các phần: text thường, Kanji, và Hán Việt
        const kanjiPattern = /([一-龯]+)\s*\(([A-ZÁÀẠẢÃĂẰẮẶẲẴÂẦẤẬẨẪĐÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸ\s]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        
        let match;
        while ((match = kanjiPattern.exec(text)) !== null) {
            // Thêm text trước match
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.substring(lastIndex, match.index)
                });
            }
            
            // Thêm Kanji
            parts.push({
                type: 'kanji',
                content: match[1]
            });
            
            // Thêm Hán Việt
            parts.push({
                type: 'hanviet',
                content: `(${match[2]})`
            });
            
            lastIndex = match.index + match[0].length;
        }
        
        // Thêm phần còn lại
        if (lastIndex < text.length) {
            parts.push({
                type: 'text',
                content: text.substring(lastIndex)
            });
        }
        
        return parts;
    };

    const RichText = ({ children, style }) => {
        const textParts = parseTextWithKanji(children);
        
        return (
            <Text style={style}>
                {textParts.map((part, index) => {
                    if (part.type === 'kanji') {
                        return (
                            <Text key={index} style={{ fontWeight: 'bold', color: '#F472B6' }}>
                                {part.content}
                            </Text>
                        );
                    } else if (part.type === 'hanviet') {
                        return (
                            <Text key={index} style={{ color: '#3B82F6', fontSize: 13 }}>
                                {part.content}
                            </Text>
                        );
                    } else {
                        return part.content;
                    }
                })}
            </Text>
        );
    };

    const formatGrammarExplanation = (text) => {
        if (!text) return [];
        
        const lines = text.split('\n').filter(line => line.trim());
        const sections = [];
        let currentSection = null;
        
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            
            if (trimmedLine.match(/^\d+\./)) {
                // Dòng bắt đầu bằng số (1., 2., 3., ...)
                const match = trimmedLine.match(/^(\d+\.\s*)(.+)$/);
                if (match) {
                    const number = match[1];
                    const content = match[2];
                    
                    // Lưu section trước đó nếu có
                    if (currentSection) {
                        sections.push(currentSection);
                    }
                    
                    // Tạo section mới
                    currentSection = {
                        number: number.trim(),
                        content: content,
                        type: 'main'
                    };
                }
            } else if (trimmedLine.startsWith('-') && currentSection) {
                // Ví dụ thuộc về section hiện tại
                const exampleContent = trimmedLine.substring(1).trim();
                
                // Nếu là section "Ví dụ minh họa" (section số 3)
                if (currentSection.number === '3.') {
                    // Xử lý format đặc biệt cho ví dụ ngữ pháp
                    const nextLine = lines[index + 1]?.trim();
                    
                    // Kiểm tra nếu dòng tiếp theo không phải là ví dụ (không có dấu -)
                    if (nextLine && !nextLine.startsWith('-')) {
                        // Format: Câu Nhật\nNghĩa tiếng Việt
                        const formattedExample = `${exampleContent}\n${nextLine}`;
                        
                        if (currentSection.content === currentSection.content.match(/^.+$/)?.[0]) {
                            // Nếu chưa có ví dụ nào, thay thế content
                            currentSection.content = formattedExample;
                        } else {
                            // Nếu đã có ví dụ, thêm với khoảng cách
                            currentSection.content += '\n\n' + formattedExample;
                        }
                        
                        // Bỏ qua dòng tiếp theo vì đã xử lý
                        lines.splice(index + 1, 1);
                    } else {
                        // Nếu không có nghĩa ở dòng tiếp theo, chỉ thêm câu ví dụ
                        if (currentSection.content === currentSection.content.match(/^.+$/)?.[0]) {
                            currentSection.content = exampleContent;
                        } else {
                            currentSection.content += '\n\n' + exampleContent;
                        }
                    }
                } else {
                    // Các section khác thì nối bình thường
                    currentSection.content += '\n• ' + exampleContent;
                }
            } else if (trimmedLine && !trimmedLine.match(/^\d+\./) && currentSection && !trimmedLine.startsWith('-')) {
                // Nội dung bổ sung - nối vào section hiện tại (chỉ khi không phải dấu -)
                currentSection.content += '\n' + trimmedLine;
            }
        });
        
        // Thêm section cuối cùng
        if (currentSection) {
            sections.push(currentSection);
        }
        
        return sections;
    };

    const getGrammarSectionTitle = (number) => {
        const sectionTitles = {
            '1.': 'Ý nghĩa và cách sử dụng',
            '2.': 'Cấu trúc ngữ pháp', 
            '3.': 'Ví dụ minh họa',
            '4.': 'Lưu ý về cách sử dụng',
            '5.': 'Ngữ pháp tương tự hoặc cần phân biệt'
        };
        return sectionTitles[number] || 'Nội dung';
    };

    const formatQuestionExplanation = (text) => {
        if (!text) return [];
        
        const lines = text.split('\n').filter(line => line.trim());
        const sections = [];
        let currentSection = null;
        
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            
            // Tìm section header với format: 1. **Title** hoặc **số. Title**
            const headerMatch = trimmedLine.match(/^(\d+\.|\*\*\d+\.)\s*\*\*(.*?)\*\*/) || 
                               trimmedLine.match(/^(\d+\.)\s*(.+)$/);
            
            if (headerMatch) {
                // Lưu section trước đó nếu có
                if (currentSection) {
                    sections.push(currentSection);
                }
                
                const number = headerMatch[1].replace(/\*/g, '').trim();
                const title = headerMatch[2] || headerMatch[1];
                
                // Tạo section mới
                currentSection = {
                    number: number,
                    title: title.replace(/\*/g, '').trim(),
                    content: '',
                    type: 'main'
                };
            } else if (trimmedLine.startsWith('-') && currentSection) {
                // Bullet point thuộc về section hiện tại
                const bulletContent = trimmedLine.substring(1).trim();
                if (currentSection.content) {
                    currentSection.content += '\n• ' + bulletContent;
                } else {
                    currentSection.content = '• ' + bulletContent;
                }
            } else if (trimmedLine && !trimmedLine.match(/^\*\*/) && currentSection) {
                // Nội dung bổ sung - nối vào section hiện tại
                if (currentSection.content) {
                    currentSection.content += '\n' + trimmedLine;
                } else {
                    currentSection.content = trimmedLine;
                }
            }
        });
        
        // Thêm section cuối cùng
        if (currentSection) {
            sections.push(currentSection);
        }
        
        return sections;
    };

    const getQuestionSectionTitle = (number, originalTitle) => {
        // Nếu có title gốc từ AI, sử dụng nó
        if (originalTitle) {
            return originalTitle;
        }
        
        // Fallback titles
        const sectionTitles = {
            '1.': 'Phân tích câu hỏi',
            '2.': 'Giải thích từng lựa chọn', 
            '3.': 'Tại sao đáp án này đúng?',
            '4.': 'Kiến thức cần nhớ',
            '5.': 'Mẹo làm bài'
        };
        return sectionTitles[number] || 'Nội dung';
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={{
                    alignItems: 'center',
                    paddingVertical: 60
                }}>
                    <ActivityIndicator size="large" color="#F472B6" />
                    <Text style={{
                        color: '#6B7280',
                        marginTop: 20,
                        textAlign: 'center',
                        fontSize: 16
                    }}>
                        AI đang phân tích và tạo giải thích chi tiết...
                    </Text>
                </View>
            );
        }

        if (!explanation) {
            return (
                <View style={{
                    alignItems: 'center',
                    paddingVertical: 60
                }}>
                    <Icon name="help-circle-outline" size={64} color="#9CA3AF" />
                    <Text style={{
                        color: '#6B7280',
                        marginTop: 20,
                        textAlign: 'center',
                        fontSize: 16
                    }}>
                        Chưa có giải thích
                    </Text>
                    <Text style={{
                        color: '#9CA3AF',
                        marginTop: 10,
                        textAlign: 'center',
                        fontSize: 14
                    }}>
                        Vui lòng thử lại sau
                    </Text>
                </View>
            );
        }

        const sections = explanationType === 'vocabulary' 
            ? formatVocabularyExplanation(explanation)
            : explanationType === 'grammar'
                ? formatGrammarExplanation(explanation)
                : formatQuestionExplanation(explanation);

        return (
            <View>
                {/* Header */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 20,
                    padding: 15,
                    backgroundColor: '#FDF2F8',
                    borderRadius: 12,
                    borderLeftWidth: 4,
                    borderLeftColor: '#F472B6'
                }}>
                    <Icon name="sparkles" size={22} color="#F472B6" />
                    <Text style={{
                        fontSize: 20,
                        fontWeight: '600',
                        color: '#1F2937',
                        marginLeft: 10
                    }}>
                        {explanationType === 'vocabulary' ? 'Giải thích từ vựng' : explanationType === 'grammar' ? 'Giải thích ngữ pháp' : 'Giải thích câu hỏi'}
                    </Text>
                </View>
                
                {/* Content Sections */}
                {sections.length > 0 ? sections.map((section, index) => (
                    <View key={index} style={{
                        marginBottom: section.type === 'example' ? 10 : 20,
                        padding: section.type === 'example' ? 12 : 16,
                        backgroundColor: section.type === 'example' ? '#F0F9FF' : 'white',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: section.type === 'example' ? '#3B82F6' : '#E5E7EB',
                        borderLeftWidth: section.type === 'example' ? 4 : 1,
                        borderLeftColor: section.type === 'example' ? '#3B82F6' : '#F472B6',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2
                    }}>
                        {section.number && (
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 12
                            }}>
                                <View style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    backgroundColor: section.type === 'example' ? '#3B82F6' : '#F472B6',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 8
                                }}>
                                    <Text style={{
                                        color: 'white',
                                        fontSize: 12,
                                        fontWeight: 'bold'
                                    }}>
                                        {section.number.replace('.', '').trim()}
                                    </Text>
                                </View>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: section.type === 'example' ? '#1E40AF' : '#F472B6',
                                    flex: 1
                                }}>
                                    {explanationType === 'vocabulary' ? getVocabSectionTitle(section.number) : 
                                     explanationType === 'grammar' ? getGrammarSectionTitle(section.number) : 
                                     getQuestionSectionTitle(section.number, section.title)}
                                </Text>
                            </View>
                        )}
                        <RichText style={{
                            color: section.type === 'example' ? '#1E40AF' : '#374151',
                            lineHeight: 24,
                            fontSize: section.type === 'example' ? 14 : 15,
                            textAlign: 'justify',
                            fontStyle: section.type === 'example' ? 'italic' : 'normal'
                        }}>
                            {section.content.trim()}
                        </RichText>
                    </View>
                )) : (
                    // Fallback nếu không parse được sections, hiển thị text thô
                    <View style={{
                        padding: 16,
                        backgroundColor: 'white',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                        marginBottom: 20
                    }}>
                        <RichText style={{
                            color: '#374151',
                            lineHeight: 24,
                            fontSize: 15,
                            textAlign: 'justify'
                        }}>
                            {explanation}
                        </RichText>
                    </View>
                )}
                
                {/* Footer */}
                <View style={{
                    marginTop: 20,
                    padding: 15,
                    backgroundColor: '#FDF2F8',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#F472B6'
                }}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Icon name="information-circle" size={20} color="#F472B6" />
                        <Text style={{
                            fontSize: 14,
                            color: '#EC4899',
                            marginLeft: 8,
                            fontWeight: '500'
                        }}>
                            Giải thích được tạo bởi AI và có thể cần xác minh thêm
                        </Text>
                    </View>
                </View>
                
                <View style={{ height: 20 }} />
            </View>
        );
    };

    const getVocabSectionTitle = (number) => {
        const sectionTitles = {
            '1.': 'Từ vựng và nghĩa',
            '2.': 'Cách đọc', 
            '3.': 'Ví dụ câu sử dụng',
            '4.': 'Từ liên quan',
            '5.': 'Lưu ý sử dụng'
        };
        return sectionTitles[number] || 'Thông tin';
    };

    console.log('🎭 Modal visibility check:', isModalVisible);

    if (isModalVisible) {
        console.log('📱 Rendering AI Explanation Modal');
        return (
            <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                zIndex: 99999,
                elevation: 99999,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
            }}>
                {/* Backdrop để đóng modal */}
                <TouchableOpacity 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}
                    onPress={() => {
                        console.log('🎯 Backdrop pressed');
                        hideExplanation();
                    }}
                    activeOpacity={1}
                />

                <View style={{
                    width: '100%',
                    height: '90%',
                    maxWidth: 450,
                    backgroundColor: 'white',
                    borderRadius: 16,
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 10
                }}>
                    {/* Header */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 20,
                        backgroundColor: '#F472B6',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E5E7EB'
                    }}>
                        <View style={{ flex: 1, paddingRight: 10 }}>
                            <Text style={{
                                fontSize: 22,
                                fontWeight: 'bold',
                                color: 'white'
                            }}>{getItemTitle()}</Text>
                            {getItemSubtitle() && (
                                <Text style={{
                                    fontSize: 16,
                                    color: 'rgba(255,255,255,0.9)',
                                    marginTop: 4
                                }}>{getItemSubtitle()}</Text>
                            )}
                        </View>
                        <TouchableOpacity 
                            onPress={() => {
                                console.log('❌ Close button pressed');
                                hideExplanation();
                            }}
                            style={{
                                padding: 8,
                                borderRadius: 20,
                                backgroundColor: 'rgba(255,255,255,0.2)'
                            }}
                        >
                            <Icon name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <ScrollView 
                        style={{ flex: 1 }}
                        contentContainerStyle={{ padding: 20 }}
                        showsVerticalScrollIndicator={true}
                        bounces={true}
                    >
                        {renderContent()}
                    </ScrollView>
                </View>
            </View>
        );
    }

    return null;

    // Original Modal Code (commented out for testing)
    /*
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                console.log('🚪 Modal onRequestClose called');
                hideExplanation();
            }}
            presentationStyle="overFullScreen"
        >
            <View style={styles.overlay}>
                <View style={styles.backdrop}>
                    <TouchableOpacity 
                        style={styles.backdropTouchable}
                        onPress={() => {
                            console.log('🎯 Backdrop pressed');
                            hideExplanation();
                        }}
                        activeOpacity={1}
                    />
                </View>
                
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <View style={styles.headerContent}>
                            <Text style={styles.title}>{getItemTitle()}</Text>
                            {getItemSubtitle() && (
                                <Text style={styles.subtitle}>{getItemSubtitle()}</Text>
                            )}
                        </View>
                        <TouchableOpacity 
                            onPress={() => {
                                console.log('❌ Close button pressed');
                                hideExplanation();
                            }}
                            style={styles.closeButton}
                        >
                            <Icon name="close" size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={true}
                    >
                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#F472B6" />
                                <Text style={styles.loadingText}>
                                    AI đang phân tích và tạo giải thích chi tiết...
                                </Text>
                            </View>
                        ) : explanation ? (
                            <View>
                                <View style={styles.explanationHeader}>
                                    <Icon name="sparkles" size={22} color="#FF4081" />
                                    <Text style={styles.explanationTitle}>
                                        Giải thích từ AI
                                    </Text>
                                </View>
                                
                                {formatExplanation(explanation).map((section, index) => (
                                    <View key={index} style={styles.section}>
                                        {section.number && (
                                            <Text style={styles.sectionNumber}>
                                                {section.number.trim()}
                                            </Text>
                                        )}
                                        <Text style={styles.sectionContent}>
                                            {section.content.trim()}
                                        </Text>
                                    </View>
                                ))}
                                
                                <View style={{ height: 20 }} />
                            </View>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Icon name="help-circle-outline" size={64} color="#9CA3AF" />
                                <Text style={styles.emptyText}>
                                    Chưa có giải thích
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
    */
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 9999,
        elevation: 9999,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    backdropTouchable: {
        flex: 1,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 450,
        maxHeight: '90%',
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        zIndex: 2,
        borderWidth: 3,
        borderColor: 'blue',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: 'white',
    },
    headerContent: {
        flex: 1,
        paddingRight: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 6,
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    scrollView: {
        maxHeight: screenHeight * 0.6,
    },
    scrollContent: {
        padding: 20,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        color: '#6B7280',
        marginTop: 20,
        textAlign: 'center',
        fontSize: 16,
    },
    explanationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    explanationTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1F2937',
        marginLeft: 10,
    },
    section: {
        marginBottom: 25,
    },
    sectionNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF4081',
        marginBottom: 10,
    },
    sectionContent: {
        color: '#374151',
        lineHeight: 28,
        fontSize: 16,
        textAlign: 'justify',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        color: '#6B7280',
        marginTop: 20,
        textAlign: 'center',
        fontSize: 16,
    },
}); 