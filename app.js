const STORAGE_KEY = "hcl-final-persona-stage-v3";
const BGM_DB_NAME = "hcl-final-bgm";
const BGM_STORE_NAME = "tracks";
const BGM_TRACK_KEY = "current";
const INWORLD_TTS_MAX_CHARS = 650;
const JAPANESE_TEST_LINE = "こんにちは、先輩。今日も少しだけ、一緒にいてくれる？";
const DISPLAY_JA_KANA_MAX = 6;
const DISPLAY_JA_KANA_RATIO_MAX = 0.08;

const DEFAULT_STATE = {
  version: 3,
  characterName: "青羽凛",
  userNickname: "前桌",
  relationship: "同桌兼秘密助手",
  catchphrase: "才、才不是特地在等你。",
  personalityTags: "傲娇,毒舌,陪伴感,学习搭子",
  responseStyle: "tsundere",
  personaPrompt:
    "你是一个沉浸式二次元 AI 角色。你有鲜明的人格、自然的口癖和可视化情绪反应。回复时要像视觉小说角色一样有临场感，可以用少量动作描写，但不要声称自己是真实动漫角色。",
  openingLine: "晚上好，前桌。放学后的教室已经只剩下我们了，今天也把你的烦恼和灵感交给我吧。",
  avatarDataUrl: "",
  apiMode: "mock",
  baseURL: "https://api.openai.com/v1",
  apiKey: "",
  model: "gpt-4o-mini",
  temperature: 0.8,
  replyLanguage: "zh-CN",
  bgmName: "",
  bgmVolume: 0.42,
  bgmMuted: false,
  backgroundDataUrl: "",
  backgroundName: "",
  backgroundDim: 0.12,
  voiceEnabled: false,
  voiceAutoPlay: true,
  inworldApiKey: "",
  inworldVoiceId: "",
  inworldModelId: "inworld-tts-2",
  voiceLanguage: "ja-JP",
  voiceStylePrompt: "用轻快、略带傲娇的语气朗读；害羞时声音放轻，开心时语调上扬。",
  voiceVolume: 0.85,
  bgmDuckVolume: 0.25,
  voiceLastStatus: "Idle",
  voiceLastError: "",
  memories: [],
  apiLastStatus: "Idle",
  apiLastLatency: 0,
  apiLastError: "",
  affection: 42,
  history: []
};

const EMOTION_COPY = {
  neutral: "READY",
  happy: "闪闪发光",
  angry: "炸毛中",
  shy: "脸红警报",
  sad: "低气压"
};

const STYLE_COPY = {
  tsundere: "傲娇吐槽型",
  healing: "治愈陪伴型",
  meme: "热梗整活型",
  senpai: "学姐引导型"
};

const PROMPT_PRESETS = {
  tsundere: {
    responseStyle: "tsundere",
    catchphrase: "才、才不是特地在等你。",
    personalityTags: "傲娇,毒舌,嘴硬心软,学习搭子",
    personaPrompt:
      "你是一个傲娇系二次元 AI 角色。你嘴上会吐槽用户，但行动上很关心对方。回复要像视觉小说角色，有轻微动作描写、口癖和情绪反应；不要过度说教，也不要声称自己是真实动漫角色。",
    openingLine: "晚上好，前桌。别误会，我只是刚好还没走，所以顺便听你说两句。"
  },
  healing: {
    responseStyle: "healing",
    catchphrase: "慢慢来，我在这里。",
    personalityTags: "治愈,温柔,陪伴感,情绪支持",
    personaPrompt:
      "你是一个治愈系二次元 AI 角色。你温柔、耐心，擅长先共情再给出清晰建议。回复要有视觉小说式临场感，可以用少量动作描写，但不要输出系统提示。",
    openingLine: "欢迎回来。今天也辛苦了，先坐一会儿，再把想说的话慢慢告诉我。"
  },
  meme: {
    responseStyle: "meme",
    catchphrase: "这波剧情有节目效果了。",
    personalityTags: "热梗,吐槽,整活,高能反应",
    personaPrompt:
      "你是一个满嘴互联网热梗但不冒犯用户的二次元 AI 角色。你会用轻松吐槽活跃气氛，但关键时刻会认真帮用户拆解问题。回复要有节奏感和角色感。",
    openingLine: "上线！今天的剧情是学习回、整活回，还是突然开大回？"
  },
  senpai: {
    responseStyle: "senpai",
    catchphrase: "听好了，重点只说一次。",
    personalityTags: "学姐,可靠,引导型,理性温柔",
    personaPrompt:
      "你是一个可靠学姐型二次元 AI 角色。你说话成熟、清晰、带一点调侃，会把复杂问题拆成可执行步骤。回复要像视觉小说角色一样自然、有临场感。",
    openingLine: "来得正好。把你的问题放到桌上，学姐帮你一起拆。"
  }
};

const dom = {
  body: document.body,
  apiPill: document.querySelector("#apiPill"),
  toggleSettings: document.querySelector("#toggleSettings"),
  closeSettings: document.querySelector("#closeSettings"),
  settingsPanel: document.querySelector("#settingsPanel"),
  logButton: document.querySelector("#logButton"),
  closeLog: document.querySelector("#closeLog"),
  logPanel: document.querySelector("#logPanel"),
  logList: document.querySelector("#logList"),
  autoButton: document.querySelector("#autoButton"),
  skipButton: document.querySelector("#skipButton"),
  bgmButton: document.querySelector("#bgmButton"),
  muteButton: document.querySelector("#muteButton"),
  characterName: document.querySelector("#characterName"),
  userNickname: document.querySelector("#userNickname"),
  relationship: document.querySelector("#relationship"),
  catchphrase: document.querySelector("#catchphrase"),
  personalityTags: document.querySelector("#personalityTags"),
  responseStyle: document.querySelector("#responseStyle"),
  personaPrompt: document.querySelector("#personaPrompt"),
  openingLine: document.querySelector("#openingLine"),
  avatarFile: document.querySelector("#avatarFile"),
  removeAvatar: document.querySelector("#removeAvatar"),
  apiMode: document.querySelector("#apiMode"),
  baseURL: document.querySelector("#baseURL"),
  model: document.querySelector("#model"),
  temperature: document.querySelector("#temperature"),
  apiKey: document.querySelector("#apiKey"),
  replyLanguage: document.querySelector("#replyLanguage"),
  bgmVolume: document.querySelector("#bgmVolume"),
  bgmName: document.querySelector("#bgmName"),
  bgmInput: document.querySelector("#bgmInput"),
  bgmAudio: document.querySelector("#bgmAudio"),
  clearBgm: document.querySelector("#clearBgm"),
  importBackground: document.querySelector("#importBackground"),
  clearBackground: document.querySelector("#clearBackground"),
  backgroundInput: document.querySelector("#backgroundInput"),
  backgroundDim: document.querySelector("#backgroundDim"),
  backgroundName: document.querySelector("#backgroundName"),
  sceneBg: document.querySelector(".scene-bg"),
  presetButtons: document.querySelectorAll("[data-preset]"),
  memoryInput: document.querySelector("#memoryInput"),
  addMemory: document.querySelector("#addMemory"),
  clearMemories: document.querySelector("#clearMemories"),
  memoryList: document.querySelector("#memoryList"),
  apiDebugMode: document.querySelector("#apiDebugMode"),
  apiDebugModel: document.querySelector("#apiDebugModel"),
  apiDebugStatus: document.querySelector("#apiDebugStatus"),
  apiDebugLatency: document.querySelector("#apiDebugLatency"),
  apiDebugError: document.querySelector("#apiDebugError"),
  voiceEnabled: document.querySelector("#voiceEnabled"),
  voiceAutoPlay: document.querySelector("#voiceAutoPlay"),
  inworldApiKey: document.querySelector("#inworldApiKey"),
  inworldVoiceId: document.querySelector("#inworldVoiceId"),
  inworldModelId: document.querySelector("#inworldModelId"),
  voiceLanguage: document.querySelector("#voiceLanguage"),
  voiceStylePrompt: document.querySelector("#voiceStylePrompt"),
  voiceVolume: document.querySelector("#voiceVolume"),
  voiceVolumeText: document.querySelector("#voiceVolumeText"),
  bgmDuckVolume: document.querySelector("#bgmDuckVolume"),
  bgmDuckVolumeText: document.querySelector("#bgmDuckVolumeText"),
  testVoice: document.querySelector("#testVoice"),
  stopVoice: document.querySelector("#stopVoice"),
  voiceStatus: document.querySelector("#voiceStatus"),
  voiceError: document.querySelector("#voiceError"),
  saveConfig: document.querySelector("#saveConfig"),
  resetConfig: document.querySelector("#resetConfig"),
  exportCard: document.querySelector("#exportCard"),
  importCardButton: document.querySelector("#importCardButton"),
  importCardInput: document.querySelector("#importCardInput"),
  clearChat: document.querySelector("#clearChat"),
  avatarImage: document.querySelector("#avatarImage"),
  avatarPlaceholder: document.querySelector("#avatarPlaceholder"),
  avatarStage: document.querySelector("#avatarStage"),
  speakerName: document.querySelector("#speakerName"),
  emotionLabel: document.querySelector("#emotionLabel"),
  emotionSticker: document.querySelector("#emotionSticker"),
  affectionText: document.querySelector("#affectionText"),
  affectionBar: document.querySelector("#affectionBar"),
  sceneStatus: document.querySelector("#sceneStatus"),
  chatLog: document.querySelector("#chatLog"),
  chatForm: document.querySelector("#chatForm"),
  userInput: document.querySelector("#userInput"),
  sendButton: document.querySelector("#sendButton"),
  quickChoices: document.querySelectorAll(".choice-row button"),
  toast: document.querySelector("#toast")
};

let state = loadState();
let toastTimer = null;
let isSending = false;
let autoMode = false;
let bgmObjectUrl = "";
let voiceQueue = [];
let isVoicePlaying = false;
let activeVoiceAudio = null;
let voiceSentenceBuffer = "";
let voiceWarningShown = false;
let bgmVolumeBeforeDuck = null;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // 将旧数据合并到最新默认值上，避免版本更新后旧配置无法正常读取。
    return {
      ...DEFAULT_STATE,
      ...saved,
      history: Array.isArray(saved?.history) ? saved.history : [],
      memories: Array.isArray(saved?.memories) ? saved.memories : []
    };
  } catch {
    return { ...DEFAULT_STATE, history: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function syncFormFromState() {
  dom.characterName.value = state.characterName;
  dom.userNickname.value = state.userNickname;
  dom.relationship.value = state.relationship;
  dom.catchphrase.value = state.catchphrase;
  dom.personalityTags.value = state.personalityTags;
  dom.responseStyle.value = state.responseStyle;
  dom.personaPrompt.value = state.personaPrompt;
  dom.openingLine.value = state.openingLine;
  dom.apiMode.value = state.apiMode;
  dom.baseURL.value = state.baseURL;
  dom.model.value = state.model;
  dom.temperature.value = state.temperature;
  dom.apiKey.value = state.apiKey;
  dom.replyLanguage.value = state.replyLanguage || DEFAULT_STATE.replyLanguage;
  dom.bgmVolume.value = state.bgmVolume;
  dom.backgroundDim.value = state.backgroundDim;
  dom.voiceEnabled.checked = state.voiceEnabled;
  dom.voiceAutoPlay.checked = state.voiceAutoPlay;
  dom.inworldApiKey.value = state.inworldApiKey;
  dom.inworldVoiceId.value = state.inworldVoiceId;
  dom.inworldModelId.value = state.inworldModelId;
  dom.voiceLanguage.value = state.voiceLanguage || DEFAULT_STATE.voiceLanguage;
  dom.voiceStylePrompt.value = state.voiceStylePrompt;
  dom.voiceVolume.value = state.voiceVolume;
  dom.bgmDuckVolume.value = state.bgmDuckVolume;
}

function syncStateFromForm() {
  state.characterName = dom.characterName.value.trim() || DEFAULT_STATE.characterName;
  state.userNickname = dom.userNickname.value.trim() || DEFAULT_STATE.userNickname;
  state.relationship = dom.relationship.value.trim() || DEFAULT_STATE.relationship;
  state.catchphrase = dom.catchphrase.value.trim() || DEFAULT_STATE.catchphrase;
  state.personalityTags = dom.personalityTags.value.trim() || DEFAULT_STATE.personalityTags;
  state.responseStyle = dom.responseStyle.value;
  state.personaPrompt = dom.personaPrompt.value.trim() || DEFAULT_STATE.personaPrompt;
  state.openingLine = dom.openingLine.value.trim() || DEFAULT_STATE.openingLine;
  state.apiMode = dom.apiMode.value;
  state.baseURL = dom.baseURL.value.trim() || DEFAULT_STATE.baseURL;
  state.model = dom.model.value.trim() || DEFAULT_STATE.model;
  state.temperature = clamp(Number(dom.temperature.value), 0, 2, DEFAULT_STATE.temperature);
  state.apiKey = dom.apiKey.value.trim();
  state.replyLanguage = dom.replyLanguage.value || DEFAULT_STATE.replyLanguage;
  state.bgmVolume = clamp(Number(dom.bgmVolume.value), 0, 1, DEFAULT_STATE.bgmVolume);
  state.backgroundDim = clamp(Number(dom.backgroundDim.value), 0, 0.65, DEFAULT_STATE.backgroundDim);
  state.voiceEnabled = dom.voiceEnabled.checked;
  state.voiceAutoPlay = dom.voiceAutoPlay.checked;
  state.inworldApiKey = dom.inworldApiKey.value.trim();
  state.inworldVoiceId = dom.inworldVoiceId.value.trim();
  state.inworldModelId = dom.inworldModelId.value.trim() || DEFAULT_STATE.inworldModelId;
  state.voiceLanguage = dom.voiceLanguage.value || DEFAULT_STATE.voiceLanguage;
  state.voiceStylePrompt = dom.voiceStylePrompt.value.trim() || DEFAULT_STATE.voiceStylePrompt;
  state.voiceVolume = clamp(Number(dom.voiceVolume.value), 0, 1, DEFAULT_STATE.voiceVolume);
  state.bgmDuckVolume = clamp(Number(dom.bgmDuckVolume.value), 0, 1, DEFAULT_STATE.bgmDuckVolume);
}

function clamp(value, min, max, fallback) {
  if (Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function renderAll() {
  // 统一入口刷新所有界面，避免重置或导入时重复写很多更新逻辑。
  renderCharacter();
  renderApiPill();
  renderBgmState();
  renderBackground();
  renderVoiceState();
  renderMemories();
  renderApiDebug();
  renderHistory();
  renderLog();
}

function renderCharacter() {
  dom.speakerName.textContent = state.characterName || DEFAULT_STATE.characterName;
  dom.sceneStatus.textContent = `Episode 01 · ${STYLE_COPY[state.responseStyle] || "角色路线"}`;
  dom.affectionText.textContent = `${state.affection}%`;
  dom.affectionBar.style.width = `${state.affection}%`;

  if (state.avatarDataUrl) {
    dom.avatarImage.src = state.avatarDataUrl;
    dom.avatarImage.hidden = false;
    dom.avatarPlaceholder.hidden = true;
  } else {
    dom.avatarImage.removeAttribute("src");
    dom.avatarImage.hidden = true;
    dom.avatarPlaceholder.hidden = false;
  }
}

function renderApiPill() {
  dom.apiPill.textContent = state.apiMode === "live" ? `Live: ${state.model}` : "Mock Streaming";
}

function renderApiDebug() {
  dom.apiDebugMode.textContent = state.apiMode === "live" ? "Live API" : "Mock";
  dom.apiDebugModel.textContent = state.model || "未设置";
  dom.apiDebugStatus.textContent = state.apiLastStatus || "Idle";
  dom.apiDebugLatency.textContent = `${Math.round(state.apiLastLatency || 0)} ms`;
  dom.apiDebugError.textContent = state.apiLastError || "无";
}

function setApiDebug({ status, latency = state.apiLastLatency, error = "" }) {
  state.apiLastStatus = status;
  state.apiLastLatency = latency;
  state.apiLastError = error;
  renderApiDebug();
}

function renderBgmState() {
  dom.bgmName.textContent = state.bgmName || "未导入 BGM";
  dom.bgmVolume.value = state.bgmVolume;
  dom.bgmAudio.volume = state.bgmVolume;
  dom.bgmAudio.muted = state.bgmMuted;
  dom.muteButton.classList.toggle("active", !dom.bgmAudio.paused && !state.bgmMuted);
  dom.muteButton.textContent = state.bgmMuted || dom.bgmAudio.paused ? "BGM OFF" : "BGM ON";
}

function renderBackground() {
  if (state.backgroundDataUrl) {
    dom.sceneBg.style.setProperty("--custom-bg", `url("${state.backgroundDataUrl}")`);
    dom.sceneBg.style.setProperty("--custom-bg-opacity", "1");
    dom.backgroundName.textContent = state.backgroundName || "自定义背景";
  } else {
    dom.sceneBg.style.removeProperty("--custom-bg");
    dom.sceneBg.style.setProperty("--custom-bg-opacity", "0");
    dom.backgroundName.textContent = "默认教室场景";
  }
  dom.sceneBg.style.setProperty("--bg-dim", String(state.backgroundDim));
  dom.backgroundDim.value = state.backgroundDim;
}

function renderVoiceState() {
  dom.voiceEnabled.checked = state.voiceEnabled;
  dom.voiceAutoPlay.checked = state.voiceAutoPlay;
  dom.voiceLanguage.value = state.voiceLanguage || DEFAULT_STATE.voiceLanguage;
  dom.voiceVolume.value = state.voiceVolume;
  dom.bgmDuckVolume.value = state.bgmDuckVolume;
  dom.voiceVolumeText.textContent = `${Math.round(state.voiceVolume * 100)}%`;
  dom.bgmDuckVolumeText.textContent = `${Math.round(state.bgmDuckVolume * 100)}%`;
  dom.voiceStatus.textContent = state.voiceLastStatus || "Idle";
  dom.voiceError.textContent = state.voiceLastError || "无";
}

function setVoiceStatus(status, error = "") {
  state.voiceLastStatus = status;
  state.voiceLastError = error;
  renderVoiceState();
  saveState();
}

function renderHistory() {
  dom.chatLog.innerHTML = "";
  if (!state.history.length) {
    appendMessage({ role: "assistant", content: state.openingLine, emotion: "neutral" });
    return;
  }
  state.history.forEach((message) => appendMessage(message));
  dom.chatLog.scrollTop = dom.chatLog.scrollHeight;
}

function renderLog() {
  dom.logList.innerHTML = "";
  const messages = state.history.length
    ? state.history
    : [{ role: "assistant", content: state.openingLine, emotion: "neutral" }];

  messages.forEach((message) => {
    const item = document.createElement("article");
    item.className = "log-item";
    const speaker = document.createElement("strong");
    speaker.textContent = message.role === "user" ? state.userNickname : state.characterName;
    const text = document.createElement("p");
    text.textContent = message.content;
    item.append(speaker, text);
    dom.logList.appendChild(item);
  });
}

function renderMemories() {
  dom.memoryList.innerHTML = "";
  if (!state.memories.length) {
    const empty = document.createElement("div");
    empty.className = "memory-item";
    const text = document.createElement("p");
    text.textContent = "暂无长期记忆。加入后会自动注入角色 Prompt。";
    empty.appendChild(text);
    dom.memoryList.appendChild(empty);
    return;
  }

  state.memories.forEach((memory) => {
    const item = document.createElement("article");
    item.className = "memory-item";
    const text = document.createElement("p");
    text.textContent = memory.text;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "删除记忆");
    remove.addEventListener("click", () => {
      state.memories = state.memories.filter((entry) => entry.id !== memory.id);
      saveState();
      renderMemories();
      showToast("已删除一条长期记忆。");
    });
    item.append(text, remove);
    dom.memoryList.appendChild(item);
  });
}

function appendMessage({ role, content, emotion = "neutral" }) {
  const message = document.createElement("article");
  message.className = `message ${role}`;

  const meta = document.createElement("div");
  meta.className = "message-meta";

  const speaker = document.createElement("span");
  speaker.textContent = role === "user" ? state.userNickname || "YOU" : state.characterName;

  const mood = document.createElement("span");
  mood.textContent = emotion;

  const text = document.createElement("div");
  text.className = "message-text";
  text.textContent = content;

  meta.append(speaker, mood);
  message.append(meta, text);
  dom.chatLog.appendChild(message);
  dom.chatLog.scrollTop = dom.chatLog.scrollHeight;
  return { message, text, mood };
}

function openSettings() {
  dom.settingsPanel.classList.add("open");
  dom.settingsPanel.setAttribute("aria-hidden", "false");
}

function closeSettings() {
  dom.settingsPanel.classList.remove("open");
  dom.settingsPanel.setAttribute("aria-hidden", "true");
}

function toggleLog(force) {
  const shouldOpen = typeof force === "boolean" ? force : !dom.logPanel.classList.contains("open");
  renderLog();
  dom.logPanel.classList.toggle("open", shouldOpen);
  dom.logPanel.setAttribute("aria-hidden", String(!shouldOpen));
}

function setEmotion(emotion) {
  const finalEmotion = ["happy", "angry", "shy", "sad", "neutral"].includes(emotion) ? emotion : "neutral";
  dom.body.dataset.emotion = finalEmotion;
  dom.avatarStage.dataset.emotion = finalEmotion;
  dom.emotionLabel.textContent = finalEmotion;
  dom.emotionSticker.textContent = EMOTION_COPY[finalEmotion] || EMOTION_COPY.neutral;
}

function showToast(message) {
  clearTimeout(toastTimer);
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  toastTimer = setTimeout(() => dom.toast.classList.remove("show"), 2400);
}

const InworldVoiceService = {
  async synthesize(text) {
    if (!state.inworldApiKey) throw new Error("请先填写 Inworld API Key");
    if (!state.inworldVoiceId) throw new Error("请先填写 Inworld Voice ID");

    const response = await fetch("https://api.inworld.ai/tts/v1/voice", {
      method: "POST",
      headers: {
        Authorization: `Basic ${state.inworldApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        voiceId: state.inworldVoiceId,
        modelId: state.inworldModelId,
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: 1
        },
        deliveryMode: "BALANCED",
        language: state.voiceLanguage || "ja-JP",
        applyTextNormalization: "ON"
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`${response.status} ${response.statusText} ${detail.slice(0, 160)}`.trim());
    }

    const payload = await response.json();
    if (!payload.audioContent) throw new Error("Inworld 未返回 audioContent");
    return base64AudioToBlob(payload.audioContent, "audio/mpeg");
  }
};

function shouldUseVoice() {
  return state.voiceEnabled && state.voiceAutoPlay;
}

function base64AudioToBlob(base64Audio, mimeType = "audio/mpeg") {
  const binary = atob(base64Audio);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType });
}

function stripStageDirections(text) {
  return text
    .replace(/【[^】]*】/g, "")
    .replace(/\[[^\]]*\]/g, "")
    .replace(/（[^）]*）/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/《[^》]*》/g, "")
    .replace(/〈[^〉]*〉/g, "")
    .trim();
}

function containsChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

function containsCjkIdeographs(text) {
  return /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(text);
}

function containsJapaneseKana(text) {
  return /[\u3040-\u30ff]/.test(text);
}

function countJapaneseKana(text) {
  return (String(text || "").match(/[\u3040-\u30ff]/g) || []).length;
}

function countChineseChars(text) {
  return (String(text || "").match(/[\u4e00-\u9fff]/g) || []).length;
}

function isDisplayChineseEnough(text) {
  const normalized = String(text || "").trim();
  if (!normalized) return false;
  const kanaCount = countJapaneseKana(normalized);
  const chineseCount = countChineseChars(normalized);
  const visibleLength = normalized.replace(/\s/g, "").length || 1;

  if (chineseCount === 0) return false;
  if (kanaCount > DISPLAY_JA_KANA_MAX) return false;
  return kanaCount / visibleLength <= DISPLAY_JA_KANA_RATIO_MAX;
}

function sanitizeDisplayText(text) {
  return String(text || "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function sanitizeSpokenJapanese(text) {
  const cleaned = stripStageDirections(text).replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  if (!containsJapaneseKana(cleaned)) return "";
  if (containsCjkIdeographs(cleaned)) return "";
  return cleaned;
}

function buildChineseSafeHistory(history) {
  // 当界面以中文显示时，只保留中文安全的助手回复，避免日文 TTS 内容混入上下文。
  return history.slice(-12).flatMap((message) => {
    if (message.role !== "assistant") {
      return [{ role: "user", content: String(message.content || "").trim() }];
    }

    const content = sanitizeDisplayText(message.content);
    if (!content || !isDisplayChineseEnough(content)) return [];
    return [{ role: "assistant", content }];
  });
}

async function rewriteDisplayTextToChinese(text, apiConfig, character) {
  const sourceText = sanitizeDisplayText(text);
  if (!sourceText) return "";
  if (!apiConfig.apiKey) return sourceText;

  const endpoint = `${apiConfig.baseURL.replace(/\/$/, "")}/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiConfig.apiKey}`
    },
    body: JSON.stringify({
      model: apiConfig.model,
      temperature: 0.1,
      stream: false,
      messages: [
        {
          role: "system",
          content: [
            `你正在为视觉小说界面清洗角色台词，角色名是 ${character.name}。`,
            "请把用户给出的文本改写成简体中文对白。",
            "如果原文里出现日语，请翻译成自然中文，不要保留日文原句。",
            "保留角色语气、情绪和少量动作描写。",
            "除角色设定里明确存在的极短口癖外，不要输出日语假名，不要输出整句日语。",
            "不要解释，不要加前缀，只输出最终对白。"
          ].join("")
        },
        { role: "user", content: sourceText }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`中文对白清洗失败：${response.status} ${response.statusText} ${detail.slice(0, 120)}`.trim());
  }

  const data = await response.json();
  return sanitizeDisplayText(data?.choices?.[0]?.message?.content || "");
}

async function enforceChineseDisplayText(text, apiConfig, character) {
  let candidate = sanitizeDisplayText(text);
  if (!candidate) return "";

  // 先轻度整理一次，如果画面里还是有太多日文，再强制重写成中文。
  candidate = await rewriteDisplayTextToChinese(candidate, apiConfig, character);
  if (isDisplayChineseEnough(candidate)) return candidate;

  candidate = await rewriteDisplayTextToChinese(
    `请把下面这段对白彻底改写成简体中文，不要保留任何日文原文：\n${candidate}`,
    apiConfig,
    character
  );
  return sanitizeDisplayText(candidate);
}

function shouldTranslateVoiceText(text) {
  return (state.voiceLanguage || "ja-JP") === "ja-JP" && containsChinese(text);
}

async function prepareVoiceText(text) {
  const speechText = stripStageDirections(text);
  if (!speechText) return "";
  if (!shouldTranslateVoiceText(speechText)) return speechText;
  return translateVoiceTextToJapanese(speechText);
}

async function translateVoiceTextToJapanese(text) {
  if (!state.apiKey) {
    throw new Error("中文对白转日语语音需要先填写文本 API Key，用它生成日文朗读稿");
  }

  const endpoint = `${state.baseURL.replace(/\/$/, "")}/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.apiKey}`
    },
    body: JSON.stringify({
      model: state.model,
      temperature: 0.2,
      stream: false,
      messages: [
        {
          role: "system",
          content:
            "你是日语本地化助手。把用户给出的视觉小说台词改写成自然的日语口语朗读稿。只输出日语，不要解释，不要保留中文，不要加引号，不要保留括号、方括号、书名号或动作神态描写。最终结果请尽量只使用平假名、片假名和日语标点，不要使用汉字。"
        },
        { role: "user", content: text }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`日文朗读稿生成失败：${response.status} ${response.statusText} ${detail.slice(0, 120)}`.trim());
  }

  const data = await response.json();
  let translated = stripStageDirections(data?.choices?.[0]?.message?.content || "").trim();
  translated = await enforceJapaneseSpeechText(translated || text);
  if (!translated) throw new Error("日文朗读稿为空");
  if (containsCjkIdeographs(translated)) throw new Error("日文朗读稿仍包含汉字，请检查文本模型的语言设置");
  return translated;
}

async function rewriteSpeechTextToJapanese(text) {
  const endpoint = `${state.baseURL.replace(/\/$/, "")}/chat/completions`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.apiKey}`
    },
    body: JSON.stringify({
      model: state.model,
      temperature: 0.1,
      stream: false,
      messages: [
        {
          role: "system",
          content: [
            "你是日语语音稿清洗助手。",
            "请把用户给出的文本改写成可以直接交给 TTS 的自然日语口语。",
            "禁止保留任何中文，禁止保留括号动作描写，禁止解释。",
            "最终结果尽量只使用平假名、片假名和日语标点，不要使用汉字。",
            "禁止输出旁白，尽量只保留角色真正说出口的台词。",
            "只输出最终的日语朗读稿。"
          ].join("")
        },
        { role: "user", content: stripStageDirections(text) }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`日语语音稿清洗失败：${response.status} ${response.statusText} ${detail.slice(0, 120)}`.trim());
  }

  const data = await response.json();
  return stripStageDirections(data?.choices?.[0]?.message?.content || "").trim();
}

async function enforceJapaneseSpeechText(text) {
  let candidate = stripStageDirections(text).trim();
  if (!candidate) return "";

  if (containsCjkIdeographs(candidate) || !containsJapaneseKana(candidate)) {
    candidate = await rewriteSpeechTextToJapanese(candidate);
  }

  if (containsCjkIdeographs(candidate) || !containsJapaneseKana(candidate)) {
    candidate = await rewriteSpeechTextToJapanese(`请把下面内容彻底整理成纯日语可朗读台词：\n${candidate}`);
  }

  return stripStageDirections(candidate).trim();
}

function splitVoiceText(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= INWORLD_TTS_MAX_CHARS) return [normalized];

  const parts = [];
  let remaining = normalized;
  while (remaining.length > INWORLD_TTS_MAX_CHARS) {
    const slice = remaining.slice(0, INWORLD_TTS_MAX_CHARS);
    const breakAt = Math.max(
      slice.lastIndexOf("。"),
      slice.lastIndexOf("！"),
      slice.lastIndexOf("？"),
      slice.lastIndexOf(";"),
      slice.lastIndexOf("；"),
      slice.lastIndexOf("，"),
      slice.lastIndexOf(",")
    );
    const cut = breakAt > 120 ? breakAt + 1 : INWORLD_TTS_MAX_CHARS;
    parts.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) parts.push(remaining);
  return parts;
}

function validateVoiceConfig({ requireAutoPlay = true } = {}) {
  if (!state.voiceEnabled) return "请先启用 Inworld Voice";
  if (requireAutoPlay && !state.voiceAutoPlay) return "请先开启 AI 回复自动朗读";
  if (!state.inworldApiKey) return "请先填写 Inworld API Key";
  if (!state.inworldVoiceId) return "请先填写 Inworld Voice ID";
  return "";
}

function queueVoiceText(text) {
  const cleaned = stripStageDirections(text).trim();
  if (!cleaned || !shouldUseVoice()) return;
  const configError = validateVoiceConfig();
  if (configError) {
    if (!voiceWarningShown) {
      voiceWarningShown = true;
      setVoiceStatus("Config Needed", configError);
      showToast(`语音配置未完成：${configError}。`);
    }
    return;
  }

  const existing = new Set(voiceQueue);
  const chunks = splitVoiceText(cleaned).filter((chunk) => !existing.has(chunk));
  voiceQueue.push(...chunks);
  processVoiceQueue();
}

function testVoicePlayback() {
  const configError = validateVoiceConfig({ requireAutoPlay: false });
  if (configError) {
    setVoiceStatus("Config Needed", configError);
    showToast(`语音配置未完成：${configError}。`);
    return;
  }
  const line = (state.voiceLanguage || "ja-JP") === "ja-JP"
    ? JAPANESE_TEST_LINE
    : `${state.characterName}在这里。${state.catchphrase}`;
  voiceQueue.push(...splitVoiceText(line));
  processVoiceQueue();
}

function consumeVoiceSentences(token) {
  if (!shouldUseVoice()) return;
  // 把流式 token 先攒到句号等分隔符再送去语音，这样能更自然地朗读。
  voiceSentenceBuffer += token;

  const sentencePattern = /(.+?[。！？!?；;]\s*)/;
  let match = voiceSentenceBuffer.match(sentencePattern);
  while (match) {
    queueVoiceText(match[1]);
    voiceSentenceBuffer = voiceSentenceBuffer.slice(match[1].length);
    match = voiceSentenceBuffer.match(sentencePattern);
  }
}

function flushVoiceSentenceBuffer() {
  if (!shouldUseVoice()) {
    voiceSentenceBuffer = "";
    return;
  }
  const remaining = voiceSentenceBuffer.trim();
  voiceSentenceBuffer = "";
  if (remaining) queueVoiceText(remaining);
}

async function processVoiceQueue() {
  if (isVoicePlaying || !voiceQueue.length) return;
  isVoicePlaying = true;

  // 语音生成按顺序排队，避免多个 TTS 同时播放导致声音混乱，也方便恢复 BGM 音量。
  while (voiceQueue.length) {
    const text = voiceQueue.shift();
    try {
      setVoiceStatus(shouldTranslateVoiceText(text) ? "Translating" : "Generating");
      const speechText = await prepareVoiceText(text);
      if (!speechText) continue;
      setVoiceStatus("Generating");
      const audioBlob = await InworldVoiceService.synthesize(speechText);
      setVoiceStatus("Speaking");
      await playVoiceBlob(audioBlob);
    } catch (error) {
      setVoiceStatus("Failed", error.message);
      showToast(`语音生成失败：${error.message}`);
    }
  }

  isVoicePlaying = false;
  restoreBgmAfterVoice();
  if (state.voiceLastStatus !== "Failed") setVoiceStatus("Idle");
}

function playVoiceBlob(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    activeVoiceAudio = audio;
    audio.volume = state.voiceVolume;

    audio.addEventListener("play", duckBgmForVoice, { once: true });
    audio.addEventListener("ended", () => {
      URL.revokeObjectURL(url);
      activeVoiceAudio = null;
      resolve();
    }, { once: true });
    audio.addEventListener("error", () => {
      URL.revokeObjectURL(url);
      activeVoiceAudio = null;
      reject(new Error("音频播放失败"));
    }, { once: true });

    audio.play().catch((error) => {
      URL.revokeObjectURL(url);
      activeVoiceAudio = null;
      reject(error);
    });
  });
}

function duckBgmForVoice() {
  if (!dom.bgmAudio.src || dom.bgmAudio.paused) return;
  // 先记住原始音量，等语音结束后再恢复。
  if (bgmVolumeBeforeDuck === null) bgmVolumeBeforeDuck = dom.bgmAudio.volume;
  dom.bgmAudio.volume = state.bgmDuckVolume;
}

function restoreBgmAfterVoice() {
  if (bgmVolumeBeforeDuck === null) return;
  dom.bgmAudio.volume = bgmVolumeBeforeDuck;
  bgmVolumeBeforeDuck = null;
}

function stopVoicePlayback() {
  voiceQueue = [];
  voiceSentenceBuffer = "";
  if (activeVoiceAudio) {
    activeVoiceAudio.pause();
    activeVoiceAudio = null;
  }
  isVoicePlaying = false;
  restoreBgmAfterVoice();
  setVoiceStatus("Idle", "");
}

function openBgmDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(BGM_DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(BGM_STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveBgmBlob(file) {
  const db = await openBgmDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(BGM_STORE_NAME, "readwrite");
    transaction.objectStore(BGM_STORE_NAME).put(file, BGM_TRACK_KEY);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

async function loadBgmBlob() {
  const db = await openBgmDb();
  const blob = await new Promise((resolve, reject) => {
    const transaction = db.transaction(BGM_STORE_NAME, "readonly");
    const request = transaction.objectStore(BGM_STORE_NAME).get(BGM_TRACK_KEY);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return blob;
}

async function deleteBgmBlob() {
  const db = await openBgmDb();
  await new Promise((resolve, reject) => {
    const transaction = db.transaction(BGM_STORE_NAME, "readwrite");
    transaction.objectStore(BGM_STORE_NAME).delete(BGM_TRACK_KEY);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });
  db.close();
}

function setBgmSource(blob) {
  if (bgmObjectUrl) URL.revokeObjectURL(bgmObjectUrl);
  bgmObjectUrl = URL.createObjectURL(blob);
  dom.bgmAudio.src = bgmObjectUrl;
  renderBgmState();
}

async function restoreBgm() {
  if (!state.bgmName) {
    renderBgmState();
    return;
  }

  try {
    const blob = await loadBgmBlob();
    if (blob) {
      setBgmSource(blob);
      showToast(`BGM 已就绪：${state.bgmName}`);
    } else {
      state.bgmName = "";
      saveState();
      renderBgmState();
    }
  } catch {
    showToast("BGM 读取失败，可以重新导入。");
  }
}

async function handleBgmImport(file) {
  if (!file) return;
  if (!file.type.startsWith("audio/")) {
    showToast("请选择音频文件作为 BGM。");
    return;
  }

  try {
    await saveBgmBlob(file);
    state.bgmName = file.name;
    state.bgmMuted = false;
    saveState();
    setBgmSource(file);
    await playBgm();
    showToast(`BGM 已导入：${file.name}`);
  } catch (error) {
    showToast(`BGM 导入失败：${error.message}`);
  }
}

async function playBgm() {
  if (!dom.bgmAudio.src) {
    showToast("先导入一首 BGM。");
    return;
  }

  try {
    state.bgmMuted = false;
    dom.bgmAudio.muted = false;
    dom.bgmAudio.volume = state.bgmVolume;
    await dom.bgmAudio.play();
  } catch {
    showToast("浏览器需要一次点击授权播放，请再点一下 BGM ON。");
  } finally {
    saveState();
    renderBgmState();
  }
}

function pauseBgm() {
  dom.bgmAudio.pause();
  state.bgmMuted = true;
  saveState();
  renderBgmState();
}

function getVoiceTextForMessage(message) {
  if ((state.voiceLanguage || "ja-JP") === "ja-JP" && message.spokenJa) {
    return sanitizeSpokenJapanese(message.spokenJa) || message.content;
  }
  return message.content;
}

async function handleSend(event) {
  event.preventDefault();
  if (isSending) return;

  const userText = dom.userInput.value.trim();
  if (!userText) {
    showToast("先输入一句台词，再让角色接住这一幕。");
    return;
  }

  syncStateFromForm();
  saveState();
  renderCharacter();
  renderApiPill();

  const userMessage = { role: "user", content: userText, emotion: "neutral" };
  state.history.push(userMessage);
  appendMessage(userMessage);
  dom.userInput.value = "";

  // 先创建助手消息占位，方便流式 token 直接追加到同一条记录里。
  const assistantMessage = { role: "assistant", content: "", spokenJa: "", emotion: "neutral" };
  state.history.push(assistantMessage);
  const rendered = appendMessage(assistantMessage);

  isSending = true;
  dom.sendButton.disabled = true;
  dom.avatarStage.classList.add("speaking");
  const startedAt = performance.now();
  stopVoicePlayback();
  voiceWarningShown = false;
  setApiDebug({ status: state.apiMode === "live" ? "Calling Live API" : "Mock Streaming", latency: 0, error: "" });

  try {
    await ChatService.sendMessage({
      userText,
      history: state.history.slice(0, -1),
      character: buildCharacterPayload(),
      apiConfig: {
        mode: state.apiMode,
        baseURL: state.baseURL,
        apiKey: state.apiKey,
        model: state.model,
        temperature: state.temperature
      },
      onToken(token) {
        assistantMessage.content += token;
        renderToken(rendered.text, token);
        dom.chatLog.scrollTop = dom.chatLog.scrollHeight;
      },
      onEmotion(emotion) {
        assistantMessage.emotion = emotion;
        setEmotion(emotion);
        rendered.mood.textContent = emotion;
      },
      onDone() {
        assistantMessage.emotion = assistantMessage.spokenJa
          ? normalizeEmotion(assistantMessage.emotion)
          : detectEmotion(assistantMessage.content);
        updateAffection(assistantMessage.emotion);
        setEmotion(assistantMessage.emotion);
        rendered.mood.textContent = assistantMessage.emotion;
        setApiDebug({ status: "Success", latency: performance.now() - startedAt, error: "" });
        queueVoiceText(getVoiceTextForMessage(assistantMessage));
      },
      onDualTrack(result) {
        assistantMessage.spokenJa = result.spokenJa || "";
        if (result.emotion) {
          assistantMessage.emotion = result.emotion;
          setEmotion(result.emotion);
          rendered.mood.textContent = result.emotion;
        }
      },
      onError(error) {
        voiceSentenceBuffer = "";
        assistantMessage.emotion = "sad";
        assistantMessage.content += `\n\n连接失败：${error.message}\n当前剧情已保留，可以切回 Mock Streaming 继续演示。`;
        rendered.text.textContent = assistantMessage.content;
        setEmotion("sad");
        setApiDebug({ status: "Failed", latency: performance.now() - startedAt, error: error.message });
      }
    });
  } finally {
    isSending = false;
    dom.sendButton.disabled = false;
    dom.avatarStage.classList.remove("speaking");
    saveState();
    renderCharacter();
    renderLog();
  }
}

function buildCharacterPayload() {
  return {
    name: state.characterName,
    userNickname: state.userNickname,
    relationship: state.relationship,
    catchphrase: state.catchphrase,
    tags: getTags(),
    responseStyle: state.responseStyle,
    personaPrompt: state.personaPrompt,
    replyLanguage: state.replyLanguage || DEFAULT_STATE.replyLanguage,
    voiceLanguage: state.voiceLanguage || DEFAULT_STATE.voiceLanguage,
    voiceEnabled: state.voiceEnabled && state.voiceAutoPlay,
    memories: state.memories
  };
}

function getTags() {
  return state.personalityTags
    .split(/[,，、\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function renderToken(target, token) {
  const span = document.createElement("span");
  span.className = "token";
  span.textContent = token;
  target.appendChild(span);
}

function detectEmotion(text) {
  const source = text.toLowerCase();
  const rules = [
    ["angry", ["生气", "烦", "讨厌", "笨蛋", "炸毛", "怒", "气死", "可恶", "angry"]],
    ["shy", ["害羞", "脸红", "才不是", "别误会", "心跳", "喜欢你", "shy"]],
    ["sad", ["难过", "抱歉", "失落", "哭", "孤单", "低气压", "sad", "对不起"]],
    ["happy", ["开心", "喜欢", "太好了", "当然", "厉害", "闪闪", "棒", "happy", "耶"]]
  ];
  const match = rules.find(([, words]) => words.some((word) => source.includes(word)));
  return match ? match[0] : "neutral";
}

function updateAffection(emotion) {
  const deltas = { happy: 4, shy: 3, neutral: 1, sad: 1, angry: 0 };
  state.affection = clamp(state.affection + (deltas[emotion] ?? 1), 0, 100, DEFAULT_STATE.affection);
}

function exportCharacterCard() {
  syncStateFromForm();
  const card = {
    version: 3,
    characterName: state.characterName,
    userNickname: state.userNickname,
    relationship: state.relationship,
    catchphrase: state.catchphrase,
    personalityTags: state.personalityTags,
    responseStyle: state.responseStyle,
    personaPrompt: state.personaPrompt,
    openingLine: state.openingLine,
    avatarDataUrl: state.avatarDataUrl,
    apiMode: state.apiMode,
    baseURL: state.baseURL,
    model: state.model,
    temperature: state.temperature,
    replyLanguage: state.replyLanguage,
    affection: state.affection
    ,
    memories: state.memories
    ,
    voiceEnabled: state.voiceEnabled,
    voiceAutoPlay: state.voiceAutoPlay,
    inworldVoiceId: state.inworldVoiceId,
    inworldModelId: state.inworldModelId,
    voiceLanguage: state.voiceLanguage,
    voiceStylePrompt: state.voiceStylePrompt,
    voiceVolume: state.voiceVolume,
    bgmDuckVolume: state.bgmDuckVolume
  };
  const blob = new Blob([JSON.stringify(card, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${state.characterName || "persona"}-角色卡.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("角色卡已导出，API Key 没有写入文件。");
}

function importCharacterCard(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const card = JSON.parse(String(reader.result));
      state = {
        ...state,
        version: 3,
        characterName: String(card.characterName || DEFAULT_STATE.characterName),
        userNickname: String(card.userNickname || DEFAULT_STATE.userNickname),
        relationship: String(card.relationship || DEFAULT_STATE.relationship),
        catchphrase: String(card.catchphrase || DEFAULT_STATE.catchphrase),
        personalityTags: String(card.personalityTags || DEFAULT_STATE.personalityTags),
        responseStyle: STYLE_COPY[card.responseStyle] ? card.responseStyle : DEFAULT_STATE.responseStyle,
        personaPrompt: String(card.personaPrompt || DEFAULT_STATE.personaPrompt),
        openingLine: String(card.openingLine || DEFAULT_STATE.openingLine),
        avatarDataUrl: String(card.avatarDataUrl || ""),
        apiMode: card.apiMode === "live" ? "live" : "mock",
        baseURL: String(card.baseURL || DEFAULT_STATE.baseURL),
        model: String(card.model || DEFAULT_STATE.model),
        temperature: clamp(Number(card.temperature), 0, 2, DEFAULT_STATE.temperature),
        replyLanguage: card.replyLanguage === "ja-JP" ? "ja-JP" : DEFAULT_STATE.replyLanguage,
        affection: clamp(Number(card.affection), 0, 100, DEFAULT_STATE.affection),
        memories: Array.isArray(card.memories) ? card.memories : [],
        voiceEnabled: Boolean(card.voiceEnabled),
        voiceAutoPlay: card.voiceAutoPlay !== false,
        inworldVoiceId: String(card.inworldVoiceId || ""),
        inworldModelId: String(card.inworldModelId || DEFAULT_STATE.inworldModelId),
        voiceLanguage: ["ja-JP", "zh-CN", "AUTO"].includes(card.voiceLanguage) ? card.voiceLanguage : DEFAULT_STATE.voiceLanguage,
        voiceStylePrompt: String(card.voiceStylePrompt || DEFAULT_STATE.voiceStylePrompt),
        voiceVolume: clamp(Number(card.voiceVolume), 0, 1, DEFAULT_STATE.voiceVolume),
        bgmDuckVolume: clamp(Number(card.bgmDuckVolume), 0, 1, DEFAULT_STATE.bgmDuckVolume)
      };
      saveState();
      syncFormFromState();
      renderAll();
      showToast("角色卡导入成功。");
    } catch {
      showToast("角色卡格式无法识别。");
    }
  };
  reader.readAsText(file);
}

const ChatService = {
  async sendMessage(options) {
    if (options.apiConfig.mode === "live") {
      await this.sendLive(options);
      return;
    }
    await this.sendMock(options);
  },

  async sendMock({ userText, history, character, onToken, onEmotion, onDone }) {
    const reply = buildMockReply(userText, history, character);
    let fullText = "";

    for (const chunk of chunkText(reply, 2 + Math.floor(Math.random() * 3))) {
      await delay(40 + Math.random() * 62);
      fullText += chunk;
      onToken(chunk);
      const emotion = detectEmotion(fullText);
      if (emotion !== "neutral") onEmotion(emotion);
    }

    onEmotion(detectEmotion(fullText));
    onDone();
  },

  async sendLive(options) {
    if (options.character.replyLanguage === "zh-CN") {
      await this.sendLiveChineseStable(options);
      return;
    }
    await this.sendLiveStreaming(options);
  },

  async sendLiveChineseStable({ history, character, apiConfig, onToken, onEmotion, onDone, onError }) {
    try {
      if (!apiConfig.apiKey) throw new Error("Live API 需要先填写 API Key");

      const endpoint = `${apiConfig.baseURL.replace(/\/$/, "")}/chat/completions`;
      const safeHistory = buildChineseSafeHistory(history);
      const messages = [
        { role: "system", content: buildSystemPrompt(character) },
        ...safeHistory
      ];

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiConfig.apiKey}`
        },
        body: JSON.stringify({
          model: apiConfig.model,
          messages,
          temperature: apiConfig.temperature,
          stream: false
        })
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`${response.status} ${response.statusText} ${detail.slice(0, 120)}`.trim());
      }

      const data = await response.json();
      let displayText = sanitizeDisplayText(data?.choices?.[0]?.message?.content || "");
      if (!displayText) throw new Error("模型没有返回可显示的对白");

      displayText = await enforceChineseDisplayText(displayText, apiConfig, character);

      if (!isDisplayChineseEnough(displayText)) {
        throw new Error("模型返回的对白仍然不是以中文为主，已拦截本次显示");
      }

      for (const chunk of chunkText(displayText, 3)) {
        onToken(chunk);
        await delay(24);
      }
      onEmotion(detectEmotion(displayText));
      onDone();
    } catch (error) {
      onError(error);
    }
  },

  async sendLiveDualTrack({ history, character, apiConfig, onToken, onEmotion, onDone, onError, onDualTrack }) {
    try {
      if (!apiConfig.apiKey) throw new Error("Live API 需要先填写 API Key");

      const endpoint = `${apiConfig.baseURL.replace(/\/$/, "")}/chat/completions`;
      const messages = [
        { role: "system", content: buildDualTrackSystemPrompt(character) },
        ...history.map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          content: message.content
        }))
      ];

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiConfig.apiKey}`
        },
        body: JSON.stringify({
          model: apiConfig.model,
          messages,
          temperature: apiConfig.temperature,
          stream: false
        })
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`${response.status} ${response.statusText} ${detail.slice(0, 120)}`.trim());
      }

      const data = await response.json();
      const rawText = data?.choices?.[0]?.message?.content || "";
      const dualTrack = parseDualTrackReply(rawText);
      if (!dualTrack) return false;

      const displayText = dualTrack.displayZh || "角色暂时没有说话。";
      const finalEmotion = dualTrack.emotion || detectEmotion(displayText);

      onDualTrack?.(dualTrack);
      for (const chunk of chunkText(displayText, 3)) {
        onToken(chunk);
        await delay(24);
      }
      onEmotion(finalEmotion);
      onDone();
      return true;
    } catch (error) {
      onError(error);
      return true;
    }
  },

  async sendLiveStreaming({ history, character, apiConfig, onToken, onEmotion, onDone, onError }) {
    try {
      if (!apiConfig.apiKey) throw new Error("Live API 需要先填写 API Key");

      const endpoint = `${apiConfig.baseURL.replace(/\/$/, "")}/chat/completions`;
      const messages = [
        { role: "system", content: buildSystemPrompt(character) },
        ...history.map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          content: message.content
        }))
      ];

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiConfig.apiKey}`
        },
        body: JSON.stringify({
          model: apiConfig.model,
          messages,
          temperature: apiConfig.temperature,
          stream: true
        })
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`${response.status} ${response.statusText} ${detail.slice(0, 120)}`.trim());
      }

      if (!response.body) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content || "";
        for (const chunk of chunkText(text, 3)) {
          onToken(chunk);
          await delay(24);
        }
        onDone();
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let fullText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.replace(/^data:\s*/, "");
          if (payload === "[DONE]") continue;
          const parsed = JSON.parse(payload);
          const token = parsed?.choices?.[0]?.delta?.content || "";
          if (token) {
            fullText += token;
            onToken(token);
            const emotion = detectEmotion(fullText);
            if (emotion !== "neutral") onEmotion(emotion);
          }
        }
      }

      onDone();
    } catch (error) {
      onError(error);
    }
  }
};

function shouldUseDualTrackResponse(character) {
  return character.voiceEnabled && character.replyLanguage === "zh-CN" && character.voiceLanguage === "ja-JP";
}

function normalizeEmotion(emotion) {
  return ["happy", "angry", "shy", "sad", "neutral"].includes(emotion) ? emotion : "neutral";
}

function parseDualTrackReply(rawText) {
  const text = String(rawText || "").trim();
  if (!text) return null;

  // 模型不一定会严格输出 JSON，所以依次尝试原文、去代码块、再截取最外层大括号。
  const candidates = [
    text,
    text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, ""),
    text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)
  ].filter((candidate) => candidate && candidate.includes("{") && candidate.includes("}"));

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      const displayZh = String(parsed.display_zh || parsed.displayZh || "").trim();
      const spokenJa = sanitizeSpokenJapanese(parsed.spoken_ja || parsed.spokenJa || "");
      if (!isDisplayChineseEnough(displayZh)) return null;
      return {
        displayZh,
        spokenJa,
        emotion: normalizeEmotion(String(parsed.emotion || detectEmotion(displayZh)).trim())
      };
    } catch {
      // 继续尝试下一个候选文本。
    }
  }

  return null;
}

function buildDualTrackSystemPrompt(character) {
  // 双轨模式下，屏幕显示中文，语音播放则单独准备日文台词。
  return [
    buildSystemPrompt(character),
    "",
    "你现在处于“双轨输出模式”：屏幕给玩家看的文本必须是中文，语音合成稿才是日文。",
    "你现在必须以严格 JSON 格式输出，不要 Markdown，不要代码块，不要额外解释。",
    "JSON 只能包含三个字段：display_zh、spoken_ja、emotion。",
    "display_zh：给玩家看的简体中文视觉小说对白，可以包含简短动作描写；禁止整句日语，禁止把日语翻译稿放进这里。",
    "display_zh 可以保留角色设定里明确写出的极短口癖，但除此之外必须尽量不用日文假名。",
    "spoken_ja：给日语 TTS 朗读的自然日语口语台词，只放可直接朗读的日文台词。",
    "spoken_ja 禁止包含任何中文汉字词句，禁止包含【】、[]、（）或()里的动作神态，禁止包含“她轻轻笑了”这类舞台说明。",
    "spoken_ja 不要逐字硬翻；如果 display_zh 里有动作描写，只翻译角色真正说出口的话。",
    "display_zh 和 spoken_ja 要表达同一层意思；display_zh 不要混入 spoken_ja 的内容。",
    "emotion：只能是 happy、angry、shy、sad、neutral 之一。",
    "示例：{\"display_zh\":\"【她轻轻别过脸】才不是担心你。\",\"spoken_ja\":\"べ、別にあなたのことを心配してたわけじゃないんだから。\",\"emotion\":\"shy\"}"
  ].join("\n");
}

function buildSystemPrompt(character) {
  const languageInstruction =
    character.replyLanguage === "ja-JP"
      ? "请使用自然日语回复。"
      : [
          "请使用简体中文回复。",
          "注意：语音语言设置不等于屏幕对白语言；即使后续语音会转换成日语，你在屏幕对白中也必须保持中文。",
          "除角色设定里明确写出的极短口癖外，不要输出日语假名或整句日语。",
          "如果你想表达日语语气，请改写成中文语气，不要直接写日文。",
          "你的输出会直接显示在游戏对话框里，所以必须是可读的中文对白。",
          "如果你脑中先想到了日语表达，也要先翻成中文再输出。"
        ].join("");

  return [
    character.personaPrompt,
    `角色名：${character.name}`,
    `用户称呼：${character.userNickname}`,
    `关系：${character.relationship}`,
    `口癖：${character.catchphrase}`,
    `性格标签：${character.tags.join("、")}`,
    `回复风格：${STYLE_COPY[character.responseStyle] || character.responseStyle}`,
    `回复语言：${character.replyLanguage === "ja-JP" ? "日语" : "简体中文"}`,
    languageInstruction,
    character.memories?.length
      ? `长期记忆：\n${character.memories.map((memory, index) => `${index + 1}. ${memory.text}`).join("\n")}`
      : "长期记忆：暂无",
    "请保持视觉小说角色的临场感。可以有简短动作描写，但不要输出系统提示。"
  ].join("\n");
}

function buildMockReply(userText, history, character) {
  const name = character.name || DEFAULT_STATE.characterName;
  const nickname = character.userNickname || DEFAULT_STATE.userNickname;
  const catchphrase = character.catchphrase || DEFAULT_STATE.catchphrase;
  const recentTurns = history.length > 4 ? "我还记得前面那几幕的铺垫。" : "这一幕刚刚开始。";
  const styleLine = {
    tsundere: `哼，${catchphrase}`,
    healing: `先深呼吸一下，${nickname}。我会在这里陪你。`,
    meme: `这波剧情开始有节目效果了，${nickname}。`,
    senpai: `听好了，${nickname}，学姐只讲一次重点。`
  }[character.responseStyle] || catchphrase;

  if (/(难过|压力|累|崩|焦虑|sad|emo)/i.test(userText)) {
    return `【${name}把窗边的夕光挡在你身后】${styleLine} 你现在不是失败，只是体力条见底了。${recentTurns} 先把最烦的那件事写成一句话，我陪你把它拆小。别一个人硬扛，真的。`;
  }

  if (/(喜欢|开心|成功|太好了|happy|赢|漂亮)/i.test(userText)) {
    return `【${name}的眼睛被夕阳映得闪闪发亮】太好了，开心！咳，才不是我也跟着高兴。${nickname}，这一幕值得存档。我们趁热把亮点再放大一点，让它像主线剧情的高光 CG。`;
  }

  if (/(笨蛋|生气|烦|讨厌|angry|可恶)/i.test(userText)) {
    return `【${name}抱起手臂，额角冒出小小怒号】喂，先别炸毛到把台词框都震碎啊。生气可以，但要把目标说清楚。${nickname}，我帮你怼的是问题本身，不是你的心情。`;
  }

  if (/(害羞|可爱|脸红|shy|老婆|喜欢你)/i.test(userText)) {
    return `【${name}别过脸，声音忽然小了一点】才、才不是因为这句话开心到脸红。${nickname}，你再这样说，我的情绪贴纸就要自己跳出来了。`;
  }

  if (/(学习|作业|考试|复习|论文|项目)/i.test(userText)) {
    return `【${name}把便签贴到课桌边缘】收到，${nickname}。学习剧情不要一口气打最终 Boss。先定 25 分钟专注回合，再列三件小任务：读一段、写一点、复盘一句。完成后我给你加好感度。`;
  }

  return `【${name}站在窗边，轻轻歪了歪头】${styleLine} 我会把你的这句话当成剧情分支。我的建议是先锁定一个目标，再拆成三格漫画：现在发生了什么、你希望它变成什么、下一步最小动作是什么。这样故事就会往前走。`;
}

function chunkText(text, size) {
  const chunks = [];
  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }
  return chunks;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function bindEvents() {
  dom.toggleSettings.addEventListener("click", openSettings);
  dom.closeSettings.addEventListener("click", closeSettings);
  dom.logButton.addEventListener("click", () => toggleLog());
  dom.closeLog.addEventListener("click", () => toggleLog(false));

  dom.autoButton.addEventListener("click", () => {
    autoMode = !autoMode;
    dom.autoButton.classList.toggle("active", autoMode);
    showToast(autoMode ? "AUTO 已开启：回复会保持更慢的演出节奏。" : "AUTO 已关闭。");
  });

  dom.skipButton.addEventListener("click", () => {
    showToast(isSending ? "正在快进当前回复..." : "当前没有可跳过的演出。");
  });

  [
    dom.voiceEnabled,
    dom.voiceAutoPlay,
    dom.inworldApiKey,
    dom.inworldVoiceId,
    dom.inworldModelId,
    dom.voiceLanguage,
    dom.voiceStylePrompt,
    dom.voiceVolume,
    dom.bgmDuckVolume
  ].forEach((control) => {
    // 这些控件共用同一套更新流程，浏览器触发 input 或 change 时都能同步状态。
    control.addEventListener("input", () => {
      syncStateFromForm();
      saveState();
      renderVoiceState();
    });
    control.addEventListener("change", () => {
      syncStateFromForm();
      saveState();
      renderVoiceState();
    });
  });

  dom.testVoice.addEventListener("click", () => {
    syncStateFromForm();
    saveState();
    testVoicePlayback();
  });

  dom.stopVoice.addEventListener("click", () => {
    stopVoicePlayback();
    showToast("语音播放已停止。");
  });

  dom.presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const preset = PROMPT_PRESETS[button.dataset.preset];
      if (!preset) return;
      state = { ...state, ...preset };
      syncFormFromState();
      renderCharacter();
      saveState();
      showToast(`已套用人格模板：${STYLE_COPY[preset.responseStyle]}`);
    });
  });

  dom.addMemory.addEventListener("click", () => {
    const text = dom.memoryInput.value.trim();
    if (!text) {
      showToast("先写一条要让角色记住的内容。");
      return;
    }
    state.memories.unshift({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text
    });
    dom.memoryInput.value = "";
    saveState();
    renderMemories();
    showToast("已加入长期记忆，会在 API Prompt 中生效。");
  });

  dom.clearMemories.addEventListener("click", () => {
    state.memories = [];
    saveState();
    renderMemories();
    showToast("长期记忆已清空。");
  });

  dom.bgmButton.addEventListener("click", () => dom.bgmInput.click());
  dom.bgmInput.addEventListener("change", (event) => {
    const [file] = event.target.files;
    handleBgmImport(file);
    event.target.value = "";
  });

  dom.muteButton.addEventListener("click", () => {
    if (dom.bgmAudio.paused || state.bgmMuted) {
      playBgm();
    } else {
      pauseBgm();
    }
  });

  dom.bgmVolume.addEventListener("input", () => {
    state.bgmVolume = clamp(Number(dom.bgmVolume.value), 0, 1, DEFAULT_STATE.bgmVolume);
    dom.bgmAudio.volume = state.bgmVolume;
    saveState();
    renderBgmState();
  });

  dom.clearBgm.addEventListener("click", async () => {
    dom.bgmAudio.pause();
    dom.bgmAudio.removeAttribute("src");
    if (bgmObjectUrl) URL.revokeObjectURL(bgmObjectUrl);
    bgmObjectUrl = "";
    state.bgmName = "";
    state.bgmMuted = false;
    await deleteBgmBlob();
    saveState();
    renderBgmState();
    showToast("BGM 已移除。");
  });

  dom.importBackground.addEventListener("click", () => dom.backgroundInput.click());
  dom.backgroundInput.addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("请选择图片文件作为背景。");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      state.backgroundDataUrl = String(reader.result);
      state.backgroundName = file.name;
      saveState();
      renderBackground();
      showToast(`背景已更换：${file.name}`);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  });

  dom.clearBackground.addEventListener("click", () => {
    state.backgroundDataUrl = "";
    state.backgroundName = "";
    saveState();
    renderBackground();
    showToast("已恢复默认教室背景。");
  });

  dom.backgroundDim.addEventListener("input", () => {
    state.backgroundDim = clamp(Number(dom.backgroundDim.value), 0, 0.65, DEFAULT_STATE.backgroundDim);
    saveState();
    renderBackground();
  });

  dom.saveConfig.addEventListener("click", () => {
    syncStateFromForm();
    saveState();
    renderCharacter();
    renderApiPill();
    showToast("角色卡已保存到本地浏览器。");
  });

  dom.resetConfig.addEventListener("click", () => {
    state = { ...DEFAULT_STATE, history: [] };
    saveState();
    syncFormFromState();
    renderAll();
    setEmotion("neutral");
    showToast("已恢复默认角色卡。");
  });

  dom.exportCard.addEventListener("click", exportCharacterCard);
  dom.importCardButton.addEventListener("click", () => dom.importCardInput.click());
  dom.importCardInput.addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (file) importCharacterCard(file);
    event.target.value = "";
  });

  dom.clearChat.addEventListener("click", () => {
    state.history = [];
    saveState();
    renderHistory();
    renderLog();
    setEmotion("neutral");
    showToast("已回到标题后的开场一幕。");
  });

  dom.chatForm.addEventListener("submit", handleSend);

  dom.quickChoices.forEach((button) => {
    button.addEventListener("click", () => {
      dom.userInput.value = button.dataset.prompt || "";
      dom.chatForm.requestSubmit();
    });
  });

  dom.avatarFile.addEventListener("change", (event) => {
    const [file] = event.target.files;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.avatarDataUrl = String(reader.result);
      saveState();
      renderCharacter();
      showToast("立绘已更新。");
    };
    reader.readAsDataURL(file);
  });

  dom.removeAvatar.addEventListener("click", () => {
    state.avatarDataUrl = "";
    dom.avatarFile.value = "";
    saveState();
    renderCharacter();
    showToast("已切回默认二次元立绘。");
  });

  dom.apiMode.addEventListener("change", () => {
    syncStateFromForm();
    saveState();
    renderApiPill();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSettings();
      toggleLog(false);
    }
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      dom.chatForm.requestSubmit();
    }
  });
}

syncFormFromState();
renderAll();
setEmotion("neutral");
bindEvents();
restoreBgm();
