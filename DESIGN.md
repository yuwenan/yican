# DESIGN · 一餐 · 原型原色（yican-prototype）

来源：Figma《一餐 · 我的厨房｜MVP 交互原型》(file key `y6JlnXiZQ4ygTLekmKKH0S`)，
色值由设计稿样式面板与实际填充实测抽取，不是现编。语义色 Figma 未给，为实现补的低饱和色，已单列。

## 长相

浅纸灰底、纯白卡片、墨黑主按钮，无重投影、圆角偏大；
唯一暖色是「印章 / 开饭」的暖米色 #F8EEE8，热气与点缀用低饱和暖棕。
克制、家常、纸感，像一本自己的厨房小簿子，不用彩色竖条、不用卡通 emoji。

- 模式：light
- 适合：一人食 / 记录簿 / 轻工具型移动页

## Token → theme-hub 31 契约映射

| 契约变量 | 值 | 出处 |
| --- | --- | --- |
| --bg | #FAFAFC | Figma 页面底 |
| --bg-2 / --surface-2 | #F0F1F4 | Figma 次级填充 |
| --surface | #FFFFFF | 卡片底 |
| --border | rgba(36,37,42,.08) | Figma 细描边 |
| --border-strong | #E6E7EC | 分隔线 |
| --text | #24252A | Figma 主文字（墨黑） |
| --text-muted | #777A84 | 次级文字 |
| --text-faint | #AAADB6 | 占位/弱化 |
| --accent | #24252A | 主按钮=墨黑，非彩色 |
| --accent-text | #FFFFFF | 墨黑按钮上的白字 |
| --accent-soft | #F8EEE8 | 暖米，印章/选中点缀 |
| --hero | #FFFFFF | 首屏大块底 |
| --ok | #4E7A5F | 实现补（Figma 仅文字「淡绿」） |
| --ok-soft | #EDF3EE | 实现补 |
| --warn | #B07A4F | 实现补，取自暖棕同系 |
| --warn-soft | #F6ECE3 | 实现补 |
| --danger | #C04A3E | 实现补 |
| --danger-soft | #F8E9E6 | 实现补 |

字体：`"Noto Sans SC","PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif`
（中文栈末尾保留中文回退，符合 theme-hub 契约）。
正文 400、强调 500；大标题字距 -0.01em。

圆角：卡片 22px、控件 25px（胶囊）。
卡片阴影：无；浮层（玻璃底导/弹窗/抽屉）才用
`0 5px 24px rgba(31,36,51,.10), inset 0 1px 2px rgba(255,255,255,.8)`。

## 项目专用非契约变量

- --stamp:#F8EEE8 印章暖底
- --nav-fill:rgba(255,255,255,.64) 玻璃底导填充（配 backdrop-filter: blur(24px)）
- --nav-stroke:rgba(255,255,255,.9)
- --nav-active:rgba(228,230,236,.62) 底导选中胶囊
- --scrim:rgba(36,37,42,.22) 遮罩
- --side:24px 页边距

## 补色原则（语义色）

Figma 只给了中性墨黑 + 暖米，没有成功/警告/危险色。补色时：
全部降饱和、提高灰度，与墨黑文字同明度带，不出现鲜亮红绿灯；
暖棕系（warn）从印章暖米同色相延伸，冷绿（ok）只用于「可以直接做 / 已勾选」的淡底，
绝不用绿色做品牌主色（品牌主色始终是墨黑）。

## 回流

符合 theme-hub 31 变量契约，可用 `cd ~/Desktop/theme-hub && py -3 add.py` 入库为
`yican-prototype`，再 `py -3 build_index.py`。入库动作待用户点头后执行。
