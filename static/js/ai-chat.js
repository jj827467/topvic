document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 將 HTML 結構封裝成字串 (已更新為黃/橘色系，並更新 q1 按鈕文字)
    const aiChatHTML = `
        <button id="ai-chat-btn" onclick="toggleChat()" class="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center text-white hover:scale-110 hover:shadow-orange-500/50 transition-all duration-300 z-50 group">
            <svg class="w-8 h-8 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
        </button>

        <div id="ai-chat-window" class="fixed bottom-28 right-6 w-[350px] max-w-[calc(100vw-3rem)] bg-white rounded-3xl shadow-2xl shadow-gray-900/20 border border-gray-100 flex-col overflow-hidden z-50 transition-all duration-300 opacity-0 pointer-events-none translate-y-4">
            
            <div class="bg-gradient-to-r from-amber-400 to-orange-500 p-4 flex justify-between items-center text-white">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div>
                        <h3 class="font-bold text-base drop-shadow-sm">拓域 AI 助理</h3>
                        <p class="text-xs text-orange-50">為您解答常見問題</p>
                    </div>
                </div>
                <button onclick="toggleChat()" class="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <div id="chat-messages" class="p-4 h-[350px] overflow-y-auto flex flex-col space-y-4 bg-gray-50/50">
                <div class="flex items-start space-x-2">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center text-white shadow-sm">
                       <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <!-- 頭部與耳朵 -->
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div class="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm text-sm text-gray-700 shadow-sm">
                        您好！我是拓域科技的 AI 助理。很高興為您服務，請問您想了解哪方面的資訊呢？
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t border-gray-100">
                <p class="text-xs text-gray-400 mb-2 font-medium">請選擇你想問的問題：</p>
                <div class="flex flex-wrap gap-2">
                    <button onclick="sendPredefinedQuestion('q1')" class="text-xs bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-100 px-3 py-2 rounded-xl transition-colors duration-300 text-left">如何提供AIGC支援？</button>
                    <button onclick="sendPredefinedQuestion('q2')" class="text-xs bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white border border-amber-100 px-3 py-2 rounded-xl transition-colors duration-300 text-left">AI 訂閱服務包含哪些？</button>
                    <button onclick="sendPredefinedQuestion('q3')" class="text-xs bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white border border-yellow-100 px-3 py-2 rounded-xl transition-colors duration-300 text-left">如何與我們聯絡？</button>
                </div>
            </div>
        </div>
    `;

    // 2. 將結構動態注入到當前頁面的 <body> 底部
    document.body.insertAdjacentHTML('beforeend', aiChatHTML);

    // 3. 取得 DOM 節點
    const chatWindow = document.getElementById('ai-chat-window');
    const chatMessages = document.getElementById('chat-messages');

    // 4. 定義固定的問答資料庫 (已更新 q1)
    const qaDatabase = {
        'q1': {
            question: '你們團隊能夠為我們AIGC視覺生成提供什麼樣的支援？',
            answer: '我們拓域科技的團隊擁有專業的 AIGC 視覺生成技術能力，能夠根據您的需求，提供高品質的圖像、影片生成設計。我們將運用最先進的 AI 模型，為您打造吸引眼球的視覺內容，無論是企業宣傳片、社群短影音還是其他創意視覺項目，我們都能提供全方位的支援與解決方案。'
        },
        'q2': {
            question: 'AI 訂閱服務支援哪些項目？',
            answer: '我們支援市面上絕大多數主流 AI 服務，包含即夢AI、可靈AI、ChatGPT、Gemini、ComfyUI 等等的訂閱，以及開發者所需的各類 API 額度充值。'
        },
        'q3': {
            question: '如何與你們取得聯絡？',
            answer: '您可以直接點擊網頁底部的 WhatsApp 按鈕與我們專人聯繫，或是發送郵件至 topvicmo@gmail.com，我們將盡快回覆您！'
        }
    };

    // 5. 將控制函數掛載到全域 (window)
    window.toggleChat = function() {
        if (chatWindow.classList.contains('opacity-0')) {
            chatWindow.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
            chatWindow.classList.add('opacity-100', 'flex', 'translate-y-0');
        } else {
            chatWindow.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
            chatWindow.classList.remove('opacity-100', 'translate-y-0');
            setTimeout(() => {
                if(chatWindow.classList.contains('opacity-0')){
                    chatWindow.classList.remove('flex');
                }
            }, 300);
        }
    };

    window.sendPredefinedQuestion = function(qId) {
        const data = qaDatabase[qId];
        if (!data) return;

        appendUserMessage(data.question);
        const typingId = appendTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator(typingId);
            appendAIMessage(data.answer);
        }, 1000);
    };

    function appendUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'flex items-end justify-end space-x-2 animate-[fadeIn_0.3s_ease-out]';
        msgDiv.innerHTML = `
            <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-3 rounded-2xl rounded-tr-sm text-sm shadow-md max-w-[85%]">
                ${text}
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendAIMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'flex items-start space-x-2 animate-[fadeIn_0.3s_ease-out]';
        msgDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center text-white shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div class="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm text-sm text-gray-700 shadow-sm max-w-[85%] leading-relaxed">
                ${text}
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendTypingIndicator() {
        const id = 'typing-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.className = 'flex items-start space-x-2 animate-[fadeIn_0.3s_ease-out]';
        msgDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center text-white shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div class="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-1">
                <div class="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
        `;
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});