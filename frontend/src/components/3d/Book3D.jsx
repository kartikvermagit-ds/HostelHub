import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { BookPages } from './BookPages';
import { useReducedMotion } from './useReducedMotion';

/**
 * 3D Academic Hardcover Book with Spine Pivot Animation
 */
export const Book3D = ({ openProgress = 1 }) => {
  const frontCoverPivotRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  // Front cover rotates around spine from 0 to -Math.PI (180 deg)
  useFrame(() => {
    if (frontCoverPivotRef.current) {
      const angle = (prefersReducedMotion ? 1 : openProgress) * -Math.PI;
      frontCoverPivotRef.current.rotation.z = angle;
    }
  });

  return (
    <group position={[0, -0.15, 0]}>
      {/* Central Book Spine Foundation */}
      <RoundedBox args={[0.4, 0.28, 4.6]} radius={0.06} smoothness={3} position={[0, -0.06, 0]}>
        <meshStandardMaterial
          color="#004d46"
          roughness={0.35}
          metalness={0.2}
        />
      </RoundedBox>

      {/* Back Cover (Stays Flat on the Desk / Base) */}
      <RoundedBox
        args={[3.5, 0.08, 4.56]}
        radius={0.04}
        smoothness={3}
        position={[1.75, -0.1, 0]}
      >
        <meshStandardMaterial
          color="#00685f"
          roughness={0.3}
          metalness={0.2}
        />
      </RoundedBox>

      {/* Front Cover Assembly (Pivots smoothly from Spine x = 0) */}
      <group ref={frontCoverPivotRef} position={[0, -0.05, 0]}>
        {/* Front Cover Board */}
        <RoundedBox
          args={[3.5, 0.08, 4.56]}
          radius={0.04}
          smoothness={3}
          position={[1.75, 0.04, 0]}
        >
          <meshStandardMaterial
            color="#00685f"
            roughness={0.28}
            metalness={0.22}
          />
        </RoundedBox>

        {/* Golden Foil Embossed "HostelHub" Brand Emblem */}
        <RoundedBox
          args={[0.8, 0.8, 0.02]}
          radius={0.12}
          position={[1.75, 0.085, -0.6]}
        >
          <meshStandardMaterial
            color="#89f5e7"
            emissive="#00685f"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.15}
          />
        </RoundedBox>

        {/* Embossed Letter H inside Emblem */}
        <mesh position={[1.75, 0.1, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.4, 0.4]} />
          <meshStandardMaterial color="#004d46" metalness={0.5} />
        </mesh>

        {/* Golden Title Bar (HostelHub) */}
        <RoundedBox
          args={[1.8, 0.18, 0.02]}
          radius={0.02}
          position={[1.75, 0.085, 0.3]}
        >
          <meshStandardMaterial
            color="#89f5e7"
            metalness={0.8}
            roughness={0.2}
          />
        </RoundedBox>

        {/* Subtitle Bar ("Your Hostel's Study Hub") */}
        <RoundedBox
          args={[1.4, 0.08, 0.02]}
          radius={0.01}
          position={[1.75, 0.085, 0.65]}
        >
          <meshStandardMaterial
            color="#ffdbce"
            metalness={0.6}
            roughness={0.3}
          />
        </RoundedBox>

        {/* Gold Corner Protectors */}
        {[
          [3.4, 0.085, -2.2],
          [3.4, 0.085, 2.2]
        ].map(([x, y, z], idx) => (
          <mesh key={idx} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial color="#ffb59a" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Opening Book Pages */}
      <BookPages openProgress={openProgress} />
    </group>
  );
};
