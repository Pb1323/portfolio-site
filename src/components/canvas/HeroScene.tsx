"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Icosahedron } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import GradientShader from "./GradientShader";

gsap.registerPlugin(ScrollTrigger);

type MeshDistortMaterialImpl = { distort: number };

function DistortedObject({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<MeshDistortMaterialImpl | null>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const p = progressRef.current;
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y = p * Math.PI * 1.5;
    meshRef.current.position.y = -0.2 - p * 1.6;
    meshRef.current.scale.setScalar(1.7 - p * 0.4);
    if (materialRef.current) {
      materialRef.current.distort = 0.35 + p * 0.35;
    }
  });

  return (
    <Icosahedron ref={meshRef} args={[1.4, 5]} position={[0, -0.2, -0.5]}>
      <MeshDistortMaterial
        ref={(instance) => {
          materialRef.current = instance as unknown as MeshDistortMaterialImpl | null;
        }}
        color="#ff8a3d"
        emissive="#ff6a1a"
        emissiveIntensity={0.55}
        roughness={0.25}
        metalness={0.05}
        distort={0.4}
        speed={1.5}
      />
    </Icosahedron>
  );
}

export default function HeroScene() {
  const progressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <GradientShader progressRef={progressRef} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 3, 4]} intensity={2.8} color="#ffcf94" />
        <directionalLight position={[-3, -2, -3]} intensity={1.1} color="#6d8dff" />
        <pointLight position={[0, 0, 3]} intensity={1.2} color="#ffffff" />
        <DistortedObject progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
