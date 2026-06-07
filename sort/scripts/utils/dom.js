export function querySelectorAllDeep(root, selector) {
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