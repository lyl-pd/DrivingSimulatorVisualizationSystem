import express from 'express';
import cors from 'cors';
import { topology, simulators, servers, connections } from './data/topology.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 完整拓扑
app.get('/api/topology', (req, res) => {
  res.json(topology);
});

// 模拟器列表
app.get('/api/simulators', (req, res) => {
  res.json(simulators);
});

// 单个模拟器详情
app.get('/api/simulators/:id', (req, res) => {
  const item = simulators.find((s) => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'simulator not found' });
  res.json(item);
});

// 服务器列表
app.get('/api/servers', (req, res) => {
  res.json(servers);
});

// 单个服务器详情
app.get('/api/servers/:id', (req, res) => {
  const item = servers.find((s) => s.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'server not found' });
  res.json(item);
});

// 连接线列表
app.get('/api/connections', (req, res) => {
  res.json(connections);
});

app.listen(PORT, () => {
  console.log(`[DIL backend] API server running at http://localhost:${PORT}`);
});
