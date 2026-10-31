// 一餐 · 内置数据：食材 / 调料 / 厨具 / 菜谱
// 真实一人食数据：用量写在步骤里（克数/勺数），库存用买菜的粗单位（个/根/份/碗）。
// 标签三维：method 做法（单值）/ flavors 味型（多值）/ category 分类（单值），供筛选。

export const FOODS = {
  // 蛋 · 豆
  egg:          { name: '鸡蛋',     unit: '个' },
  century_egg:  { name: '皮蛋',     unit: '个' },
  tofu:         { name: '嫩豆腐',   unit: '盒' },
  // 荤
  pork:           { name: '猪瘦肉',   unit: '份' },
  shrimp:         { name: '虾仁',     unit: '份' },
  chicken_thigh:  { name: '鸡腿肉',   unit: '份' },
  chicken_breast: { name: '鸡胸肉',   unit: '块' },
  chicken_wing:   { name: '鸡翅',     unit: '份' },
  sausage:        { name: '香肠',     unit: '根' },
  // 蔬菜
  tomato:       { name: '番茄',     unit: '个' },
  potato:       { name: '土豆',     unit: '个' },
  broccoli:     { name: '西兰花',   unit: '颗' },
  green_pepper: { name: '青椒',     unit: '个' },
  carrot:       { name: '胡萝卜',   unit: '份' },
  cucumber:     { name: '黄瓜',     unit: '根' },
  lettuce:      { name: '生菜',     unit: '颗' },
  mushroom:     { name: '鲜香菇',   unit: '朵' },
  woodear:      { name: '干木耳',   unit: '小份' },
  peanut:       { name: '花生米',   unit: '小份' },
  seaweed:      { name: '紫菜',     unit: '包' },
  rosemary:     { name: '迷迭香',   unit: '小份' },
  // 主食
  rice:         { name: '大米',     unit: '杯' },
  cooked_rice:  { name: '隔夜米饭', unit: '碗' },
  noodle:       { name: '面条',     unit: '份' },
  // 配料
  cola:         { name: '可乐',     unit: '罐' },
  scallion:     { name: '葱',       unit: '份' },
  ginger:       { name: '姜',       unit: '份' },
  garlic:       { name: '蒜',       unit: '份' }
};

// 调料不做数量扣减，只在 available / none 间切换；none 只能手动恢复
export const SEASONINGS = {
  salt:          { name: '盐' },
  oil:           { name: '食用油' },
  light_soy:     { name: '生抽' },
  dark_soy:      { name: '老抽' },
  oyster:        { name: '蚝油' },
  vinegar:       { name: '陈醋' },
  sugar:         { name: '白糖' },
  cooking_wine:  { name: '料酒' },
  douban:        { name: '豆瓣酱' },
  chili_dry:     { name: '干辣椒' },
  peppercorn:    { name: '花椒' },
  black_pepper:  { name: '黑胡椒' },
  sesame_oil:    { name: '香油' },
  starch:        { name: '淀粉' }
};

export const COOKWARE = {
  wok:        { name: '炒锅' },
  pan:        { name: '平底锅' },
  pot:        { name: '汤锅' },
  steamer:    { name: '蒸锅' },
  ricecooker: { name: '电饭煲' },
  airfryer:   { name: '空气炸锅' }
};

// 做法（单值）：卡片副标题“15 分钟 · 炒”
export const METHODS = {
  stirfry:    '炒',
  panfry:     '煎',
  braise:     '炖焖',
  steam:      '蒸',
  boil:       '煮',
  airfry:     '烤',
  cold:       '凉拌',
  ricecooker: '焖饭'
};

// 味型（多值）
export const FLAVORS = {
  light:   '清淡',
  savory:  '咸鲜',
  sweet:   '甜口',
  spicy:   '辣口',
  sour:    '酸口'
};

// 分类（单值）
export const CATEGORIES = {
  egg:     '蛋·豆制品',
  meat:    '荤菜',
  veg:     '素菜',
  staple:  '主食',
  soup:    '汤'
};

export const RECIPES = [
  {
    id: 'tomato-egg',
    name: '番茄炒蛋',
    line: '酸甜下饭',
    minutes: 15,
    method: 'stirfry',
    flavors: ['savory', 'sweet', 'sour'],
    category: 'egg',
    servings: 1,
    img: 'assets/img/dish-tomato-egg.png',
    cookware: ['wok'],
    ingredients: [
      { food: 'tomato', qty: 1 },
      { food: 'egg', qty: 2 }
    ],
    seasonings: ['salt', 'oil', 'sugar'],
    steps: [
      { t: '备料', d: '番茄切块；2 个鸡蛋打散，加一小撮盐。' },
      { t: '先炒蛋', d: '热锅倒油，蛋液下锅快速划散，刚凝固就盛出。' },
      { t: '炒出红汁', d: '锅里补少许油，番茄中火炒软出汁，加半勺糖提鲜。' },
      { t: '合炒出锅', d: '倒回鸡蛋，加盐翻匀，大火收一下即可。' }
    ]
  },
  {
    id: 'mapo-tofu',
    name: '麻婆豆腐',
    line: '麻辣下饭',
    minutes: 20,
    method: 'stirfry',
    flavors: ['spicy', 'savory'],
    category: 'meat',
    servings: 1,
    img: 'assets/img/dish-mapo-tofu.png',
    cookware: ['wok'],
    ingredients: [
      { food: 'tofu', qty: 1 },
      { food: 'pork', qty: 1 },
      { food: 'scallion', qty: 1 }
    ],
    seasonings: ['douban', 'peppercorn', 'light_soy', 'starch', 'cooking_wine', 'oil', 'salt'],
    steps: [
      { t: '处理豆腐', d: '嫩豆腐切约 2cm 方块，放淡盐水里泡几分钟不易碎。' },
      { t: '腌肉末', d: '猪肉末用生抽、料酒抓匀腌 5 分钟。' },
      { t: '炒红油', d: '油热下肉末炒散，加一勺豆瓣酱，小火炒出红油。' },
      { t: '烧豆腐', d: '加小半碗水，下豆腐轻推均匀，中火煮 3-5 分钟入味。' },
      { t: '勾芡出锅', d: '水淀粉分两次勾薄芡，撒花椒粉和葱花。' }
    ],
    note: '花椒粉最后撒，久煮会发苦。'
  },
  {
    id: 'steamed-egg',
    name: '嫩滑鸡蛋羹',
    line: '滑得像布丁',
    minutes: 15,
    method: 'steam',
    flavors: ['light'],
    category: 'egg',
    servings: 1,
    img: 'assets/img/dish-steamed-egg.png',
    cookware: ['steamer'],
    ingredients: [
      { food: 'egg', qty: 2 },
      { food: 'scallion', qty: 1 }
    ],
    seasonings: ['salt', 'light_soy', 'sesame_oil'],
    steps: [
      { t: '打蛋加水', d: '2 个鸡蛋打散，加约 1.5 倍温水（手感微温）和少许盐搅匀。' },
      { t: '过筛盖膜', d: '蛋液过筛倒进浅碗，撇去浮沫，碗口扣个盘子（或保鲜膜扎孔）。' },
      { t: '小火蒸', d: '水开后上锅，小火蒸 10 分钟，关火再焖 2 分钟。' },
      { t: '调味', d: '淋一勺生抽、几滴香油，撒葱花。' }
    ],
    note: '小火加加盖，表面才不起孔、像布丁一样滑。'
  },
  {
    id: 'shrimp-egg',
    name: '虾仁滑蛋',
    line: '软嫩鲜香',
    minutes: 10,
    method: 'stirfry',
    flavors: ['light', 'savory'],
    category: 'egg',
    servings: 1,
    img: 'assets/img/dish-shrimp-egg.png',
    cookware: ['wok'],
    ingredients: [
      { food: 'shrimp', qty: 1 },
      { food: 'egg', qty: 3 },
      { food: 'scallion', qty: 1 }
    ],
    seasonings: ['salt', 'oil', 'cooking_wine', 'starch'],
    steps: [
      { t: '腌虾仁', d: '虾仁解冻擦干，加少许盐、料酒、淀粉抓匀腌 5 分钟。' },
      { t: '滑虾', d: '小火温油把虾仁滑到变色，立刻盛出，倒进打散的蛋液里。' },
      { t: '滑蛋', d: '锅里补油，中小火倒入蛋液，底部凝固就轻推，八九成熟出锅。' },
      { t: '撒葱花', d: '余温会把蛋焖到全熟，千万别炒老。' }
    ],
    note: '全程小火，是滑蛋不老的唯一秘诀。'
  },
  {
    id: 'century-tofu',
    name: '皮蛋豆腐',
    line: '5 分钟开胃凉拌',
    minutes: 5,
    method: 'cold',
    flavors: ['light'],
    category: 'egg',
    servings: 1,
    img: 'assets/img/dish-century-tofu.png',
    cookware: [],
    ingredients: [
      { food: 'century_egg', qty: 1 },
      { food: 'tofu', qty: 1 },
      { food: 'scallion', qty: 1 }
    ],
    seasonings: ['light_soy', 'vinegar', 'sesame_oil'],
    steps: [
      { t: '扣豆腐', d: '内酯豆腐连盒四角剪口进空气，倒扣盘里，倒掉析出的水。' },
      { t: '切皮蛋', d: '皮蛋切四瓣，围在豆腐边上。' },
      { t: '淋汁', d: '生抽 2 勺、醋 1 勺、香油几滴调匀淋上，撒葱花。' }
    ]
  },
  {
    id: 'shredded-pork-pepper',
    name: '青椒肉丝',
    line: '镬气家常菜',
    minutes: 15,
    method: 'stirfry',
    flavors: ['savory'],
    category: 'meat',
    servings: 1,
    img: 'assets/img/dish-shredded-pork-pepper.png',
    cookware: ['wok'],
    ingredients: [
      { food: 'pork', qty: 1 },
      { food: 'green_pepper', qty: 2 }
    ],
    seasonings: ['light_soy', 'dark_soy', 'cooking_wine', 'starch', 'oil', 'salt'],
    steps: [
      { t: '腌肉丝', d: '瘦肉切丝，用生抽、料酒、淀粉和一点油抓匀，腌 10 分钟。' },
      { t: '配菜调汁', d: '青椒去籽切丝；小碗汁：生抽半勺、老抽几滴、盐少许。' },
      { t: '滑肉丝', d: '热锅宽油，肉丝下锅大火快速滑散后盛出。' },
      { t: '合炒', d: '青椒炒到微微起虎皮，倒回肉丝，淋碗汁翻匀出锅。' }
    ]
  },
  {
    id: 'yuxiang-shredded-pork',
    name: '鱼香肉丝',
    line: '没有鱼也很香',
    minutes: 20,
    method: 'stirfry',
    flavors: ['sweet', 'sour', 'spicy', 'savory'],
    category: 'meat',
    servings: 1,
    img: 'assets/img/dish-yuxiang-shredded-pork.png',
    cookware: ['wok'],
    ingredients: [
      { food: 'pork', qty: 1 },
      { food: 'woodear', qty: 1 },
      { food: 'carrot', qty: 1 },
      { food: 'green_pepper', qty: 1 },
      { food: 'ginger', qty: 1 },
      { food: 'garlic', qty: 1 },
      { food: 'scallion', qty: 1 }
    ],
    seasonings: ['douban', 'vinegar', 'sugar', 'light_soy', 'starch', 'cooking_wine', 'oil'],
    steps: [
      { t: '备料', d: '瘦肉切丝，加生抽、料酒、淀粉腌 10 分钟；木耳提前泡发切丝，胡萝卜青椒切丝。' },
      { t: '调鱼香汁', d: '糖 2 勺、醋 2 勺、生抽 1 勺、水淀粉 1 勺、水 2 勺搅匀。' },
      { t: '炒底料', d: '热油下肉丝滑散盛出；小火把豆瓣酱、姜蒜末炒出红油。' },
      { t: '收汁', d: '下配菜炒到断生，倒回肉丝，淋鱼香汁，大火收汁撒葱花。' }
    ]
  },
  {
    id: 'cola-chicken-wings',
    name: '可乐鸡翅',
    line: '甜口零失败',
    minutes: 25,
    method: 'braise',
    flavors: ['sweet', 'savory'],
    category: 'meat',
    servings: 1,
    img: 'assets/img/dish-cola-chicken-wings.png',
    cookware: ['wok'],
    ingredients: [
      { food: 'chicken_wing', qty: 1 },
      { food: 'cola', qty: 1 },
      { food: 'ginger', qty: 1 }
    ],
    seasonings: ['light_soy', 'dark_soy', 'cooking_wine', 'oil'],
    steps: [
      { t: '焯水', d: '鸡翅两面划两刀，冷水下锅加姜片、料酒煮开，撇沫后捞出擦干。' },
      { t: '煎上色', d: '锅里少许油，鸡翅中小火煎到两面微黄。' },
      { t: '加可乐', d: '放生抽 2 勺、老抽半勺，倒可乐约半罐，差不多没过鸡翅。' },
      { t: '焖与收汁', d: '中火焖 15 分钟，最后大火把汤汁收浓裹在鸡翅上。' }
    ],
    note: '收汁时人别走开，含糖的汁很容易糊底。'
  },
  {
    id: 'kungpao-chicken',
    name: '宫保鸡丁',
    line: '糊辣荔枝口',
    minutes: 20,
    method: 'stirfry',
    flavors: ['spicy', 'sweet', 'savory'],
    category: 'meat',
    servings: 1,
    img: 'assets/img/dish-kungpao-chicken.png',
    cookware: ['wok'],
    ingredients: [
      { food: 'chicken_thigh', qty: 1 },
      { food: 'peanut', qty: 1 },
      { food: 'cucumber', qty: 1 },
      { food: 'scallion', qty: 1 }
    ],
    seasonings: ['chili_dry', 'peppercorn', 'vinegar', 'sugar', 'light_soy', 'starch', 'cooking_wine', 'oil'],
    steps: [
      { t: '腌鸡丁', d: '鸡腿肉去骨切 1.5cm 丁，加生抽、料酒、淀粉腌 10 分钟；葱白切段，黄瓜切丁。' },
      { t: '调宫保汁', d: '糖 2 勺、醋 2 勺、生抽 1 勺、水淀粉 1 勺、水 2 勺。' },
      { t: '炸花生', d: '温油小火把花生米焙到酥脆，盛出放凉。' },
      { t: '快炒', d: '留油小火煸香干辣椒和花椒，下鸡丁大火炒散，放葱段黄瓜丁。' },
      { t: '出锅', d: '淋汁翻匀，关火再撒花生，翻两下出锅。' }
    ],
    note: '花生一定最后放，裹汁久了就不脆。'
  },
  {
    id: 'mushroom-chicken',
    name: '香菇滑鸡',
    line: '蒸出来的嫩',
    minutes: 25,
    method: 'steam',
    flavors: ['light', 'savory'],
    category: 'meat',
    servings: 1,
    img: 'assets/img/dish-mushroom-chicken.png',
    cookware: ['steamer'],
    ingredients: [
      { food: 'chicken_thigh', qty: 1 },
      { food: 'mushroom', qty: 4 },
      { food: 'ginger', qty: 1 }
    ],
    seasonings: ['light_soy', 'oyster', 'cooking_wine', 'starch', 'oil', 'sesame_oil'],
    steps: [
      { t: '腌鸡块', d: '鸡腿肉切块，加生抽、蚝油、料酒、淀粉和一勺油抓匀，腌 15 分钟。' },
      { t: '摆盘', d: '香菇切片铺盘底，鸡块铺在上面，撒姜丝。' },
      { t: '大火蒸', d: '水开后上锅，大火蒸 15 分钟。' },
      { t: '拌匀', d: '出锅淋几滴香油，趁热拌匀。' }
    ],
    note: '腌料里那一勺油会封住肉汁，是“滑”的关键。'
  },
  {
    id: 'seared-chicken-breast',
    name: '香煎鸡胸肉',
    line: '多汁不柴',
    minutes: 15,
    method: 'panfry',
    flavors: ['savory', 'light'],
    category: 'meat',
    servings: 1,
    img: 'assets/img/dish-seared-chicken-breast.png',
    cookware: ['pan'],
    ingredients: [
      { food: 'chicken_breast', qty: 1 },
      { food: 'garlic', qty: 1 }
    ],
    seasonings: ['salt', 'black_pepper', 'oil', 'cooking_wine'],
    steps: [
      { t: '处理鸡胸', d: '鸡胸横剖成两片约 1.5cm 厚，刀背轻拍；两面撒盐、黑胡椒，抹一点油腌 10 分钟。' },
      { t: '第一面', d: '平底锅中小火，光滑面朝下，别翻动，煎 3-4 分钟到底色金黄。' },
      { t: '翻面', d: '翻面再煎 2-3 分钟，拍个蒜丢锅边借香。' },
      { t: '静置', d: '出锅放 3 分钟再切片，肉汁不会流光。' }
    ]
  },
  {
    id: 'sour-spicy-potato-shreds',
    name: '酸辣土豆丝',
    line: '爽脆开胃',
    minutes: 15,
    method: 'stirfry',
    flavors: ['sour', 'spicy'],
    category: 'veg',
    servings: 1,
    img: 'assets/img/dish-sour-spicy-potato-shreds.png',
    cookware: ['wok'],
    ingredients: [
      { food: 'potato', qty: 2 },
      { food: 'garlic', qty: 1 }
    ],
    seasonings: ['chili_dry', 'vinegar', 'salt', 'oil'],
    steps: [
      { t: '切丝泡水', d: '土豆切细丝或擦丝，清水洗两遍洗掉淀粉，沥干水分。' },
      { t: '爆香', d: '热油把干辣椒段和蒜末爆香。' },
      { t: '快炒', d: '下土豆丝大火快炒约 1 分钟，沿锅边烹入陈醋。' },
      { t: '出锅', d: '再炒 1 分钟保持脆感，加盐翻匀立刻出锅。' }
    ],
    note: '想脆就火大、手快、不盖盖。'
  },
  {
    id: 'garlic-broccoli',
    name: '蒜香西兰花',
    line: '绿得发亮',
    minutes: 10,
    method: 'stirfry',
    flavors: ['light'],
    category: 'veg',
    servings: 1,
    img: 'assets/img/dish-garlic-broccoli.png',
    cookware: ['wok'],
    ingredients: [
      { food: 'broccoli', qty: 1 },
      { food: 'garlic', qty: 1 }
    ],
    seasonings: ['salt', 'oil'],
    steps: [
      { t: '清洗', d: '西兰花掰小朵，淡盐水泡 10 分钟后冲净。' },
      { t: '焯水', d: '开水里加几滴油和一点盐，焯 1 分钟捞出过凉水，保持翠绿。' },
      { t: '煸蒜', d: '热油小火把一半蒜末煸到微黄。' },
      { t: '快炒', d: '下西兰花大火快炒，加剩下的生蒜和盐，翻匀出锅。' }
    ]
  },
  {
    id: 'oyster-lettuce',
    name: '蚝油生菜',
    line: '3 分钟出锅',
    minutes: 8,
    method: 'stirfry',
    flavors: ['savory', 'light'],
    category: 'veg',
    servings: 1,
    img: 'assets/img/dish-oyster-lettuce.png',
    cookware: ['wok'],
    ingredients: [
      { food: 'lettuce', qty: 1 },
      { food: 'garlic', qty: 1 }
    ],
    seasonings: ['oyster', 'light_soy', 'starch', 'oil', 'sugar'],
    steps: [
      { t: '烫菜', d: '生菜整片洗净，开水里加几滴油，烫 15 秒立刻捞出摆盘。' },
      { t: '炒汁', d: '另起锅少许油炒香蒜末，加蚝油 1 勺、生抽半勺、小半碗水煮开。' },
      { t: '淋汁', d: '水淀粉勾薄芡，把汁淋在生菜上。' }
    ],
    note: '焯水别超过 20 秒，叶子塌了就不爽口。'
  },
  {
    id: 'smashed-cucumber',
    name: '拍黄瓜',
    line: '拍出来才入味',
    minutes: 5,
    method: 'cold',
    flavors: ['sour', 'light'],
    category: 'veg',
    servings: 1,
    img: 'assets/img/dish-smashed-cucumber.png',
    cookware: [],
    ingredients: [
      { food: 'cucumber', qty: 1 },
      { food: 'garlic', qty: 1 }
    ],
    seasonings: ['vinegar', 'light_soy', 'sesame_oil', 'sugar', 'salt'],
    steps: [
      { t: '拍黄瓜', d: '黄瓜用刀背拍裂，掰成适口的块，加少许盐腌 5 分钟，倒掉水。' },
      { t: '调汁', d: '蒜切末，加醋 2 勺、生抽 1 勺、糖小半勺、香油几滴。' },
      { t: '拌匀', d: '汁倒进黄瓜里拌匀即可。' }
    ]
  },
  {
    id: 'egg-fried-rice',
    name: '蛋炒饭',
    line: '粒粒分明',
    minutes: 10,
    method: 'stirfry',
    flavors: ['savory'],
    category: 'staple',
    servings: 1,
    img: 'assets/img/dish-egg-fried-rice.png',
    cookware: ['wok'],
    ingredients: [
      { food: 'cooked_rice', qty: 1 },
      { food: 'egg', qty: 2 },
      { food: 'scallion', qty: 1 }
    ],
    seasonings: ['salt', 'oil', 'light_soy'],
    steps: [
      { t: '备料', d: '隔夜米饭一碗提前拨散；鸡蛋打散加少许盐。' },
      { t: '金包银', d: '热锅宽油倒蛋液，马上把米饭倒进蛋里快速翻炒，让米粒裹上蛋。' },
      { t: '炒散', d: '中火把饭炒到粒粒分明、在锅里微微蹦跳。' },
      { t: '调味', d: '加盐（或一点点生抽），撒葱花翻匀出锅。' }
    ],
    note: '一定要用偏干的隔夜饭，新饭水分大，容易黏成块。'
  },
  {
    id: 'scallion-oil-noodles',
    name: '葱油拌面',
    line: '一勺酱救活一碗面',
    minutes: 15,
    method: 'boil',
    flavors: ['savory', 'sweet'],
    category: 'staple',
    servings: 1,
    img: 'assets/img/dish-scallion-oil-noodles.png',
    cookware: ['pot'],
    ingredients: [
      { food: 'noodle', qty: 1 },
      { food: 'scallion', qty: 1 }
    ],
    seasonings: ['light_soy', 'dark_soy', 'sugar', 'oil'],
    steps: [
      { t: '熬葱油', d: '葱切长段，锅里约 4 勺油，小火把葱段慢慢炸到焦褐，夹出葱留油。' },
      { t: '调酱汁', d: '葱油里加生抽 2 勺、老抽半勺、糖 1 勺，小火煮到糖化开。' },
      { t: '煮面', d: '另起锅水开下面，煮到刚断生捞出，留一勺面汤。' },
      { t: '拌', d: '加 2-3 勺葱油酱汁，拌匀即可。' }
    ],
    note: '葱油可以一次多熬点，密封冷藏能放一周。'
  },
  {
    id: 'sausage-potato-rice',
    name: '香肠土豆焖饭',
    line: '备料完交给电饭煲',
    minutes: 40,
    method: 'ricecooker',
    flavors: ['savory'],
    category: 'staple',
    servings: 1,
    img: 'assets/img/dish-sausage-potato-rice.png',
    cookware: ['ricecooker', 'wok'],
    ingredients: [
      { food: 'rice', qty: 1 },
      { food: 'sausage', qty: 1 },
      { food: 'potato', qty: 1 },
      { food: 'carrot', qty: 1 }
    ],
    seasonings: ['light_soy', 'oyster', 'oil'],
    steps: [
      { t: '淘米', d: '米淘好，按平时煮饭的水量放进电饭煲。' },
      { t: '炒料', d: '土豆、香肠、胡萝卜切丁；锅里少许油，先煸香肠出油，加土豆胡萝卜，放生抽蚝油炒匀。' },
      { t: '开煮', d: '炒好的料铺在米上，按下煮饭键。' },
      { t: '拌匀', d: '跳闸后再焖 10 分钟，开盖拌匀盛出。' }
    ],
    note: '酱汁有咸度，水量比平时少一点点，饭粒更有型。'
  },
  {
    id: 'seaweed-egg-soup',
    name: '紫菜蛋花汤',
    line: '5 分钟一锅汤',
    minutes: 5,
    method: 'boil',
    flavors: ['light', 'savory'],
    category: 'soup',
    servings: 1,
    img: 'assets/img/dish-seaweed-egg-soup.png',
    cookware: ['pot'],
    ingredients: [
      { food: 'seaweed', qty: 1 },
      { food: 'egg', qty: 1 },
      { food: 'scallion', qty: 1 }
    ],
    seasonings: ['salt', 'light_soy', 'sesame_oil'],
    steps: [
      { t: '备碗', d: '紫菜撕小块放进汤碗，加少许生抽、香油和葱花。' },
      { t: '烧水', d: '锅里烧一碗半水，水开后转小火。' },
      { t: '淋蛋花', d: '鸡蛋打散，贴着水面细细画圈淋入，等蛋花慢慢浮起。' },
      { t: '冲汤', d: '连水冲进紫菜碗里即可。' }
    ],
    note: '水别大开、蛋液细线淋，蛋花才轻薄。'
  },
  {
    id: 'herbs-potato',
    name: '香草薯角配西兰花',
    line: '香草薯角，配一份清爽西兰花',
    minutes: 25,
    method: 'airfry',
    flavors: ['light', 'savory'],
    category: 'veg',
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
