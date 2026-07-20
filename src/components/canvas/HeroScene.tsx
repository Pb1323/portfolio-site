"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import GradientShader from "./GradientShader";

gsap.registerPlugin(ScrollTrigger);

function DistortedObject({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseY = -3.1;
  const baseScale = 0.75;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const p = progressRef.current;
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
    // Diagonal glide up-and-out to the side so it never crosses the centered headline.
    const ease = p * p;

    meshRef.current.rotation.x += delta * 0.12;
    meshRef.current.rotation.y += delta * 0.08;
    meshRef.current.rotation.z = p * Math.PI * 0.4;
    meshRef.current.position.y = baseY + ease * 1.9;
    meshRef.current.position.x = ease * 2.6;
    meshRef.current.scale.setScalar((baseScale + p * 0.15) * breathe);
  });

  return (
    <mesh ref={meshRef} position={[0, baseY, -2.5]}>
      <icosahedronGeometry args={[1.1, 3]} />
      <meshStandardMaterial
        color="#ff8a3d"
        emissive="#ff5f1f"
        emissiveIntensity={0.35}
        roughness={0.3}
        metalness={0.15}
      />
    </mesh>
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
