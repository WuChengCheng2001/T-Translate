
// --- 全局变量 ---
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let draggablePopup = null; 

// 记录用户是否拖动过，以及拖动后的位置
let hasMoved = false;
let savedLeft = "";
let savedTop = "";

// --- 核心显示逻辑 ---
function showPopup(content, isLoading) {
    const oldPopup = document.getElementById('t-translate-popup');
    
    // 如果存在旧弹窗，我们要继承它的位置状态
    // 注意：如果用户还没拖动过 (hasMoved=false)，我们不继承 style.left/top
    // 因为这可能导致从 Loading 到 结果显示 时，尺寸变化导致的遮挡
    if (oldPopup) {
        oldPopup.remove();
    }

    const popup = document.createElement('div');
    popup.id = 't-translate-popup';
    popup.innerText = content;
    
    if (isLoading) popup.style.color = "#aaa";

    popup.style.opacity = "0"; 
    document.body.appendChild(popup);
    
    // --- 注册拖动事件 (MouseDown) ---
    popup.addEventListener('mousedown', (e) => {
        isDragging = true;
        hasMoved = true; // 标记用户已经手动移动过
        draggablePopup = popup;
        
        // 【关键修复】：开始拖动的一瞬间，获取当前真实的边界矩形
        const rect = popup.getBoundingClientRect();
        
        // 将 CSS 锚点从 bottom/right 切换为绝对坐标 left/top
        // 这样拖动时就不会因为尺寸变化乱跳
        popup.style.bottom = "auto";
        popup.style.right = "auto";
        popup.style.left = rect.left + "px";
        popup.style.top = rect.top + "px";

        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        
        popup.style.cursor = 'grabbing';
        e.preventDefault(); 
        e.stopPropagation();
    });

    // --- 智能定位策略 ---
    if (hasMoved && savedLeft && savedTop) {
        // 策略 A: 用户之前拖动过，恢复到用户喜欢的位置
        popup.style.left = savedLeft;
        popup.style.top = savedTop;
        popup.style.bottom = "auto";
        popup.style.right = "auto";
    } else {
        // 策略 B (默认): 强制锚定到右下角
        // 使用 CSS bottom/right 属性，而非计算 top/left
        // 这样无论内容高度如何变化，盒子永远贴着底部生长，绝不被遮挡
        popup.style.bottom = "20px";
        popup.style.right = "20px";
        popup.style.left = "auto";
        popup.style.top = "auto";
    }

    // 显示动画
    // 使用 requestAnimationFrame 确保 DOM 渲染后再显示，避免闪烁
    requestAnimationFrame(() => {
        popup.style.opacity = "1"; 
    });
    
    popup.style.cursor = 'grab';
}

// --- 辅助逻辑：文本处理 ---
function processTextForTranslation(text) {
    let cleanText = text.replace(/\$.*?\$/g, "···");
    cleanText = cleanText.replace(/[=<>+\-*/^]{2,}/g, "···");
    return cleanText;
}

// ==============================
// 触发方式 1: 键盘 't' 键
// ==============================
document.addEventListener('keydown', (e) => {
    if ((e.key === 't' || e.key === 'T') && !e.ctrlKey && !e.metaKey) {
        const selection = window.getSelection();
        let rawText = selection.toString().trim();

        if (!rawText) return;

        const words = rawText.split(/\s+/);
        if (words.length > 300) rawText = words.slice(0, 300).join(" ") + " ...";
        let processedText = processTextForTranslation(rawText);

        showPopup("Translating... / 翻译中...", true);

        chrome.runtime.sendMessage({ action: "translate_request", text: processedText }, (response) => {
            if (response && response.status === "success") {
                showPopup(response.translation, false);
            } else {
                showPopup("❌ " + (response ? response.message : "Error"), false);
            }
        });
    }
});

// ==============================
// 触发方式 2: 右键菜单消息
// ==============================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "displayLoading") {
        showPopup("Translating... / 翻译中...", true);
    }
    if (request.action === "displayResult") {
        showPopup(request.translation, false);
    }
});

// ==============================
// 拖动与交互
// ==============================
document.addEventListener('mousemove', (e) => {
    if (!isDragging || !draggablePopup) return;
    
    let newLeft = (e.clientX - dragOffsetX);
    let newTop = (e.clientY - dragOffsetY);
    
    draggablePopup.style.left = newLeft + 'px';
    draggablePopup.style.top = newTop + 'px';
    
    // 实时保存位置
    savedLeft = draggablePopup.style.left;
    savedTop = draggablePopup.style.top;
    
    e.preventDefault(); 
});

document.addEventListener('mouseup', () => {
    if (isDragging && draggablePopup) {
        isDragging = false;
        draggablePopup.style.cursor = 'grab';
    }
});

document.addEventListener('mousedown', (e) => {
    const popup = document.getElementById('t-translate-popup');
    if (!isDragging && popup && !popup.contains(e.target)) {
        popup.remove();
        draggablePopup = null;
        // 注意：这里我们不重置 hasMoved，
        // 这样用户下次打开时，依然会在上次拖动到的位置。
        // 如果您希望每次关闭后重置回右下角，可以把下面这行注释取消：
        // hasMoved = false; 
    }
});
