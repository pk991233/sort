const SKILL_ORDER = [
  "ath", "acr", "slt", "ste",
  "arc", "his", "inv", "nat", "rel",
  "ani", "ins", "med", "prc", "sur",
  "dec", "itm", "prf", "per"
];

const SKILL_TO_ABILITY = {
  ath: "str",
  acr: "dex",
  slt: "dex",
  ste: "dex",
  arc: "int",
  his: "int",
  inv: "int",
  nat: "int",
  rel: "int",
  ani: "wis",
  ins: "wis",
  med: "wis",
  prc: "wis",
  sur: "wis",
  dec: "cha",
  itm: "cha",
  prf: "cha",
  per: "cha"
};

const ABILITY_ROW_ORDER = ["str", "dex", "int", "wis", "cha"];

const LABEL_TO_SKILL_KEY = {
  "運動": "ath",
  "特技": "acr",
  "巧手": "slt",
  "隱匿": "ste",
  "奧秘": "arc",
  "歷史": "his",
  "調查": "inv",
  "自然": "nat",
  "宗教": "rel",
  "馴獸": "ani",
  "洞悉": "ins",
  "醫藥": "med",
  "醫療": "med",
  "察覺": "prc",
  "求生": "sur",
  "欺瞞": "dec",
  "威嚇": "itm",
  "表演": "prf",
  "說服": "per",
  "遊說": "per",

  "Athletics": "ath",
  "Acrobatics": "acr",
  "Sleight of Hand": "slt",
  "Stealth": "ste",
  "Arcana": "arc",
  "History": "his",
  "Investigation": "inv",
  "Nature": "nat",
  "Religion": "rel",
  "Animal Handling": "ani",
  "Insight": "ins",
  "Medicine": "med",
  "Perception": "prc",
  "Survival": "sur",
  "Deception": "dec",
  "Intimidation": "itm",
  "Performance": "prf",
  "Persuasion": "per"
};

let observerStarted = false;
let isApplying = false;

function normalizeText(text) {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function extractSkillKeyFromElement(el) {
  const text = normalizeText(el.textContent);
  for (const [label, key] of Object.entries(LABEL_TO_SKILL_KEY)) {
    if (text.includes(label)) return key;
  }
  return null;
}

function getHudRoot() {
  return document.querySelector("#token-action-hud")
    || document.querySelector(".token-action-hud")
    || document.querySelector("[class*='token-action-hud']");
}

function findSkillsPanel(root) {
  if (!root) return null;

  const containers = Array.from(root.querySelectorAll("section, div, article"));
  for (const el of containers) {
    const text = normalizeText(el.textContent);
    const buttons = el.querySelectorAll("button, a");
    if ((text.includes("技能") || text.includes("Skills")) && buttons.length >= 10) {
      return el;
    }
  }

  return null;
}

function getSkillButtons(skillsPanel) {
  return Array.from(skillsPanel.querySelectorAll("button, a")).filter(el => {
    return !!extractSkillKeyFromElement(el);
  });
}

function sortButtons(buttons) {
  const orderMap = Object.fromEntries(SKILL_ORDER.map((k, i) => [k, i]));
  return [...buttons].sort((a, b) => {
    const aKey = extractSkillKeyFromElement(a);
    const bKey = extractSkillKeyFromElement(b);
    return (orderMap[aKey] ?? 999) - (orderMap[bKey] ?? 999);
  });
}

function applyRows(skillsPanel) {
  if (isApplying) return;
  isApplying = true;

  try {
    const buttons = getSkillButtons(skillsPanel);
    if (!buttons.length) return;

    // 避免一直重做
    const currentSignature = buttons.map(b => extractSkillKeyFromElement(b)).join("|");
    if (skillsPanel.dataset.pkSkillSignature === currentSignature &&
        skillsPanel.dataset.pkSkillSorted === "true") {
      return;
    }

    const container = buttons[0].parentElement?.parentElement || buttons[0].parentElement;
    if (!container) return;

    let wrapper = skillsPanel.querySelector(".pk-tah-skill-wrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "pk-tah-skill-wrapper";
      container.prepend(wrapper);
    }

    wrapper.innerHTML = "";

    const grouped = {
      str: [],
      dex: [],
      int: [],
      wis: [],
      cha: []
    };

    for (const button of sortButtons(buttons)) {
      const key = extractSkillKeyFromElement(button);
      const ability = SKILL_TO_ABILITY[key];
      if (!ability) continue;
      grouped[ability].push(button);
    }

    for (const ability of ABILITY_ROW_ORDER) {
      if (!grouped[ability].length) continue;

      const row = document.createElement("div");
      row.className = `pk-tah-skill-row pk-tah-skill-row-${ability}`;

      for (const button of grouped[ability]) {
        row.appendChild(button);
      }

      wrapper.appendChild(row);
    }

    skillsPanel.dataset.pkSkillSorted = "true";
    skillsPanel.dataset.pkSkillSignature = currentSignature;
  } finally {
    isApplying = false;
  }
}

function tryApplyToHud() {
  const root = getHudRoot();
  if (!root) return;

  const skillsPanel = findSkillsPanel(root);
  if (!skillsPanel) return;

  applyRows(skillsPanel);
}

export function registerTokenActionHudSkillSort() {
  if (observerStarted) return;
  observerStarted = true;

  Hooks.once("ready", () => {
    // 先跑一次
    setTimeout(() => {
      tryApplyToHud();
    }, 100);

    const observer = new MutationObserver(() => {
      if (isApplying) return;

      // 避免同步連環觸發
      requestAnimationFrame(() => {
        tryApplyToHud();
      });
    });

    const root = document.body;
    observer.observe(root, {
      childList: true,
      subtree: true
    });

    console.log("test | token action hud skill sort registered");
  });
}