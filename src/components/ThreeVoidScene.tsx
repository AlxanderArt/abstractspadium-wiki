'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import type { Points as ThreePoints } from 'three';

function StarField() {
  const ref = useRef<ThreePoints>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(900);
    for (let i = 0; i < 900; i += 3) {
      arr[i] = (Math.random() - 0.5) * 9;
      arr[i + 1] = (Math.random() - 0.5) * 5;
      arr[i + 2] = (Math.random() - 0.5) * 7;
    }
    return arr;
  }, []);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.025;
      ref.current.rotation.x += delta * 0.006;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial transparent color="#c4a45f" size={0.012} sizeAttenuation depthWrite={false} opacity={0.34} />
    </Points>
  );
}

export default function ThreeVoidScene() {
  return (
    <div className="void-scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 4], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.32} />
        <StarField />
      </Canvas>
    </div>
  );
}
