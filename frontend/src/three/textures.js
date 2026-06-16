import * as THREE from 'three';

/**
 * 生成投影屏纹理：透视公路 + 城市天际线。
 * 使用 Canvas 程序化绘制，避免外部图片依赖。
 */
export function createScreenTexture() {
  const w = 512;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // 天空渐变
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.55);
  sky.addColorStop(0, '#0a1530');
  sky.addColorStop(1, '#14385f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.55);

  // 城市天际线
  ctx.fillStyle = '#0c1c34';
  let x = 0;
  while (x < w) {
    const bw = 12 + Math.random() * 26;
    const bh = 30 + Math.random() * 70;
    ctx.fillRect(x, h * 0.55 - bh, bw, bh);
    // 窗户灯光
    ctx.fillStyle = 'rgba(0,204,255,0.5)';
    for (let yy = h * 0.55 - bh + 4; yy < h * 0.55 - 4; yy += 8) {
      for (let xx = x + 3; xx < x + bw - 3; xx += 6) {
        if (Math.random() > 0.5) ctx.fillRect(xx, yy, 2, 3);
      }
    }
    ctx.fillStyle = '#0c1c34';
    x += bw + 4;
  }

  // 地面
  ctx.fillStyle = '#0a0f18';
  ctx.fillRect(0, h * 0.55, w, h * 0.45);

  // 透视公路
  ctx.fillStyle = '#1a2230';
  ctx.beginPath();
  ctx.moveTo(w / 2 - 10, h * 0.55);
  ctx.lineTo(w / 2 + 10, h * 0.55);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  // 公路中线
  ctx.strokeStyle = '#ffd24a';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 14]);
  ctx.beginPath();
  ctx.moveTo(w / 2, h * 0.55);
  ctx.lineTo(w / 2, h);
  ctx.stroke();
  ctx.setLineDash([]);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
