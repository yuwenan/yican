// 一餐 · 视图渲染检查：按真实闭环顺序，边推进状态边渲染每一屏
const mem = {};
global.localStorage = { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; } };

const { store } = await import('../js/store.js');
const V = await import('../js/views.js');

let fails = 0;
function check(name, html, mustNot = ['undefined', 'NaN', '[object', '>null<']) {
  let bad = [];
  try {
    if (typeof html !== 'string' || html.length < 50) bad.push('输出异常');
    else bad = mustNot.filter((b) => html.includes(b));
  } catch (err) { bad = [err.message]; }
  if (bad.length) { console.log('FAIL ', name, '->', bad.join(',')); fails++; }
  else console.log('PASS ', name, `(${html.length} 字)`);
}

// 初始
check('splash', V.splash());
check('home/recommend', V.home('recommend'));
check('home/pantry', V.home('pantry'));
check('home/craving', V.home('craving'));
check('recipe/tomato', V.recipe('tomato-egg'));
check('recipe/herbs', V.recipe('herbs-potato'));
check('menu/empty', V.menu());
check('kitchen', V.kitchen());
check('manage/food', V.manage('food'));
check('manage/seasoning', V.manage('seasoning'));
check('manage/cookware', V.manage('cookware'));
check('prefs', V.prefs());

// 加入餐单 -> 厨具未记录确认页
store.addToMenu('tomato-egg');
check('menu/ask-cookware', V.menu(), ['undefined', 'NaN', '[object']);
if (!V.menu().includes('家里有炒锅吗')) { console.log('FAIL  menu/ask-cookware 缺确认文案'); fails++; }

// 确认有炒锅 -> 缺番茄 -> 采买
store.confirmCookware('wok', true);
store.buildShopping();
check('shopping', V.shopping());
if (!V.shopping().includes('番茄')) { console.log('FAIL  shopping 缺番茄'); fails++; }

// 勾选 -> 入库预览 -> 入库
store.toggleShopItem(0);
check('ingest', V.ingest());
if (!V.ingest().includes('→')) { console.log('FAIL  ingest 缺变化'); fails++; }
store.confirmIngest();
check('ready', V.ready('tomato-egg'));
check('cook', V.cook('tomato-egg'));
check('consume', V.consume('tomato-egg'));

// 完成落章
store.finishCooking('tomato-egg');
check('stamp', V.stamp('tomato-egg'));
check('me/with-history', V.me());
check('home/after', V.home('recommend'));
check('kitchen/after', V.kitchen());

// 空厨房
store.resetToEmpty();
check('home/empty-kitchen', V.home('pantry'));
if (!V.home('pantry').includes('等你添点新鲜')) { console.log('FAIL  空厨房引导缺失'); fails++; }

console.log(fails ? `\n${fails} 条需检查` : '\n全部渲染正常');
process.exit(fails ? 1 : 0);
