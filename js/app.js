// 一餐 · 应用入口：hash 路由 + 玻璃胶囊底导 + 动作委托 + 自写确认弹窗 + 离线缓存
import { store, FOODS, COOKWARE } from './store.js';
import { RECIPES } from './data.js';
import { I } from './icons.js';
import * as V from './views.js';

const app = document.getElementById('app');

/* ---------- 路由 ---------- */
const routes = [
  [/^#?\/?$/, () => splashOrHome()],
  [/^#\/splash$/, () => ({ html: V.splash(), chrome: 'none', splash: true })],
  [/^#\/home$/, () => ({ html: V.home(), chrome: 'main', nav: 0 })],
  [/^#\/can-do$/, () => ({ html: V.canDo(), chrome: 'main', nav: 0 })],
  [/^#\/favorites$/, () => ({ html: V.favorites(), chrome: 'main', nav: 2 })],
  [/^#\/recipe\/(.+)$/, (m) => ({ html: V.recipe(m[1]), chrome: 'sub' })],
  [/^#\/menu$/, () => ({ html: V.menu(), chrome: 'main', nav: 1 })],
  [/^#\/shopping$/, () => ({ html: V.shopping(), chrome: 'sub' })],
  [/^#\/ingest$/, () => ({ html: V.ingest(), chrome: 'sub' })],
  [/^#\/ready\/(.+)$/, (m) => ({ html: V.ready(m[1]), chrome: 'sub' })],
  [/^#\/cook\/(.+)$/, (m) => ({ html: V.cook(m[1]), chrome: 'sub' })],
  [/^#\/consume\/(.+)$/, (m) => ({ html: V.consume(m[1]), chrome: 'sub' })],
  [/^#\/stamp\/(.+)$/, (m) => ({ html: V.stamp(m[1]), chrome: 'sub' })],
  [/^#\/kitchen$/, () => ({ html: V.kitchen(), chrome: 'main', nav: 2 })],
  [/^#\/manage\/(food|seasoning|cookware)$/, (m) => ({ html: V.manage(m[1]), chrome: 'sub' })],
  [/^#\/prefs$/, () => ({ html: V.prefs(), chrome: 'none' })],
  [/^#\/me$/, () => ({ html: V.me(), chrome: 'main', nav: 2 })]
];

function splashOrHome() {
  if (!sessionStorage.getItem('yican.splash')) {
    sessionStorage.setItem('yican.splash', '1');
    return { html: V.splash(), chrome: 'none', splash: true };
  }
  return { html: V.home(), chrome: 'main', nav: 0 };
}

/* ---------- 常驻悬浮玻璃胶囊底导（只建一次，靠 class/transform 切换） ---------- */
const navEl = document.createElement('nav');
navEl.className = 'bottom-nav';
navEl.innerHTML = `
  <span class="nav-thumb"></span>
  <a class="nav-item" href="#/home">${I.home}<span>首页</span></a>
  <a class="nav-item" href="#/menu">${I.menu}<span>餐单</span></a>
  <a class="nav-item" href="#/me">${I.user}<span>我的</span></a>`;
document.body.appendChild(navEl);

function setNav(active) {
  const items = navEl.querySelectorAll('.nav-item');
  items.forEach((it, i) => it.classList.toggle('on', i === active));
  navEl.querySelector('.nav-thumb').style.transform = `translateX(${active * 100}%)`;
  navEl.classList.add('show');
}
function hideNav() { navEl.classList.remove('show'); }

let splashTimer = null;
function render(resetScroll = true) {
  const hash = location.hash || '#/';
  let view = null;
  for (const [re, fn] of routes) {
    const m = hash.match(re);
    if (m) { view = fn(m); break; }
  }
  if (!view) view = { html: V.home(), chrome: 'main', nav: 0 };

  if (splashTimer) { clearTimeout(splashTimer); splashTimer = null; }
  if (view.splash) {
    splashTimer = setTimeout(() => { location.hash = '#/home'; }, 1600);
  }

  if (view.chrome === 'none') {
    app.innerHTML = view.html;
    hideNav();
  } else if (view.chrome === 'main') {
    app.innerHTML = `<div class="screen with-nav">${view.html}</div>`;
    setNav(view.nav ?? 0);
  } else {
    app.innerHTML = `<div class="screen">${view.html}</div>`;
    hideNav();
  }
  if (resetScroll) window.scrollTo(0, 0);
  bindPage();
}

// 切路由回到顶部；数据变更（勾选/步进/收藏）触发的重渲染保持滚动位置
window.addEventListener('hashchange', () => render(true));
store.subscribe(() => render(false));

/* ---------- 我能做：顶部搜索。默认只列马上能开火的，输入后搜全部菜 ---------- */
function bindSearch() {
  const input = document.getElementById('crave-input');
  const box = document.getElementById('crave-results');
  if (!input || !box) return;
  const run = (kw) => {
    const q = (kw || input.value).trim();
    let list;
    if (q) {
      list = RECIPES.filter((r) => {
        const inName = r.name.includes(q) || r.line.includes(q);
        const inFood = r.ingredients.some((x) => FOODS[x.food].name.includes(q)) ||
          r.cookware.some((c) => COOKWARE[c].name.includes(q));
        return inName || inFood;
      });
    } else {
      list = RECIPES.filter((r) => store.evaluate(r).ready);
    }
    box.innerHTML = `<h3 class="sec-title">${
      q ? (list.length ? '找到这些' : '暂时没有这道菜') : (list.length ? `现在就能开火 · ${list.length} 道` : '暂时没有能直接做的菜')
    }</h3>` +
      (list.length
        ? `<div class="feed">${list.map((r) => V.recipeCard(r)).join('')}</div>`
        : `<div class="empty-note soft feed-note"><p>换个食材，或先记下家里有什么。</p>
           <a class="btn btn-primary" href="#/manage/food">记下家里的食材</a></div>`);
  };
  input.addEventListener('input', () => run());
}

function bindPage() {
  bindSearch();
}

/* ---------- 动作委托 ---------- */
document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el) return;
  const act = el.dataset.act;
  const id = el.dataset.id;

  switch (act) {
    // 详情页唯一主按钮：加餐单后按齐备程度分流（确认厨具 / 采买 / 直接开火）
    case 'start-cook': {
      store.addToMenu(id);
      const r = store.currentDish();
      const e = store.evaluate(r);
      if (e.unknownCookware.length || e.blocked) location.hash = '#/menu';
      else if (e.lack.length) { store.buildShopping(); location.hash = '#/shopping'; }
      else location.hash = `#/ready/${r.id}`;
      break;
    }
    case 'fav':
      ev.preventDefault();
      store.toggleFavorite(id); // 订阅触发重渲染，心形态随数据更新
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
      location.hash = '#/home';
      break;
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
