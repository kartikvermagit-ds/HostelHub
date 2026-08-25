import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from './useReducedMotion';

/**
 * 3D Curved Open Pages of the Academic Study Book
 */
export const BookPages = ({ openProgress = 1 }) => {
  const leftPagesRef = useRef();
  const rightPagesRef = useRef();
  const auraRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  // Subtle breathing aura when open
  useFrame((state) => {
    if (auraRef.current && !prefersReducedMotion) {
      const t = state.clock.elapsedTime;
      auraRef.current.material.opacity =
        openProgress > 0.8 ? 0.25 + Math.sin(t * 2) * 0.08 : 0;
      auraRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.05);
    }
  });

  return (
    <group position={[0, 0.08, 0]}>
      {/* Left Stack of Open Pages */}
      <group
        ref={leftPagesRef}
        position={[-1.75, 0, 0]}
        rotation={[0, 0, -openProgress * 0.04]}
      >
        <RoundedBox args={[3.3, 0.22, 4.4]} radius={0.04} smoothness={3} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#fdfdfd"
            roughness={0.7}
            metalness={0.02}
          />
        </RoundedBox>

        {/* Gold Leaf Page Trimming (Left edge) */}
        <RoundedBox args={[0.04, 0.2, 4.38]} radius={0.01} position={[-1.64, 0, 0]}>
          <meshStandardMaterial color="#ffdbce" metalness={0.7} roughness={0.3} />
        </RoundedBox>

        {/* Faint academic textbook printed lines simulation on left page */}
        {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((z, idx) => (
          <mesh key={`lline-${idx}`} position={[0, 0.115, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.4, 0.08]} />
            <meshBasicMaterial color="#e1e8fd" />
          </mesh>
        ))}
      </group>

      {/* Right Stack of Open Pages */}
      <group
        ref={rightPagesRef}
        position={[1.75, 0, 0]}
        rotation={[0, 0, openProgress * 0.04]}
      >
        <RoundedBox args={[3.3, 0.22, 4.4]} radius={0.04} smoothness={3} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#fcfcfc"
            roughness={0.7}
            metalness={0.02}
          />
        </RoundedBox>

        {/* Gold Leaf Page Trimming (Right edge) */}
        <RoundedBox args={[0.04, 0.2, 4.38]} radius={0.01} position={[1.64, 0, 0]}>
          <meshStandardMaterial color="#ffdbce" metalness={0.7} roughness={0.3} />
        </RoundedBox>

        {/* Faint academic textbook lines on right page */}
        {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((z, idx) => (
          <mesh key={`rline-${idx}`} position={[0, 0.115, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.4, 0.08]} />
            <meshBasicMaterial color="#e1e8fd" />
          </mesh>
        ))}
      </group>

      {/* Center Spine Crease */}
      <RoundedBox args={[0.3, 0.16, 4.4]} radius={0.02} position={[0, -0.02, 0]}>
        <meshStandardMaterial color="#dce2f3" roughness={0.8} />
      </RoundedBox>

      {/* Upward Emergence Light Aura Ground Disk */}
      <mesh
        ref={auraRef}
        position={[0, 0.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.3, 2.2, 32]} />
        <meshBasicMaterial
          color="#89f5e7"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
