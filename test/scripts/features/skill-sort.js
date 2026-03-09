import { querySelectorAllDeep } from "../utils/dom.js";

export function registerSkillSort() {
  Hooks.on("renderActorSheet", (app, html) => {
    if (app.constructor.name !== "Tidy5eCharacterSheet") return;
    if (app.actor?.type !== "character") return;

    const root = html[0];
    if (!root) return;

    const desiredOrder = [
      "ath", "acr", "slt", "ste",
      "arc", "his", "inv", "nat", "rel",
      "ani", "ins", "med", "prc", "sur",
      "dec", "itm", "prf", "per"
    ];

    const orderMap = Object.fromEntries(
      desiredOrder.map((key, index) => [key, index + 1])
    );

    const skillRows = querySelectorAllDeep(
      root,
      'li[data-tidy-sheet-part="skill-container"][data-key]'
    );

    if (!skillRows.length) return;

    for (const row of skillRows) {
      const key = row.dataset.key;
      const order = orderMap[key];
      if (!order) continue;

      row.style.order = String(order);
    }

    // 不想一直看到訊息就刪掉這行
    // console.log("test | 技能順序已設定為 CSS order");
  });
}