// 一餐 · 应用入口：hash 路由 + 玻璃底导 + 动作委托 + 自写确认弹窗 + 离线缓存
import { store, FOODS, COOKWARE } from './store.js';
import { recipeById, RECIPES } from './data.js';
import { I } from './icons.js';
import * as V from './views.js';

const app = document.getElementById('app');

/* ---------- 路由 ---------- */
const routes = [
  [/^#?\/?$/, () => splashOrHome()],
  [/^#\/splash$/, () => ({ html: V.splash(), chrome: 'none', splash: true })],
  [/^#\/home(?:\/(recommend|pantry|craving))?$/, (m) => ({ html: V.home(m[1] || 'recommend'), chrome: 'main', tab: m[1] || 'recommend' })],
  [/^#\/recipe\/(.+)$/, (m) => ({ html: V.recipe(m[1]), chrome: 'sub' })],
  [/^#\/menu$/, () => ({ html: V.menu(), chrome: 'main', nav: 'menu' })],
  [/^#\/shopping$/, () => ({ html: V.shopping(), chrome: 'sub' })],
  [/^#\/ingest$/, () => ({ html: V.ingest(), chrome: 'sub' })],
  [/^#\/ready\/(.+)$/, (m) => ({ html: V.ready(m[1]), chrome: 'sub' })],
  [/^#\/cook\/(.+)$/, (m) => ({ html: V.cook(m[1]), chrome: 'sub' })],
  [/^#\/consume\/(.+)$/, (m) => ({ html: V.consume(m[1]), chrome: 'sub' })],
  [/^#\/stamp\/(.+)$/, (m) => ({ html: V.stamp(m[1]), chrome: 'sub' })],
  [/^#\/kitchen$/, () => ({ html: V.kitchen(), chrome: 'main', nav: 'me' })],
  [/^#\/manage\/(food|seasoning|cookware)$/, (m) => ({ html: V.manage(m[1]), chrome: 'sub' })],
  [/^#\/prefs$/, () => ({ html: V.prefs(), chrome: 'none' })],
  [/^#\/me$/, () => ({ html: V.me(), chrome: 'main', nav: 'me' })]
];

function splashOrHome() {
  if (!sessionStorage.getItem('yican.splash')) {
    sessionStorage.setItem('yican.splash', '1');
    return { html: V.splash(), chrome: 'none', splash: true };
  }
  return { html: V.home('recommend'), chrome: 'main', tab: 'recommend' };
}

function currentTab() {
  const m = location.hash.match(/^#\/home(?:\/(recommend|pantry|craving))?$/);
  return m ? (m[1] || 'recommend') : null;
}

function bottomNav(active) {
  const atHome = currentTab() !== null;
  const item = (href, ico, label, on) =>
    `<a class="nav-item ${on ? 'on' : ''}" href="${href}">${ico}<span>${label}</span></a>`;
  return `<nav class="bottom-nav">
    ${item('#/home', I.home, '首页', atHome)}
    ${item('#/menu', I.menu, '餐单', active === 'menu')}
    ${item('#/me', I.user, '我的', active === 'me')}
  </nav>`;
}

let splashTimer = null;
function render() {
  const hash = location.hash || '#/';
  let view = null;
  for (const [re, fn] of routes) {
    const m = hash.match(re);
    if (m) { view = fn(m); break; }
  }
  if (!view) { view = { html: V.home('recommend'), chrome: 'main' }; }

  // 启动页定时
  if (splashTimer) { clearTimeout(splashTimer); splashTimer = null; }
  if (view.splash) {
    splashTimer = setTimeout(() => { location.hash = '#/home'; }, 1600);
  }

  if (view.chrome === 'none') {
    app.innerHTML = view.html;
  } else if (view.chrome === 'main') {
    const navKey = view.nav || (currentTab() ? 'home' : '');
    app.innerHTML = `<div class="screen with-nav">${view.html}${bottomNav(navKey)}</div>`;
  } else {
    app.innerHTML = `<div class="screen">${view.html}</div>`;
  }
  window.scrollTo(0, 0);
  bindPage();
}

window.addEventListener('hashchange', render);
store.subscribe(() => render());

/* ---------- 想吃什么：本地搜索过滤 ---------- */
function bindCraving() {
  const input = document.getElementById('crave-input');
  const box = document.getElementById('crave-results');
  if (!input || !box) return;
  const run = (kw) => {
    const q = (kw || input.value).trim();
    let list = store.recommendations().map((x) => x.r);
    if (q) {
      list = RECIPES.filter((r) => {
        const inName = r.name.includes(q) || r.line.includes(q);
        const inFood = r.ingredients.some((x) => FOODS[x.food].name.includes(q)) ||
          r.cookware.some((c) => COOKWARE[c].name.includes(q));
        return inName || inFood;
      });
    }
    box.innerHTML = `<h3 class="sec-title">${q ? '找到这些' : '今天想吃点家常的'}</h3>` +
      (list.length
        ? `<div class="feed">${list.map((r) => V.recipeCard(r)).join('')}</div>`
        : `<div class="empty-note soft"><h3>暂时没有这道菜</h3><p>换个食材，或先记下家里有什么。</p>
           <a class="btn btn-primary" href="#/manage/food">记下家里的食材</a></div>`);
  };
  input.addEventListener('input', () => run());
  input.dataset.bound = '1';
  window.__craveRun = run;
}

function bindPage() {
  bindCraving();
}

/* ---------- 动作委托 ---------- */
document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  const id = el.dataset.id;

  switch (act) {
    case 'add-menu':
      store.addToMenu(id);
      location.hash = '#/menu';
      break;
    case 'quick-add':
      // 网格卡右下角 + ：直接加餐单，不跳页，留在选菜流里继续逛
      store.addToMenu(id);
      break;
    case 'go-menu':
      location.hash = '#/menu';
      break;
    case 'clear-menu':
      store.clearMenu();
      location.hash = '#/home';
      break;
    case 'cw-yes': {
      store.confirmCookware(id, true);
      const r = store.currentDish();
      const e = store.evaluate(r);
      if (e.lack.length) { store.buildShopping(); location.hash = '#/shopping'; }
      else location.hash = `#/ready/${r.id}`; // 只缺调料不阻断，菜单页已有补货提示
      break;
    }
    case 'cw-no':
      store.confirmCookware(id, false); // 明确没有，绝不被默认覆盖
      store.clearMenu();
      location.hash = '#/home';
      break;
    case 'gen-shop':
      store.buildShopping();
      location.hash = '#/shopping';
      break;
    case 'shop-check':
      ev.preventDefault();
      store.toggleShopItem(Number(id));
      break;
    case 'to-ingest':
      location.hash = '#/ingest';
      break;
    case 'ingest': {
      store.confirmIngest();
      const r = store.currentDish();
      location.hash = `#/ready/${r.id}`;
      break;
    }
    case 'finish':
      store.finishCooking(id);
      location.hash = `#/stamp/${id}`;
      break;
    case 'undo':
      store.undoLastFinish();
      location.hash = '#/home';
      break;
    case 'food-step':
      store.stepFood(id, Number(el.dataset.d));
      break;
    case 'sea':
      store.setSeasoning(id, el.dataset.v);
      break;
    case 'cw-set':
      store.setCookware(id, el.dataset.v);
      break;
    case 'pref-toggle':
      ev.preventDefault();
      ev.stopPropagation();
      store.togglePref(el.dataset.g, id); // save() 会自动重渲染，chip 选中态原地更新
      break;
    case 'clear-prefs':
      ev.preventDefault();
      ev.stopPropagation();
      store.clearPrefs();
      break;
    case 'close-prefs':
      location.hash = '#/home/recommend';
      break;
    case 'crave': {
      const input = document.getElementById('crave-input');
      if (input && window.__craveRun) { input.value = id; window.__craveRun(id); input.focus(); }
      break;
    }
    case 'reset-sample':
      confirmModal({
        title: '重置为示例厨房',
        body: '会清空你现在的库存、餐单和开火记录，换成“鸡蛋 2 个、盐油齐全”的示例厨房。',
        ok: '重置'
      }).then((ok) => { if (ok) { store.resetToSample(); location.hash = '#/home'; } });
      break;
    case 'reset-empty':
      confirmModal({
        title: '清空成全新空厨房',
        body: '会清空全部食材、调料、厨具和开火记录，回到第一次打开的空厨房。',
        ok: '清空',
        danger: true
      }).then((ok) => { if (ok) { store.resetToEmpty(); location.hash = '#/home'; } });
      break;
  }
});

/* ---------- 自写同主题确认弹窗（不用原生 confirm） ---------- */
function confirmModal({ title, body, ok = '确定', danger = false }) {
  return new Promise((resolve) => {
    const wrap = document.createElement('div');
    wrap.className = 'modal-mask';
    wrap.innerHTML = `<div class="modal">
      <h3>${title}</h3>
      <p>${body}</p>
      <div class="modal-actions">
        <button class="btn btn-ghost" data-r="0">取消</button>
        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-r="1">${ok}</button>
      </div></div>`;
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('show'));
    const done = (v) => { wrap.classList.remove('show'); setTimeout(() => wrap.remove(), 180); resolve(v); };
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) done(false);
      const b = e.target.closest('button[data-r]');
      if (b) done(b.dataset.r === '1');
    });
  });
}

/* ---------- 离线 PWA ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

render();
