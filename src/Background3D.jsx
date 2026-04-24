import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleSwarm({ count = 2000 }) {
  const pointsRef = useRef();
  const { mouse, viewport } = useThree();

  // Generate random positions
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * 10 + 2;
      const y = (Math.random() - 0.5) * 15;
      p[i * 3] = r * Math.cos(theta);
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = r * Math.sin(theta);
    }
    return p;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05;
      
      // Parallax effect based on mouse
      pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, (mouse.x * viewport.width) / 10, 0.05);
      pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, (mouse.y * viewport.height) / 10, 0.05);
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#d4af37"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function Background3D() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, background: 'radial-gradient(circle at center, #111 0%, #050505 100%)' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ParticleSwarm />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}
