"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";

function KnotMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.18;
    meshRef.current.rotation.y += delta * 0.22;
    meshRef.current.rotation.x += mouse.normalizedY * 0.003;
    meshRef.current.rotation.y += mouse.normalizedX * 0.003;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.28, 256, 32]} />
      <meshStandardMaterial
        color="#0ea5e9"
        emissive="#8b5cf6"
        emissiveIntensity={1.2}
        metalness={0.9}
        roughness={0.1}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function TorusKnotSceneInner() {
  return (
    <Canvas
      className="absolute inset-0 w-full h-full"
      camera={{ position: [0, 0, 4], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} color="#0ea5e9" intensity={3} />
      <pointLight position={[-5, -5, 5]} color="#8b5cf6" intensity={2} />
      <pointLight position={[0, -5, 2]} color="#06b6d4" intensity={1.5} />
      <KnotMesh />
    </Canvas>
  );
}
