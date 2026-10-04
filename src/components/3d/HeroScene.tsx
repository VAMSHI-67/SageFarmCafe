'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// 3D Leaf / Botanical Organic Element
function FloatingHerb({ position, rotation, color, scale }: { position: [number, number, number], rotation: [number, number, number], color: string, scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.8) * 0.1;
    meshRef.current.rotation.y = rotation[1] + Math.cos(t * 0.5) * 0.15;
    meshRef.current.position.y = position[1] + Math.sin(t * 1.2 + position[0]) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <coneGeometry args={[0.3, 0.8, 5]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.1}
        wireframe={false}
      />
    </mesh>
  );
}

// 3D Ceramic Coffee Cup & Saucer
function CeramicCup({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.2;
  });

  return (
    <group ref={groupRef} position={position} scale={1.2}>
      {/* Cup Body */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.45, 0.35, 0.6, 32]} />
        <meshStandardMaterial color="#EFECE4" roughness={0.3} metalness={0.05} />
      </mesh>
      {/* Coffee liquid */}
      <mesh position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial color="#3E2723" roughness={0.1} metalness={0.1} />
      </mesh>
      {/* Saucer */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.7, 0.5, 0.08, 32]} />
        <meshStandardMaterial color="#EFECE4" roughness={0.3} metalness={0.05} />
      </mesh>
    </group>
  );
}

// 3D Wooden Table Slab
function WoodenTable() {
  return (
    <mesh position={[0, -1.2, 0]} rotation={[-0.1, 0, 0]}>
      <boxGeometry args={[7, 0.3, 4]} />
      <meshStandardMaterial
        color="#3E2C22"
        roughness={0.7}
        metalness={0.05}
      />
    </mesh>
  );
}

// Scene Controller
function SceneContent() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.6, 4]} fov={50} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#FFF7E6" castShadow />
      <pointLight position={[-4, 2, -2]} intensity={0.6} color="#CADAC9" />

      <WoodenTable />
      <CeramicCup position={[0, -0.8, 0.5]} />

      {/* Floating Botanical Herbs and Organic Nature Orbs */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <FloatingHerb position={[-1.8, 0.2, 0.2]} rotation={[0.4, 0.2, 0.5]} color="#5F7C60" scale={1.2} />
        <FloatingHerb position={[1.9, 0.5, -0.4]} rotation={[-0.3, 0.6, -0.4]} color="#8FA58F" scale={1.4} />
        <FloatingHerb position={[-1.2, -0.3, 1]} rotation={[0.2, -0.5, 0.3]} color="#2C3E2D" scale={0.9} />
        <FloatingHerb position={[1.4, -0.4, 0.8]} rotation={[-0.5, -0.2, -0.6]} color="#4A624B" scale={1.1} />
      </Float>
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]}>
        <SceneContent />
      </Canvas>
    </div>
  );
}
