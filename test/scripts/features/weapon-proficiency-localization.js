import { WEAPON_PROFICIENCY_KEY_MAP } from "../data/weapon-proficiency-keys.js";

function localizeWeaponProficiency(key, fallback) {
  const i18nKey = WEAPON_PROFICIENCY_KEY_MAP[key];
  if (!i18nKey) return fallback;

  const localized = game.i18n.localize(i18nKey);
  return localized === i18nKey ? fallback : localized;
}

export function registerWeaponProficiencyLocalization() {
  Hooks.once("setup", () => {
    const weaponProficiencies = CONFIG.DND5E?.weaponProficiencies;
    if (!weaponProficiencies) {
      console.log("test | 找不到 CONFIG.DND5E.weaponProficiencies");
      return;
    }

    for (const [key, value] of Object.entries(weaponProficiencies)) {
      if (typeof value === "string") {
        weaponProficiencies[key] = localizeWeaponProficiency(key, value);
      }
    }

    console.log(
      "test | weaponProficiencies localized",
      foundry.utils.deepClone(weaponProficiencies)
    );
  });
}