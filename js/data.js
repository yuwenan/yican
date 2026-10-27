// 一餐 · 内置数据：食材 / 调料 / 厨具 / 菜谱 fixture
// 两套菜来自 Figma 原型：番茄炒蛋(V2 主链路) 与 香草薯角配西兰花(V1 链路)。

export const FOODS = {
  tomato:   { name: '番茄',   unit: '个' },
  egg:      { name: '鸡蛋',   unit: '个' },
  potato:   { name: '土豆',   unit: '个' },
  broccoli: { name: '西兰花', unit: '颗' },
  rosemary: { name: '迷迭香', unit: '小份' }
};

// 调料不做数量扣减，只在 available / none 间切换；none 只能手动恢复
export const SEASONINGS = {
  salt:    { name: '盐' },
  oil:     { name: '油' },
  vinegar: { name: '陈醋' }
};

export const COOKWARE = {
  wok:       { name: '炒锅' },
  airfryer:  { name: '空气炸锅' },
  steamer:   { name: '蒸锅' },
  ricecooker:{ name: '电饭煲' }
};

export const RECIPES = [
  {
    id: 'tomato-egg',
    name: '番茄炒蛋',
    line: '酸甜下饭',
    minutes: 15,
    servings: 1,
    img: 'assets/img/dish-tomato-egg.png',
    cookware: ['wok'],
    ingredients: [
      { food: 'tomato', qty: 1 },
      { food: 'egg', qty: 2 }
    ],
    seasonings: ['salt', 'oil'],
    steps: [
      { t: '备好食材', d: '番茄切块，鸡蛋打散。' },
      { t: '炒好鸡蛋', d: '热锅放油，鸡蛋炒至凝固后盛出。' },
      { t: '番茄炒出汁', d: '炒软番茄，倒回鸡蛋，加盐翻匀熟透。' }
    ]
  },
  {
    id: 'herbs-potato',
    name: '香草薯角配西兰花',
    line: '香草薯角，配一份清爽西兰花',
    minutes: 25,
    servings: 1,
    img: 'assets/img/dish-herbs.png',
    cookware: ['airfryer', 'steamer'],
    ingredients: [
      { food: 'potato', qty: 1 },
      { food: 'broccoli', qty: 0.5 },
      { food: 'rosemary', qty: 1 }
    ],
    seasonings: ['salt', 'oil'],
    steps: [
      { t: '土豆切块', d: '洗净，擦干表面。' },
      { t: '拌油、盐与迷迭香', d: '均匀铺进炸篮。' },
      { t: '炸薯角，同时蒸西兰花', d: '中途翻面，熟透出锅。' }
    ],
    note: '空气炸锅参考 180°C、15–20 分钟；按设备与切块大小调整，西兰花蒸熟。'
  }
];

export function recipeById(id) {
  return RECIPES.find((r) => r.id === id);
}
