// 一餐 · 视图。每个函数返回一段 HTML；导航用 <a href="#/...">，动作用 data-act。
import { store, FOODS, SEASONINGS, COOKWARE, RECIPES } from './store.js';
import { recipeById } from './data.js';
import { I } from './icons.js';

const S = store; // 简写
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- 通用块 ---------- */

function head(title, sub) {
  return `<header class="head">
    <h1>${title}</h1>
    ${sub ? `<p>${sub}</p>` : ''}
  </header>`;
}

function btn(text, act, extra = '', opts = {}) {
  const { id, primary = true, disabled = false } = opts;
  const tag = act
    ? `<button class="btn ${primary ? 'btn-primary' : 'btn-ghost'}" data-act="${act}"${id ? ` data-id="${esc(id)}"` : ''}${disabled ? ' disabled' : ''}>${text}</button>`
    : '';
  return extra ? `<div class="cta-stack">${extra}${tag}</div>` : `<div class="cta-stack">${tag}</div>`;
}

function back(route = '#/home') {
  return `<a class="back-btn" href="${route}" aria-label="返回">${I.back}</a>`;
}

// 菜谱卡
function dishCard({ r, e }) {
  const cwNames = r.cookware.map((c) => COOKWARE[c].name).join('＋');
  let tag;
  if (e.ready) tag = `<span class="tag tag-ok">食材齐了 · 可以直接做</span>`;
  else if (e.blocked) tag = `<span class="tag tag-danger">缺厨具：${e.missingCookware.map((c) => COOKWARE[c].name).join('、')}</span>`;
  else {
    const bits = [];
    if (e.ownedCount) bits.push(`用上 ${e.ownedCount} 样库存`);
    if (e.lack.length) bits.push(`还缺 ${e.lack.map((x) => FOODS[x.food].name).join('、')}`);
    if (e.unknownCookware.length) bits.push(`厨具待确认`);
    tag = `<span class="tag">${bits.join(' · ')}</span>`;
  }
  return `<a class="dish-card" href="#/recipe/${r.id}">
    <img src="${r.img}" alt="${esc(r.name)}" loading="lazy" />
    <div class="dish-meta">
      <div class="dish-name">${esc(r.name)}</div>
      <div class="dish-sub">${esc(r.line)} · ${r.minutes} 分钟 · ${esc(cwNames)}</div>
      ${tag}
    </div>
  </a>`;
}

/* ---------- 00 启动页 ---------- */
export function splash() {
  return `<div class="splash">
    <div class="splash-brand">
      <span class="brand-mark">${I.pot}</span>
      <h1>一餐</h1>
    </div>
    <img class="splash-photo" src="assets/img/dish-tomato-egg.png" alt="" />
    <p class="splash-slogan">把日子，过得有滋有味。</p>
    <a class="splash-skip" href="#/home" data-act="skip-splash">从一顿好饭开始</a>
  </div>`;
}

/* ---------- 01 首页（三 tab） ---------- */
const TABS = [
  { k: 'recommend', n: '为你推荐' },
  { k: 'pantry', n: '家里食材' },
  { k: 'craving', n: '想吃什么' }
];

export function home(tab = 'recommend') {
  const titles = {
    recommend: ['今天，吃点好的', '给自己的一餐，从这里开始'],
    pantry: ['用手边的，做点好的', '记住你的食材，也记住你的厨具'],
    craving: ['想吃什么，找找看', '一道菜，或一种喜欢的食材']
  };
  const [title, sub] = titles[tab];
  const empty = S.isKitchenEmpty();

  const tabBar = `<div class="tabs">${TABS.map((t) =>
    `<a class="tab ${tab === t.k ? 'on' : ''}" href="#/home/${t.k}">${t.n}</a>`).join('')}</div>`;

  let body = '';

  if (tab === 'recommend') {
    const max = S.get().prefs.maxMinutes;
    const chips = max
      ? `<a class="filterbar chip-on" href="#/prefs">${I.clock}<span>${max} 分钟内，轻松开饭</span><span class="chip-clear" data-act="clear-pref">${I.back}</span></a>`
      : `<a class="filterbar" href="#/prefs">${I.spark}<span>今日灵感</span><span class="filter-go">筛选 ${I.arrow}</span></a>`;
    const recs = S.recommendations();
    const emptyKit = empty ? emptyKitchenNote() : '';
    body = `${chips}${emptyKit}<section class="feed">
      ${recs.some((x) => x.e.ready) ? '<h3 class="sec-title">简单做，也好吃</h3>' : '<h3 class="sec-title">这些，很适合今天</h3>'}
      ${recs.map(dishCard).join('')}
      ${recs.every((x) => x.e.blocked) ? noMatch() : ''}
    </section>`;
  }

  if (tab === 'pantry') {
    const foods = Object.entries(S.get().inventory);
    const seas = Object.entries(S.get().seasonings).filter(([, v]) => v === 'available');
    const cws = Object.entries(S.get().cookware).filter(([, v]) => v === 'have');
    const foodCard = `<a class="sum-card" href="#/manage/food">
      <div><div class="sum-title">${foods.length ? foods.map(([id, q]) => `${FOODS[id].name} ${S.qtyText(q, FOODS[id].unit)}`).join(' · ') : '还没有记下食材'}</div>
      <div class="sum-sub">食材与调料</div></div>
      <span class="row-go">调整食材 ${I.arrow}</span></a>`;
    const cwCard = `<a class="sum-card" href="#/manage/cookware">
      <div><div class="sum-title">${cws.length ? cws.map(([id]) => COOKWARE[id].name).join(' · ') : '厨具还没记录'}</div>
      <div class="sum-sub">我的厨具</div></div>
      <span class="row-go">修改厨具 ${I.arrow}</span></a>`;
    void seas;
    const recs = S.recommendations();
    body = `${empty ? emptyKitchenNote() : ''}
      <div class="card-stack">${foodCard}${cwCard}</div>
      <section class="feed"><h3 class="sec-title">可以这样吃</h3>
      ${recs.map(dishCard).join('')}</section>`;
  }

  if (tab === 'craving') {
    const hot = ['番茄炒蛋', '土豆', '西兰花', '鸡蛋'];
    body = `<div class="searchbox">${I.search}<input id="crave-input" placeholder="搜索菜名或食材" autocomplete="off" /></div>
    <div class="chips">${hot.map((w) => `<button class="chip" data-act="crave" data-id="${esc(w)}">${esc(w)}</button>`).join('')}</div>
    <div id="crave-results"><h3 class="sec-title">今天想吃点家常的</h3>${S.recommendations().map(dishCard).join('')}</div>`;
  }

  return `<div class="page home-page">
    ${head(title, sub)}
    ${tabBar}
    <div class="scroll-body">${body}</div>
  </div>`;
}

function emptyKitchenNote() {
  return `<div class="empty-note">
    <div class="empty-art">${I.pot}</div>
    <h3>厨房，等你添点新鲜</h3>
    <p>第一次见面，从手边的食材开始。一个土豆，也能有好几种吃法。</p>
    <a class="btn btn-primary" href="#/manage/food">记下家里的食材</a>
    <a class="btn btn-ghost" href="#/home/craving">先看看想吃什么</a>
  </div>`;
}

function noMatch() {
  return `<div class="empty-note soft">
    <h3>换个思路，也能开饭</h3>
    <p>当前食材和厨具暂时没有合适搭配。添一样，或换一种做法。</p>
    <a class="btn btn-ghost" href="#/manage/cookware">调整厨具</a>
    <a class="btn btn-ghost" href="#/manage/food">换些食材</a>
    <a class="btn btn-ghost" href="#/home/craving">直接看看想吃的</a>
  </div>`;
}

/* ---------- 06 菜谱详情 ---------- */
export function recipe(id) {
  const r = recipeById(id);
  if (!r) return notFound();
  const e = S.evaluate(r);
  const cwNames = r.cookware.map((c) => COOKWARE[c].name).join('、');

  const owned = r.ingredients.filter((x) => !e.lack.some((l) => l.food === x.food));
  const lack = e.lack;
  const seasHave = r.seasonings.filter((s) => S.get().seasonings[s] !== 'none');

  const row = (name, qty, unit, right, ok) => `<div class="line-row">
    <span class="line-name">${esc(name)} <em>${S.qtyText(qty, unit)}</em></span>
    <span class="line-state ${ok ? 'is-ok' : 'is-buy'}">${right}</span></div>`;

  return `<div class="page detail-page">
    <div class="detail-topbar">${back('#/home')}</div>
    <img class="detail-hero" src="${r.img}" alt="${esc(r.name)}" />
    <div class="detail-body">
      <h2>${esc(r.name)}</h2>
      <p class="detail-line">${esc(r.line)}，一人份刚刚好</p>
      <div class="detail-meta">${I.clock}<span>${r.minutes} 分钟</span><span>·</span><span>${r.servings} 人份</span><span>·</span><span>需要${esc(cwNames)}</span></div>

      <div class="ing-group">
        <h4>家里有</h4>
        ${owned.length ? owned.map((x) => row(FOODS[x.food].name, x.qty, FOODS[x.food].unit, '家里有', true)).join('') : '<p class="dim">这道菜的主料都还没有。</p>'}
        ${seasHave.length ? `<p class="hint">${seasHave.map((s) => SEASONINGS[s].name).join('、')}已在厨房，不重复采买。</p>` : ''}
      </div>
      <div class="ing-group">
        <h4>需要买</h4>
        ${lack.length ? lack.map((x) => row(FOODS[x.food].name, x.need, FOODS[x.food].unit, `需要买 · 还差 ${S.qtyText(x.need - x.have > 0 ? x.need - x.have : x.need, FOODS[x.food].unit)}`, false)).join('') : '<p class="hint">主料都齐了，可以直接做。</p>'}
      </div>
      ${e.missingSeasoning.length ? `<p class="hint warn-hint">${e.missingSeasoning.map((s) => SEASONINGS[s].name).join('、')}已标记用完，记得补货。</p>` : ''}
      ${e.blocked ? `<p class="hint warn-hint">你标记了没有${e.missingCookware.map((c) => COOKWARE[c].name).join('、')}，这道菜暂时做不了。</p>` : ''}

      <div class="cta-stack">
        <button class="btn btn-primary" data-act="add-menu" data-id="${r.id}">加入今晚餐单</button>
        <a class="btn btn-ghost" href="#/home">返回推荐</a>
      </div>
    </div>
  </div>`;
}

/* ---------- 08/09 餐单（含厨具确认分支） ---------- */
export function menu() {
  const r = S.currentDish();
  if (!r) {
    return `<div class="page">${back('#/home')}${head('我的餐单', '把想吃的，慢慢变成日常')}
      <div class="scroll-body"><div class="empty-note soft">
        <div class="empty-art">${I.menu}</div>
        <h3>今晚还没安排</h3>
        <p>从一道想吃的菜开始，把它加进今晚餐单。</p>
        <a class="btn btn-primary" href="#/home">去挑一道菜</a>
      </div></div></div>`;
  }
  const e = S.evaluate(r);

  // 厨具未记录：先确认（V2 番茄分支）
  if (e.unknownCookware.length) {
    const cid = e.unknownCookware[0];
    return `<div class="page">${back('#/recipe/' + r.id)}${head('今天晚餐', `${esc(r.name)} · ${r.servings} 人份`)}
      <div class="scroll-body">
        <div class="dish-strip"><img src="${r.img}" alt=""/><div><div class="dish-name">${esc(r.name)}</div><div class="dish-sub">${r.minutes} 分钟</div></div></div>
        <div class="ask-card">
          <div class="ask-ico">${I.pot}</div>
          <h3>家里有${COOKWARE[cid].name}吗？</h3>
          <p>确认后再准备。${COOKWARE[cid].name}决定这道菜能不能做。</p>
        </div>
        <div class="cta-stack">
          <button class="btn btn-primary" data-act="cw-yes" data-id="${cid}">有${COOKWARE[cid].name}，查看采买清单</button>
          <button class="btn btn-ghost" data-act="cw-no" data-id="${cid}">没有${COOKWARE[cid].name}，换一道</button>
        </div>
      </div></div>`;
  }

  // 明确缺厨具
  if (e.blocked) {
    return `<div class="page">${back('#/home')}${head('今天晚餐', `${esc(r.name)} · 做不了这道`)}
      <div class="scroll-body"><div class="empty-note soft">
        <h3>缺少厨具</h3>
        <p>你标记了没有${e.missingCookware.map((c) => COOKWARE[c].name).join('、')}。换一道，或在“我的厨具”里改回来。</p>
        <a class="btn btn-primary" href="#/manage/cookware">修改我的厨具</a>
        <button class="btn btn-ghost" data-act="clear-menu">换一道菜</button>
      </div></div></div>`;
  }

  // 正常餐单：缺料汇总
  const haveLines = r.ingredients.filter((x) => !e.lack.some((l) => l.food === x.food))
    .map((x) => `<span class="pill pill-ok">${FOODS[x.food].name}</span>`).join('');
  const lackLines = e.lack.map((x) => `<span class="pill pill-buy">${FOODS[x.food].name} ${S.qtyText(x.buyQty, FOODS[x.food].unit)}</span>`).join('');

  return `<div class="page">${back('#/home')}${head('今天晚餐', `${r.servings} 人份 · 1 道菜 · 约 ${r.minutes} 分钟`)}
    <div class="scroll-body">
      <div class="dish-strip"><img src="${r.img}" alt=""/><div><div class="dish-name">${esc(r.name)}</div>
      <div class="dish-sub">${e.lack.length ? `还缺 ${e.lack.length} 样食材` : '食材都齐了'}</div></div></div>
      <div class="pill-group">${haveLines}${lackLines}</div>
      ${e.missingSeasoning.length ? `<p class="hint warn-hint">${e.missingSeasoning.map((s) => SEASONINGS[s].name).join('、')}用完了，顺手补一瓶。</p>` : ''}
      <div class="cta-stack">
        ${e.lack.length
          ? `<button class="btn btn-primary" data-act="gen-shop">生成采买清单</button>`
          : `<a class="btn btn-primary" href="#/ready/${r.id}">食材齐了，开始做</a>`}
        <a class="btn btn-ghost" href="#/home">返回餐单</a>
      </div>
    </div></div>`;
}

/* ---------- 10 采买清单 ---------- */
export function shopping() {
  const items = S.get().shopping;
  const r = S.currentDish();
  if (!r || !items.length) {
    return `<div class="page">${back('#/menu')}${head('采买清单', '从今晚餐单生成')}
      <div class="scroll-body"><div class="empty-note soft"><p>还没有采买清单。</p>
      <a class="btn btn-primary" href="#/menu">回到今晚餐单</a></div></div></div>`;
  }
  const allChecked = items.every((x) => x.checked);
  return `<div class="page">${back('#/menu')}
    ${head('去买一点新鲜', `今天晚餐 · 还缺 ${items.length} 样`)}
    <div class="scroll-body">
      <div class="check-list">
        ${items.map((x, i) => `<button class="check-row ${x.checked ? 'on' : ''}" data-act="shop-check" data-id="${i}">
          <span class="circle">${I.check}</span>
          <span class="check-name">${FOODS[x.food].name}</span>
          <span class="check-qty">${S.qtyText(x.qty, x.unit)}</span>
        </button>`).join('')}
      </div>
      <p class="hint">勾选只表示买到了，确认入库后才会加进厨房。</p>
      <div class="cta-stack">
        <button class="btn btn-primary" data-act="to-ingest" ${allChecked ? '' : 'disabled'}>买到了，确认数量</button>
        <a class="btn btn-ghost" href="#/menu">返回今晚餐单</a>
      </div>
    </div></div>`;
}

/* ---------- 12 确认入库 ---------- */
export function ingest() {
  const preview = S.ingestPreview();
  const r = S.currentDish();
  if (!preview.length) {
    return `<div class="page">${back('#/shopping')}${head('放进我的厨房', '先勾选买到的食材')}
      <div class="scroll-body"><div class="cta-stack"><a class="btn btn-primary" href="#/shopping">回采买清单勾选</a></div></div></div>`;
  }
  return `<div class="page">${back('#/shopping')}
    ${head('放进我的厨房', '按实际买到的数量记录')}
    <div class="scroll-body">
      <div class="check-list">
        ${preview.map((x) => `<div class="line-row static">
          <span class="line-name">${FOODS[x.food].name}</span>
          <span class="delta">${S.qtyText(x.before, x.unit)} <span class="arrow-t">→</span> <strong>${S.qtyText(x.after, x.unit)}</strong></span>
        </div>`).join('')}
      </div>
      <p class="hint">回家前核对一下实际买了多少。确认后食材才进入厨房。</p>
      <div class="cta-stack">
        <button class="btn btn-primary" data-act="ingest">确认入库</button>
        <a class="btn btn-ghost" href="#/shopping">返回修改</a>
      </div>
    </div></div>`;
}

/* ---------- 13 食材齐了 ---------- */
export function ready(id) {
  const r = recipeById(id) || S.currentDish();
  if (!r) return notFound();
  const total = r.ingredients.length;
  return `<div class="page">${back('#/menu')}
    <div class="scroll-body soft-center">
      <img class="ready-img" src="${r.img}" alt="${esc(r.name)}" />
      <h2 class="ready-title">食材齐了，开火吧</h2>
      <p class="dim">今天晚餐 · 已准备好</p>
      <div class="ready-badge">${I.check}<span>食材已就位 · ${total} 样</span></div>
      <div class="cta-stack">
        <a class="btn btn-primary" href="#/cook/${r.id}">开始做这道菜</a>
        <a class="btn btn-ghost" href="#/home">晚点再做</a>
      </div>
    </div></div>`;
}

/* ---------- 14 做菜步骤 ---------- */
export function cook(id) {
  const r = recipeById(id);
  if (!r) return notFound();
  return `<div class="page">${back('#/menu')}
    ${head('跟着做，就好', `${esc(r.name)} · ${r.minutes} 分钟`)}
    <div class="scroll-body">
      <img class="cook-img" src="${r.img}" alt="" />
      <div class="steps">
        ${r.steps.map((s, i) => `<div class="step-card">
          <span class="step-no">${String(i + 1).padStart(2, '0')}</span>
          <div><div class="step-t">${esc(s.t)}</div><div class="step-d">${esc(s.d)}</div></div>
        </div>`).join('')}
      </div>
      ${r.note ? `<p class="hint">${esc(r.note)} 时间仅参考，别让计时器替你判断熟度。</p>` : ''}
      <div class="cta-stack">
        <a class="btn btn-primary" href="#/consume/${r.id}">做好了，记录这一餐</a>
      </div>
    </div></div>`;
}

/* ---------- 15 确认消耗 ---------- */
export function consume(id) {
  const r = recipeById(id);
  if (!r) return notFound();
  const inv = S.get().inventory;
  const seas = r.seasonings;
  return `<div class="page">${back('#/cook/' + r.id)}
    ${head('这次用了多少', '确认后，记住剩下的食材')}
    <div class="scroll-body">
      <div class="check-list">
        ${r.ingredients.map(({ food, qty }) => {
          const before = inv[food] || 0;
          const after = Math.max(0, Math.round((before - qty) * 10) / 10);
          const unit = FOODS[food].unit;
          const afterTxt = after <= 0 ? '用完' : `剩 ${S.qtyText(after, unit)}`;
          return `<div class="line-row static">
            <span class="line-name">${FOODS[food].name}</span>
            <span class="delta">用了 ${S.qtyText(qty, unit)} <span class="arrow-t">→</span> <strong>${afterTxt}</strong></span>
          </div>`;
        }).join('')}
        ${seas.map((sid) => `<div class="line-row static">
          <span class="line-name">${SEASONINGS[sid].name}</span>
          <span class="delta dim">${S.get().seasonings[sid] === 'none' ? '已标记用完' : '还有，不改库存'}</span>
        </div>`).join('')}
      </div>
      <p class="hint">确认完成才会扣减并盖上今天的章。</p>
      <div class="cta-stack">
        <button class="btn btn-primary" data-act="finish" data-id="${r.id}">确认完成，盖个章</button>
        <a class="btn btn-ghost" href="#/cook/${r.id}">还没做完</a>
      </div>
    </div></div>`;
}

/* ---------- 16 完成 + 落章 ---------- */
export function stamp(id) {
  const r = recipeById(id);
  const inv = S.get().inventory;
  const left = Object.entries(inv).filter(([, q]) => q > 0);
  return `<div class="page stamp-page">
    <div class="scroll-body soft-center">
      <div class="stamp-stage">
        <div class="stamp-seal">${I.stamp}<span>认真开饭</span></div>
      </div>
      <h2 class="stamp-title">今天，好好吃饭了</h2>
      <p class="dim">一餐一枚，记下自己的小日子</p>
      <div class="stamp-card">
        <div class="sc-row"><span>今天做了</span><strong>${esc(r ? r.name : '一餐')}</strong></div>
        ${left.length ? `<div class="sc-row"><span>厨房还剩</span><strong>${left.slice(0, 3).map(([f, q]) => `${FOODS[f].name} ${S.qtyText(q, FOODS[f].unit)}`).join('、')}</strong></div>` : ''}
      </div>
      <p class="stamp-quote">把平常的一天，做得有滋有味。</p>
      <div class="cta-stack">
        <a class="btn btn-primary" href="#/home">好的</a>
        <button class="btn btn-ghost" data-act="undo">撤销这次记录</button>
      </div>
    </div>
  </div>`;
}

/* ---------- 我的厨房（库存视图，从“我的”进入） ---------- */
export function kitchen() {
  const st = S.get();
  const foods = Object.entries(st.inventory).filter(([, q]) => q > 0);
  const seas = Object.entries(st.seasonings);
  const cws = Object.entries(st.cookware).filter(([, v]) => v === 'have');
  return `<div class="page">${back('#/me')}${head('我的厨房', '记住手边所有小小的新鲜')}
    <div class="scroll-body">
      <div class="card-stack">
        <div class="inv-card">
          <div class="inv-head"><h3>食材</h3><a href="#/manage/food" class="link">补充食材 ${I.arrow}</a></div>
          ${foods.length ? `<div class="pill-group">${foods.map(([id, q]) => `<span class="pill">${FOODS[id].name} ${S.qtyText(q, FOODS[id].unit)}</span>`).join('')}</div>` : '<p class="dim">还没有食材。</p>'}
        </div>
        <div class="inv-card">
          <div class="inv-head"><h3>常备调料</h3><a href="#/manage/seasoning" class="link">管理 ${I.arrow}</a></div>
          <div class="pill-group">
            ${seas.length ? seas.map(([id, v]) => `<span class="pill ${v === 'none' ? 'pill-off' : 'pill-ok'}">${SEASONINGS[id].name}${v === 'none' ? ' · 用完' : ''}</span>`).join('') : '<span class="dim">还没记录调料。</span>'}
          </div>
        </div>
        <div class="inv-card">
          <div class="inv-head"><h3>我的厨具</h3><a href="#/manage/cookware" class="link">管理 ${I.arrow}</a></div>
          <div class="pill-group">
            ${cws.length ? cws.map(([id]) => `<span class="pill pill-ok">${COOKWARE[id].name}</span>`).join('') : '<span class="dim">还没记录厨具。</span>'}
          </div>
        </div>
      </div>
    </div></div>`;
}

/* ---------- 管理：食材 / 调料 / 厨具 ---------- */
export function manage(kind) {
  const titles = { food: ['家里有什么', '选几样食材，看看今天能做什么'], seasoning: ['常备调料', '用完的调料标记一下，下次不会算作家里有'], cookware: ['我的厨具', '记住这次选择，下次直接用'] };
  const [t, sub] = titles[kind] || titles.food;

  let inner = '';
  if (kind === 'food') {
    inner = Object.entries(FOODS).map(([id, f]) => {
      const q = S.get().inventory[id] || 0;
      return `<div class="stepper-row">
        <span class="line-name">${f.name}${q ? ` <em>${S.qtyText(q, f.unit)}</em>` : ''}</span>
        <span class="stepper">
          <button data-act="food-step" data-id="${id}" data-d="-1" ${q ? '' : 'disabled'}>${I.back}</button>
          <b>${S.trimNum(q)}</b>
          <button data-act="food-step" data-id="${id}" data-d="1">${I.plus}</button>
        </span></div>`;
    }).join('');
  } else if (kind === 'seasoning') {
    inner = Object.entries(SEASONINGS).map(([id, f]) => {
      const v = S.get().seasonings[id]; // available / none / undefined
      return `<div class="seg-row">
        <span class="line-name">${f.name}${v === 'none' ? '<em class="off"> · 用完</em>' : v === 'available' ? '' : '<em class=dim> · 未记录</em>'}</span>
        <span class="seg">
          <button class="${v === 'available' ? 'on' : ''}" data-act="sea" data-id="${id}" data-v="available">都有</button>
          <button class="${v === 'none' ? 'on off' : ''}" data-act="sea" data-id="${id}" data-v="none">用完</button>
        </span></div>`;
    }).join('');
  } else {
    inner = Object.entries(COOKWARE).map(([id, f]) => {
      const v = S.get().cookware[id] || 'unknown';
      return `<div class="seg-row">
        <span class="line-name">${f.name}${v === 'unknown' ? '<em class=dim> · 未记录</em>' : ''}</span>
        <span class="seg">
          <button class="${v === 'have' ? 'on' : ''}" data-act="cw-set" data-id="${id}" data-v="have">有</button>
          <button class="${v === 'none' ? 'on off' : ''}" data-act="cw-set" data-id="${id}" data-v="none">没有</button>
        </span></div>`;
    }).join('');
  }

  const backTo = kind === 'cookware' ? '#/home/pantry' : '#/home/pantry';
  return `<div class="page">${back(backTo)}${head(t, sub)}
    <div class="scroll-body"><div class="card-stack manage-list">${inner}</div>
    <div class="cta-stack"><a class="btn btn-primary" href="#/home/pantry">好了</a></div></div></div>`;
}

/* ---------- 筛选偏好 ---------- */
export function prefs() {
  const max = S.get().prefs.maxMinutes;
  const opt = (val, label, sub) => `<button class="opt-row ${max === val ? 'on' : ''}" data-act="pref" data-id="${val}">
    <span><span class="opt-t">${label}</span><span class="opt-s">${sub}</span></span>${I.arrow}</button>`;
  return `<div class="page sheet-page">
    <div class="scrim" data-act="close-prefs"></div>
    <div class="sheet">
      <span class="grabber"></span>
      <h2>今天想怎么做</h2>
      <p class="dim">有多少时间？</p>
      <div class="card-stack">
        ${opt(15, '15 分钟以内', '快手开饭')}
        ${opt(30, '30 分钟以内', '慢慢做')}
      </div>
      <div class="cta-stack">
        <button class="btn btn-ghost" data-act="pref" data-id="">不限制，随便看看</button>
        <a class="btn btn-primary" href="#/home/recommend">完成</a>
      </div>
    </div></div>`;
}

/* ---------- 25 我的 ---------- */
export function me() {
  const st = S.get();
  const foodCount = Object.keys(st.inventory).length;
  const cwCount = Object.values(st.cookware).filter((v) => v === 'have').length;
  const stamps = S.stampDates();
  const meRow = (ico, t, sub, href) => `<a class="me-row" href="${href}">
    <span class="me-ico">${ico}</span><span class="me-text">${t}</span><span class="me-sub">${sub} ${I.arrow}</span></a>`;

  return `<div class="page">
    ${head('我的', '把厨房，慢慢变成喜欢的样子')}
    <div class="scroll-body">
      <div class="me-card">
        <div class="avatar">${I.user}</div>
        <div><div class="me-name">我的小厨房</div><div class="dim">一人食，也有烟火气</div></div>
      </div>
      <div class="card-stack">
        ${meRow(I.basket, '食材与调料', foodCount ? `${foodCount} 样食材` : '查看库存', '#/kitchen')}
        ${meRow(I.pot, '我的厨具', cwCount ? `${cwCount} 件` : '未记录', '#/manage/cookware')}
        ${meRow(I.stamp, '做过的菜', stamps.length ? `${stamps.length} 枚章` : '还没有章', '#/me')}
        ${meRow(I.clock, '口味与时间', '调整偏好', '#/prefs')}
      </div>
      ${stamps.length ? `<section class="stamp-history"><h3 class="sec-title">开火的日子</h3>
        ${stamps.map((d) => {
          const hs = st.history.filter((h) => h.date === d);
          return `<div class="stamp-day"><span class="stamp-dot">${I.stamp}</span>
            <div><div class="d-date">${d}</div><div class="d-dish">${hs.map((h) => recipeById(h.recipeId)?.name).filter(Boolean).join('、')}</div></div></div>`;
        }).join('')}</section>` : ''}
      <div class="danger-zone">
        <button class="btn btn-ghost" data-act="reset-sample">重置为示例厨房</button>
        <button class="btn btn-text-danger" data-act="reset-empty">清空成全新空厨房</button>
      </div>
    </div></div>`;
}

function notFound() {
  return `<div class="page"><div class="scroll-body soft-center"><p>页面不存在。</p><a class="btn btn-primary" href="#/home">回首页</a></div></div>`;
}
