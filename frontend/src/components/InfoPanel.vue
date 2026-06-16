<template>
  <div class="panel info-panel">
    <h1 class="title">多车驾驶模拟器系统</h1>
    <p class="subtitle">Master-Agent 仿真网络 · 3D 可视化</p>

    <section>
      <h2>模拟器 ({{ topology.simulators.length }})</h2>
      <ul>
        <li
          v-for="s in topology.simulators"
          :key="s.id"
          :class="{ active: selectedId === s.id }"
          @click="$emit('pick', s.id)"
        >
          <span class="dot" :style="{ background: s.color }"></span>{{ s.name }}
        </li>
      </ul>
    </section>

    <section>
      <h2>服务器 ({{ topology.servers.length }})</h2>
      <ul>
        <li
          v-for="s in topology.servers"
          :key="s.id"
          :class="{ active: selectedId === s.id }"
          @click="$emit('pick', s.id)"
        >
          <span class="dot" :style="{ background: s.role === 'master' ? '#ffcc33' : '#00ccff' }"></span>{{ s.name }}
        </li>
      </ul>
    </section>

    <section>
      <h2>连接线 ({{ topology.connections.length }})</h2>
      <ul>
        <li
          v-for="c in topology.connections"
          :key="c.id"
          :class="{ active: selectedId === c.id }"
          @click="$emit('pick', c.id)"
        >
          <span class="dot" :style="{ background: c.color }"></span>{{ nameOf(c.from) }} → {{ nameOf(c.to) }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: 'InfoPanel',
  props: {
    topology: { type: Object, required: true },
    selectedId: { type: String, default: null }
  },
  methods: {
    nameOf(id) {
      const all = [...this.topology.simulators, ...this.topology.servers];
      const item = all.find((x) => x.id === id);
      return item ? item.name : id;
    }
  }
};
</script>

<style scoped>
.info-panel {
  left: 16px;
  top: 16px;
  width: 280px;
}
.title {
  font-size: 18px;
  color: #ffffff;
}
.subtitle {
  font-size: 12px;
  color: #6f96bf;
  margin: 4px 0 14px;
}
section {
  margin-bottom: 14px;
}
h2 {
  font-size: 13px;
  color: #00ccff;
  margin-bottom: 6px;
  border-bottom: 1px solid rgba(0, 204, 255, 0.2);
  padding-bottom: 4px;
}
ul {
  list-style: none;
}
li {
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}
li:hover {
  background: rgba(0, 204, 255, 0.1);
}
li.active {
  background: rgba(0, 204, 255, 0.2);
  box-shadow: inset 0 0 0 1px rgba(0, 204, 255, 0.5);
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}
</style>
