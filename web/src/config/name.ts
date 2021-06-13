const storedKey = "chess-name";

const adj = [
  "红色",
  "橙色",
  "黄色",
  "绿色",
  "青色",
  "蓝色",
  "紫色",
  "粉色",
  "棕色",
  "白色",
  "灰色",
  "黑色",
];
const subject = [
  "狮子",
  "鲨鱼",
  "老虎",
  "猫咪",
  "狗子",
  "大象",
  "河马",
  "水母",
  "斑马",
  "边牧",
  "鸭子",
  "鸽子",
  "鳄鱼",
  "猩猩",
  "兔子",
  "猴子",
  "孔雀",
  "麒麟",
  "凤凰",
  "犀牛",
  "猎鹰",
  "熊猫",
  "考拉",
  "螃蟹",
  "鸵鸟",
  "麻雀",
  "老鼠",
  "山鸡",
  "河豚",
  "豪猪",
  "仙鹤",
  "浣熊",
  "乌龟",
];
export const random = () =>
  `${adj[Math.floor(Math.random() * adj.length)]}的${
    subject[Math.floor(Math.random() * subject.length)]
  }`;

const register = () => {
  let name: string | null;
  (name = localStorage.getItem(storedKey)) ||
    localStorage.setItem(storedKey, (name = random()));
  return name;
};

export const storeName = (name: string) =>
  localStorage.setItem(storedKey, name);

export const name = register();
