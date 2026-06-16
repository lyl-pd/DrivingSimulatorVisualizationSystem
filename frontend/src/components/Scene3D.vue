<template>
  <div ref="container" class="scene3d"></div>
</template>

<script>
import { SceneManager } from '../three/SceneManager.js';

export default {
  name: 'Scene3D',
  props: {
    topology: { type: Object, default: null }
  },
  data() {
    return { manager: null };
  },
  watch: {
    topology(val) {
      if (val && this.manager) this.manager.setTopology(val);
    }
  },
  mounted() {
    this.manager = new SceneManager(this.$refs.container, (payload) => {
      this.$emit('select', payload);
    });
    if (this.topology) this.manager.setTopology(this.topology);
    this.manager.start();
  },
  beforeDestroy() {
    if (this.manager) this.manager.dispose();
  },
  methods: {
    selectById(id) {
      if (this.manager) this.manager.selectById(id);
    }
  }
};
</script>

<style scoped>
.scene3d {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>

<style>
.scene-label {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  background: rgba(4, 8, 16, 0.7);
  border: 1px solid rgba(0, 204, 255, 0.4);
  border-radius: 4px;
  white-space: nowrap;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
}
</style>
