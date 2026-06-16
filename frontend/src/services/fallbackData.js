/**
 * 本地内置拓扑数据，作为后端不可用时的回退。
 * 与 backend/src/data/topology.js 保持一致。
 */
export const fallbackTopology = {
  simulators: [
    {
      id: 'sim-car',
      type: 'vehicle',
      name: '机动车模拟器',
      color: '#cc4422',
      position: [-18, 0, 0],
      components: ['运动平台', '驾驶舱（方向盘/油门/刹车/挡位）', '投影屏'],
      description: '配备完整驾驶舱的机动车驾驶模拟器，含方向盘、油门踏板、刹车踏板与挡位。'
    },
    {
      id: 'sim-moped',
      type: 'moped',
      name: '助动车模拟器',
      color: '#dd8800',
      position: [0, 0, 0],
      components: ['运动平台', '骑行座舱（车把）', '投影屏'],
      description: '面向两轮助动车的骑行模拟器，含车把控制与骑行座舱。'
    },
    {
      id: 'sim-bike',
      type: 'bike',
      name: '自行车模拟器',
      color: '#44aa44',
      position: [18, 0, 0],
      components: ['运动平台', '自行车骨架（前后轮/车架/把手）', '投影屏'],
      description: '基于真实自行车骨架的骑行模拟器，含前后轮、车架与把手。'
    }
  ],
  servers: [
    {
      id: 'srv-master',
      name: '主服务器 (Master + Agent)',
      role: 'master',
      agentId: 'agent-0',
      position: [-18, 0, 22],
      description: '核心节点，负责管理各个 Agent，并内置一个 Agent 连接机动车模拟器。'
    },
    {
      id: 'srv-agent-1',
      name: '从服务器 1 (Agent)',
      role: 'agent',
      agentId: 'agent-1',
      position: [0, 0, 22],
      description: '分布式代理节点，连接助动车模拟器。'
    },
    {
      id: 'srv-agent-2',
      name: '从服务器 2 (Agent)',
      role: 'agent',
      agentId: 'agent-2',
      position: [18, 0, 22],
      description: '分布式代理节点，连接自行车模拟器。'
    }
  ],
  connections: [
    { id: 'conn-0', type: 'agent-to-sim', from: 'srv-master', to: 'sim-car', color: '#00ccff', arcH: 1.8, description: 'Master 内置 Agent 与机动车模拟器之间的数据同步流。' },
    { id: 'conn-1', type: 'agent-to-sim', from: 'srv-agent-1', to: 'sim-moped', color: '#00ccff', arcH: 1.8, description: 'Agent 1 与助动车模拟器之间的数据同步流。' },
    { id: 'conn-2', type: 'agent-to-sim', from: 'srv-agent-2', to: 'sim-bike', color: '#00ccff', arcH: 1.8, description: 'Agent 2 与自行车模拟器之间的数据同步流。' }
  ]
};
