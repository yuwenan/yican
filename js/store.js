// 一餐 · 单一数据源：库存/厨具/调料/餐单/采买/历史，全部持久化到 localStorage。
// 四条库存铁律：
//  1) 选菜不入账，确认入库才加库存；
//  2) 开始做饭不扣，确认完成才在同一“事务”里扣减并写历史/盖章；
//  3) 重复确认不重复扣（完成动作以一次性快照执行）；
//  4) 调料 none 只能手动恢复，绝不被默认值覆盖。

import { FOODS, SEASONINGS, COOKWARE, RECIPES, recipeById } from './data.js';

const KEY = 'yican.state.v1';

// 为让第一版打开即有可走通的闭环，预置 V2 番茄链假设的最小厨房：
// 鸡蛋 2、盐/油有；厨具全部“未记录”（正好走“家里有炒锅吗”确认分支）。
function defaultState() {
  return {
    onboarded: true,
    inventory: { egg: 2 },
    seasonings: { salt: 'available', oil: 'available' }, // 缺席 = 未记录
    cookware: {},                                          // unknown / have / none
    menu: [],                 // [{recipeId}]  首版一道
    shopping: [],             // [{food, qty, unit, reason:'lack'|'restock', checked}]
    history: [],              // [{recipeId, date, stamp:true}]
    prefs: { maxMinutes: null }
  };
}

// 全新空厨房（对应原型 20 空状态，不含盐油、不预造历史）
function emptyState() {
  return {
    onboarded: true,
    inventory: {}, seasonings: {}, cookware: {},
    menu: [], shopping: [], history: [],
    prefs: { maxMinutes: null }
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const s = JSON.parse(raw);
    return Object.assign(defaultState(), s);
  } catch {
    return defaultState();
  }
}

let state = load();
const listeners = new Set();

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((fn) => fn(state));
}

export const store = {
  get: () => state,
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },

  /* ---------- 数量显示 ---------- */
  // 0.5 颗 -> 半颗；其余按数值+单位
  qtyText(qty, unit) {
    if (qty === 0.5 && unit === '颗') return '半颗';
    return `${this.trimNum(qty)} ${unit}`;
  },
  trimNum(n) { return Number.isInteger(n) ? String(n) : String(n).replace(/\.0+$/, ''); },

  /* ---------- 库存编辑 ---------- */
  setFood(food, qty) {
    const q = Math.max(0, Math.round(qty * 2) / 2); // 允许半份步进
    if (q <= 0) delete state.inventory[food];
    else state.inventory[food] = q;
    save();
  },
  stepFood(food, d) {
    const cur = state.inventory[food] || 0;
    const unit = FOODS[food]?.unit;
    const step = unit === '小份' || food === 'broccoli' ? 0.5 : 1;
    this.setFood(food, cur + d * step);
  },
  setSeasoning(id, v) {
    // 只允许显式 available / none；不写 undefined 覆盖
    if (v !== 'available' && v !== 'none') return;
    state.seasonings[id] = v;
    save();
  },
  setCookware(id, v) {
    if (v === 'unknown') delete state.cookware[id];
    else state.cookware[id] = v;
    save();
  },

  /* ---------- 菜谱评估（推荐/缺料/缺厨具） ---------- */
  evaluate(r) {
    const lack = [];
    let ownedCount = 0;
    r.ingredients.forEach(({ food, qty }) => {
      const have = state.inventory[food] || 0;
      if (have >= qty && qty > 0) ownedCount += 1;
      else lack.push({ food, need: qty, have, buyQty: Math.max(qty - have, qty) });
    });

    const unknownCookware = r.cookware.filter((c) => (state.cookware[c] || 'unknown') === 'unknown');
    const missingCookware = r.cookware.filter((c) => state.cookware[c] === 'none');

    const missingSeasoning = r.seasonings.filter((s) => state.seasonings[s] === 'none');

    const blocked = missingCookware.length > 0; // 明确没有的厨具 -> 不可做
    const ready = lack.length === 0 && unknownCookware.length === 0 &&
      missingSeasoning.length === 0 && !blocked;

    return { lack, ownedCount, unknownCookware, missingCookware, missingSeasoning, blocked, ready };
  },

  // 推荐排序：可做 > 只差确认/食材 > 缺厨具；15 分钟偏好过滤
  recommendations() {
    const max = state.prefs.maxMinutes;
    return RECIPES
      .filter((r) => !max || r.minutes <= max)
      .map((r) => ({ r, e: this.evaluate(r) }))
      .sort((a, b) => score(b) - score(a));
    function score(x) {
      if (x.e.ready) return 3;
      if (x.e.blocked) return 0;
      return 1 + x.e.ownedCount / 10;
    }
  },

  /* ---------- 餐单 ---------- */
  addToMenu(recipeId) {
    // 选菜不入账。同菜重复加入 = 维持一道（首版份量固定 1），不重复堆。
    state.menu = [{ recipeId }];
    save();
  },
  clearMenu() { state.menu = []; save(); },
  currentDish() {
    return state.menu[0] ? recipeById(state.menu[0].recipeId) : null;
  },

  // 餐单上确认厨具
  confirmCookware(id, have) {
    this.setCookware(id, have ? 'have' : 'none');
  },

  /* ---------- 采买：仅缺料（+主动补货另算） ---------- */
  buildShopping() {
    const r = this.currentDish();
    if (!r) return;
    const e = this.evaluate(r);
    state.shopping = e.lack.map((x) => ({
      food: x.food, qty: x.buyQty, unit: FOODS[x.food].unit, reason: 'lack', checked: false
    }));
    save();
  },
  toggleShopItem(i) {
    const it = state.shopping[i];
    if (it) it.checked = !it.checked;
    save();
  },
  // 确认入库前的变化预览
  ingestPreview() {
    return state.shopping.filter((x) => x.checked).map((x) => {
      const before = state.inventory[x.food] || 0;
      return { ...x, before, after: Math.round((before + x.qty) * 10) / 10 };
    });
  },
  // 确认入库：勾选的才加；幂等——以调用时库存为准，一次写入
  confirmIngest() {
    state.shopping.forEach((x) => {
      if (x.checked) state.inventory[x.food] = Math.round(((state.inventory[x.food] || 0) + x.qty) * 10) / 10;
    });
    state.shopping = [];
    save();
  },

  /* ---------- 完成：同一动作里扣库存 + 写历史 + 盖章 ---------- */
  finishCooking(recipeId) {
    const r = recipeById(recipeId);
    if (!r) return;
    // 扣数量食材（调料不动）
    r.ingredients.forEach(({ food, qty }) => {
      const cur = state.inventory[food] || 0;
      this.setFood(food, Math.max(0, Math.round((cur - qty) * 10) / 10));
    });
    const today = new Date().toISOString().slice(0, 10);
    // 同一天同一菜只记一次、一天一章
    if (!state.history.some((h) => h.recipeId === recipeId && h.date === today)) {
      state.history.push({ recipeId, date: today, stamp: true });
    }
    state.menu = [];
    state.shopping = [];
    save();
  },

  // 撤销最近一次完成：同步恢复库存、删历史/章
  undoLastFinish() {
    const last = state.history.pop();
    if (last) {
      const r = recipeById(last.recipeId);
      r?.ingredients.forEach(({ food, qty }) => {
        state.inventory[food] = Math.round(((state.inventory[food] || 0) + qty) * 10) / 10;
      });
    }
    save();
  },

  stampDates() {
    return [...new Set(state.history.map((h) => h.date))].sort().reverse();
  },

  resetToEmpty() { state = emptyState(); save(); },
  resetToSample() { state = defaultState(); save(); },

  // 厨房是否全空（空状态引导用）
  isKitchenEmpty() {
    return Object.keys(state.inventory).length === 0 &&
      Object.values(state.seasonings).every((v) => v !== 'available') &&
      Object.values(state.cookware).every((v) => v !== 'have');
  }
};

export { FOODS, SEASONINGS, COOKWARE, RECIPES };
