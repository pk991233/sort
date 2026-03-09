import { WEAPON_TYPE_KEY_MAP } from "../data/weapon-type-keys.js";

function localizeWeaponType(key, fallback) {
  const i18nKey = WEAPON_TYPE_KEY_MAP[key];
  if (!i18nKey) return fallback;

  const localized = game.i18n.localize(i18nKey);
  return localized === i18nKey ? fallback : localized;
}

export function registerWeaponTypeLocalization() {
  Hooks.once("setup", () => {
    const weaponTypes = CONFIG.DND5E?.weaponTypes;
    if (!weaponTypes) {
      console.log("test | 找不到 CONFIG.DND5E.weaponTypes");
      return;
    }

    for (const [key, value] of Object.entries(weaponTypes)) {
      if (typeof value === "string") {
        weaponTypes[key] = localizeWeaponType(key, value);
      }
    }

    console.log("test | weaponTypes localized", foundry.utils.deepClone(weaponTypes));
  });
}