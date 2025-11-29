# T-Translator v1.0 (Dual Trigger & Fix)

**Instant Web Translator / 网页即时翻译插件 (修复遮挡版)**

## 功能介绍 (中文)

### ✨ 核心功能

1.  **双模触发**：
    * **键盘**：选中文字 -> 按 **`t`** 键（如果出现悬浮菜单，先用鼠标左键点击空白处使菜单消失，然后再按下 `t` 键）。
    * **鼠标**：选中文字 -> **右键** -> 选择 **“T-Translate Selected”**。
2.  **智能右下角定位 (修复版)**：
    * 翻译框默认位于屏幕 **右下角**。
    * 采用底部锚定技术 (`bottom: 20px`)，无论翻译内容多长，框体都会**向上延伸**，确保**底部内容永远不会被屏幕边缘切断**。
3.  **自由拖动**：您可以随意拖动翻译框。一旦拖动，后续的翻译都会出现在您放置的新位置。
4.  **防遮挡**：全局置顶显示，不会被网页导航栏覆盖。
5.  **300词限制**：自动截断超过 300 词的长文本，保证翻译的实时性。

### 🛠 安装教程
1.  下载本仓库ZIP文件并解压。
2.  打开 Edge 或 Chrome，在地址栏输入 `edge://extensions` 或 `chrome://extensions`。
3.  开启 **“开发人员模式”**。
4.  点击 **“加载解压缩的扩展”** 按钮，选择解压后的文件夹。

## 🌐 Introduction (English)

T-Translate is a lightweight browser extension that provides instant English-to-Chinese translation. 

### ✨ Key Features

1.  **Dual Trigger Methods**:
    * **Method A**: Select text -> Press **`t`**.
    * **Method B**: Select text -> **Right Click** -> Choose **"T-Translate Selected"**.
2.  **Smart Bottom-Right Positioning**: 
    * The popup is anchored to the **Bottom-Right** (20px margin).
    * It grows **upwards** as text length increases, guaranteeing that the content is **never obstructed** by the bottom of the screen.
3.  **Draggable**: Click and drag the box to move it anywhere. The extension remembers your custom position for the session.
4.  **Global Visibility**: Always stays on top of other webpage elements.
5.  **Text Limit**: Automatically truncates selections longer than 300 words to ensure rapid response times.

### 🛠 Installation
1.  Download and unzip `T-Translator.zip`.
2.  Open **Edge** or **Chrome** -> `edge://extensions`.
3.  Enable **Developer mode**.
4.  Click **"Load unpacked"** and select the folder.

## 备注

* **我负责写Prompt，具体代码工作由Gemini完成**

* **I am responsible for writing the prompts, while the actual coding work is handled by Gemini.**