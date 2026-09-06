"use client";

// Hero centerpiece is a data-driven "signature" built from this account's real GitHub
// language mix (useGitHubLanguages) instead of a decorative shape — see AGENTS/CLAUDE.md
// research note: a glowing purple primitive on a dark gradient is 2026's most recognized
// "generic AI-built site" tell, so the fix is to make the form provably about the person
// it belongs to, not just re-skin the same shape. Each language becomes one strand of a
// double-helix, sized by repo count, colored with that language's real GitHub linguist
// color, so the palette is naturally multi-hued rather than monochrome purple.
//
// Keeps, from the previous version:
//  1. Post-processing (Bloom + Noise/grain) via @react-three/postprocessing
//  2. Cinematic camera dolly — camera moves through the scene on scroll
// Drops the chromatic-aberration + single-object vertex-morph shader (the "shiny rock"
// look) in favor of the particle signature below.
//
// Respects prefers-reduced-motion: post-processing intensity is dialed down and rotation
// stops (signature still renders, just static).

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import GradientShader from "./GradientShader";
import { useGitHubLanguages, PLACEHOLDER_LANGUAGES } from "@/lib/useGitHubLanguages";
import { useReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const GITHUB_USERNAME = "Pb1323";
const PARTICLES_PER_REPO = 16;
const MIN_PARTICLES_PER_STRAND = 24;
const HELIX_HEIGHT = 4.2;
const HELIX_RADIUS = 1.15;

function buildSignatureGeometry(languages: { name: string; color: string; count: number }[]) {
  const positions: number[] = [];
  const colors: number[] = [];
  const strandCount = languages.length;

  languages.forEach((lang, strandIndex) => {
    const n = Math.max(MIN_PARTICLES_PER_STRAND, lang.count * PARTICLES_PER_REPO);
    const color = new THREE.Color(lang.color);
    const strandAngle = (strandIndex / strandCount) * Math.PI * 2;
    for (let i = 0; i < n; i++) {
      const t = i / n; // 0..1 along the strand
      const y = (t - 0.5) * HELIX_HEIGHT;
      const twist = t * Math.PI * 5; // turns over the strand's height
      const wobble = 1 + Math.sin(t * Math.PI * 9 + strandIndex) * 0.06;
      const radius = HELIX_RADIUS * wobble;
      const angle = strandAngle + twist;
      positions.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      colors.push(color.r, color.g, color.b);
    }
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return geometry;
}

// Soft round sprite so points read as glowing dots, not hard squares.
function useDotTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.7)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function DataSignature({
  progressRef,
  reduceMotion,
}: {
  progressRef: React.MutableRefObject<number>;
  reduceMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const languages = useGitHubLanguages(GITHUB_USERNAME) ?? PLACEHOLDER_LANGUAGES;
  const dotTexture = useDotTexture();
  const geometry = useMemo(() => buildSignatureGeometry(languages), [languages]);
  const baseY = -2.6;
  const baseScale = 0.85;

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const p = progressRef.current;
    const ease = p * p;

    const approachPhase = reduceMotion ? 0 : (Math.sin(state.clock.elapsedTime * 0.35) + 1) / 2;
    const breathe = reduceMotion ? 1 : 1 + approachPhase * 0.05;

    if (!reduceMotion) {
      group.rotation.y += delta * 0.15;
      group.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.15;
    }
    group.position.y = baseY + ease * 1.9;
    group.position.x = ease * 2.6;
    group.position.z = -2.5;
    group.scale.setScalar((baseScale + p * 0.2) * breathe);
  });

  return (
    <group ref={groupRef} position={[0, baseY, -2.5]}>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.09}
          map={dotTexture}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function CameraDolly({
  progressRef,
  reduceMotion,
}: {
  progressRef: React.MutableRefObject<number>;
  reduceMotion: boolean;
}) {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useFrame(() => {
    if (reduceMotion) return;
    const cam = cameraRef.current;
    const p = progressRef.current;
    // Dolly in and slightly around the object; subtle, never disorienting.
    cam.position.z = 5 - p * 1.4;
    cam.position.x = Math.sin(p * Math.PI * 0.5) * 0.6;
    cam.position.y = p * 0.35;
    cam.lookAt(0, -1.2 + p * 0.6, -2.5);
  });

  return null;
}

export default function HeroScene() {
  const progressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#hero-scroll-track",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10">
      <Canvas
        dpr={1}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <GradientShader progressRef={progressRef} />
        <DataSignature progressRef={progressRef} reduceMotion={reduceMotion} />
        <CameraDolly progressRef={progressRef} reduceMotion={reduceMotion} />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={reduceMotion ? 0.35 : 0.7}
            luminanceThreshold={0.15}
            luminanceSmoothing={0.4}
            mipmapBlur
            radius={0.5}
          />
          <Noise opacity={reduceMotion ? 0.012 : 0.025} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
