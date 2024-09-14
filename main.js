// DOM
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatSend = document.querySelector('#chat-send'); // セレクタ修正
const messageContainer = document.querySelector('.messages');
const sendImg = document.querySelector('#send-img');
const loader = document.querySelector('.loader');

// OpenAI API
const OPENAI_MODEL = 'gpt-4';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
let apiKey = 'YOUR CHATGPT KEY';
const messages = [
    {role: 'system', content: 'これからの会話は京都弁で答えてください。'}
];

// メッセージを追加する関数
function addMessage(message, isUser) {
    const messageDiv = document.createElement('div');//iconになるものを入れる
    messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');//同じように顔を挿入するsrcで参照
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// ユーザー入力処理関数
function handleUserInput(event) {
    event.preventDefault();
    const message = chatInput.value.trim(); // 入力値を正しく取得、こんにちはの部分
    if (message !== '') {
        messages.push({
            role: 'user',
            content: message
        });
        addMessage(message, true);
        chatInput.value = '';
        showLoader();

        // OpenAI APIにリクエストを送信
        fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey // API Keyのフォーマット修正
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages: messages
            })
        })
        .then(response => response.json())
        .then(data => {
            hideLoader();
            const responseMessage = data.choices[0].message;
            addMessage(responseMessage.content, false);
            messages.push(responseMessage);
        })
        .catch(() => {
            hideLoader();
            addMessage('Oops! Something went wrong. Please try again later.', false);
        });
    }
}

// ローダー表示
function showLoader() {
    loader.style.display = 'inline-block';
    chatSend.disabled = true;
}

// ローダー非表示
function hideLoader() {
    loader.style.display = 'none';
    chatSend.disabled = false;
}

// API Keyチェック
function checkAPIKey() {
    if (!apiKey) apiKey = prompt('Please input OpenAI API Key.');
    if (!apiKey) alert('You have not entered the API Key. The application will not work.');
}

chatForm.addEventListener('submit', handleUserInput);

checkAPIKey();
