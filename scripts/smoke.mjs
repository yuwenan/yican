// 一餐 · 库存闭环业务规则冒烟测试（Node 运行，无浏览器依赖）
const mem = {};
global.localStorage = {
  getItem: (k) => (k in mem ? mem[k] : null),
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; }
};

const { store } = await import('../js/store.js');
const { recipeById } = await import('../js/data.js');

const log = [];
const ok = (name, cond) => log.push((cond ? 'PASS' : 'FAIL') + '  ' + name);

// 初始：选菜不入账
store.addToMenu('tomato-egg');
let e = store.evaluate(store.currentDish());
ok('初始番茄不 ready（缺番茄+炒锅未记录）', !e.ready && e.lack.length === 1 && e.unknownCookware.includes('wok'));

store.confirmCookware('wok', true);
e = store.evaluate(store.currentDish());
ok('确认炒锅后仍缺番茄', !e.ready && e.lack[0].food === 'tomato');

store.buildShopping();
ok('采买仅番茄 1 个', store.get().shopping.length === 1 && store.get().shopping[0].qty === 1);
ok('选菜/生成清单未入账', (store.get().inventory.tomato || 0) === 0);

store.toggleShopItem(0);
const prev = store.ingestPreview()[0];
ok('入库预览 0 -> 1', prev.before === 0 && prev.after === 1);
store.confirmIngest();
ok('确认入库后库存番茄 1', store.get().inventory.tomato === 1);
ok('食材厨具齐全 -> ready', store.evaluate(store.currentDish()).ready);

store.finishCooking('tomato-egg');
ok('完成后番茄 0、鸡蛋 0', (store.get().inventory.tomato || 0) === 0 && (store.get().inventory.egg || 0) === 0);
ok('写 1 条历史 / 1 枚章', store.get().history.length === 1 && store.stampDates().length === 1);
ok('完成后餐单清空', store.get().menu.length === 0);

store.finishCooking('tomato-egg');
ok('重复完成不重复记历史', store.get().history.length === 1);

store.undoLastFinish();
ok('撤销恢复 番茄1/鸡蛋2、历史清零', store.get().inventory.tomato === 1 && store.get().inventory.egg === 2 && store.get().history.length === 0);

store.setSeasoning('vinegar', 'none');
ok('调料 none 持久不被覆盖', store.get().seasonings.vinegar === 'none');

store.setCookware('airfryer', 'none');
ok('无空气炸锅 -> 香草菜 blocked', store.evaluate(recipeById('herbs-potato')).blocked === true);

store.resetToEmpty();
ok('空厨房 isKitchenEmpty', store.isKitchenEmpty() === true);

const fails = log.filter((l) => l.startsWith('FAIL'));
console.log(log.join('\n'));
console.log(fails.length ? `\n${fails.length} 条失败` : '\n全部通过');
process.exit(fails.length ? 1 : 0);
