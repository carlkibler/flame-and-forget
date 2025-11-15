const form = document.getElementById("burn-form");
const input = document.getElementById("grievance");
const layer = document.querySelector(".note-layer");
const fireTarget = document.querySelector("[data-fire-target]");
const queueDeck = document.querySelector(".queue-deck");
const burnButton = document.getElementById("burn-button");
const historyToggle = document.getElementById("history-toggle");
const historyDrawer = document.getElementById("history-drawer");
const historyList = document.getElementById("history-list");
const historyEmpty = document.querySelector(".history-empty");
const languageSelect = document.getElementById("language-select");
const root = document.documentElement;
let entryCounter = 0;
const burnHistory = [];

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

const settings = {
  itemDelay: parseFloat(controls.itemDelay.value) * 1000,
  dropDuration: parseFloat(controls.fallDuration.value) * 1000,
  burnDuration: parseFloat(controls.burnDuration.value) * 1000,
  flameIntensity: parseFloat(controls.flameIntensity.value),
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

const translations = {
  en: {
    pageTitle: "Flame & Forget",
    title: "Flame & Forget 🔥",
    tagline:
      "Write down anything you're done with—regrets, cringey moments, bad habits, or just Tuesday. Burn it and move on.",
    inputLabel: "What needs to burn?",
    placeholder: "e.g., Tripping on the stairs in front of everyone",
    burnButton: "Burn it and forget it",
    settingsLabel: "Settings",
    languageLabel: "Language",
    itemDelayLabel: "Item delay (seconds)",
    fallDurationLabel: "Fall duration (seconds)",
    burnDurationLabel: "Burn duration (seconds)",
    flameIntensityLabel: "Flame intensity",
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
    pageTitle: "烧掉忘掉",
    title: "烧掉忘掉 🔥",
    tagline:
      "写下任何你想放下的事——尴尬时刻、坏习惯、或者只是糟糕的一天。烧掉它，继续前进。",
    inputLabel: "需要焚烧什么？",
    placeholder: "例如：在众人面前摔倒",
    burnButton: "烧掉并忘记",
    settingsLabel: "设置",
    languageLabel: "语言",
    itemDelayLabel: "条目间隔（秒）",
    fallDurationLabel: "下落时间（秒）",
    burnDurationLabel: "燃烧时间（秒）",
    flameIntensityLabel: "火焰强度",
    fireAlt: "焚烧祭坛垃圾桶",
    footerCopy: "分享链接，放下一切，看着烦恼化为烟雾。",
    historyToggle: "焚烧记录",
    historyTitle: "灰烬档案",
    historyBlurb: "这些时刻已成过去，记录在此只为证明它们不能伤害你的未来。",
    historyEmpty: "还没有任何东西被焚烧，写点什么吧！",
  },
  es: {
    pageTitle: "Quémalo y Olvídalo",
    title: "Quémalo y Olvídalo 🔥",
    tagline:
      "Escribe lo que quieras dejar atrás—momentos vergonzosos, malos hábitos, o simplemente el martes. Quémalo y sigue adelante.",
    inputLabel: "¿Qué debe arder?",
    placeholder: "p. ej., Tropezar en las escaleras frente a todos",
    burnButton: "Quémalo y olvídalo",
    settingsLabel: "Configuración",
    languageLabel: "Idioma",
    itemDelayLabel: "Intervalo entre notas (segundos)",
    fallDurationLabel: "Duración de la caída (segundos)",
    burnDurationLabel: "Duración de la combustión (segundos)",
    flameIntensityLabel: "Intensidad de la llama",
    fireAlt: "Altar de cubo de basura",
    footerCopy: "Comparte el enlace, déjalo todo ir y observa tus preocupaciones convertirse en humo.",
    historyToggle: "Registro ardiente",
    historyTitle: "Archivo de cenizas",
    historyBlurb:
      "Estos momentos quedaron atrás—registrados aquí solo como prueba de que no pueden dañar tu futuro.",
    historyEmpty: "Nada se ha quemado todavía. ¡Alimenta el fuego!",
  },
  hi: {
    pageTitle: "जलाओ और भूल जाओ",
    title: "जलाओ और भूल जाओ 🔥",
    tagline:
      "वह सब लिखें जो आप पीछे छोड़ना चाहते हैं—शर्मनाक पल, बुरी आदतें, या सिर्फ बुरा दिन। इसे जलाएं और आगे बढ़ें।",
    inputLabel: "क्या जलाना है?",
    placeholder: "उदा. सबके सामने सीढ़ियों पर गिरना",
    burnButton: "जलाओ और भूल जाओ",
    settingsLabel: "सेटिंग्स",
    languageLabel: "भाषा",
    itemDelayLabel: "नोट अंतराल (सेकंड)",
    fallDurationLabel: "गिरने की अवधि (सेकंड)",
    burnDurationLabel: "जलने की अवधि (सेकंड)",
    flameIntensityLabel: "लौ की तीव्रता",
    fireAlt: "आग का कूड़ेदान वेदी",
    footerCopy: "लिंक साझा करें, सब कुछ जाने दें, और अपनी चिंताओं को धुएं में बदलते देखें।",
    historyToggle: "आग लॉग",
    historyTitle: "राख अभिलेख",
    historyBlurb:
      "ये पल अब आपके पीछे हैं—यहां केवल इस बात के प्रमाण के रूप में दर्ज हैं कि वे आपके भविष्य को नुकसान नहीं पहुंचा सकते।",
    historyEmpty: "अभी तक कुछ नहीं जला। आग को कुछ दीजिए!",
  },
  ar: {
    pageTitle: "احرق وانسَ",
    title: "احرق وانسَ 🔥",
    tagline:
      "اكتب أي شيء تريد تركه خلفك—لحظات محرجة، عادات سيئة، أو مجرد يوم سيء. احرقه وتقدم للأمام।",
    inputLabel: "ما الذي يجب أن يحترق؟",
    placeholder: "مثال: التعثر على السلالم أمام الجميع",
    burnButton: "احرقه وانساه",
    settingsLabel: "الإعدادات",
    languageLabel: "اللغة",
    itemDelayLabel: "الفاصل بين العناصر (بالثواني)",
    fallDurationLabel: "مدة السقوط (بالثواني)",
    burnDurationLabel: "مدة الاحتراق (بالثواني)",
    flameIntensityLabel: "شدة اللهب",
    fireAlt: "موقد سلة المهملات",
    footerCopy: "شارك الرابط، اترك كل شيء، وشاهد همومك تتحول إلى دخان।",
    historyToggle: "سجل الحرق",
    historyTitle: "أرشيف الرماد",
    historyBlurb:
      "هذه اللحظات أصبحت خلفك الآن—مسجلة هنا فقط كدليل على أنها لا يمكن أن تؤذي مستقبلك।",
    historyEmpty: "لم يُحرق شيء بعد. غذِّ النار!",
  },
  fr: {
    pageTitle: "Brûle et Oublie",
    title: "Brûle et Oublie 🔥",
    tagline:
      "Écris tout ce que tu veux laisser derrière toi—moments embarrassants, mauvaises habitudes, ou simplement un mauvais mardi. Brûle-le et avance.",
    inputLabel: "Qu'est-ce qui doit brûler ?",
    placeholder: "ex. : Trébucher dans les escaliers devant tout le monde",
    burnButton: "Brûle et oublie",
    settingsLabel: "Paramètres",
    languageLabel: "Langue",
    itemDelayLabel: "Intervalle entre notes (secondes)",
    fallDurationLabel: "Durée de la chute (secondes)",
    burnDurationLabel: "Durée de combustion (secondes)",
    flameIntensityLabel: "Intensité de la flamme",
    fireAlt: "Autel-poubelle enflammé",
    footerCopy:
      "Partage le lien, laisse tout partir et regarde tes soucis se transformer en fumée.",
    historyToggle: "Journal des braises",
    historyTitle: "Archives des cendres",
    historyBlurb:
      "Ces moments sont derrière toi maintenant—enregistrés ici uniquement comme preuve qu'ils ne peuvent pas blesser ton avenir.",
    historyEmpty: "Rien n'a encore brûlé. Alimente le feu !",
  },
};

const languageOptions = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "hi", label: "हिन्दी" },
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
];
burnButton?.addEventListener("click", () => {
  queueFromTextarea();
});
historyToggle?.addEventListener("click", () => {
  toggleHistoryDrawer();
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
    topOffset: 10 + Math.random() * 90,
    tilt: randomTilt(),
  };
}

function createEntryElement(text) {
  const card = document.createElement("div");
  card.className = "note-card floating-card";
  card.textContent = text;
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
  element.classList.remove("floating-card", "arrive", "note");
  element.classList.add("queue-card");
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
  if (!element) {
    return;
  }

  // Remove from queue - just destroy it
  if (queueDeck?.contains(element)) {
    queueDeck.removeChild(element);
  }

  // Create a completely fresh element for dropping
  const dropElement = document.createElement("div");
  dropElement.className = "note";
  dropElement.textContent = entry.text;

  // Add smoke
  const smoke = document.createElement("span");
  smoke.className = "smoke";
  smoke.setAttribute("aria-hidden", "true");
  dropElement.appendChild(smoke);

  // Apply color
  dropElement.style.setProperty("--note-bg", entry.color.bg);
  dropElement.style.setProperty("--note-border", entry.color.border);
  dropElement.style.setProperty("--note-text", entry.color.text);

  // Position at the queue position (where the element was)
  const layerRect = layer.getBoundingClientRect();
  const queueRect = queueDeck.getBoundingClientRect();
  const fireRect = fireTarget.getBoundingClientRect();

  // Start from center of queue area
  const startX = queueRect.left + queueRect.width / 2;
  const startY = queueRect.top + queueRect.height / 2;

  dropElement.style.left = `${startX - layerRect.left}px`;
  dropElement.style.top = `${startY - layerRect.top}px`;

  // Set tilt and target (into the fire)
  const tilt = randomTilt();
  dropElement.style.setProperty("--tilt", `${tilt}deg`);

  const targetX = fireRect.left + fireRect.width / 2;
  const targetY = fireRect.top + fireRect.height * 0.3;
  dropElement.style.setProperty("--delta-x", `${targetX - startX}px`);
  dropElement.style.setProperty("--delta-y", `${targetY - startY}px`);

  // Append to layer
  layer?.appendChild(dropElement);

  // Start animation immediately
  requestAnimationFrame(() => {
    dropElement.classList.add("ignite");
  });

  const onBurnEnd = (event) => {
    if (event.animationName !== "note-burn") {
      return;
    }
    dropElement.removeEventListener("animationend", onBurnEnd);
    dropElement.remove();
  };

  dropElement.addEventListener("animationend", onBurnEnd);
  recordBurn(entry);
}

function convertToNoteElement(entry) {
  const element = entry.element;
  ensureSmoke(element);
  element.classList.remove("queue-card", "floating-card", "arrive");
  element.classList.add("note");
  element.style.removeProperty("--queue-left");
  element.style.removeProperty("--queue-top");
  element.style.removeProperty("--queue-tilt");
  applyNotePalette(element, entry.color);
  element.style.removeProperty("transform");
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
  node.style.setProperty("--card-bg", color.bg);
  node.style.setProperty("--card-border", color.border);
  node.style.setProperty("--card-text", color.text);
  node.style.setProperty("--note-bg", color.bg);
  node.style.setProperty("--note-border", color.border);
  node.style.setProperty("--note-text", color.text);
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
  const brightness = Math.min(
    1.4,
    Math.max(0.5, 0.75 + (settings.flameIntensity - 1) * 0.6),
  );
  root.style.setProperty("--flame-brightness", brightness.toFixed(2));
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

function handleRangeInput(control, formatter, updater) {
  control.addEventListener("input", (event) => {
    const value = parseFloat(event.target.value);
    updater(value);
    if (formatter) {
      formatter(value);
    }
  });
}

handleRangeInput(
  controls.itemDelay,
  (value) => {
    controls.displays.itemDelay.textContent = `${value.toFixed(1)}s`;
  },
  (value) => {
    settings.itemDelay = value * 1000;
  },
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
);

handleRangeInput(
  controls.flameIntensity,
  (value) => {
    controls.displays.flameIntensity.textContent = `${Math.round(value * 100)}%`;
  },
  (value) => {
    settings.flameIntensity = value;
    updateFlameVars();
  },
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
}

updateDurationVars();
updateFlameVars();
initLanguageOptions();
renderHistory();
input?.focus();
