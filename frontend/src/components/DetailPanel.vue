<template>
  <transition name="slide">
    <div v-if="selected" class="panel detail-panel">
      <button class="close" @click="$emit('close')">×</button>
      <span class="badge">{{ kindLabel }}</span>
      <h2 class="name">{{ data.name || title }}</h2>

      <p v-if="data.description" class="desc">{{ data.description }}</p>

      <template v-if="selected.kind === 'simulator'">
        <h3>类型</h3>
        <p class="value">{{ typeLabel }}</p>
        <h3>颜色标识</h3>
        <p class="value"><span class="dot" :style="{ background: data.color }"></span>{{ data.color }}</p>
        <h3>主要构成</h3>
        <ul>
          <li v-for="c in data.components" :key="c">{{ c }}</li>
        </ul>
      </template>

      <template v-else-if="selected.kind === 'server'">
        <h3>角色</h3>
        <p class="value">{{ data.role === 'master' ? 'Master + Agent（主节点）' : 'Agent（代理节点）' }}</p>
        <h3>Agent 编号</h3>
        <p class="value">{{ data.agentId }}</p>
      </template>

      <template v-else-if="selected.kind === 'connection'">
        <h3>连接类型</h3>
        <p class="value">Agent → 模拟器 数据流</p>
        <h3>颜色</h3>
        <p class="value"><span class="dot" :style="{ background: data.color }"></span>{{ data.color }}</p>
        <h3>弧度参数</h3>
        <p class="value">arcH = {{ data.arcH }}</p>
      </template>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'DetailPanel',
  props: {
    selected: { type: Object, default: null }
  },
  computed: {
    data() {
      return this.selected ? this.selected.data : {};
    },
    title() {
      return this.selected ? this.selected.id : '';
    },
    kindLabel() {
      const map = { simulator: '模拟器', server: '服务器', connection: '连接线' };
      return this.selected ? map[this.selected.kind] : '';
    },
    typeLabel() {
      const map = { vehicle: '机动车', moped: '助动车', bike: '自行车' };
      return map[this.data.type] || this.data.type;
    }
  }
};
</script>

<style scoped>
.detail-panel {
  right: 16px;
  top: 16px;
  width: 300px;
}
.close {
  position: absolute;
  right: 12px;
  top: 10px;
  background: none;
  border: none;
  color: #6f96bf;
  font-size: 22px;
  cursor: pointer;
  line-height: 1;
}
.close:hover {
  color: #fff;
}
.badge {
  display: inline-block;
  font-size: 11px;
  color: #040810;
  background: #00ccff;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
}
.name {
  font-size: 18px;
  color: #fff;
  margin: 10px 0;
}
.desc {
  font-size: 13px;
  color: #9db8d6;
  line-height: 1.6;
  margin-bottom: 12px;
}
h3 {
  font-size: 12px;
  color: #00ccff;
  margin: 12px 0 4px;
}
.value {
  font-size: 13px;
  display: flex;
  align-items: center;
}
ul {
  list-style: none;
}
li {
  font-size: 13px;
  padding: 4px 0 4px 14px;
  position: relative;
}
li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #00ccff;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-right: 8px;
  display: inline-block;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
