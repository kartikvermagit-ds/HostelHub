import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from './useReducedMotion';

/**
 * Procedural 3D Academic Document / PDF Card
 */
export const FloatingDocument = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  headerColor = '#00685f',
  badgeText = 'PDF',
  animate = true
}) => {
  const meshRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useFrame((state) => {
    if (animate && meshRef.current && !prefersReducedMotion) {
      const t = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(t * 1.5 + position[0]) * 0.08;
      meshRef.current.rotation.z = rotation[2] + Math.cos(t * 1.2) * 0.04;
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      {/* Paper Sheet */}
      <RoundedBox args={[1.2, 1.6, 0.04]} radius={0.03} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.4}
          metalness={0.05}
        />
      </RoundedBox>

      {/* Header Accent Bar */}
      <RoundedBox args={[1.04, 0.28, 0.02]} radius={0.02} smoothness={3} position={[0, 0.54, 0.025]}>
        <meshStandardMaterial
          color={headerColor}
          roughness={0.3}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Simulated Text Lines */}
      {[-0.05, -0.22, -0.39, -0.56].map((y, index) => (
        <RoundedBox
          key={index}
          args={[index === 3 ? 0.6 : 0.96, 0.05, 0.01]}
          radius={0.01}
          smoothness={2}
          position={[index === 3 ? -0.18 : 0, y, 0.025]}
        >
          <meshStandardMaterial
            color="#dce2f3"
            roughness={0.5}
          />
        </RoundedBox>
      ))}

      {/* Document Corner Fold */}
      <mesh position={[0.48, 0.68, 0.025]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial color="#c0c7d6" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
