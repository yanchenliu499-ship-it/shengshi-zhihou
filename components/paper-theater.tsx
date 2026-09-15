"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useDeck } from "@/components/deck";
import { BASE_PATH } from "@/lib/data";
import { THEATER_ELEMENTS } from "@/lib/theater-data";

/**
 * 纸剧场 —— 把九件唐代元件（骑兵、诗人、舞者、宫殿……）摆成一个
 * 「画在纸上的纵深场景」，作为封面交互层：
 *  · 26° 中长焦压平纵深，静止时像一幅完整的画
 *  · 移动鼠标 → 轻微横向视差（阻尼，不直接赋坐标）
 *  · 自定义溶解着色器替代雾：远景朝纸色淡去，色相/饱和度一起溶
 *  · 屏幕空间纸纹叠层，观感从「3D 渲染」变成「画在纸上」
 *  · 每个元件可 hover 高亮、点击跳转到对应屏（复用 Deck 转场）
 */

const CFG = {
  fov: 26,
  cameraPos: [0, 5, 30] as const,
  lookAt: [0, 1.5, -28] as const,
  lateralRange: 2.5,
  damping: 3.5,
  // 站点宣纸配色（见 app/globals.css）
  skyTop: "#faf7f2",
  skyBottom: "#f0e6d0",
  dissolveBg: "#f0e6d0",
  dissolveNear: 25,
  dissolveFar: 150,
  dissolveMaxMix: 0.7,
  groundFar: "#f0e6d0",
  groundNear: "#d9cbb2",
  alphaTest: 0.05,
  grainTile: 220,
  grainStrength: 0.11,
};

const DISSOLVE_VERT = /* glsl */ `
  varying vec2 vUv;
  varying float vDist;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const DISSOLVE_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uBg;
  uniform float uNear;
  uniform float uFar;
  uniform float uMaxMix;
  uniform float uAlphaTest;
  varying vec2 vUv;
  varying float vDist;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    float t = smoothstep(uNear, uFar, vDist);
    vec3 col = mix(tex.rgb, uBg, t * uMaxMix);
    if (tex.a < uAlphaTest) discard;
    gl_FragColor = vec4(col, tex.a);
  }
`;

const GRAIN_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GRAIN_FRAG = /* glsl */ `
  uniform sampler2D tScene;
  uniform sampler2D tGrain;
  uniform vec2 uResolution;
  uniform float uTileSize;
  uniform float uStrength;
  varying vec2 vUv;
  void main() {
    vec3 col = texture2D(tScene, vUv).rgb;
    vec2 gUv = vUv * uResolution / uTileSize;
    float n = texture2D(tGrain, gUv).r;
    n = (n - 0.5) * 2.0;
    col += n * uStrength;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function makeGradientTexture(stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = 2;
  c.height = 512;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 512);
  for (const [o, col] of stops) grad.addColorStop(o, col);
  g.fillStyle = grad;
  g.fillRect(0, 0, 2, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function makeNoiseTexture(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const im = g.createImageData(size, size);
  for (let i = 0; i < im.data.length; i += 4) {
    const v = Math.floor(128 + (Math.random() - 0.5) * 2 * 38);
    im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
    im.data[i + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  return c;
}

export function PaperTheater() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const { goTo, index } = useDeck();

  // 用 ref 让事件回调和渲染循环始终读到最新值，避免重复挂载
  const indexRef = useRef(index);
  indexRef.current = index;
  const goToRef = useRef(goTo);
  goToRef.current = goTo;

  const [tip, setTip] = useState<{ name: string; label: string } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.clientWidth || window.innerWidth;
    const H = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = makeGradientTexture([
      [0, CFG.skyTop],
      [1, CFG.skyBottom],
    ]);

    const camera = new THREE.PerspectiveCamera(CFG.fov, W / H, 0.5, 800);
    camera.position.set(...CFG.cameraPos);
    const LOOK = new THREE.Vector3(...CFG.lookAt);
    camera.lookAt(LOOK);

    // 地面：躺平面片
    {
      const tex = makeGradientTexture([
        [0, CFG.groundFar],
        [1, CFG.groundNear],
      ]);
      const g = new THREE.Mesh(
        new THREE.PlaneGeometry(500, 320),
        new THREE.MeshBasicMaterial({ map: tex })
      );
      g.rotation.x = -Math.PI / 2;
      g.position.set(0, 0, -70);
      scene.add(g);
    }

    // 元件：竖面片 + 溶解着色器
    const meshes: THREE.Mesh[] = [];
    const loader = new THREE.TextureLoader();
    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const bgColor = new THREE.Color(CFG.dissolveBg);

    for (const el of THEATER_ELEMENTS) {
      const tex = loader.load(`${BASE_PATH}/theater/${el.file}`);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;

      const mat = new THREE.ShaderMaterial({
        vertexShader: DISSOLVE_VERT,
        fragmentShader: DISSOLVE_FRAG,
        uniforms: {
          uMap: { value: tex },
          uBg: { value: bgColor },
          uNear: { value: CFG.dissolveNear },
          uFar: { value: CFG.dissolveFar },
          uMaxMix: { value: CFG.dissolveMaxMix },
          uAlphaTest: { value: CFG.alphaTest },
        },
        transparent: true,
        side: THREE.DoubleSide,
      });

      const worldWidth = el.mh * (el.w / el.h);
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(worldWidth, el.mh),
        mat
      );
      const groundFrac = el.groundY / el.h;
      mesh.position.set(el.x, el.mh * (groundFrac - 0.5), el.z);
      mesh.userData = { screen: el.screen, name: el.name, label: el.label };
      scene.add(mesh);
      meshes.push(mesh);
    }

    // 纸纹后处理（屏幕空间）
    const grainTex = new THREE.CanvasTexture(makeNoiseTexture(256));
    grainTex.wrapS = grainTex.wrapT = THREE.RepeatWrapping;
    grainTex.colorSpace = THREE.NoColorSpace;
    const grainMat = new THREE.ShaderMaterial({
      vertexShader: GRAIN_VERT,
      fragmentShader: GRAIN_FRAG,
      uniforms: {
        tScene: { value: null },
        tGrain: { value: grainTex },
        uResolution: { value: new THREE.Vector2(W, H) },
        uTileSize: { value: CFG.grainTile },
        uStrength: { value: CFG.grainStrength },
      },
      depthTest: false,
      depthWrite: false,
    });
    const grainScene = new THREE.Scene();
    grainScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), grainMat));
    const grainCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const rt = new THREE.WebGLRenderTarget(W, H, { samples: 4 });

    // 交互：横向视差 + raycast 命中
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let lateralTarget = 0;
    let hovered: THREE.Mesh | null = null;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      lateralTarget = (nx - 0.5) * 2 * CFG.lateralRange;
      pointer.x = nx * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      // 跟随光标的提示框位置（DOM 直接定位，避免逐帧 re-render）
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onLeave = () => {
      lateralTarget = 0;
      if (hovered) hovered.scale.set(1, 1, 1);
      hovered = null;
      setTip(null);
      container.style.cursor = "default";
    };

    const onClick = (e: MouseEvent) => {
      if (indexRef.current !== 0) return;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes, false);
      if (hits.length > 0) {
        const screen = hits[0].object.userData.screen as number;
        if (typeof screen === "number") goToRef.current(screen, "baoxiang");
      }
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onLeave);
    container.addEventListener("click", onClick);

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      rt.setSize(w, h);
      grainMat.uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);

    let lastT = performance.now();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (indexRef.current !== 0) return; // 不在封面屏则停渲，省资源

      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.1);
      lastT = now;
      const k = 1 - Math.exp(-CFG.damping * dt);

      // 相机横向视差（阻尼追目标）
      camera.position.x += (lateralTarget - camera.position.x) * k;
      camera.lookAt(LOOK);

      // hover 高亮
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(meshes, false);
      const cur = hits.length > 0 ? (hits[0].object as THREE.Mesh) : null;
      if (cur !== hovered) {
        if (hovered) hovered.scale.set(1, 1, 1);
        hovered = cur;
        if (hovered) {
          hovered.scale.set(1.06, 1.06, 1);
          setTip({
            name: hovered.userData.name as string,
            label: hovered.userData.label as string,
          });
          container.style.cursor = "pointer";
        } else {
          setTip(null);
          container.style.cursor = "default";
        }
      }

      renderer.setRenderTarget(rt);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      grainMat.uniforms.tScene.value = rt.texture;
      renderer.render(grainScene, grainCam);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onLeave);
      container.removeEventListener("click", onClick);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else if (m) m.dispose();
      });
      grainTex.dispose();
      rt.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div ref={containerRef} className="absolute inset-0" aria-hidden="true" />
      <div
        ref={tooltipRef}
        className="pointer-events-none fixed left-0 top-0 z-[13] -translate-x-1/2 -translate-y-[130%]"
        style={{ display: tip ? "block" : "none" }}
      >
        {tip && (
          <div className="rounded-full border border-gold/40 bg-paper/95 px-3.5 py-1.5 shadow-[0_2px_12px_rgba(44,36,22,0.16)] backdrop-blur-sm">
            <span className="font-heading text-sm font-bold text-ink">{tip.name}</span>
            <span className="ml-2 font-body text-xs text-accent">→ {tip.label}</span>
          </div>
        )}
      </div>
    </>
  );
}
