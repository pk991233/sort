import { registerSkillSort } from "./features/skill-sort.js";
import { registerTokenActionHudSkillSort } from "./features/token-action-hud-skill-sort.js";

Hooks.once("init", () => {
  console.log("test | init");

  registerSkillSort();
  registerTokenActionHudSkillSort();
});