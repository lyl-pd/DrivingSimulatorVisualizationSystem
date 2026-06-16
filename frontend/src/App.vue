<template>
  <div class="app">
    <Scene3D
      v-if="topology"
      ref="scene"
      :topology="topology"
      @select="onSceneSelect"
    />

    <InfoPanel
      v-if="topology"
      :topology="topology"
      :selected-id="selectedId"
      @pick="onPick"
    />

    <DetailPanel :selected="selected" @close="onPick(null)" />

    <div v-if="loading" class="loading">正在加载仿真拓扑…</div>
    <div v-if="dataSource === 'fallback'" class="data-hint">⚠ 后端不可用，使用本地内置数据</div>
  </div>
</template>

<script>
import Scene3D from './components/Scene3D.vue';
import InfoPanel from './components/InfoPanel.vue';
import DetailPanel from './components/DetailPanel.vue';
import { api } from './services/api.js';
import { fallbackTopology } from './services/fallbackData.js';

export default {
  name: 'App',
  components: { Scene3D, InfoPanel, DetailPanel },
  data() {
    return {
      topology: null,
      selected: null,
      selectedId: null,
      loading: true,
      dataSource: 'api'
    };
  },
  async created() {
    try {
      this.topology = await api.getTopology();
      this.dataSource = 'api';
    } catch (e) {
      this.topology = fallbackTopology;
      this.dataSource = 'fallback';
    } finally {
      this.loading = false;
    }
  },
  methods: {
    onSceneSelect(payload) {
      this.selected = payload;
      this.selectedId = payload ? payload.id : null;
    },
    onPick(id) {
      this.selectedId = id;
      if (this.$refs.scene) this.$refs.scene.selectById(id);
    }
  }
};
</script>

<style scoped>
.app {
  position: absolute;
  inset: 0;
}
.loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #00ccff;
  font-size: 16px;
}
.data-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #ffcc33;
  background: rgba(4, 8, 16, 0.7);
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid rgba(255, 204, 51, 0.3);
}
</style>
