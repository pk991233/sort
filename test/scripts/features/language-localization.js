const LANGUAGE_KEY_MAP = {
  common: "TEST.Languages.common",
  sign: "TEST.Languages.sign",
  draconic: "TEST.Languages.draconic",
  dwarvish: "TEST.Languages.dwarvish",
  elvish: "TEST.Languages.elvish",
  giant: "TEST.Languages.giant",
  gnomish: "TEST.Languages.gnomish",
  goblin: "TEST.Languages.goblin",
  halfling: "TEST.Languages.halfling",
  orc: "TEST.Languages.orc",

  aarakocra: "TEST.Languages.aarakocra",
  abyssal: "TEST.Languages.abyssal",
  celestial: "TEST.Languages.celestial",
  deep: "TEST.Languages.deep",
  druidic: "TEST.Languages.druidic",
  gith: "TEST.Languages.gith",
  gnoll: "TEST.Languages.gnoll",
  infernal: "TEST.Languages.infernal",

  primordial: "TEST.Languages.primordial",
  aquan: "TEST.Languages.aquan",
  auran: "TEST.Languages.auran",
  ignan: "TEST.Languages.ignan",
  terran: "TEST.Languages.terran",

  sylvan: "TEST.Languages.sylvan",
  cant: "TEST.Languages.cant",
  undercommon: "TEST.Languages.undercommon"
};

const GROUP_KEY_MAP = {
  standard: "TEST.LanguageGroups.standard",
  exotic: "TEST.LanguageGroups.exotic",
  primordial: "TEST.Languages.primordial"
};

function localizeKey(key, fallback) {
  const i18nKey = LANGUAGE_KEY_MAP[key];
  if (!i18nKey) return fallback;

  const localized = game.i18n.localize(i18nKey);
  return localized === i18nKey ? fallback : localized;
}

function localizeGroup(key, fallback) {
  const i18nKey = GROUP_KEY_MAP[key];
  if (!i18nKey) return fallback;

  const localized = game.i18n.localize(i18nKey);
  return localized === i18nKey ? fallback : localized;
}

function walkLanguages(obj) {
  if (!obj || typeof obj !== "object") return;

  for (const [key, value] of Object.entries(obj)) {
    if (key === "label" && typeof value === "string") continue;

    if (typeof value === "string") {
      obj[key] = localizeKey(key, value);
      continue;
    }

    if (value && typeof value === "object") {
      if (typeof value.label === "string") {
        value.label = localizeGroup(key, value.label) || localizeKey(key, value.label);
      }
      walkLanguages(value.children ?? value);
    }
  }
}

export function registerLanguageLocalization() {
  Hooks.once("setup", () => {
    const languages = CONFIG.DND5E?.languages;
    if (!languages) {
      console.log("test | 找不到 CONFIG.DND5E.languages");
      return;
    }

    console.log("test | before", foundry.utils.deepClone(languages));
    walkLanguages(languages);
    console.log("test | after", foundry.utils.deepClone(languages));
  });
}