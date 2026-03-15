"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { Float, Sphere } from "@react-three/drei";
import * as THREE from "three";


function Scene() {
  const sphereRef = useRef<THREE.Mesh>(null!);

  useFrame((state: RootState) => { // Changed 'any' back to RootState
    const time = state.clock.getElapsedTime();
    sphereRef.current.position.y = Math.sin(time) * 0.15;
    sphereRef.current.rotation.x = time * 0.1;
    sphereRef.current.rotation.y = time * 0.15;
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d4a373" />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={sphereRef} args={[1, 100, 100]} scale={1.4}>
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={1}
            thickness={0.5}
            roughness={0.05}
            envMapIntensity={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            metalness={0.02}
            ior={1.2}
          />
        </Sphere>
      </Float>
    </>
  );
}

export default function Hero3D() {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <Scene />
            </Canvas>
        </div>
    );
}