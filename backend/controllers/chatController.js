const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Hàm giải thích từ vựng tiếng Nhật
const explainVocabulary = async (req, res) => {
    try {
        const { word, context } = req.body;
        
        if (!word) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp từ vựng cần giải thích'
            });
        }

        const prompt = `Bạn là một giáo viên tiếng Nhật chuyên nghiệp. Hãy giải thích từ vựng "${word}" bằng tiếng Việt theo ĐÚNG CHÍNH XÁC format sau:

1. [Từ kanji (PHIÊN ÂM HÁN VIỆT)] nghĩa là [nghĩa tiếng Việt]

2. [hiragana/katakana] ([romaji])

3. Ví dụ câu sử dụng:
   - [Câu tiếng Nhật thuần túy KHÔNG có phiên âm Hán Việt]
   - [Romaji đầy đủ]
   - [Bản dịch tiếng Việt]
   
   - [Câu thứ 2 tiếng Nhật thuần túy KHÔNG có phiên âm Hán Việt]
   - [Romaji đầy đủ]  
   - [Bản dịch tiếng Việt]

4. Từ đồng nghĩa / liên quan:
   - [từ 1 (PHIÊN ÂM HÁN VIỆT)] nghĩa là [nghĩa]
   - [từ 2 (PHIÊN ÂM HÁN VIỆT)] nghĩa là [nghĩa]

5. Lưu ý khi sử dụng: [Tính trang trọng, tình huống sử dụng]

**VÍ DỤ CHUẨN BẮT BUỘC TUÂN THEO:**

1. 川 (XUYÊN) nghĩa là sông

2. かわ (kawa)

3. Ví dụ câu sử dụng:
   - 川を渡って、学校に行きます
   - Kawa o watatte, gakkou ni ikimasu
   - Tôi sẽ qua sông để đến trường
   
   - 川岸でピクニックを楽しんだ
   - Kawagishi de pikunikku o tanoshinda
   - Chúng tôi đã thưởng thức picnic ở bờ sông

4. Từ đồng nghĩa / liên quan:
   - 河 (HÀ) nghĩa là sông
   - 川岸 (XUYÊN NGẠN) nghĩa là bờ sông

5. Lưu ý khi sử dụng: Từ thông dụng trong cả văn viết và hội thoại hàng ngày

**CỰC KỲ QUAN TRỌNG:**
- BẮT BUỘC có số thứ tự 1. 2. 3. 4. 5.
- BẮT BUỘC viết "nghĩa là" sau mỗi từ có kanji (trừ trong ví dụ câu mục 3)
- BẮT BUỘC có phiên âm Hán Việt VIẾT HOA trong () cho kanji (CHỈ ở mục 1 và 4, KHÔNG ở mục 3)
- BẮT BUỘC theo ĐÚNG CHÍNH XÁC format trên
- KHÔNG được thay đổi cấu trúc dù là từ nào
- MỤC 3 (ví dụ câu): CHỈ viết câu tiếng Nhật thuần túy, KHÔNG thêm phiên âm Hán Việt

${context ? `Ngữ cảnh: ${context}` : ''}

Hãy trả lời theo ĐÚNG CHÍNH XÁC format trên, KHÔNG được sai lệch!`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.7,
        });

        const explanation = completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            data: {
                word: word,
                explanation: explanation,
                context: context || null
            }
        });

    } catch (error) {
        console.error('Lỗi khi gọi ChatGPT API:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xử lý yêu cầu',
            error: error.message
        });
    }
};

// Hàm giải thích ngữ pháp tiếng Nhật
const explainGrammar = async (req, res) => {
    try {
        const { grammar, example } = req.body;
        
        if (!grammar) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp ngữ pháp cần giải thích'
            });
        }

        const prompt = `Bạn là một giáo viên tiếng Nhật chuyên nghiệp. Hãy giải thích ngữ pháp tiếng Nhật "${grammar}" một cách chi tiết và dễ hiểu bằng tiếng Việt. Bao gồm:

1. Ý nghĩa và cách sử dụng
2. Cấu trúc ngữ pháp
3. Ví dụ minh họa (ít nhất 3 câu với bản dịch tiếng Việt)
4. Lưu ý về cách sử dụng (formal/informal, tình huống sử dụng)
5. Ngữ pháp tương tự hoặc cần phân biệt (nếu có)

${example ? `Ví dụ tham khảo: ${example}` : ''}

Hãy trả lời một cách ngắn gọn nhưng đầy đủ thông tin.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1200,
            temperature: 0.7,
        });

        const explanation = completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            data: {
                grammar: grammar,
                explanation: explanation,
                example: example || null
            }
        });

    } catch (error) {
        console.error('Lỗi khi gọi ChatGPT API:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xử lý yêu cầu',
            error: error.message
        });
    }
};

// Hàm hỏi đáp tổng quát về tiếng Nhật
const askQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp câu hỏi'
            });
        }

        const prompt = `Bạn là một giáo viên tiếng Nhật chuyên nghiệp và thân thiện. Hãy trả lời câu hỏi sau đây về tiếng Nhật bằng tiếng Việt một cách chi tiết và dễ hiểu:

"${question}"

Nếu câu hỏi liên quan đến:
- Từ vựng: Hãy cung cấp nghĩa, cách đọc, ví dụ sử dụng
- Ngữ pháp: Hãy giải thích cấu trúc, cách dùng, ví dụ minh họa
- Văn hóa Nhật: Hãy chia sẻ thông tin hữu ích và thú vị
- Học tập: Hãy đưa ra lời khuyên và phương pháp học hiệu quả

Trả lời một cách ngắn gọn nhưng đầy đủ thông tin.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.8,
        });

        const answer = completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            data: {
                question: question,
                answer: answer
            }
        });

    } catch (error) {
        console.error('Lỗi khi gọi ChatGPT API:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xử lý yêu cầu',
            error: error.message
        });
    }
};

// Hàm tạo câu ví dụ với từ vựng
const generateExamples = async (req, res) => {
    try {
        const { word, level } = req.body;
        
        if (!word) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp từ vựng'
            });
        }

        const levelText = level ? `cấp độ ${level}` : 'phù hợp với người học';

        const prompt = `Hãy tạo 5 câu ví dụ sử dụng từ vựng tiếng Nhật "${word}" với mức độ ${levelText}. Mỗi câu ví dụ cần bao gồm:

1. Câu tiếng Nhật (có kanji và hiragana)
2. Bản dịch tiếng Việt
3. Ghi chú ngắn về ngữ cảnh sử dụng (nếu cần)

Các câu ví dụ nên đa dạng về tình huống sử dụng (hội thoại hàng ngày, công việc, học tập, v.v.)`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.8,
        });

        const examples = completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            data: {
                word: word,
                level: level || 'chung',
                examples: examples
            }
        });

    } catch (error) {
        console.error('Lỗi khi gọi ChatGPT API:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xử lý yêu cầu',
            error: error.message
        });
    }
};

// Hàm giải thích đáp án câu hỏi
const explainAnswer = async (req, res) => {
    try {
        const { 
            questionText, 
            options, 
            correctAnswer, 
            userAnswer, 
            questionType,
            level,
            section 
        } = req.body;
        
        if (!questionText || !options || !correctAnswer) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp đầy đủ thông tin câu hỏi, lựa chọn và đáp án đúng'
            });
        }

        // Tạo chuỗi options để hiển thị
        const optionsText = options.map((opt, index) => 
            `${index + 1}. ${opt.text} ${opt.isCorrect ? '(Đáp án đúng)' : ''}`
        ).join('\n');

        // Xác định loại câu hỏi để tùy chỉnh prompt
        const getQuestionTypeDescription = (type, section) => {
            const typeMap = {
                'kanji-hiragana': 'đọc kanji',
                'hiragana-kanji': 'viết kanji',
                'vocabulary': 'từ vựng',
                'grammar-selection': 'chọn ngữ pháp đúng',
                'sentence-combination': 'sắp xếp câu',
                'context-grammar': 'từ vựng trong ngữ cảnh',
                'synonyms': 'từ đồng nghĩa',
                'usage': 'cách sử dụng từ',
                'short-reading': 'đọc hiểu ngắn',
                'medium-reading': 'đọc hiểu trung bình',
                'long-reading': 'đọc hiểu dài',
                'listening': 'nghe hiểu'
            };
            return typeMap[type] || 'câu hỏi tiếng Nhật';
        };

        const questionTypeDesc = getQuestionTypeDescription(questionType, section);

        // Thêm function getSectionName trước khi sử dụng
        const getSectionName = (section) => {
            const sectionNames = {
                'moji_goi': '文字・語彙 (Từ vựng)',
                'bunpou': '文法 (Ngữ pháp)', 
                'dokkai': '読解 (Đọc hiểu)',
                'choukai': '聴解 (Nghe hiểu)',
                'context-grammar': '文法 (Ngữ pháp)',
                'vocabulary': '語彙 (Từ vựng)',
                'grammar': '文法 (Ngữ pháp)',
                'reading': '読解 (Đọc hiểu)',
                'listening': '聴解 (Nghe hiểu)'
            };
            return sectionNames[section] || 'JLPT';
        };

        const prompt = `Bạn là một giáo viên tiếng Nhật chuyên nghiệp với nhiều năm kinh nghiệm luyện thi JLPT. Hãy giải thích câu hỏi ${questionTypeDesc} cấp độ ${level || 'JLPT'} sau đây bằng tiếng Việt theo ĐÚNG CHÍNH XÁC format yêu cầu:

**CÂU HỎI JLPT ${level || 'N5'} - ${getSectionName(section)}:**
${questionText}

**CÁC LỰA CHỌN:**
${optionsText}

**ĐÁP ÁN ĐÚNG:** ${correctAnswer}
${userAnswer && userAnswer !== correctAnswer ? `**BẠN ĐÃ CHỌN:** ${userAnswer} (Sai)` : ''}

Hãy giải thích theo ĐÚNG CHÍNH XÁC format sau và KHÔNG ĐƯỢC thay đổi:

1. Phân tích câu hỏi:
[Phân tích câu hỏi và yêu cầu của đề bài - giải thích ngắn gọn câu hỏi đang hỏi gì]

2. Giải thích từng lựa chọn:
[Giải thích từng đáp án A, B, C, D - tại sao đúng hay sai]

3. Tại sao đáp án này đúng?:
[Lý do cụ thể tại sao đáp án được chọn là chính xác nhất]

4. Kiến thức cần nhớ:
[Ngữ pháp, từ vựng, quy tắc quan trọng liên quan đến câu hỏi này]

5. Mẹo làm bài:
[Kỹ thuật và phương pháp để giải nhanh dạng câu hỏi tương tự]

**YÊU CẦU CỰC KỲ QUAN TRỌNG:**
- BẮT BUỘC bắt đầu bằng số thứ tự: 1. 2. 3. 4. 5.
- KHÔNG sử dụng ** hay ### để đánh dấu tiêu đề
- CHỈ sử dụng dấu hai chấm (:) sau tiêu đề
- Giải thích bằng tiếng Việt dễ hiểu
- Khi có Kanji, thêm phiên âm Hán Việt: 朝 (TRIÊU)
- Mỗi section phải có nội dung cụ thể, không để trống

**VÍ DỤ FORMAT CHUẨN:**
1. Phân tích câu hỏi:
Câu hỏi này yêu cầu...

2. Giải thích từng lựa chọn:
A. 食べます - đúng vì...
B. 飲みます - sai vì...

TUÂN THỦ ĐÚNG format trên, KHÔNG thay đổi!`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1500,
            temperature: 0.7,
        });

        const explanation = completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            data: {
                questionText: questionText,
                correctAnswer: correctAnswer,
                userAnswer: userAnswer || null,
                explanation: explanation,
                questionType: questionType,
                level: level,
                isCorrect: userAnswer ? userAnswer === correctAnswer : null
            }
        });

    } catch (error) {
        console.error('Lỗi khi gọi ChatGPT API:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xử lý yêu cầu',
            error: error.message
        });
    }
};

// Hàm giải thích đáp án cho cả bài test
const explainTestResults = async (req, res) => {
    try {
        const { testResult, wrongAnswersOnly = true } = req.body;
        
        if (!testResult || !testResult.answers) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp kết quả bài test'
            });
        }

        // Lọc câu trả lời cần giải thích
        const answersToExplain = wrongAnswersOnly 
            ? testResult.answers.filter(answer => !answer.isCorrect)
            : testResult.answers;

        if (answersToExplain.length === 0) {
            return res.status(200).json({
                success: true,
                data: {
                    message: 'Bạn đã làm đúng tất cả câu hỏi! Chúc mừng!',
                    explanations: []
                }
            });
        }

        // Tạo prompt cho việc giải thích nhiều câu
        const questionsText = answersToExplain.map((answer, index) => 
            `**Câu ${index + 1}:** ${answer.question?.questionText || 'Không có thông tin câu hỏi'}
Bạn chọn: ${answer.userAnswer}
Đáp án đúng: ${answer.question?.correctAnswer || 'Không xác định'}
Loại câu hỏi: ${answer.question?.type || 'Không xác định'}
---`
        ).join('\n');

        const prompt = `Bạn là một giáo viên tiếng Nhật chuyên nghiệp. Học sinh vừa hoàn thành bài thi JLPT và có ${answersToExplain.length} câu ${wrongAnswersOnly ? 'làm sai' : 'cần giải thích'}. 

Hãy đưa ra lời khuyên tổng quát và giải thích ngắn gọn cho từng câu bằng tiếng Việt:

${questionsText}

**Yêu cầu:**
1. **Đánh giá tổng quát:** Nhận xét về điểm mạnh/yếu của học sinh
2. **Giải thích từng câu:** Ngắn gọn tại sao đáp án đúng là như vậy
3. **Lời khuyên học tập:** Các phần kiến thức cần ôn luyện thêm

Hãy trả lời một cách có cấu trúc và khuyến khích học sinh.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 2000,
            temperature: 0.7,
        });

        const explanation = completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            data: {
                totalQuestions: testResult.answers.length,
                wrongAnswers: answersToExplain.length,
                score: testResult.score || 0,
                explanation: explanation,
                analysisType: wrongAnswersOnly ? 'wrong_only' : 'all_answers'
            }
        });

    } catch (error) {
        console.error('Lỗi khi gọi ChatGPT API:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xử lý yêu cầu',
            error: error.message
        });
    }
};

// Hàm bắt đầu cuộc hội thoại luyện giao tiếp
const startConversation = async (req, res) => {
    try {
        const { 
            scenario, 
            level = 'N5', 
            userRole,
            sessionId 
        } = req.body;
        
        if (!scenario) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng chọn tình huống giao tiếp'
            });
        }

        // Tạo chuỗi prompt dựa trên tình huống và level
        const getScenarioPrompt = (scenario, level, userRole) => {
            const scenarios = {
                'restaurant': {
                    name: 'Nhà hàng',
                    context: 'Bạn đang ở một nhà hàng Nhật Bản',
                    aiRole: 'nhân viên phục vụ',
                    userRoleDefault: 'khách hàng'
                },
                'shopping': {
                    name: 'Mua sắm',
                    context: 'Bạn đang ở một cửa hàng ở Nhật Bản',
                    aiRole: 'nhân viên bán hàng',
                    userRoleDefault: 'khách hàng'
                },
                'station': {
                    name: 'Ga tàu',
                    context: 'Bạn đang ở ga tàu điện ngầm',
                    aiRole: 'nhân viên ga tàu',
                    userRoleDefault: 'hành khách'
                },
                'hotel': {
                    name: 'Khách sạn',
                    context: 'Bạn đang ở quầy lễ tân khách sạn',
                    aiRole: 'nhân viên lễ tân',
                    userRoleDefault: 'khách'
                },
                'doctor': {
                    name: 'Bệnh viện',
                    context: 'Bạn đang ở phòng khám bác sĩ',
                    aiRole: 'bác sĩ',
                    userRoleDefault: 'bệnh nhân'
                },
                'school': {
                    name: 'Trường học',
                    context: 'Bạn đang ở trường',
                    aiRole: 'giáo viên',
                    userRoleDefault: 'học sinh'
                },
                'friend': {
                    name: 'Bạn bè',
                    context: 'Bạn đang nói chuyện với bạn Nhật',
                    aiRole: 'bạn Nhật',
                    userRoleDefault: 'bạn của họ'
                },
                'interview': {
                    name: 'Phỏng vấn xin việc',
                    context: 'Bạn đang trong buổi phỏng vấn xin việc tại công ty Nhật',
                    aiRole: 'người phỏng vấn',
                    userRoleDefault: 'ứng viên'
                }
            };

            const scenarioInfo = scenarios[scenario] || scenarios['friend'];
            const finalUserRole = userRole || scenarioInfo.userRoleDefault;

            return {
                scenarioInfo,
                finalUserRole
            };
        };

        const { scenarioInfo, finalUserRole } = getScenarioPrompt(scenario, level, userRole);

        const prompt = `Bạn là một AI giáo viên tiếng Nhật chuyên nghiệp và thân thiện. Bạn sẽ tham gia cuộc hội thoại luyện giao tiếp với học sinh cấp độ ${level}.

**TÌNH HUỐNG:** ${scenarioInfo.name}
**BỐI CẢNH:** ${scenarioInfo.context}
**VAI TRÒ CỦA BẠN:** ${scenarioInfo.aiRole}
**VAI TRÒ CỦA HỌC SINH:** ${finalUserRole}

**HƯỚNG DẪN QUAN TRỌNG:**
1. CHỈ nói tiếng Nhật thuần túy, KHÔNG thêm bản dịch tiếng Việt
2. CHỈ nói DUY NHẤT một câu của ${scenarioInfo.aiRole}
3. KHÔNG mô phỏng câu trả lời của khách hàng/học sinh
4. KHÔNG viết cả cuộc hội thoại
5. Sử dụng từ vựng phù hợp với cấp độ ${level}
6. Tạo một câu mở đầu tự nhiên có câu hỏi để học sinh phản hồi

**Ví dụ ĐÚNG:**
- Restaurant: "いらっしゃいませ！何名様ですか？"
- Shopping: "いらっしゃいませ！今日は何かお探しですか？"
- Friend: "久しぶり！元気だった？"

**VÍ DỤ SAI - ĐỪNG LÀM:**
"いらっしゃいませ！何名様ですか？
二人です。
ありがとうございます..."

**Hãy nói CHỈ MỘT CÂU duy nhất với vai trò ${scenarioInfo.aiRole}!**`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: prompt
                }
            ],
            max_tokens: 50,
            temperature: 0.8,
        });

        const aiResponse = completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            data: {
                sessionId: sessionId || `conv_${Date.now()}`,
                scenario: scenario,
                scenarioName: scenarioInfo.name,
                level: level,
                userRole: finalUserRole,
                aiRole: scenarioInfo.aiRole,
                aiMessage: aiResponse,
                conversationHistory: [
                    {
                        role: 'assistant',
                        message: aiResponse,
                        timestamp: new Date().toISOString()
                    }
                ],
                tips: `💡 **Mẹo:** AI sẽ chỉ nói tiếng Nhật thuần túy. Hãy cố gắng hiểu và trả lời bằng tiếng Nhật!`
            }
        });

    } catch (error) {
        console.error('Lỗi khi bắt đầu hội thoại:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi bắt đầu hội thoại',
            error: error.message
        });
    }
};

// Hàm tiếp tục cuộc hội thoại
const continueConversation = async (req, res) => {
    try {
        const { 
            sessionId,
            userMessage, 
            conversationHistory = [],
            scenario,
            level = 'N5'
        } = req.body;
        
        if (!userMessage) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập tin nhắn'
            });
        }

        // Tạo lịch sử hội thoại cho ChatGPT
        const messages = [
            {
                role: "system",
                content: `Bạn là một AI giáo viên tiếng Nhật chuyên nghiệp. Đang trong cuộc hội thoại luyện giao tiếp cấp độ ${level} với tình huống "${scenario}".

**NHIỆM VỤ:**
1. CHỈ phản hồi bằng tiếng Nhật thuần túy, KHÔNG thêm bản dịch tiếng Việt
2. Sử dụng từ vựng và ngữ pháp phù hợp với cấp độ ${level}
3. Nếu học sinh có lỗi, nhẹ nhàng sửa sai bằng tiếng Nhật tự nhiên
4. Tiếp tục cuộc hội thoại một cách tự nhiên như người Nhật thực sự
5. Đôi khi hỏi câu hỏi để duy trì cuộc hội thoại
6. Giữ phong cách thân thiện và khuyến khích

**Hãy phản hồi bằng tiếng Nhật tự nhiên!**`
            }
        ];

        // Thêm lịch sử hội thoại gần đây (giới hạn 10 tin nhắn cuối)
        const recentHistory = conversationHistory.slice(-10);
        recentHistory.forEach(msg => {
            messages.push({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content || msg.message
            });
        });

        // Thêm tin nhắn hiện tại của user
        messages.push({
            role: 'user',
            content: userMessage
        });

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 300,
            temperature: 0.8,
        });

        const aiResponse = completion.choices[0].message.content;

        // Cập nhật lịch sử hội thoại
        const updatedHistory = [
            ...conversationHistory,
            {
                role: 'user',
                message: userMessage,
                timestamp: new Date().toISOString()
            },
            {
                role: 'assistant', 
                message: aiResponse,
                timestamp: new Date().toISOString()
            }
        ];

        res.status(200).json({
            success: true,
            data: {
                sessionId: sessionId,
                userMessage: userMessage,
                aiMessage: aiResponse,
                conversationHistory: updatedHistory,
                messageCount: updatedHistory.length
            }
        });

    } catch (error) {
        console.error('Lỗi khi tiếp tục hội thoại:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi xử lý hội thoại',
            error: error.message
        });
    }
};

// Hàm kết thúc và đánh giá cuộc hội thoại
const endConversation = async (req, res) => {
    try {
        const { 
            sessionId,
            conversationHistory = [],
            scenario,
            level = 'N5'
        } = req.body;
        
        if (!conversationHistory || conversationHistory.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có lịch sử hội thoại để đánh giá'
            });
        }

        // Lấy các tin nhắn của user để phân tích
        const userMessages = conversationHistory
            .filter(msg => msg.role === 'user')
            .map(msg => msg.message);

        if (userMessages.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có tin nhắn của người dùng để đánh giá'
            });
        }

        const conversationText = conversationHistory
            .map(msg => `${msg.role === 'user' ? 'Học sinh' : 'AI'}: ${msg.message}`)
            .join('\n');

        const prompt = `Bạn là một giáo viên tiếng Nhật chuyên nghiệp. Hãy đánh giá cuộc hội thoại luyện giao tiếp cấp độ ${level} với tình huống "${scenario}" sau đây:

**CUỘC HỘI THOẠI:**
${conversationText}

**YÊU CẦU ĐÁNH GIÁ:**
1. **Điểm tổng quát (1-10):** Đánh giá khả năng giao tiếp tổng thể của bạn
2. **Điểm mạnh:** Những gì bạn đã làm tốt
3. **Điểm cần cải thiện:** Lỗi ngữ pháp, từ vựng, hay cách diễn đạt của bạn
4. **Từ vựng đã sử dụng:** Liệt kê các từ/cụm từ hay bạn đã dùng
5. **Lời khuyên cụ thể:** Gợi ý để bạn cải thiện kỹ năng giao tiếp
6. **Bài tập đề xuất:** Những gì bạn nên luyện tập thêm

**Lưu ý quan trọng:** Hãy xưng hô với người học là "bạn" trong suốt bài đánh giá, tạo cảm giác thân thiện và gần gũi.

**Hãy đưa ra đánh giá chi tiết, tích cực và xây dựng bằng tiếng Việt!**`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1000,
            temperature: 0.7,
        });

        const evaluation = completion.choices[0].message.content;

        res.status(200).json({
            success: true,
            data: {
                sessionId: sessionId,
                scenario: scenario,
                level: level,
                totalMessages: conversationHistory.length,
                userMessages: userMessages.length,
                duration: conversationHistory.length > 0 ? 
                    new Date(conversationHistory[conversationHistory.length - 1].timestamp) - 
                    new Date(conversationHistory[0].timestamp) : 0,
                evaluation: evaluation,
                conversationSummary: {
                    totalExchanges: Math.floor(conversationHistory.length / 2),
                    userParticipation: `${((userMessages.length / conversationHistory.length) * 100).toFixed(1)}%`
                }
            }
        });

    } catch (error) {
        console.error('Lỗi khi kết thúc hội thoại:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi đánh giá hội thoại',
            error: error.message
        });
    }
};

module.exports = {
    explainVocabulary,
    explainGrammar,
    askQuestion,
    generateExamples,
    explainAnswer,
    explainTestResults,
    startConversation,
    continueConversation,
    endConversation
}; 