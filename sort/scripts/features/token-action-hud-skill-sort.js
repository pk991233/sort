const SKILL_POSITION = {
  // STR
  ath: { row: 1, col: 1 },

  // DEX
  acr: { row: 2, col: 1 },
  slt: { row: 2, col: 2 },
  ste: { row: 2, col: 3 },

  // INT
  arc: { row: 3, col: 1 },
  his: { row: 3, col: 2 },
  inv: { row: 3, col: 3 },
  nat: { row: 3, col: 4 },
  rel: { row: 3, col: 5 },

  // WIS
  ani: { row: 4, col: 1 },
  ins: { row: 4, col: 2 },
  med: { row: 4, col: 3 },
  prc: { row: 4, col: 4 },
  sur: { row: 4, col: 5 },

  // CHA
  dec: { row: 5, col: 1 },
  itm: { row: 5, col: 2 },
  prf: { row: 5, col: 3 },
  per: { row: 5, col: 4 }
};

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
    const actions = el.querySelectorAll("button, a");
    if ((text.includes("技能") || text.includes("Skills")) && actions.length >= 10) {
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

function clearOldLayout(parent) {
  if (!parent) return;

  parent.classList.remove("pk-tah-skill-grid");

  const items = parent.querySelectorAll(".pk-tah-skill-item");
  for (const item of items) {
    item.classList.remove("pk-tah-skill-item");
    item.style.gridRow = "";
    item.style.gridColumn = "";
  }
}

function applyGridLayout(skillsPanel) {
  if (isApplying) return;
  isApplying = true;

  try {
    const buttons = getSkillButtons(skillsPanel);
    if (!buttons.length) return;

    const actionItems = buttons
      .map(button => {
        const key = extractSkillKeyFromElement(button);
        const action = button.closest(".tah-action");
        return { button, key, action };
      })
      .filter(x => x.key && x.action);

    if (!actionItems.length) return;

    const parent = actionItems[0].action.parentElement;
    if (!parent) return;

    clearOldLayout(parent);
    parent.classList.add("pk-tah-skill-grid");

    for (const { key, action } of actionItems) {
      const pos = SKILL_POSITION[key];
      if (!pos) continue;

      action.classList.add("pk-tah-skill-item");
      action.style.gridRow = String(pos.row);
      action.style.gridColumn = String(pos.col);
    }
  } finally {
    isApplying = false;
  }
}

function tryApplyToHud() {
  const root = getHudRoot();
  if (!root) return;

  const skillsPanel = findSkillsPanel(root);
  if (!skillsPanel) return;

  applyGridLayout(skillsPanel);
}

export function registerTokenActionHudSkillSort() {
  if (observerStarted) return;
  observerStarted = true;

  Hooks.once("ready", () => {
    setTimeout(() => {
      tryApplyToHud();
    }, 100);

    const observer = new MutationObserver(() => {
      if (isApplying) return;
      requestAnimationFrame(() => {
        tryApplyToHud();
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log("test | token action hud skill sort registered");
  });
}