
// --- 文本预处理 ---
function processText(text) {
    if (!text) return "";
    let clean = text.trim();
    const words = clean.split(/\s+/);
    if (words.length > 300) {
        clean = words.slice(0, 300).join(" ") + " ......";
    }
    clean = clean.replace(/\$.*?\$/g, "···");
    clean = clean.replace(/[=<>+\-*/^]{2,}/g, "···");
    return clean;
}

// --- 翻译 API ---
async function fetchTranslation(text) {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        let translatedText = "";
        if (data && data[0]) {
            data[0].forEach(item => {
                if (item[0]) translatedText += item[0];
            });
        }
        return { status: "success", translation: translatedText };
    } catch (error) {
        console.error("Translation Error:", error);
        return { status: "error", message: "Network Error" };
    }
}

// 1. 初始化右键菜单
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "Translator-Menu",
        title: "paper精读「快捷英译中」",
        contexts: ["selection"]
    });
});

// 2. 右键菜单触发
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "Translator-Menu" && info.selectionText) {
        chrome.tabs.sendMessage(tab.id, { action: "displayLoading" });
        const cleanText = processText(info.selectionText);
        const result = await fetchTranslation(cleanText);
        chrome.tabs.sendMessage(tab.id, { 
            action: "displayResult", 
            translation: result.status === "success" ? result.translation : "Error: " + result.message 
        });
    }
});

// 3. 't' 键触发
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "translate_request") {
        fetchTranslation(request.text).then(result => sendResponse(result));
        return true; 
    }
});
