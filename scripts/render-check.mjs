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
function must(name, html, word) {
  if (!html.includes(word)) { console.log('FAIL ', name, '缺', word); fails++; }
}

// 初始
check('splash', V.splash());
check('home', V.home());
must('home', V.home(), '一餐');
must('home', V.home(), '推荐菜品');
must('home', V.home(), '我能做');
check('can-do/初始', V.canDo());
check('favorites/空', V.favorites());
check('recipe/tomato', V.recipe('tomato-egg'));
must('recipe', V.recipe('tomato-egg'), '开始做菜');
must('recipe', V.recipe('tomato-egg'), '用料');
must('recipe', V.recipe('tomato-egg'), '做法');
must('recipe', V.recipe('tomato-egg'), 'detail-fav');
check('recipe/herbs', V.recipe('herbs-potato'));
check('menu/empty', V.menu());
check('kitchen', V.kitchen());
check('manage/food', V.manage('food'));
check('manage/seasoning', V.manage('seasoning'));
check('manage/cookware', V.manage('cookware'));
check('prefs', V.prefs());

// 收藏
store.toggleFavorite('mapo-tofu');
check('favorites/有收藏', V.favorites());
must('favorites', V.favorites(), '麻婆豆腐');
must('recipe/已收藏', V.recipe('mapo-tofu'), 'is-fav');
store.toggleFavorite('mapo-tofu');

// 加入餐单 -> 厨具未记录确认页
store.addToMenu('tomato-egg');
check('menu/ask-cookware', V.menu(), ['undefined', 'NaN', '[object']);
must('menu', V.menu(), '家里有炒锅吗');

// 确认有炒锅 -> 缺番茄 -> 采买
store.confirmCookware('wok', true);
store.buildShopping();
check('shopping', V.shopping());
must('shopping', V.shopping(), '番茄');

// 勾选 -> 入库预览 -> 入库
store.toggleShopItem(0);
check('ingest', V.ingest());
must('ingest', V.ingest(), '→');
store.confirmIngest();
check('ready', V.ready('tomato-egg'));
check('can-do/齐料', V.canDo());
must('can-do', V.canDo(), '番茄炒蛋');
check('cook', V.cook('tomato-egg'));
check('consume', V.consume('tomato-egg'));

// 完成落章
store.finishCooking('tomato-egg');
check('stamp', V.stamp('tomato-egg'));
check('me/with-history', V.me());
check('home/after', V.home());
check('kitchen/after', V.kitchen());

// 空厨房
store.resetToEmpty();
check('home/empty-kitchen', V.home());
must('home', V.home(), '等你添点新鲜');
check('can-do/空厨房', V.canDo());

console.log(fails ? `\n${fails} 条需检查` : '\n全部渲染正常');
process.exit(fails ? 1 : 0);
