import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { buildSimulator, buildServer } from './builders.js';

const BG_COLOR = 0x040810;

/**
 * 3D 场景管理器：负责渲染、灯光、控制器、连接线、数据粒子、浮动标签与拾取。
 * 通过构造参数 onSelect(payload|null) 向外抛出选中事件。
 */
export class SceneManager {
  constructor(container, onSelect) {
    this.container = container;
    this.onSelect = onSelect || (() => {});
    this.objects = new Map(); // id -> THREE.Object3D
    this.connections = [];
    this.particles = [];
    this.selectableMeshes = [];
    this.selectedId = null;
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this._initRenderer();
    this._initScene();
    this._initCamera();
    this._initControls();
    this._initLights();
    this._initGround();
    this._bindEvents();
  }

  _initRenderer() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(w, h);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    this.container.appendChild(this.labelRenderer.domElement);
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(BG_COLOR);
    this.scene.fog = new THREE.Fog(BG_COLOR, 55, 130);
  }

  _initCamera() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 500);
    this.camera.position.set(0, 28, 52);
  }

  _initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.target.set(0, 4, 8);
    this.controls.minDistance = 8;
    this.controls.maxDistance = 85;
    this.controls.maxPolarAngle = Math.PI / 2.05;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.28;
    // 用户开始交互后停止自动旋转
    this.controls.addEventListener('start', () => {
      this.controls.autoRotate = false;
    });
  }

  _initLights() {
    // 低强度冷蓝环境光：保留阴影层次，维持科技感底色
    this.scene.add(new THREE.AmbientLight(0x1a2a4a, 1.0));

    // 主光源（右上方）：强白光，产生明显明暗对比
    const key = new THREE.DirectionalLight(0xffffff, 5.0);
    key.position.set(30, 50, 20);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 160;
    key.shadow.camera.left = -60;
    key.shadow.camera.right = 60;
    key.shadow.camera.top = 60;
    key.shadow.camera.bottom = -60;
    this.scene.add(key);

    // 填充光（左下方）：冷蓝，柔化阴影面但不消除层次
    const fill = new THREE.DirectionalLight(0x3366cc, 1.2);
    fill.position.set(-30, 10, -10);
    this.scene.add(fill);

    // 背光（场景后方）：勾勒轮廓
    const rim = new THREE.DirectionalLight(0x0099ff, 0.8);
    rim.position.set(0, 20, -50);
    this.scene.add(rim);

    // 点光源：局部氛围补光（强度收紧，聚焦主体区域）
    const p1 = new THREE.PointLight(0x0055ff, 60, 45);
    p1.position.set(-20, 10, 5);
    this.scene.add(p1);
    const p2 = new THREE.PointLight(0x00ccff, 60, 45);
    p2.position.set(20, 10, 5);
    this.scene.add(p2);
    const p3 = new THREE.PointLight(0x0077ff, 50, 50);
    p3.position.set(0, 14, 25);
    this.scene.add(p3);
  }

  _initGround() {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ color: 0x1c2d44, metalness: 0.5, roughness: 0.6 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const grid = new THREE.GridHelper(100, 50, 0x4488dd, 0x2255aa);
    grid.material.opacity = 0.55;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  /** 根据拓扑数据构建所有设备、连接线与粒子。 */
  setTopology(topology) {
    const { simulators = [], servers = [], connections = [] } = topology;

    simulators.forEach((data) => {
      const obj = buildSimulator(data);
      this.scene.add(obj);
      this.objects.set(data.id, obj);
      this._addLabel(obj, data.name, data.color, 7);
      this._registerSelectable(obj);
    });

    servers.forEach((data) => {
      const obj = buildServer(data);
      this.scene.add(obj);
      this.objects.set(data.id, obj);
      this._addLabel(obj, data.name, data.role === 'master' ? '#ffcc33' : '#00ccff', 6.2);
      this._registerSelectable(obj);
    });

    connections.forEach((data) => this._addConnection(data));
  }

  _registerSelectable(group) {
    group.traverse((o) => {
      if (o.isMesh) {
        o.userData.ownerId = group.userData.id;
        this.selectableMeshes.push(o);
      }
    });
  }

  _addLabel(object, text, color, yOffset) {
    const div = document.createElement('div');
    div.className = 'scene-label';
    div.textContent = text;
    div.style.color = color;
    const label = new CSS2DObject(div);
    label.position.set(0, yOffset, 0);
    object.add(label);
  }

  _addConnection(data) {
    const fromObj = this.objects.get(data.from);
    const toObj = this.objects.get(data.to);
    if (!fromObj || !toObj) return;

    const start = fromObj.position.clone().setY(3);
    const end = toObj.position.clone().setY(3.2);
    const mid = start.clone().lerp(end, 0.5);
    mid.y += (start.distanceTo(end)) * data.arcH * 0.12;

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(60);
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(data.color),
      transparent: true,
      opacity: 0.7
    });
    const line = new THREE.Line(geom, material);
    line.userData = { kind: 'connection', id: data.id, data };
    this.scene.add(line);
    this.objects.set(data.id, line);

    this.connections.push({ data, curve, material });

    // 数据粒子（每条连接 2 个，共 6 个，PRD 5.1）
    for (let i = 0; i < 2; i++) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 10, 10),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(data.color) })
      );
      this.scene.add(dot);
      this.particles.push({ mesh: dot, curve, t: i * 0.5, speed: 0.006 });
    }
  }

  _bindEvents() {
    this._onResize = this._onResize.bind(this);
    this._onClick = this._onClick.bind(this);
    window.addEventListener('resize', this._onResize);
    this.renderer.domElement.addEventListener('click', this._onClick);
  }

  _onResize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.labelRenderer.setSize(w, h);
  }

  _onClick(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.selectableMeshes, false);
    if (hits.length > 0) {
      const ownerId = hits[0].object.userData.ownerId;
      this.selectById(ownerId);
    } else {
      this.selectById(null);
    }
  }

  /** 选中指定 id 的设备并高亮。null 表示取消选择。 */
  selectById(id) {
    if (this.selectedId && this.objects.has(this.selectedId)) {
      this._setHighlight(this.objects.get(this.selectedId), false);
    }
    this.selectedId = id;
    if (id && this.objects.has(id)) {
      const obj = this.objects.get(id);
      this._setHighlight(obj, true);
      this.onSelect(obj.userData);
    } else {
      this.onSelect(null);
    }
  }

  _setHighlight(group, on) {
    group.traverse((o) => {
      if (o.isMesh && o.material && 'emissive' in o.material) {
        if (on) {
          o.userData._emissive = o.material.emissive.getHex();
          o.material.emissive.setHex(0x00ccff);
          o.material.emissiveIntensity = 0.9;
        } else if (o.userData._emissive !== undefined) {
          o.material.emissive.setHex(o.userData._emissive);
        }
      }
    });
  }

  start() {
    const loop = () => {
      this._raf = requestAnimationFrame(loop);
      this._update();
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);
    };
    loop();
  }

  _update() {
    const elapsed = this.clock.getElapsedTime();
    this.controls.update();

    // 粒子沿曲线运动
    this.particles.forEach((p) => {
      p.t += p.speed;
      if (p.t > 1) p.t -= 1;
      p.curve.getPointAt(p.t, p.mesh.position);
    });

    // 连接线呼吸式脉冲，周期约 3.5s
    const pulse = 0.45 + 0.35 * (0.5 + 0.5 * Math.sin((elapsed / 3.5) * Math.PI * 2));
    this.connections.forEach((c) => {
      c.material.opacity = pulse;
    });
  }

  dispose() {
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._onResize);
    this.renderer.domElement.removeEventListener('click', this._onClick);
    this.controls.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    if (this.labelRenderer.domElement.parentNode) {
      this.labelRenderer.domElement.parentNode.removeChild(this.labelRenderer.domElement);
    }
  }
}
