import * as THREE from 'three';
import { createScreenTexture } from './textures.js';

/**
 * 运动平台：深色金属底板 + 蓝色边缘发光描边（PRD 4.1.1 共用组件）。
 */
function createMotionPlatform() {
  const group = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(7, 0.6, 7),
    new THREE.MeshStandardMaterial({ color: 0x2a3a50, metalness: 0.85, roughness: 0.25 })
  );
  base.position.y = 0.3;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  // 蓝色发光描边
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(7.05, 0.66, 7.05)),
    new THREE.LineBasicMaterial({ color: 0x00eeff })
  );
  edges.position.y = 0.3;
  group.add(edges);

  return group;
}

/**
 * 投影屏：带道路场景纹理 + 蓝色发光外框（PRD 4.1.1 共用组件）。
 */
function createScreen() {
  const group = new THREE.Group();

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(8.4, 4.6, 0.3),
    new THREE.MeshStandardMaterial({ color: 0x00ddff, emissive: 0x0088cc, emissiveIntensity: 1.2, metalness: 0.4, roughness: 0.3 })
  );
  group.add(frame);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 4.2),
    new THREE.MeshBasicMaterial({ map: createScreenTexture() })
  );
  screen.position.z = 0.16;
  group.add(screen);

  group.position.set(0, 3.2, -3);
  return group;
}

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.4, ...opts });
}

/** 机动车驾驶舱：方向盘、踏板、挡位、座椅。 */
function createCarCockpit(color) {
  const g = new THREE.Group();

  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.4, 1.2), mat(0x3a4a5c));
  seat.position.set(0, 1.1, 1);
  g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.3), mat(0x3a4a5c));
  back.position.set(0, 1.8, 1.6);
  g.add(back);

  // 仪表台
  const dash = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 0.6), mat(color));
  dash.position.set(0, 1.5, -0.6);
  g.add(dash);

  // 方向盘
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.08, 12, 32), mat(0x2a2a2a));
  wheel.position.set(0, 1.7, -0.2);
  wheel.rotation.x = Math.PI / 2.5;
  g.add(wheel);

  // 踏板（油门/刹车）
  [-0.35, 0.35].forEach((dx) => {
    const pedal = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.5), mat(0x4a4a4a));
    pedal.position.set(dx, 0.9, -0.2);
    g.add(pedal);
  });

  // 挡位
  const gear = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8), mat(0x555555));
  gear.position.set(0.8, 1.4, 0.4);
  g.add(gear);

  return g;
}

/** 助动车骑行座舱：车身 + 车把 + 座椅。 */
function createMopedCockpit(color) {
  const g = new THREE.Group();

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 2.6), mat(color));
  body.position.set(0, 1.3, 0);
  g.add(body);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 1), mat(0x3a4a5c));
  seat.position.set(0, 1.7, 0.6);
  g.add(seat);

  // 车把立柱
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8), mat(0x4a4a55));
  stem.position.set(0, 1.9, -1.1);
  stem.rotation.x = 0.2;
  g.add(stem);
  // 车把
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.4, 8), mat(0x2a2a35));
  bar.position.set(0, 2.4, -1.2);
  bar.rotation.z = Math.PI / 2;
  g.add(bar);

  // 轮子
  [1.2, -1.2].forEach((dz) => {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.12, 12, 24), mat(0x2a2a35));
    wheel.position.set(0, 0.9, dz);
    wheel.rotation.y = Math.PI / 2;
    g.add(wheel);
  });

  return g;
}

/** 自行车骨架：前后轮、车架、把手、座椅。 */
function createBikeFrame(color) {
  const g = new THREE.Group();

  // 车架（三角）
  const frameMat = mat(color, { metalness: 0.7, roughness: 0.3 });
  const tube1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2, 8), frameMat);
  tube1.position.set(0, 1.4, 0);
  tube1.rotation.z = Math.PI / 2.2;
  g.add(tube1);
  const tube2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.8, 8), frameMat);
  tube2.position.set(0.3, 1.2, 0);
  tube2.rotation.z = -Math.PI / 5;
  g.add(tube2);

  // 前后轮
  [1.3, -1.3].forEach((dz) => {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.06, 12, 32), mat(0x2a2a35));
    wheel.position.set(0, 0.9, dz);
    wheel.rotation.y = Math.PI / 2;
    g.add(wheel);
    // 辐条占位（中心毂）
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.1, 8), mat(0x888888));
    hub.position.set(0, 0.9, dz);
    hub.rotation.z = Math.PI / 2;
    g.add(hub);
  });

  // 座椅
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.3), mat(0x3a4a5c));
  seat.position.set(0.5, 1.9, 0);
  g.add(seat);

  // 把手
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8), mat(0x2a2a35));
  bar.position.set(-0.5, 1.9, 0);
  bar.rotation.x = Math.PI / 2;
  g.add(bar);

  return g;
}

/**
 * 构建一台模拟器（运动平台 + 座舱 + 投影屏）。
 * @returns {THREE.Group} group.userData = { kind:'simulator', id, data }
 */
export function buildSimulator(data) {
  const group = new THREE.Group();
  group.add(createMotionPlatform());

  const color = new THREE.Color(data.color).getHex();
  let cockpit;
  if (data.type === 'vehicle') cockpit = createCarCockpit(color);
  else if (data.type === 'moped') cockpit = createMopedCockpit(color);
  else cockpit = createBikeFrame(color);
  cockpit.position.y = 0.6;
  cockpit.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  group.add(cockpit);

  group.add(createScreen());

  group.position.set(...data.position);
  group.userData = { kind: 'simulator', id: data.id, data };
  return group;
}

/**
 * 构建一台服务器机柜。Master 带金色顶部标识。
 * @returns {THREE.Group} group.userData = { kind:'server', id, data }
 */
export function buildServer(data) {
  const group = new THREE.Group();

  const isMaster = data.role === 'master';
  const rackColor = isMaster ? 0x2a4a8a : 0x1e3050;

  const rack = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 5, 2),
    new THREE.MeshStandardMaterial({ color: rackColor, metalness: 0.75, roughness: 0.25 })
  );
  rack.position.y = 2.5;
  rack.castShadow = true;
  rack.receiveShadow = true;
  group.add(rack);

  // 机柜单元指示灯
  for (let i = 0; i < 6; i++) {
    const unit = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.5, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x1a2840, metalness: 0.6, roughness: 0.4 })
    );
    unit.position.set(0, 0.8 + i * 0.7, 1.0);
    group.add(unit);
    const led = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0x00eeff, emissive: 0x00eeff, emissiveIntensity: 2.0 })
    );
    led.position.set(0.9, 0.8 + i * 0.7, 1.04);
    group.add(led);
  }

  // 顶部角色标识
  const cap = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.2, 2.1),
    new THREE.MeshStandardMaterial({
      color: isMaster ? 0xffdd44 : 0x00ccff,
      emissive: isMaster ? 0xaa6600 : 0x005588,
      emissiveIntensity: isMaster ? 2.0 : 1.5
    })
  );
  cap.position.y = 5.1;
  group.add(cap);

  group.position.set(...data.position);
  group.userData = { kind: 'server', id: data.id, data };
  return group;
}
