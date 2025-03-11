# 贪吃蛇游戏

一个使用HTML5 Canvas + JavaScript实现的贪吃蛇游戏。

## 特色功能

1. 高分区设计
   - 特殊的高分区域，食物价值更高
   - 通过窄通道进入高分区增加游戏难度
   - 高分区食物得分50分，普通区域10分

2. 双食物系统
   - 高分区和普通区同时存在食物
   - 高分区食物带有金色光晕效果
   - 不同区域食物有不同的分值

3. 速度系统
   - 显示当前速度等级（1-10级）
   - 吃到普通食物速度+1
   - 吃到高分食物速度+2
   - 速度越快，得分机会越多

4. 现代化界面
   - 清爽的视觉设计
   - 响应式按钮效果
   - 实时分数和最高分显示
   - 游戏状态清晰可见

## 操作方式

- 方向键：控制蛇的移动
- 空格键：暂停/继续游戏
- 开始按钮：开始新游戏
- 暂停按钮：暂停当前游戏

## 游戏规则

1. 撞到墙壁或自身会导致游戏结束
2. 吃到食物会增加分数和速度
3. 普通食物：10分，速度+1
4. 高分区食物：50分，速度+2
5. 通过特定通道可以进入高分区

## 技术栈

- HTML5 Canvas
- CSS3
- JavaScript

## 本地运行

1. 克隆仓库
```bash
git clone [仓库地址]
```

2. 在浏览器中打开index.html文件即可开始游戏

## 在线演示

[在线游戏地址] 