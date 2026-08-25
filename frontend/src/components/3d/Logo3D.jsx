import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasWrapper } from './CanvasWrapper';
import { useReducedMotion } from './useReducedMotion';

/**
 * Procedural 3D HostelHub "H" Logo Mesh
 */
export const Logo3DMesh = ({ scale = 1, color = '#00685f', accentColor = '#89f5e7' }) => {
  const groupRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  // Create clean "H" shape using composite rounded boxes for maximum crispness
  useFrame((state, delta) => {
    if (groupRef.current && !prefersReducedMotion) {
      groupRef.current.rotation.y += delta * 0.6;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Left Pillar */}
      <RoundedBox args={[0.36, 1.4, 0.36]} radius={0.06} smoothness={4} position={[-0.45, 0, 0]}>
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.15}
        />
      </RoundedBox>

      {/* Right Pillar */}
      <RoundedBox args={[0.36, 1.4, 0.36]} radius={0.06} smoothness={4} position={[0.45, 0, 0]}>
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.15}
        />
      </RoundedBox>

      {/* Crossbar */}
      <RoundedBox args={[0.62, 0.34, 0.34]} radius={0.06} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={accentColor}
          roughness={0.2}
          metalness={0.2}
        />
      </RoundedBox>

      {/* Subtle Glow Ring */}
      <mesh position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

/**
 * Standalone 3D Logo Scene with Canvas
 */
export const Logo3D = ({ className = 'w-16 h-16', scale = 1.2 }) => {
  return (
    <CanvasWrapper
      className={className}
      camera={{ position: [0, 0, 3.2], fov: 40 }}
      fallback={
        <div className="w-full h-full rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-sm">
          H
        </div>
      }
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 3]} intensity={1.2} />
      <pointLight position={[-2, -1, -2]} intensity={0.4} color="#89f5e7" />
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <Logo3DMesh scale={scale} />
      </Float>
    </CanvasWrapper>
  );
};

/**
 * 3D Loading Spinner state for page transitions & async loads
 */
export const LoadingSpinner3D = ({ message = 'Loading resources...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="w-24 h-24 relative">
        <CanvasWrapper
          camera={{ position: [0, 0, 3.2], fov: 40 }}
          fallback={
            <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-lg animate-pulse">
              H
            </div>
          }
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[2, 3, 2]} intensity={1.2} />
          <pointLight position={[-2, 1, 2]} intensity={0.6} color="#6bd8cb" />
          <Logo3DMesh scale={1.1} />
        </CanvasWrapper>
      </div>
      {message && (
        <p className="font-label-md text-sm text-on-surface-variant font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
