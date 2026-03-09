import { registerSkillSort } from "./features/skill-sort.js";
import { registerLanguageLocalization } from "./features/language-localization.js";
import { registerWeaponTypeLocalization } from "./features/weapon-type-localization.js";
import { registerWeaponProficiencyLocalization } from "./features/weapon-proficiency-localization.js";

Hooks.once("init", () => {
  console.log("test | init");
  
  //registerSkillSort();

  registerLanguageLocalization();
  console.log("test | language localization registered");

  registerWeaponTypeLocalization();
  console.log("test | weapon type localization registered");

  registerWeaponProficiencyLocalization();
  console.log("test | weapon proficiency localization registered");
});