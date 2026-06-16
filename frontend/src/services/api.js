/**
 * 后端 API 封装。开发环境通过 Vite proxy 转发到 http://localhost:3000。
 * 若后端不可用，调用方可回退到本地内置拓扑数据。
 */
const BASE = '/api';

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path} 请求失败: ${res.status}`);
  return res.json();
}

export const api = {
  getTopology: () => get('/topology'),
  getSimulators: () => get('/simulators'),
  getServers: () => get('/servers'),
  getConnections: () => get('/connections')
};
