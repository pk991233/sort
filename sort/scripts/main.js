import { registerSkillSort } from "./features/skill-sort.js";

console.log("sort | main loaded");

registerSkillSort();

Hooks.once("init", () => {
  console.log("sort | init");
});

Hooks.once("setup", () => {
  console.log("sort | setup");
});

Hooks.once("ready", () => {
  console.log("sort | ready");
});