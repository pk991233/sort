import { registerSkillSort } from "./features/skill-sort.js";

Hooks.once("init", () => {
  console.log("test | init");
  registerSkillSort();
});