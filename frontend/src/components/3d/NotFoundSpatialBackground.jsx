import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasWrapper } from './CanvasWrapper';
import { useReducedMotion } from './useReducedMotion';

// Procedural floating spatial grid & coordinate nodes
const SpatialBlueprintWireframe = () => {
  const groupRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (groupRef.current && !prefersReducedMotion) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Central Abstract Digital Twin Floor Blueprint */}
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        {/* Layer 1: Ground Floor Base */}
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[7, 5, 7, 5]} />
          <meshBasicMaterial
            wireframe
            color="#00685f"
            transparent
            opacity={0.22}
          />
        </mesh>

        {/* Layer 2: Mid Floor Wireframe */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6.2, 4.4, 6, 4]} />
          <meshBasicMaterial
            wireframe
            color="#89f5e7"
            transparent
            opacity={0.18}
          />
        </mesh>

        {/* Layer 3: Upper Floor Wireframe */}
        <mesh position={[0, 1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.5, 3.8, 5, 3]} />
          <meshBasicMaterial
            wireframe
            color="#008378"
            transparent
            opacity={0.2}
          />
        </mesh>

        {/* Floating Spatial Room Cubes / Lost Coordinate Nodes */}
        <group position={[-2.2, 0.4, -1.2]}>
          <mesh>
            <boxGeometry args={[0.9, 0.9, 0.9]} />
            <meshBasicMaterial
              wireframe
              color="#89f5e7"
              transparent
              opacity={0.35}
            />
          </mesh>
        </group>

        <group position={[2.2, 0.8, 1.0]}>
          <mesh>
            <boxGeometry args={[1.0, 1.0, 1.0]} />
            <meshBasicMaterial
              wireframe
              color="#00685f"
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>

        <group position={[1.8, -0.6, -1.5]}>
          <mesh>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshBasicMaterial
              wireframe
              color="#89f5e7"
              transparent
              opacity={0.25}
            />
          </mesh>
        </group>

        <group position={[-1.6, -0.8, 1.4]}>
          <mesh>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshBasicMaterial
              wireframe
              color="#008378"
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

// Subtle ambient particle dust
const AmbientDigitalDust = ({ count = 60 }) => {
  const pointsRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current && !prefersReducedMotion) {
      pointsRef.current.rotation.y += delta * 0.015;
      pointsRef.current.rotation.x += delta * 0.008;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#89f5e7"
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

/**
 * NotFoundSpatialBackground
 * 
 * Cinematic 3D architectural digital twin canvas rendered softly
 * in the background of the 404 page. Includes WebGL checks and
 * graceful mobile/reduced-motion handling.
 */
export const NotFoundSpatialBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <CanvasWrapper
        camera={{ position: [0, 1.2, 7.5], fov: 42 }}
        className="w-full h-full opacity-65 dark:opacity-75 blur-[1px]"
        dpr={[1, 1.5]}
        shadows={false}
        fallback={
          <div className="w-full h-full bg-gradient-to-b from-[#00685f]/10 via-transparent to-[#00685f]/5" />
        }
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} color="#89f5e7" />
        <pointLight position={[-4, -2, -2]} intensity={0.5} color="#00685f" />
        <SpatialBlueprintWireframe />
        <AmbientDigitalDust count={70} />
      </CanvasWrapper>
    </div>
  );
};
