"use client";

// Drafted in a Claude Design session and ported in via steal-ui-style handoff (see
// THIRD_PARTY_NOTICES.md for the borrowed-component convention this project follows —
// this file is original code, not third-party, but was designed in that separate tool
// before being adapted here to match the live codebase).
//
// A project title rendered onto a canvas texture, then displaced by a WebGL fragment
// shader that ripples outward from the cursor on hover and springs back on leave.
// Ported from the Claude Design demo mostly as-is: swapped the CDN-loaded global THREE
// for the project's own `three` dependency, the Google Fonts link for the project's
// Familjen Grotesk variable font, and the demo's raw useReducedMotion check for the
// project's useReducedMotion hook.

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/useReducedMotion";

const TITLES = ["Summit Tuition", "QuickDraw AI", "portfolio-site"];

export default function LiquidProjectTitle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(TITLES[0]);
  const reduceMotion = useReducedMotion();

  // A real 3D tilt toward the cursor, on top of the shader ripple — the plane leans in
  // rather than staying flat, reinforcing the "coming toward the viewer" feel used
  // elsewhere on the hero.
  function onStageMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 10;
    const rotX = (py - 0.5) * -10;
    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }
  function onStageLeave() {
    const el = stageRef.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }

  const stateRef = useRef({
    hovering: false,
    mouseUV: { x: 0.5, y: 0.5 },
    mouseStrength: 0,
  });

  const drawTextRef = useRef<(text: string) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;

    const width = stage.clientWidth;
    const height = stage.clientHeight;

    const textCanvas = document.createElement("canvas");
    textCanvas.width = width * 2;
    textCanvas.height = height * 2;
    const textCtx = textCanvas.getContext("2d")!;

    function drawTextTexture(text: string) {
      textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      textCtx.fillStyle = "#0a0714";
      textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);
      textCtx.fillStyle = "#f4f1fb";
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";
      const size = Math.min(88, 760 / (text.length * 0.62));
      textCtx.font = `600 ${size}px var(--font-geist-sans), sans-serif`;
      textCtx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);
      texture.needsUpdate = true;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const texture = new THREE.CanvasTexture(textCanvas);
    texture.minFilter = THREE.LinearFilter;
    drawTextRef.current = drawTextTexture;

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uStrength: { value: 0 },
        uTime: { value: 0 },
        uAmp: { value: 0.028 },
        uFreq: { value: 26 },
      },
      transparent: true,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTexture;
        uniform vec2 uMouse;
        uniform float uStrength;
        uniform float uTime;
        uniform float uAmp;
        uniform float uFreq;
        varying vec2 vUv;
        void main() {
          vec2 uv = vUv;
          vec2 toMouse = uv - uMouse;
          float dist = length(toMouse);
          float radius = 0.42;
          float falloff = smoothstep(radius, 0.0, dist);
          vec2 dir = dist > 0.0001 ? normalize(toMouse) : vec2(0.0);
          float ripple = sin(dist * uFreq - uTime * 5.0) * 0.5 + 0.5;
          float amt = falloff * uStrength * uAmp * ripple;
          vec2 displaced = uv + dir * amt;
          gl_FragColor = texture2D(uTexture, displaced);
        }
      `,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    scene.add(mesh);

    drawTextTexture(active);

    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      stateRef.current.mouseUV = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      };
      stateRef.current.hovering = true;
    }
    function onPointerLeave() {
      stateRef.current.hovering = false;
    }
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    function onResize() {
      if (!stage) return;
      renderer.setSize(stage.clientWidth, stage.clientHeight);
    }
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf = 0;

    if (reduceMotion) {
      renderer.render(scene, camera);
    } else {
      const animate = () => {
        raf = requestAnimationFrame(animate);
        const s = stateRef.current;
        const speed = 0.15;
        const target = s.hovering ? 1 : 0;
        s.mouseStrength += (target - s.mouseStrength) * (s.hovering ? speed : speed * 0.5);
        mat.uniforms.uStrength.value = s.mouseStrength;
        mat.uniforms.uMouse.value.set(s.mouseUV.x, s.mouseUV.y);
        mat.uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      };
      animate();
    }

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      mat.dispose();
      texture.dispose();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  useEffect(() => {
    drawTextRef.current(active);
  }, [active]);

  return (
    <div className="flex flex-col items-center gap-8 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-dim">Hover the title</p>
      <div
        ref={stageRef}
        onPointerMove={onStageMove}
        onPointerLeave={onStageLeave}
        className="relative h-[140px] w-full max-w-2xl transition-transform duration-300 ease-out sm:h-[180px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {TITLES.map((t) => (
          <button
            key={t}
            type="button"
            data-cursor="Go"
            onClick={() => setActive(t)}
            className={`rounded-full border px-3.5 py-2 font-mono text-xs transition-colors ${
              active === t
                ? "border-accent/60 text-accent-soft"
                : "border-hairline text-ink-dim hover:border-accent/40 hover:text-accent-soft"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
