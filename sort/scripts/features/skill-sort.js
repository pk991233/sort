const rows = [
  ["ath"],                            // 力量
  ["acr", "slt", "ste"],              // 敏捷
  ["arc", "his", "inv", "nat", "rel"],// 智力
  ["ani", "ins", "med", "prc", "sur"],// 感知
  ["dec", "itm", "prf", "per"]        // 魅力
];

const desiredOrder = rows.flat();

const orderMap = Object.fromEntries(
  desiredOrder.map((key, index) => [key, index])
);

let timer = null;
let observer = null;
let isSorting = false;

export function registerSkillSort() {
  console.log("sort | registerSkillSort");

  startObserver();
  scheduleSort();
}

function startObserver() {
  if (observer) return;

  observer = new MutationObserver(() => {
    if (isSorting) return;
    scheduleSort();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log("sort | skill sort observer started");
}

function scheduleSort() {
  clearTimeout(timer);
  timer = setTimeout(sortTokenActionHudSkills, 150);
}

function sortTokenActionHudSkills() {
  const container = document.querySelector(
    '[data-nest-id="attributes_skills"] .tah-actions[data-part="actions"]'
  );

  if (!container) return;

  const actions = Array.from(
    container.querySelectorAll(':scope > .tah-action[data-part="action"]')
  );

  const sortable = actions
    .map(action => {
      const button = action.querySelector("button.tah-action-button[data-action-id]");
      const key = button?.dataset.actionId;

      return {
        action,
        key,
        order: orderMap[key]
      };
    })
    .filter(item => item.order !== undefined);

  if (sortable.length !== 18) return;

  const current = sortable.map(item => item.key).join(",");
  const expected = desiredOrder.join(",");

  if (current === expected && container.dataset.sortGrouped === "true") return;

  isSorting = true;

  sortable
  .sort((a, b) => a.order - b.order)
  .forEach(item => {
    container.appendChild(item.action);
  });

const positions = {
  ath: [1, 1],

  acr: [2, 1],
  slt: [2, 2],
  ste: [2, 3],

  arc: [3, 1],
  his: [3, 2],
  inv: [3, 3],
  nat: [3, 4],
  rel: [3, 5],

  ani: [4, 1],
  ins: [4, 2],
  med: [4, 3],
  prc: [4, 4],
  sur: [4, 5],

  dec: [5, 1],
  itm: [5, 2],
  prf: [5, 3],
  per: [5, 4]
};

for (const item of sortable) {
  const pos = positions[item.key];
  if (!pos) continue;

  item.action.style.gridRow = pos[0];
  item.action.style.gridColumn = pos[1];
}

  // 每一組最後一個加換行標記
  for (const row of rows) {
    const lastKey = row[row.length - 1];
    const lastAction = container.querySelector(
      `.tah-action button[data-action-id="${lastKey}"]`
    )?.closest(".tah-action");

    lastAction?.classList.add("sort-row-break");
  }

  container.dataset.sortGrouped = "true";

  setTimeout(() => {
    isSorting = false;
  }, 0);

  console.log("sort | TAH 技能已分組重排");
}