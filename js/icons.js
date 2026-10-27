// 一餐 · 线性 SVG 图标（currentColor，随文字色）。不使用 emoji。
const P = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;

export const I = {
  home: P('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>'),
  menu: P('<path d="M4 6h16M4 12h16M4 18h10"/>'),
  user: P('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>'),
  search: P('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>'),
  filter: P('<path d="M3 5h18l-7 8v6l-4-2v-4z"/>'),
  arrow: P('<path d="M9 5l7 7-7 7"/>'),
  back: P('<path d="M15 5l-7 7 7 7"/>'),
  plus: P('<path d="M12 5v14M5 12h14"/>'),
  check: P('<path d="M4 12.5l5 5L20 6.5"/>'),
  pot: P('<path d="M5 11h14v4a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6z"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/><path d="M4 11h2M18 11h2"/>'),
  leaf: P('<path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z"/><path d="M5 19c4-6 8-9 12-10"/>'),
  basket: P('<path d="M4 7h16l-1.5 12a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8z"/><path d="M9 7a3 3 0 0 1 6 0"/>'),
  stamp: P('<path d="M6 4h12v6a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4z"/><path d="M4 21h16"/><path d="M9 14v3M15 14v3"/>'),
  flame: P('<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 .5 1.5 2 2 2 2 .5-3-1-5 1-8z"/>'),
  clock: P('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
  refresh: P('<path d="M4 12a8 8 0 0 1 14-5.3L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-14 5.3L4 16"/><path d="M4 20v-4h4"/>'),
  trash: P('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
  spark: P('<path d="M12 4v4M12 16v4M4 12h4M16 12h4"/><path d="M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2"/>')
};
