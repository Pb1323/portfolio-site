"use client";

// Drafted in a Claude Design session and ported in via steal-ui-style handoff (see
// THIRD_PARTY_NOTICES.md for the borrowed-component convention this project follows —
// this file is original code, not third-party, but was designed in that separate tool
// before being adapted here to match the live codebase).
//
// Adds, on top of the previous version:
//  1. Post-processing (Bloom + Chromatic Aberration + Noise/grain) via @react-three/postprocessing
//  2. Shape-shifting hero object — vertex displacement morphs between per-project "shape
//     personalities" (spike/twist/noise params) as scroll crosses each project card
//  3. Cinematic camera dolly — camera moves through the scene on scroll, not just the object
//
// Respects prefers-reduced-motion: post-processing intensity is dialed down and the
// camera dolly / continuous rotation stop (object still renders, just static).

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import GradientShader from "./GradientShader";
import { projects } from "@/data/projects";
import { useReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// One "shape personality" per project card, blended by scroll progress.
// spike: displacement amplitude, twist: rotational shear, noiseFreq: surface detail scale.
const SHAPES = [
  { spike: 0.05, twist: 0.0, noiseFreq: 1.2 }, // resting / hero state
  ...projects.map((_, i) => ({
    spike: 0.22 + (i % 3) * 0.06,
    twist: 0.6 + i * 0.35,
    noiseFreq: 1.8 + i * 0.7,
  })),
];

const morphVertex = /* glsl */ `
  uniform float uSpike;
  uniform float uTwist;
  uniform float uNoiseFreq;
  uniform float uTime;

  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
              dot(p, vec3(269.5, 183.3, 246.1)),
              dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453123);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(dot(hash3(i + vec3(0,0,0)) - 0.5, f - vec3(0,0,0)),
              dot(hash3(i + vec3(1,0,0)) - 0.5, f - vec3(1,0,0)), f.x),
          mix(dot(hash3(i + vec3(0,1,0)) - 0.5, f - vec3(0,1,0)),
              dot(hash3(i + vec3(1,1,0)) - 0.5, f - vec3(1,1,0)), f.x), f.y),
      mix(mix(dot(hash3(i + vec3(0,0,1)) - 0.5, f - vec3(0,0,1)),
              dot(hash3(i + vec3(1,0,1)) - 0.5, f - vec3(1,0,1)), f.x),
          mix(dot(hash3(i + vec3(0,1,1)) - 0.5, f - vec3(0,1,1)),
              dot(hash3(i + vec3(1,1,1)) - 0.5, f - vec3(1,1,1)), f.x), f.y), f.z);
  }

  vec3 twistPosition(vec3 p, float angle) {
    float s = sin(angle * p.y);
    float c = cos(angle * p.y);
    mat2 m = mat2(c, -s, s, c);
    p.xz = m * p.xz;
    return p;
  }
`;

type ShaderUserData = { shader?: THREE.WebGLProgramParametersWithUniforms };

// Injected into MeshStandardMaterial via onBeforeCompile so lighting stays physically based.
function applyMorphShader(material: THREE.MeshStandardMaterial) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uSpike = { value: 0.05 };
    shader.uniforms.uTwist = { value: 0 };
    shader.uniforms.uNoiseFreq = { value: 1.2 };
    shader.uniforms.uTime = { value: 0 };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${morphVertex}`)
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vec3 morphed = twistPosition(transformed, uTwist);
        float n = noise3(morphed * uNoiseFreq + uTime * 0.15);
        morphed += normal * n * uSpike;
        transformed = morphed;`
      );
    (material.userData as ShaderUserData).shader = shader;
  };
  material.customProgramCacheKey = () => "morph-standard";
}

function DistortedObject({
  progressRef,
  reduceMotion,
}: {
  progressRef: React.MutableRefObject<number>;
  reduceMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const baseY = -3.1;
  const baseScale = 0.75;

  useEffect(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: "#8b5cf6",
      emissive: "#7c3aed",
      emissiveIntensity: 0.4,
      roughness: 0.28,
      metalness: 0.2,
    });
    applyMorphShader(mat);
    materialRef.current = mat;
    if (meshRef.current) meshRef.current.material = mat;
    return () => {
      mat.dispose();
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;
    const p = progressRef.current;
    const breathe = reduceMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
    const ease = p * p;

    if (!reduceMotion) {
      meshRef.current.rotation.x += delta * 0.12;
      meshRef.current.rotation.y += delta * 0.08;
    }
    meshRef.current.rotation.z = p * Math.PI * 0.4;
    meshRef.current.position.y = baseY + ease * 1.9;
    meshRef.current.position.x = ease * 2.6;
    meshRef.current.scale.setScalar((baseScale + p * 0.15) * breathe);

    // Blend shape personality across project cards by overall scroll progress.
    const stops = SHAPES.length - 1;
    const scaled = p * stops;
    const idx = Math.min(Math.floor(scaled), stops - 1);
    const t = reduceMotion ? 0 : scaled - idx;
    const a = SHAPES[idx];
    const b = SHAPES[Math.min(idx + 1, stops)];
    const shader = (materialRef.current.userData as ShaderUserData).shader;
    if (shader) {
      shader.uniforms.uSpike.value = THREE.MathUtils.lerp(a.spike, b.spike, t);
      shader.uniforms.uTwist.value = THREE.MathUtils.lerp(a.twist, b.twist, t);
      shader.uniforms.uNoiseFreq.value = THREE.MathUtils.lerp(a.noiseFreq, b.noiseFreq, t);
      shader.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, baseY, -2.5]}>
      <icosahedronGeometry args={[1.1, 2]} />
      <meshStandardMaterial color="#8b5cf6" emissive="#7c3aed" emissiveIntensity={0.4} roughness={0.28} metalness={0.2} />
    </mesh>
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
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 3, 4]} intensity={2.6} color="#c4b5fd" />
        <pointLight position={[0, 0, 3]} intensity={1.2} color="#ffffff" />
        <DistortedObject progressRef={progressRef} reduceMotion={reduceMotion} />
        <CameraDolly progressRef={progressRef} reduceMotion={reduceMotion} />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={reduceMotion ? 0.3 : 0.6}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.35}
            mipmapBlur={false}
            radius={0.4}
          />
          <ChromaticAberration
            offset={reduceMotion ? [0, 0] : [0.0007, 0.0009]}
            radialModulation
            modulationOffset={0.4}
          />
          <Noise opacity={reduceMotion ? 0.012 : 0.025} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
