# 多车驾驶模拟器系统 · 3D 可视化

基于 Web 的三维驾驶仿真系统可视化展示，直观呈现多类型驾驶模拟器与 Master-Agent
仿真网络的物理布局、设备架构及实时数据流向。

> 需求详见 [PRD.md](PRD.md)，协作规范详见 [CLAUDE.md](CLAUDE.md)，架构详见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)。

## 技术栈

- **前端**：Vue 2.7 + Vite 5 + Three.js
- **后端**：Node.js 18+ + Express（提供拓扑数据 REST API）

## 快速开始

### 1. 启动后端 API（端口 3000）

```bash
cd backend
npm install
npm run dev
```

### 2. 启动前端（端口 5173）

```bash
cd frontend
npm install
npm run dev
```

浏览器打开 http://localhost:5173 。前端通过 Vite 代理访问后端 `/api`。
若后端未启动，前端会自动回退到内置拓扑数据（页面底部会提示）。

## 功能

- 3 类模拟器（机动车 / 助动车 / 自行车）的 3D 设备建模
- Master-Agent 服务器机柜与 Agent→模拟器 青色数据流弧线
- 数据粒子动画、连接线呼吸脉冲、雾效、网格地面
- 鼠标旋转 / 缩放 / 平移，自动旋转，CSS2D 浮动标签
- 左侧信息面板 + 右侧详情面板，点击设备或列表双向联动

## 生产构建

```bash
cd frontend
npm run build      # 输出到 frontend/dist
npm run preview    # 本地预览构建产物
```

## API 接口

| 方法 | 路径                   | 说明         |
| ---- | ---------------------- | ------------ |
| GET  | `/api/health`          | 健康检查     |
| GET  | `/api/topology`        | 完整拓扑     |
| GET  | `/api/simulators`      | 模拟器列表   |
| GET  | `/api/simulators/:id`  | 单个模拟器   |
| GET  | `/api/servers`         | 服务器列表   |
| GET  | `/api/servers/:id`     | 单个服务器   |
| GET  | `/api/connections`     | 连接线列表   |
