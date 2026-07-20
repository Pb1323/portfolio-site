"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uProgress;

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.04;
    float n = fbm(uv * 3.0 + vec2(t, -t) + uProgress * 1.5);
    float gradient = smoothstep(0.0, 1.0, uv.y + n * 0.25 - uProgress * 0.3);
    vec3 color = mix(uColorA, uColorB, gradient);
    float vignette = smoothstep(1.1, 0.2, distance(uv, vec2(0.5)));
    color *= mix(0.7, 1.0, vignette);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const GradientMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uProgress: 0,
    uColorA: new THREE.Color("#0b0b0d"),
    uColorB: new THREE.Color("#241608"),
  },
  vertex,
  fragment
);

extend({ GradientMaterialImpl });

declare module "@react-three/fiber" {
  interface ThreeElements {
    gradientMaterialImpl: {
      ref?: React.Ref<THREE.ShaderMaterial>;
      uTime?: number;
      uProgress?: number;
      transparent?: boolean;
      depthWrite?: boolean;
    };
  }
}

export default function GradientShader({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const materialRef = useRef<THREE.ShaderMaterial & { uTime: number; uProgress: number }>(null);

  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.uTime = state.clock.elapsedTime;
    materialRef.current.uProgress = progressRef.current;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <gradientMaterialImpl ref={materialRef} depthWrite={false} />
    </mesh>
  );
}
