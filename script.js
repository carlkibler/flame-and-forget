const form = document.getElementById("burn-form");
const input = document.getElementById("grievance");
const layer = document.querySelector(".note-layer");
const fireTarget = document.querySelector("[data-fire-target]");
const queueDeck = document.querySelector(".queue-deck");
const burnButton = document.getElementById("burn-button");
const examplesButton = document.getElementById("examples-button");
const historyToggle = document.getElementById("history-toggle");
const historyDrawer = document.getElementById("history-drawer");
const historyList = document.getElementById("history-list");
const historyEmpty = document.querySelector(".history-empty");
const releaseLog = document.getElementById("release-log");
const releaseList = document.getElementById("release-list");
const clearLogButton = document.getElementById("clear-log");
const rememberToggleCheckbox = document.getElementById("remember-items-toggle");
const rememberToggleButton = document.getElementById("remember-toggle-button");
const languageSelect = document.getElementById("language-select");
const fireStyleButtons = document.querySelectorAll("[data-fire-style-btn]");
const flameContainer = document.querySelector(".flame-container");
const settingsPanel = document.getElementById("settings-panel");
const resetSettingsButton = document.getElementById("reset-settings");
const root = document.documentElement;
let entryCounter = 0;
const burnHistory = [];

// localStorage keys
const STORAGE_KEYS = {
  releaseLog: "flameAndForget_releaseLog",
  rememberItems: "flameAndForget_rememberItems",
  settings: "flameAndForget_settings",
};

// Default settings
const DEFAULT_SETTINGS = {
  itemDelay: 2.5,
  fallDuration: 3.5,
  burnDuration: 2.2,
  flameIntensity: 0.8,
  fireStyle: "original",
};

const controls = {
  itemDelay: document.getElementById("item-delay"),
  fallDuration: document.getElementById("fall-duration"),
  burnDuration: document.getElementById("burn-duration"),
  flameIntensity: document.getElementById("flame-intensity"),
  displays: {
    itemDelay: document.getElementById("item-delay-display"),
    fallDuration: document.getElementById("fall-duration-display"),
    burnDuration: document.getElementById("burn-duration-display"),
    flameIntensity: document.getElementById("flame-intensity-display"),
  },
};

// Load settings from localStorage or use defaults
const loadedSettings = loadSettings();
const settings = {
  itemDelay: loadedSettings.itemDelay * 1000,
  dropDuration: loadedSettings.fallDuration * 1000,
  burnDuration: loadedSettings.burnDuration * 1000,
  flameIntensity: loadedSettings.flameIntensity,
  fireStyle: loadedSettings.fireStyle,
};

const pastelPalette = [
  { bg: "#fff7d6", border: "#f4d5a2", text: "#362511" },
  { bg: "#ffe3ec", border: "#ffb7c8", text: "#3c1520" },
  { bg: "#e6f6ff", border: "#bde8ff", text: "#113043" },
  { bg: "#f1f0ff", border: "#cbc5ff", text: "#272147" },
  { bg: "#e9ffef", border: "#bdf3cc", text: "#0f3a1e" },
  { bg: "#fff3e3", border: "#ffd4a8", text: "#412102" },
  { bg: "#f0fffb", border: "#c3f7e8", text: "#0c3b31" },
  { bg: "#ffeefa", border: "#ffd0f0", text: "#411133" },
  { bg: "#f7fff0", border: "#d8f5ad", text: "#1e3204" },
  { bg: "#ecf2ff", border: "#c8d7ff", text: "#122142" },
];
let paletteIndex = 0;

const burnQueue = [];
let processingQueue = false;

// Encouraging release templates
const releaseTemplates = [
  "I burned and let go of **{item}**.",
  "**{item}** is now in the past.",
  "Time to move on from **{item}**.",
  "**{item}**, be forgotten.",
  "I release **{item}** and feel lighter.",
  "**{item}** no longer defines me.",
  "Goodbye, **{item}**. You're history.",
  "I choose to forget **{item}**.",
  "**{item}** has turned to ash.",
  "Moving forward without **{item}**.",
  "I'm done carrying **{item}**.",
  "**{item}** can't hurt me anymore.",
  "I've made peace with **{item}**.",
  "**{item}** is behind me now.",
  "Released: **{item}**.",
  "**{item}** has been forgotten.",
  "I let **{item}** drift away like smoke.",
  "No more **{item}** weighing me down."
];

let lastTemplateIndex = -1;

// Example items for demonstration
const exampleItems = [
  "Sent a reply-all email meant for one person",
  "Called my teacher 'Mom' in front of the class",
  "Waved back at someone waving at the person behind me",
  "Tripped over nothing while people were watching",
  "Forgot someone's name right after they told me",
  "Left my mic unmuted during an awkward moment",
  "Sent a text complaining about someone... to that person",
  "Showed up to a Zoom meeting in pajamas",
  "Ate the last slice of pizza without asking",
  "Liked a months-old photo while stalking someone's profile",
  "Got caught singing loudly in the car at a red light",
  "Walked into a glass door thinking it was open",
  "Accidentally used the wrong emoji in a serious conversation",
  "Told the same story twice to the same person",
  "Replied 'you too' when the waiter said 'enjoy your meal'",
  "Forgot I was screen sharing during a presentation",
  "Laughed at something I shouldn't have",
  "Sent a meme to the wrong group chat",
  "Got someone's pronouns wrong",
  "Realized my fly was down all morning"
];

// ============================================================
// LOCALSTORAGE HELPERS
// ============================================================
function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.settings);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn("Failed to load settings from localStorage:", e);
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(newSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(newSettings));
  } catch (e) {
    console.warn("Failed to save settings to localStorage:", e);
  }
}

function getRememberItemsPreference() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.rememberItems);
    return saved !== "false"; // Default to true
  } catch (e) {
    return true;
  }
}

function setRememberItemsPreference(remember) {
  try {
    localStorage.setItem(STORAGE_KEYS.rememberItems, remember.toString());
    if (!remember) {
      // Clear release log when disabled
      localStorage.removeItem(STORAGE_KEYS.releaseLog);
    }
  } catch (e) {
    console.warn("Failed to save remember preference:", e);
  }
}

function loadReleaseLog() {
  if (!getRememberItemsPreference()) return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.releaseLog);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.warn("Failed to load release log:", e);
    return [];
  }
}

function saveReleaseLog(entries) {
  if (!getRememberItemsPreference()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.releaseLog, JSON.stringify(entries));
  } catch (e) {
    console.warn("Failed to save release log:", e);
  }
}

// ============================================================
// SEASONAL THEME
// ============================================================
function getCurrentSeason() {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return "spring"; // Mar-May
  if (month >= 5 && month <= 7) return "summer"; // Jun-Aug
  if (month >= 8 && month <= 10) return "autumn"; // Sep-Nov
  return "winter"; // Dec-Feb
}

function applySeasonalTheme() {
  const season = getCurrentSeason();
  document.body.setAttribute("data-season", season);

  // Apply seasonal colors to root
  const seasonalColors = {
    winter: { bg: "#0a1420", accent: "#4a90c8" },
    spring: { bg: "#1a1520", accent: "#e89acc" },
    summer: { bg: "#181408", accent: "#ffd166" },
    autumn: { bg: "#1a0f08", accent: "#ff8c42" }
  };

  const colors = seasonalColors[season];
  root.style.setProperty("--seasonal-bg", colors.bg);
  root.style.setProperty("--seasonal-accent", colors.accent);
}

// ============================================================
// SOUND EFFECTS
// ============================================================
const audioContext = typeof AudioContext !== 'undefined' ? new AudioContext() : null;

// Resume AudioContext on first user interaction (browser autoplay policy)
function ensureAudioContext() {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

function playWhooshSound() {
  if (!audioContext) return;
  ensureAudioContext();

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.connect(gain);
  gain.connect(audioContext.destination);

  // Whoosh: descending frequency
  osc.frequency.setValueAtTime(800, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);

  gain.gain.setValueAtTime(0.15, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.3);
}

function playCrackleSound() {
  if (!audioContext) return;
  ensureAudioContext();

  const bufferSize = audioContext.sampleRate * 0.5;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate crackling noise
  for (let i = 0; i < bufferSize; i++) {
    if (Math.random() > 0.9) {
      data[i] = (Math.random() * 2 - 1) * 0.08;
    } else {
      data[i] = 0;
    }
  }

  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();

  source.buffer = buffer;
  source.connect(gain);
  gain.connect(audioContext.destination);

  gain.gain.setValueAtTime(0.12, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

  source.start(audioContext.currentTime);
}

const translations = {
  en: {
    pageTitle: "Flame and Forget",
    title: "Flame and Forget 🔥",
    tagline:
      "Write down anything you're done with—regrets, cringey moments, bad habits, or just Tuesday. Burn it and move on.",
    inputLabel: "What needs to burn?",
    placeholder: "Type or paste then press Enter. example: wore stained shirt to meeting",
    burnButton: "Flame it and forget it",
    examplesButton: "Try some examples",
    settingsLabel: "Settings",
    languageLabel: "Language",
    rememberItemsLabel: "Remember my items",
    fireStyleLabel: "Fire style",
    fireStyleOriginal: "Original",
    fireStyleRealistic: "Realistic",
    fireStyleMystical: "Mystical",
    fireStyleMinimalist: "Minimalist",
    itemDelayLabel: "Item delay (seconds)",
    fallDurationLabel: "Fall duration (seconds)",
    burnDurationLabel: "Burn duration (seconds)",
    flameIntensityLabel: "Flame intensity",
    resetSettings: "Reset to defaults",
    releasedAndForgotten: "Released & Forgotten",
    remembering: "Remembering",
    notRemembering: "Not remembering",
    clearLog: "Clear log",
    fireAlt: "Trash can altar",
    footerCopy:
      "Share the link, let it all go, and watch your worries turn to smoke.",
    historyToggle: "Burn log",
    historyTitle: "Ashes archive",
    historyBlurb:
      "These moments are behind you now—recorded here only as proof they can't hurt your future.",
    historyEmpty: "Nothing has burned yet. Toss something in!",
  },
  zh: {
    pageTitle: "Flame and Forget",
    title: "Flame and Forget 🔥",
    tagline:
      "写下任何你想放下的事——尴尬时刻、坏习惯、或者只是糟糕的一天。烧掉它，继续前进。",
    inputLabel: "需要焚烧什么？",
    placeholder: "例如：在众人面前摔倒",
    burnButton: "烧掉并忘记",
    examplesButton: "试试示例",
    settingsLabel: "设置",
    languageLabel: "语言",
    rememberItemsLabel: "记住我的条目",
    fireStyleLabel: "火焰样式",
    fireStyleOriginal: "原始",
    fireStyleRealistic: "逼真",
    fireStyleMystical: "神秘",
    fireStyleMinimalist: "简约",
    itemDelayLabel: "条目间隔（秒）",
    fallDurationLabel: "下落时间（秒）",
    burnDurationLabel: "燃烧时间（秒）",
    flameIntensityLabel: "火焰强度",
    resetSettings: "恢复默认设置",
    releasedAndForgotten: "已释放与遗忘",
    remembering: "正在记住",
    notRemembering: "未记住",
    clearLog: "清除记录",
    fireAlt: "焚烧祭坛垃圾桶",
    footerCopy: "分享链接，放下一切，看着烦恼化为烟雾。",
    historyToggle: "焚烧记录",
    historyTitle: "灰烬档案",
    historyBlurb: "这些时刻已成过去，记录在此只为证明它们不能伤害你的未来。",
    historyEmpty: "还没有任何东西被焚烧，写点什么吧！",
  },
  es: {
    pageTitle: "Flame and Forget",
    title: "Flame and Forget 🔥",
    tagline:
      "Escribe lo que quieras dejar atrás—momentos vergonzosos, malos hábitos, o simplemente el martes. Quémalo y sigue adelante.",
    inputLabel: "¿Qué debe arder?",
    placeholder: "p. ej., Tropezar en las escaleras frente a todos",
    burnButton: "Quémalo y olvídalo",
    examplesButton: "Prueba algunos ejemplos",
    settingsLabel: "Configuración",
    languageLabel: "Idioma",
    rememberItemsLabel: "Recordar mis elementos",
    fireStyleLabel: "Estilo de fuego",
    fireStyleOriginal: "Original",
    fireStyleRealistic: "Realista",
    fireStyleMystical: "Místico",
    fireStyleMinimalist: "Minimalista",
    itemDelayLabel: "Intervalo entre notas (segundos)",
    fallDurationLabel: "Duración de la caída (segundos)",
    burnDurationLabel: "Duración de la combustión (segundos)",
    flameIntensityLabel: "Intensidad de la llama",
    resetSettings: "Restaurar valores predeterminados",
    releasedAndForgotten: "Liberado y Olvidado",
    remembering: "Recordando",
    notRemembering: "No recordando",
    clearLog: "Limpiar registro",
    fireAlt: "Altar de cubo de basura",
    footerCopy: "Comparte el enlace, déjalo todo ir y observa tus preocupaciones convertirse en humo.",
    historyToggle: "Registro ardiente",
    historyTitle: "Archivo de cenizas",
    historyBlurb:
      "Estos momentos quedaron atrás—registrados aquí solo como prueba de que no pueden dañar tu futuro.",
    historyEmpty: "Nada se ha quemado todavía. ¡Alimenta el fuego!",
  },
  fr: {
    pageTitle: "Flame and Forget",
    title: "Flame and Forget 🔥",
    tagline:
      "Écris tout ce que tu veux laisser derrière toi—moments embarrassants, mauvaises habitudes, ou simplement un mauvais mardi. Brûle-le et avance.",
    inputLabel: "Qu'est-ce qui doit brûler ?",
    placeholder: "ex. : Trébucher dans les escaliers devant tout le monde",
    burnButton: "Brûle et oublie",
    examplesButton: "Essayer des exemples",
    settingsLabel: "Paramètres",
    languageLabel: "Langue",
    rememberItemsLabel: "Mémoriser mes éléments",
    fireStyleLabel: "Style de flamme",
    fireStyleOriginal: "Original",
    fireStyleRealistic: "Réaliste",
    fireStyleMystical: "Mystique",
    fireStyleMinimalist: "Minimaliste",
    itemDelayLabel: "Intervalle entre notes (secondes)",
    fallDurationLabel: "Durée de la chute (secondes)",
    burnDurationLabel: "Durée de combustion (secondes)",
    flameIntensityLabel: "Intensité de la flamme",
    resetSettings: "Réinitialiser par défaut",
    releasedAndForgotten: "Libéré et Oublié",
    remembering: "Mémorisation",
    notRemembering: "Non mémorisé",
    clearLog: "Effacer le journal",
    fireAlt: "Autel-poubelle enflammé",
    footerCopy:
      "Partage le lien, laisse tout partir et regarde tes soucis se transformer en fumée.",
    historyToggle: "Journal des braises",
    historyTitle: "Archives des cendres",
    historyBlurb:
      "Ces moments sont derrière toi maintenant—enregistrés ici uniquement comme preuve qu'ils ne peuvent pas blesser ton avenir.",
    historyEmpty: "Rien n'a encore brûlé. Alimente le feu !",
  },
  de: {
    pageTitle: "Flame and Forget",
    title: "Flame and Forget 🔥",
    tagline:
      "Schreibe alles auf, was du hinter dir lassen willst—peinliche Momente, schlechte Gewohnheiten oder einfach nur einen schlechten Dienstag. Verbrenne es und mach weiter.",
    inputLabel: "Was soll brennen?",
    placeholder: "z.B. Vor allen auf der Treppe gestolpert",
    burnButton: "Verbrennen und vergessen",
    examplesButton: "Beispiele ausprobieren",
    settingsLabel: "Einstellungen",
    languageLabel: "Sprache",
    rememberItemsLabel: "Meine Einträge merken",
    fireStyleLabel: "Feuerstil",
    fireStyleOriginal: "Original",
    fireStyleRealistic: "Realistisch",
    fireStyleMystical: "Mystisch",
    fireStyleMinimalist: "Minimalistisch",
    itemDelayLabel: "Element-Verzögerung (Sekunden)",
    fallDurationLabel: "Falldauer (Sekunden)",
    burnDurationLabel: "Brenndauer (Sekunden)",
    flameIntensityLabel: "Flammenintensität",
    resetSettings: "Auf Standardwerte zurücksetzen",
    releasedAndForgotten: "Losgelassen & Vergessen",
    remembering: "Merken",
    notRemembering: "Nicht merken",
    clearLog: "Protokoll löschen",
    fireAlt: "Mülleimer-Altar",
    footerCopy:
      "Teile den Link, lass alles los und beobachte, wie deine Sorgen zu Rauch werden.",
    historyToggle: "Feuerprotokoll",
    historyTitle: "Aschenarchiv",
    historyBlurb:
      "Diese Momente liegen jetzt hinter dir—nur hier aufgezeichnet als Beweis, dass sie deine Zukunft nicht verletzen können.",
    historyEmpty: "Noch nichts verbrannt. Füttere das Feuer!",
  },
  it: {
    pageTitle: "Flame and Forget",
    title: "Flame and Forget 🔥",
    tagline:
      "Scrivi tutto ciò che vuoi lasciarti alle spalle—momenti imbarazzanti, cattive abitudini, o semplicemente un brutto martedì. Brucialo e vai avanti.",
    inputLabel: "Cosa deve bruciare?",
    placeholder: "es. Inciampato sulle scale davanti a tutti",
    burnButton: "Brucia e dimentica",
    examplesButton: "Prova alcuni esempi",
    settingsLabel: "Impostazioni",
    languageLabel: "Lingua",
    rememberItemsLabel: "Ricorda i miei elementi",
    fireStyleLabel: "Stile fuoco",
    fireStyleOriginal: "Originale",
    fireStyleRealistic: "Realistico",
    fireStyleMystical: "Mistico",
    fireStyleMinimalist: "Minimalista",
    itemDelayLabel: "Ritardo elemento (secondi)",
    fallDurationLabel: "Durata caduta (secondi)",
    burnDurationLabel: "Durata combustione (secondi)",
    flameIntensityLabel: "Intensità fiamma",
    resetSettings: "Ripristina impostazioni predefinite",
    releasedAndForgotten: "Rilasciato e Dimenticato",
    remembering: "Ricordando",
    notRemembering: "Non ricordando",
    clearLog: "Cancella registro",
    fireAlt: "Altare del cestino",
    footerCopy:
      "Condividi il link, lascia andare tutto e guarda le tue preoccupazioni trasformarsi in fumo.",
    historyToggle: "Registro fuoco",
    historyTitle: "Archivio cenere",
    historyBlurb:
      "Questi momenti sono ormai alle tue spalle—registrati qui solo come prova che non possono danneggiare il tuo futuro.",
    historyEmpty: "Niente è ancora bruciato. Alimenta il fuoco!",
  },
};

const languageOptions = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
];
let examplesDebounce = false;

burnButton?.addEventListener("click", () => {
  queueFromTextarea();
});

examplesButton?.addEventListener("click", () => {
  // Prevent spam clicking
  if (examplesDebounce) return;

  examplesDebounce = true;
  setTimeout(() => {
    examplesDebounce = false;
  }, 1000);

  // Pick 3 random unique examples
  const shuffled = [...exampleItems].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  // Queue examples with staggered timing (300ms between each)
  selected.forEach((item, index) => {
    setTimeout(() => {
      enqueueMessages([item]);
    }, index * 300);
  });
});

historyToggle?.addEventListener("click", () => {
  toggleHistoryDrawer();
});

clearLogButton?.addEventListener("click", () => {
  if (releaseList) {
    releaseList.innerHTML = "";
    saveReleaseLog([]); // Clear localStorage too
  }
});

// Remember items toggle handlers
function updateRememberToggleUI(remember) {
  if (rememberToggleCheckbox) {
    rememberToggleCheckbox.checked = remember;
  }
  if (rememberToggleButton) {
    rememberToggleButton.setAttribute("aria-pressed", remember.toString());
    const label = rememberToggleButton.querySelector(".label");
    if (label) {
      const currentLang = languageSelect.value || "en";
      const pack = translations[currentLang] || translations.en;
      label.textContent = remember ? pack.remembering : pack.notRemembering;
    }
  }
}

rememberToggleCheckbox?.addEventListener("change", (event) => {
  const remember = event.target.checked;
  setRememberItemsPreference(remember);
  updateRememberToggleUI(remember);
});

rememberToggleButton?.addEventListener("click", () => {
  const currentState = getRememberItemsPreference();
  const newState = !currentState;
  setRememberItemsPreference(newState);
  updateRememberToggleUI(newState);
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    historyToggle?.getAttribute("aria-expanded") === "true"
  ) {
    toggleHistoryDrawer(false);
  }
});

input.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    !event.shiftKey &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey
  ) {
    event.preventDefault();
    commitInlineEntry();
  }
});

function commitInlineEntry() {
  const line = input.value.trim();
  if (!line) {
    return;
  }
  enqueueMessages([line], { animateFromInput: true });
  input.value = "";
  input.focus();
}

function queueFromTextarea() {
  const messages = input.value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!messages.length) {
    return;
  }

  enqueueMessages(messages);
  input.value = "";
  input.focus();
}

function enqueueMessages(messages, options = {}) {
  messages.forEach((message, index) => {
    const entry = createQueueEntry(message);
    burnQueue.push(entry);
    // Simplified: always settle directly into deck, no animation
    settleEntryIntoDeck(entry);
  });
  processQueue();
}

function createQueueEntry(text) {
  const entry = {
    id: `entry-${Date.now()}-${entryCounter++}`,
    text,
    color: nextPalette(),
    placement: generateQueuePlacement(),
    element: createEntryElement(text),
    processed: false,
    ready: false,
  };
  applyNotePalette(entry.element, entry.color);
  return entry;
}

function nextPalette() {
  const palette = pastelPalette[paletteIndex % pastelPalette.length];
  paletteIndex += 1;
  return palette;
}

function generateQueuePlacement() {
  return {
    leftPercent: 50 + (Math.random() - 0.5) * 40,
    topOffset: 70 + Math.random() * 60,
    tilt: randomTilt(),
  };
}

function createEntryElement(text) {
  const card = document.createElement("div");
  card.className = "note-card queue-card";

  // Create a text node, not textContent (to avoid any weird dot issues)
  const textNode = document.createTextNode(text);
  card.appendChild(textNode);

  return card;
}

function animateEntryFromInput(entry) {
  if (!queueDeck || !layer) {
    settleEntryIntoDeck(entry);
    return;
  }

  const element = entry.element;
  element.classList.add("floating-card");
  layer.appendChild(element);
  const layerRect = layer.getBoundingClientRect();
  const inputRect = input.getBoundingClientRect();
  const deckRect = queueDeck.getBoundingClientRect();
  const startX = inputRect.left + inputRect.width - 30;
  const startY = inputRect.top + inputRect.height / 2;
  element.style.left = `${startX - layerRect.left}px`;
  element.style.top = `${startY - layerRect.top}px`;
  element.style.setProperty("--queue-tilt", `${entry.placement.tilt}deg`);

  const targetPoint = computeDeckTargetPoint(entry.placement, deckRect);
  requestAnimationFrame(() => {
    element.classList.add("arrive");
    element.style.left = `${targetPoint.x - layerRect.left}px`;
    element.style.top = `${targetPoint.y - layerRect.top}px`;
  });

  let fallbackTimer = null;

  const finalizeFloating = () => {
    clearTimeout(fallbackTimer);
    element.removeEventListener("transitionend", onTransitionEnd);
    settleEntryIntoDeck(entry);
  };

  const onTransitionEnd = (event) => {
    if (event.propertyName !== "transform") {
      return;
    }
    finalizeFloating();
  };

  element.addEventListener("transitionend", onTransitionEnd, { once: true });
  fallbackTimer = setTimeout(finalizeFloating, 700);
}

function settleEntryIntoDeck(entry) {
  if (!queueDeck || !layer) {
    entry.ready = true;
    return;
  }

  const element = entry.element;
  // Element already has note-card and queue-card classes from creation
  const pos = getDeckLocalPosition(entry);
  element.style.left = `${pos.left}px`;
  element.style.top = `${pos.top}px`;
  element.style.setProperty("--queue-tilt", `${entry.placement.tilt}deg`);
  queueDeck.appendChild(element);
  entry.ready = true;
}

function computeDeckTargetPoint(placement, deckRect) {
  const left =
    deckRect.left + (placement.leftPercent / 100) * deckRect.width;
  const top = deckRect.top + placement.topOffset;
  return { x: left, y: top };
}

function getDeckLocalPosition(entry) {
  if (!queueDeck) {
    return { left: 0, top: 0 };
  }
  const deckRect = queueDeck.getBoundingClientRect();
  const point = computeDeckTargetPoint(entry.placement, deckRect);
  return {
    left: point.x - deckRect.left,
    top: point.y - deckRect.top,
  };
}

function processQueue() {
  if (processingQueue) {
    return;
  }
  processingQueue = true;

  const run = () => {
    if (!burnQueue.length) {
      processingQueue = false;
      return;
    }

    const entry = burnQueue[0];
    if (!entry.ready) {
      setTimeout(run, 80);
      return;
    }

    burnQueue.shift();
    if (!entry) {
      processingQueue = false;
      return;
    }
    entry.processed = true;

    dropEntry(entry);
    setTimeout(run, settings.itemDelay);
  };

  run();
}

function dropEntry(entry) {
  const element = entry.element;
  if (!element || !queueDeck || !layer || !fireTarget) {
    return;
  }

  // Capture the on-screen position before removing from the queue container
  const elementRect = element.getBoundingClientRect();
  if (!elementRect) {
    return;
  }

  // Remove from queue deck so we can re-use the element for the drop animation
  if (queueDeck?.contains(element)) {
    queueDeck.removeChild(element);
  }

  // Prepare the queue card so it can be positioned freely in the layer
  prepareEntryForDrop(entry);

  // Position at the queue position (where the element was)
  const layerRect = layer.getBoundingClientRect();
  const fireRect = fireTarget.getBoundingClientRect();

  const startX = elementRect.left + elementRect.width / 2;
  const startY = elementRect.top + elementRect.height / 2;

  element.style.left = `${startX - layerRect.left}px`;
  element.style.top = `${startY - layerRect.top}px`;

  // Set tilt and target (into the fire). Preserve the queue tilt if available so
  // the element doesn't visibly snap to a new angle.
  const tilt = entry.placement?.tilt ?? randomTilt();
  element.style.setProperty("--tilt", `${tilt}deg`);

  const targetX = fireRect.left + fireRect.width / 2;
  const targetY = fireRect.top + fireRect.height * 0.3;
  element.style.setProperty("--delta-x", `${targetX - startX}px`);
  element.style.setProperty("--delta-y", `${targetY - startY}px`);

  // Append to layer
  layer?.appendChild(element);

  // Start animation immediately after forcing the class change in the same frame
  requestAnimationFrame(() => {
    element.classList.remove("queue-card");
    ensureSmoke(element);
    element.classList.add("note");
    element.classList.add("ignite");
    // Trigger flame burst when card is 70% down
    setTimeout(() => triggerFlameBurst(), settings.dropDuration * 0.7);
    // Play crackle when card reaches the fire (after drop completes)
    setTimeout(() => playCrackleSound(), settings.dropDuration);
  });

  const onBurnEnd = (event) => {
    if (event.animationName !== "note-burn") {
      return;
    }
    element.removeEventListener("animationend", onBurnEnd);
    element.remove();
  };

  element.addEventListener("animationend", onBurnEnd);
  recordBurn(entry);
}

function prepareEntryForDrop(entry) {
  const element = entry.element;
  element.classList.remove("floating-card", "arrive");
  element.style.position = "absolute";
  element.style.removeProperty("--queue-left");
  element.style.removeProperty("--queue-top");
  element.style.removeProperty("--queue-tilt");
  element.style.removeProperty("transform");
  applyNotePalette(element, entry.color);
}

function ensureSmoke(node) {
  if (!node.querySelector(".smoke")) {
    const smoke = document.createElement("span");
    smoke.className = "smoke";
    smoke.setAttribute("aria-hidden", "true");
    node.appendChild(smoke);
  }
}

function applyNotePalette(node, color = pastelPalette[0]) {
  // Set CSS variables
  node.style.setProperty("--card-bg", color.bg);
  node.style.setProperty("--card-border", color.border);
  node.style.setProperty("--card-text", color.text);
  node.style.setProperty("--note-bg", color.bg);
  node.style.setProperty("--note-border", color.border);
  node.style.setProperty("--note-text", color.text);

  // Also set directly as backup to ensure styling works
  node.style.backgroundColor = color.bg;
  node.style.borderColor = color.border;
  node.style.color = color.text;
}

function positionNote(note, originRect, tiltValue) {
  const layerRect = layer.getBoundingClientRect();
  const fireRect = fireTarget.getBoundingClientRect();
  let startX;
  let startY;
  if (originRect) {
    startX = originRect.left + originRect.width / 2;
    startY = originRect.top + originRect.height / 2;
  } else {
    const formRect = form.getBoundingClientRect();
    startX =
      formRect.left + formRect.width * (0.3 + Math.random() * 0.4);
    startY = formRect.top + formRect.height / 2;
  }

  const targetX = fireRect.left + fireRect.width / 2;
  const targetY = fireRect.top + fireRect.height * (0.25 + Math.random() * 0.3);

  note.style.left = `${startX - layerRect.left}px`;
  note.style.top = `${startY - layerRect.top}px`;
  note.style.setProperty("--delta-x", `${targetX - startX}px`);
  note.style.setProperty("--delta-y", `${targetY - startY}px`);
  const tilt = tiltValue ?? randomTilt();
  note.style.setProperty("--tilt", `${tilt}deg`);
}

function updateDurationVars() {
  root.style.setProperty("--note-drop-duration", `${settings.dropDuration}ms`);
  root.style.setProperty("--note-burn-duration", `${settings.burnDuration}ms`);
}

function updateFlameVars() {
  root.style.setProperty("--flame-scale", settings.flameIntensity);
  // Scale brightness more aggressively with intensity
  const brightness = Math.min(
    1.6,
    Math.max(0.6, 0.8 + (settings.flameIntensity - 0.8) * 1.2),
  );
  root.style.setProperty("--flame-brightness", brightness.toFixed(2));
}

function triggerFlameBurst() {
  const baseScale = settings.flameIntensity;
  // Burst sequence: baseline → peaks → settle
  const burstSequence = [
    { scale: baseScale * 1.12, duration: 150 },
    { scale: baseScale * 1.3, duration: 200 },
    { scale: baseScale * 1.41, duration: 250 },
    { scale: baseScale * 1.36, duration: 200 },
    { scale: baseScale * 1.24, duration: 150 },
    { scale: baseScale, duration: 200 },
  ];

  let elapsed = 0;
  burstSequence.forEach((step) => {
    setTimeout(() => {
      // Add random jitter: ±0.06
      const jitter = (Math.random() - 0.5) * 0.12;
      const jitteredScale = step.scale + jitter;
      root.style.setProperty("--flame-scale", jitteredScale);
      // Scale brightness more aggressively with intensity
      const brightness = Math.min(
        1.6,
        Math.max(0.6, 0.8 + (jitteredScale - 0.8) * 1.2),
      );
      root.style.setProperty("--flame-brightness", brightness.toFixed(2));
    }, elapsed);
    elapsed += step.duration;
  });
}

function randomTilt() {
  const u = Math.random() || 1e-4;
  const v = Math.random() || 1e-4;
  const standardNormal = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  const stdDev = 5;
  const angle = Math.max(-15, Math.min(15, standardNormal * stdDev));
  return angle.toFixed(2);
}

function recordBurn(entry) {
  burnHistory.unshift({
    id: entry.id,
    text: entry.text,
    color: entry.color,
    burnedAt: new Date(),
  });
  if (burnHistory.length > 40) {
    burnHistory.pop();
  }
  renderHistory();
  addToReleaseLog(entry.text);
}

function addToReleaseLog(itemText) {
  if (!releaseList) return;

  // Pick a random template different from the last one
  let templateIndex;
  do {
    templateIndex = Math.floor(Math.random() * releaseTemplates.length);
  } while (templateIndex === lastTemplateIndex && releaseTemplates.length > 1);
  lastTemplateIndex = templateIndex;

  const template = releaseTemplates[templateIndex];
  const message = template.replace("{item}", itemText);

  // Parse markdown-style bold (**text**)
  const html = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Create new log entry
  const div = document.createElement("div");
  div.className = "release-entry";
  div.innerHTML = html;

  // Add to top of list
  releaseList.insertBefore(div, releaseList.firstChild);

  // Limit to 20 entries
  while (releaseList.children.length > 20) {
    releaseList.removeChild(releaseList.lastChild);
  }

  // Save to localStorage
  const entries = Array.from(releaseList.children).map(el => el.innerHTML);
  saveReleaseLog(entries);
}

function loadAndRenderReleaseLog() {
  if (!releaseList) return;

  const entries = loadReleaseLog();
  entries.forEach(html => {
    const div = document.createElement("div");
    div.className = "release-entry";
    div.innerHTML = html;
    releaseList.appendChild(div);
  });
}

function renderHistory() {
  if (!historyList || !historyEmpty) {
    return;
  }

  historyList.innerHTML = "";
  if (!burnHistory.length) {
    historyEmpty.hidden = false;
    historyList.classList.remove("visible");
    return;
  }

  historyEmpty.hidden = true;
  historyList.classList.add("visible");
  burnHistory.forEach((item) => {
    const li = document.createElement("li");
    li.className = "history-item";
    li.style.setProperty("--card-bg", item.color.bg);
    li.style.setProperty("--card-border", item.color.border);
    li.style.setProperty("--card-text", item.color.text);
    li.textContent = item.text;
    const time = document.createElement("span");
    time.className = "time";
    time.textContent = item.burnedAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    li.appendChild(time);
    historyList.appendChild(li);
  });
}

function toggleHistoryDrawer(forceState) {
  if (!historyDrawer || !historyToggle) {
    return;
  }
  const current =
    historyToggle.getAttribute("aria-expanded") === "true";
  const nextState =
    typeof forceState === "boolean" ? forceState : !current;
  historyToggle.setAttribute("aria-expanded", nextState ? "true" : "false");
  historyDrawer.classList.toggle("open", nextState);
  historyDrawer.setAttribute("aria-hidden", nextState ? "false" : "true");
}

function handleRangeInput(control, formatter, updater, saveCallback) {
  control.addEventListener("input", (event) => {
    const value = parseFloat(event.target.value);
    updater(value);
    if (formatter) {
      formatter(value);
    }
    if (saveCallback) {
      saveCallback();
    }
  });
}

function saveCurrentSettings() {
  const settingsToSave = {
    itemDelay: settings.itemDelay / 1000,
    fallDuration: settings.dropDuration / 1000,
    burnDuration: settings.burnDuration / 1000,
    flameIntensity: settings.flameIntensity,
    fireStyle: settings.fireStyle,
  };
  saveSettings(settingsToSave);
}

handleRangeInput(
  controls.itemDelay,
  (value) => {
    controls.displays.itemDelay.textContent = `${value.toFixed(1)}s`;
  },
  (value) => {
    settings.itemDelay = value * 1000;
  },
  saveCurrentSettings,
);

handleRangeInput(
  controls.fallDuration,
  (value) => {
    controls.displays.fallDuration.textContent = `${value.toFixed(1)}s`;
  },
  (value) => {
    settings.dropDuration = value * 1000;
    updateDurationVars();
  },
  saveCurrentSettings,
);

handleRangeInput(
  controls.burnDuration,
  (value) => {
    controls.displays.burnDuration.textContent = `${value.toFixed(1)}s`;
  },
  (value) => {
    settings.burnDuration = value * 1000;
    updateDurationVars();
  },
  saveCurrentSettings,
);

handleRangeInput(
  controls.flameIntensity,
  (value) => {
    controls.displays.flameIntensity.textContent = `${Math.round((value / 0.8) * 100)}%`;
  },
  (value) => {
    settings.flameIntensity = value;
    updateFlameVars();
  },
  saveCurrentSettings,
);

function initLanguageOptions() {
  languageOptions.forEach((entry) => {
    const option = document.createElement("option");
    option.value = entry.code;
    option.textContent = entry.label;
    languageSelect.appendChild(option);
  });

  const browserLang = (navigator.language || "en").slice(0, 2).toLowerCase();
  const initialLang = translations[browserLang] ? browserLang : "en";
  languageSelect.value = initialLang;
  applyTranslations(initialLang);
}

languageSelect.addEventListener("change", (event) => {
  applyTranslations(event.target.value);
});

// Fire style button handlers
fireStyleButtons.forEach(button => {
  button.addEventListener("click", () => {
    const style = button.dataset.fireStyleBtn;
    settings.fireStyle = style;
    applyFireStyle(style);

    // Save to localStorage
    const settingsToSave = {
      itemDelay: settings.itemDelay / 1000,
      fallDuration: settings.dropDuration / 1000,
      burnDuration: settings.burnDuration / 1000,
      flameIntensity: settings.flameIntensity,
      fireStyle: settings.fireStyle,
    };
    saveSettings(settingsToSave);

    // Update button states
    fireStyleButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
  });
});

function applyFireStyle(style) {
  if (flameContainer) {
    flameContainer.setAttribute("data-fire-style", style);
  }
  // Update button states
  fireStyleButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.fireStyleBtn === style);
  });
}

// Settings panel: close on outside click
document.addEventListener("click", (event) => {
  if (settingsPanel && settingsPanel.hasAttribute("open")) {
    if (!settingsPanel.contains(event.target)) {
      settingsPanel.removeAttribute("open");
    }
  }
});

// Reset settings button
resetSettingsButton?.addEventListener("click", () => {
  // Reset to defaults
  controls.itemDelay.value = DEFAULT_SETTINGS.itemDelay;
  controls.fallDuration.value = DEFAULT_SETTINGS.fallDuration;
  controls.burnDuration.value = DEFAULT_SETTINGS.burnDuration;
  controls.flameIntensity.value = DEFAULT_SETTINGS.flameIntensity;

  // Update displays
  controls.displays.itemDelay.textContent = `${DEFAULT_SETTINGS.itemDelay.toFixed(1)}s`;
  controls.displays.fallDuration.textContent = `${DEFAULT_SETTINGS.fallDuration.toFixed(1)}s`;
  controls.displays.burnDuration.textContent = `${DEFAULT_SETTINGS.burnDuration.toFixed(1)}s`;
  controls.displays.flameIntensity.textContent = `${Math.round((DEFAULT_SETTINGS.flameIntensity / 0.8) * 100)}%`;

  // Update internal settings
  settings.itemDelay = DEFAULT_SETTINGS.itemDelay * 1000;
  settings.dropDuration = DEFAULT_SETTINGS.fallDuration * 1000;
  settings.burnDuration = DEFAULT_SETTINGS.burnDuration * 1000;
  settings.flameIntensity = DEFAULT_SETTINGS.flameIntensity;
  settings.fireStyle = DEFAULT_SETTINGS.fireStyle;

  updateDurationVars();
  updateFlameVars();
  applyFireStyle(DEFAULT_SETTINGS.fireStyle);

  // Save to localStorage
  saveSettings(DEFAULT_SETTINGS);
});

function applyTranslations(lang) {
  const pack = translations[lang] || translations.en;
  document.title = pack.pageTitle;
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (pack[key]) {
      node.textContent = pack[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.dataset.i18nPlaceholder;
    if (pack[key]) {
      node.setAttribute("placeholder", pack[key]);
    }
  });

  // Update dynamic remember toggle label
  updateRememberToggleUI(getRememberItemsPreference());
}

// Apply loaded settings to UI controls
controls.itemDelay.value = loadedSettings.itemDelay;
controls.fallDuration.value = loadedSettings.fallDuration;
controls.burnDuration.value = loadedSettings.burnDuration;
controls.flameIntensity.value = loadedSettings.flameIntensity;

// Update displays
controls.displays.itemDelay.textContent = `${loadedSettings.itemDelay.toFixed(1)}s`;
controls.displays.fallDuration.textContent = `${loadedSettings.fallDuration.toFixed(1)}s`;
controls.displays.burnDuration.textContent = `${loadedSettings.burnDuration.toFixed(1)}s`;
controls.displays.flameIntensity.textContent = `${Math.round((loadedSettings.flameIntensity / 0.8) * 100)}%`;

updateDurationVars();
updateFlameVars();
initLanguageOptions();
applySeasonalTheme();
applyFireStyle(settings.fireStyle);
renderHistory();

// Load and render saved release log entries
loadAndRenderReleaseLog();

// Initialize remember toggle UI
updateRememberToggleUI(getRememberItemsPreference());

input?.focus();
