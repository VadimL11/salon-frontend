'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sphere, Torus, Icosahedron } from '@react-three/drei'
import * as THREE from 'three'

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    // Smooth pointer tracking (parallax effect)
    // state.pointer x/y range from -1 to 1 based on screen position
    const targetX = state.pointer.x * 2.5;
    const targetY = state.pointer.y * 2.5;

    if (groupRef.current) {
        groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05;
        groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;
    }
  })

  return (
    <group ref={groupRef}>
      {/* Front left floating sphere */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2} position={[-4, 2, -2]}>
        <Sphere args={[1.5, 64, 64]}>
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            opacity={1}
            metalness={0.1}
            roughness={0.05}
            ior={1.5}
            thickness={2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </Sphere>
      </Float>

      {/* Bottom right floating torus (gold-ish) */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.5} position={[5, -3, -4]}>
        <Torus args={[1.4, 0.4, 32, 64]}>
          <meshPhysicalMaterial
            color="#e8d5a3"
            transmission={0.6}
            opacity={1}
            metalness={0.3}
            roughness={0.1}
            ior={1.2}
            thickness={1}
            clearcoat={0.5}
          />
        </Torus>
      </Float>

      {/* Center back floating icosahedron */}
      <Float speed={3} rotationIntensity={1} floatIntensity={2.5} position={[0, -1, -8]}>
        <Icosahedron args={[2.5, 0]}>
           <meshPhysicalMaterial
            color="#f0e5d2"
            transmission={0.8}
            opacity={1}
            metalness={0.2}
            roughness={0.2}
            ior={1.4}
            thickness={3}
          />
        </Icosahedron>
      </Float>

      {/* Top right floating small sphere */}
      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={3} position={[6, 4, -6]}>
        <Sphere args={[0.8, 32, 32]}>
          <meshPhysicalMaterial
            color="#d9c09a"
            transmission={0.9}
            opacity={1}
            metalness={0.4}
            roughness={0.05}
            ior={1.5}
            thickness={0.5}
            clearcoat={1}
          />
        </Sphere>
      </Float>
      
      {/* Far left small torus */}
      <Float speed={2} rotationIntensity={2.5} floatIntensity={2} position={[-6, -4, -5]}>
        <Torus args={[0.8, 0.3, 32, 64]}>
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.8}
            opacity={1}
            metalness={0.1}
            roughness={0.2}
            ior={1.3}
            thickness={1}
          />
        </Torus>
      </Float>
    </group>
  )
}

export default function InteractiveBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #fdfaf5 0%, #f8f2e8 40%, #f0e5d2 100%)',
      }}
      aria-hidden="true"
    >
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }} 
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#e8d5a3" />
        <spotLight position={[0, 5, 5]} intensity={2} color="#ffffff" penumbra={1} />
        <FloatingShapes />
      </Canvas>
    </div>
  )
}
