const WEAPON_KEY_MAP = {
  club: "TEST.Weapons.club",
  dagger: "TEST.Weapons.dagger",
  dart: "TEST.Weapons.dart",
  greatclub: "TEST.Weapons.greatclub",
  handaxe: "TEST.Weapons.handaxe",
  javelin: "TEST.Weapons.javelin",
  lightcrossbow: "TEST.Weapons.lightcrossbow",
  lighthammer: "TEST.Weapons.lighthammer",
  mace: "TEST.Weapons.mace",
  quarterstaff: "TEST.Weapons.quarterstaff",
  shortbow: "TEST.Weapons.shortbow",
  sickle: "TEST.Weapons.sickle",
  sling: "TEST.Weapons.sling",
  spear: "TEST.Weapons.spear",

  battleaxe: "TEST.Weapons.battleaxe",
  blowgun: "TEST.Weapons.blowgun",
  flail: "TEST.Weapons.flail",
  glaive: "TEST.Weapons.glaive",
  greataxe: "TEST.Weapons.greataxe",
  greatsword: "TEST.Weapons.greatsword",
  halberd: "TEST.Weapons.halberd",
  handcrossbow: "TEST.Weapons.handcrossbow",
  heavycrossbow: "TEST.Weapons.heavycrossbow",
  lance: "TEST.Weapons.lance",
  longbow: "TEST.Weapons.longbow",
  longsword: "TEST.Weapons.longsword",
  maul: "TEST.Weapons.maul",
  morningstar: "TEST.Weapons.morningstar",
  musket: "TEST.Weapons.musket",
  pike: "TEST.Weapons.pike",
  pistol: "TEST.Weapons.pistol",
  rapier: "TEST.Weapons.rapier",
  scimitar: "TEST.Weapons.scimitar",
  shortsword: "TEST.Weapons.shortsword",
  trident: "TEST.Weapons.trident",
  warpick: "TEST.Weapons.warpick",
  warhammer: "TEST.Weapons.warhammer",
  whip: "TEST.Weapons.whip"
};

function localizeWeapon(key, fallback) {
  const i18nKey = WEAPON_KEY_MAP[key];
  if (!i18nKey) return fallback;

  const localized = game.i18n.localize(i18nKey);
  return localized === i18nKey ? fallback : localized;
}

export function registerWeaponLocalization() {
  Hooks.once("setup", () => {

    const weaponIds = CONFIG.DND5E.weaponIds;

    if (!weaponIds) {
      console.log("test | 找不到 CONFIG.DND5E.weaponIds");
      return;
    }

    console.log("test | weaponIds before", foundry.utils.deepClone(weaponIds));

    for (const [key, value] of Object.entries(weaponIds)) {

      if (typeof value === "string") {
        weaponIds[key] = localizeWeapon(key, value);
      }

    }

    console.log("test | weaponIds after", foundry.utils.deepClone(weaponIds));

  });
}