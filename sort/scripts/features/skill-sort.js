function querySelectorAllDeep(root, selector) {
  const results = [];

  function walk(node) {
    if (!node) return;

    if (node.querySelectorAll) {
      results.push(...node.querySelectorAll(selector));
    }

    const elements = node.querySelectorAll ? node.querySelectorAll("*") : [];
    for (const el of elements) {
      if (el.shadowRoot) walk(el.shadowRoot);
    }
  }

  walk(root);
  return [...new Set(results)];
}

function applyOrder(rows, orderMap, getKey) {
  if (!rows.length) return false;

  for (const row of rows) {
    const key = getKey(row);
    const order = orderMap[key];
    if (!order) continue;
    row.style.order = String(order);
  }

  return true;
}

export function registerSkillSort() {
  Hooks.on("renderActorSheet", (app, html) => {
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

    // ===== Tidy5e =====
    const tidyRows = querySelectorAllDeep(
      root,
      'li[data-tidy-sheet-part="skill-container"][data-key]'
    );

    const tidyWorked = applyOrder(
      tidyRows,
      orderMap,
      row => row.dataset.key
    );

    // ===== 預設 dnd5e 角卡 =====
    const defaultRows = Array.from(
      root.querySelectorAll('li[data-key]')
    ).filter(row => row.closest(".skills"));

    const defaultWorked = applyOrder(
      defaultRows,
      orderMap,
      row => row.dataset.key
    );

    // 讓父容器確保是可排序的 flex column
    if (defaultRows.length) {
      const parent = defaultRows[0].parentElement;
      if (parent) {
        parent.style.display = "flex";
        parent.style.flexDirection = "column";
      }
    }

  });
}