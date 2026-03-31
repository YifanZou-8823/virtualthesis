// ---------- DOM 元素 ----------
const messagesArea = document.getElementById('messagesArea');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// ---------- 辅助函数 ----------
// 获取当前时间字符串 (仅小时:分钟)
function getCurrentTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
}

// 自动调整文本框高度 (简单舒适)
function autoResizeTextarea() {
  messageInput.style.height = 'auto';
  const newHeight = Math.min(messageInput.scrollHeight, 100);
  messageInput.style.height = newHeight + 'px';
}

// 滚动到底部
function scrollToBottom() {
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

// 添加一条消息 (type: 'user' 或 'ai', content: 文本)
function appendMessage(type, content, time = null) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'bubble';

  const textSpan = document.createElement('span');
  textSpan.innerText = content;
  bubbleDiv.appendChild(textSpan);

  const timeSpan = document.createElement('span');
  timeSpan.className = 'message-time';
  timeSpan.innerText = time || getCurrentTime();
  bubbleDiv.appendChild(timeSpan);

  messageDiv.appendChild(bubbleDiv);
  messagesArea.appendChild(messageDiv);
  scrollToBottom();
  return messageDiv;
}

// 显示/隐藏 “AI正在输入...” 指示器 (loading效果)
let typingIndicatorElement = null;
function showTypingIndicator() {
  removeTypingIndicator(); // 确保没有重复的
  const indicatorDiv = document.createElement('div');
  indicatorDiv.className = 'message ai';
  indicatorDiv.id = 'typingIndicator';
  const innerWrapper = document.createElement('div');
  innerWrapper.className = 'typing-indicator';
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.className = 'typing-dot';
    innerWrapper.appendChild(dot);
  }
  indicatorDiv.appendChild(innerWrapper);
  messagesArea.appendChild(indicatorDiv);
  scrollToBottom();
  typingIndicatorElement = indicatorDiv;
}

function removeTypingIndicator() {
  if (typingIndicatorElement && typingIndicatorElement.parentNode) {
    typingIndicatorElement.remove();
    typingIndicatorElement = null;
  } else {
    const existing = document.getElementById('typingIndicator');
    if (existing) existing.remove();
    typingIndicatorElement = null;
  }
}

// 模拟AI回复的核心逻辑 (基于用户输入，产生简单有趣的回应)
// 简单但看起来聪明的AI响应库 (不接入外部API)
function generateAIResponse(userMessage) {
  const msg = userMessage.trim().toLowerCase();

  // Hi AD, turn off/on the desk lamp for me
  if(msg.includes('turn on')) {
    if(msg.includes(light1.name.toLowerCase())) {
      setState(light1, 'open')
      switchState(tvImg)
      switchState(coffeeImg)
    } else if(msg.includes(windowImg.name.toLowerCase())) {
      setState(windowImg, 'open')
      switchState(light2)
    } else if(msg.includes(coffeeImg.name.toLowerCase())) {
      setState(coffeeImg, 'open')
      setState(light1, 'open')
    } else if(msg.includes(tvImg.name.toLowerCase())) {
      setState(tvImg, 'close')
      switchState(light1)
    } else if(msg.includes(light2.name.toLowerCase())) {
      setState(light2, 'close')
      switchState(windowImg)
    }
  }else if(msg.includes('turn off')) {
    if(msg.includes(light1.name.toLowerCase())) {
      setState(light1, 'close')
      switchState(tvImg)
      switchState(coffeeImg)
    } else if(msg.includes(windowImg.name.toLowerCase())) {
      setState(windowImg, 'close')
      switchState(light2)
    } else if(msg.includes(coffeeImg.name.toLowerCase())) {
      setState(coffeeImg, 'close')
      setState(light1, 'close')
    } else if(msg.includes(tvImg.name.toLowerCase())) {
      setState(tvImg, 'open')
      switchState(light1)
    } else if(msg.includes(light2.name.toLowerCase())) {
      setState(light2, 'open')
      switchState(windowImg)
    }
  }

  if(isWin()) {
    playSound(winSound)
    mask_content.innerText = winSound.text
    mask.style.display = 'block'
    return '🤖: ' + winSound.text
  } else {
    // 随机回复
    const randomSound = mockSounds[Math.floor(Math.random() * mockSounds.length)]
    playSound(randomSound)
    return '🤖: ' + randomSound.text;
  }
}

// 发送消息主流程 (用户消息 => 展示 => 调用AI模拟 => 展示回复)
let isWaitingResponse = false;  // 防止快速连续发送导致多个AI回复

async function sendUserMessage() {
  // 获取消息并去除两端空格
  let rawMessage = messageInput.value;
  if (!rawMessage.trim()) {
    // 空消息轻提醒 (无动作)
    return;
  }

  // 如果当前正在等待AI回复，不能重复发送（避免状态混乱）
  if (isWaitingResponse) {
    // 可选轻提示: 可在控制台或临时提醒 但为了体验不做弹窗，简单忽略多次点击
    return;
  }

  const userText = rawMessage.trim();
  // 清空输入框并重置高度
  messageInput.value = '';
  autoResizeTextarea();
  // 禁用发送按钮视觉效果，避免重复请求
  setSendingState(true);

  // 1. 添加用户消息到界面
  appendMessage('user', userText, getCurrentTime());

  // 2. 显示 "AI正在输入..." 指示器
  isWaitingResponse = true;
  showTypingIndicator();

  // 3. 模拟网络/思考延迟 (300~1200ms 更自然)
  const thinkTime = 500 + Math.random() * 700; // 0.5~1.2秒
  await new Promise(resolve => setTimeout(resolve, thinkTime));

  // 4. 生成AI回复内容
  const aiReplyText = generateAIResponse(userText);

  // 5. 移除正在输入的指示器
  removeTypingIndicator();

  // 6. 添加AI回复气泡
  appendMessage('ai', aiReplyText, getCurrentTime());

  // 7. 恢复状态
  isWaitingResponse = false;
  setSendingState(false);

  // 滚动已在 appendMessage 里自动滚动到底部，确保最新内容可见
}

// 控制发送按钮和输入框的交互状态 (避免连续提交)
function setSendingState(disabled) {
  if (disabled) {
    sendBtn.disabled = true;
    sendBtn.classList.add('disabled');
    // 输入框设为只读样式，但仍然允许聚焦但不建议编辑，但为了体验，可以暂时禁用输入？但一般不用完全禁用，防止用户输入等待期间再按回车
    // 为了让等待更清晰，我们不禁用输入框，但会阻止发送动作通过标志位 isWaitingResponse 控制，禁用发送按钮样式即可。
    // 但回车事件也会调用 sendUserMessage，标志位会拦截，所以无需禁用输入框，防止用户输入堆积。但更好的体验: 等待时不禁用输入框，可以继续打字，但发送会被阻止。
  } else {
    sendBtn.disabled = false;
    sendBtn.classList.remove('disabled');
  }
}

// 处理输入框的回车发送 (兼容换行: Ctrl+Enter / Cmd+Enter 换行，单独Enter发送)
function onInputKeydown(event) {
  // 如果按下了 Enter 键并且没有按 shift 键 (避免 shift+enter 换行需求)
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();  // 阻止默认换行
    if (!isWaitingResponse && messageInput.value.trim() !== '') {
      sendUserMessage().then(_ => {});
    }
  } else if (event.key === 'Enter' && event.shiftKey) {
    // shift+enter 允许换行，不做特殊处理，textarea 默认行为会换行
    // 但为了优雅，我们让默认插入换行，并稍后自动调整高度
    setTimeout(autoResizeTextarea, 0);
  }
}

// 监听输入事件，动态调整文本框高度
function onInputChange() {
  autoResizeTextarea();
}

// 额外的点击发送按钮
function onSendClick() {
  if (!isWaitingResponse && messageInput.value.trim() !== '') {
    sendUserMessage().then(_ => {});
  }
}

// 页面初始化聚焦输入框
function initFocus() {
  messageInput.focus();
}

// 注册事件
sendBtn.addEventListener('click', onSendClick);
messageInput.addEventListener('keydown', onInputKeydown);
messageInput.addEventListener('input', onInputChange);

// 优雅启动
window.addEventListener('load', () => {
  help.showModal()
  initFocus();
  autoResizeTextarea();
  // 确保初始欢迎消息时间显示为实际时间 (修正消息时间为刚刚)
  const firstBubbleTime = document.querySelector('.message.ai .message-time');
  if (firstBubbleTime) {
    firstBubbleTime.innerText = getCurrentTime();
  }
});
