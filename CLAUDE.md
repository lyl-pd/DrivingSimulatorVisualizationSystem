# CLAUDE.md

本文件为 Claude Code / AI 编码助手在本仓库工作时的指引。遵循 Claude 项目规范编写。

## 项目概述

**DIL** 是「多车驾驶模拟器系统 · 3D 可视化展示」的实现仓库。前端用 Three.js 在浏览器中
还原仿真实验室的设备物理布局，展示 Master-Agent 网络中服务器与模拟器之间的实时数据流。
完整需求见 [PRD.md](PRD.md)。

## 技术栈

| 层    | 技术                                              |
| ----- | ------------------------------------------------- |
| 前端  | Vue 2.7 + Vite 5 + Three.js（CSS2D 标签、OrbitControls） |
| 后端  | Node.js 18+ + Express（ESM，提供拓扑数据 REST API） |
| 构建  | Vite（前端）、原生 node（后端）                   |

## 目录结构

```
DIL/
├── PRD.md                  # 产品需求文档（随实现同步更新）
├── CLAUDE.md               # 本文件，AI 协作规范
├── README.md               # 使用与开发说明
├── docs/
│   └── ARCHITECTURE.md     # 架构与数据流说明
├── backend/                # Node.js + Express API
│   ├── package.json
│   └── src/
│       ├── server.js       # Express 入口与路由
│       └── data/topology.js# 仿真拓扑数据（PRD 4.1 的唯一数据源）
└── frontend/               # Vue2 + Vite + Three.js
    ├── package.json
    ├── vite.config.js      # 含 /api 代理到后端
    ├── index.html
    └── src/
        ├── main.js
        ├── App.vue         # 加载拓扑、串联场景与面板
        ├── components/     # Scene3D / InfoPanel / DetailPanel
        ├── three/          # SceneManager、builders、textures
        ├── services/       # api.js、fallbackData.js
        └── styles/global.css
```

## 常用命令

```bash
# 后端（端口 3000）
cd backend && npm install && npm run dev

# 前端（端口 5173，开发时通过代理访问后端）
cd frontend && npm install && npm run dev

# 前端生产构建
cd frontend && npm run build
```

## 架构要点

- **数据单一来源**：拓扑（模拟器/服务器/连接）定义在 `backend/src/data/topology.js`。
  前端 `services/fallbackData.js` 是后端不可用时的镜像回退，二者需保持一致。
- **渲染核心**：`frontend/src/three/SceneManager.js` 负责渲染器、相机、灯光、控制器、
  连接线、数据粒子、CSS2D 标签与射线拾取，对外通过 `onSelect` 回调暴露选中事件。
- **设备构建**：`frontend/src/three/builders.js` 按模拟器类型生成几何体；
  `textures.js` 用 Canvas 程序化生成投影屏纹理。
- **交互**：点击 3D 物体或左侧列表都会高亮并在右侧详情面板展示数据，双向同步。

## 开发约定

- 后端使用 ESM（`"type": "module"`），路由集中在 `server.js`。
- 前端组件用 Vue 2 选项式 API；Three.js 逻辑全部封装在 `three/` 中，组件只做桥接。
- 颜色、坐标、弧度等可视化参数以 PRD 为准；改动需同步回写 PRD 与本文件。
- 新增/修改功能时，**同步更新 PRD.md 的「实现进度」章节**。

## 与 PRD 的同步规则

每完成一项功能，需要：
1. 在 `PRD.md` 末尾「实现进度（Implementation Status）」表中更新对应状态。
2. 若实现偏离原始需求（如新增前后端分离架构），在 PRD 中以注记说明。
