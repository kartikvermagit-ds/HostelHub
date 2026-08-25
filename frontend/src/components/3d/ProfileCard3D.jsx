import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasWrapper } from './CanvasWrapper';
import { useReducedMotion } from './useReducedMotion';

/**
 * 3D Holographic / Metallic Student ID Card Mesh
 */
const StudentBadgeCard = ({
  name = 'Kartik Sharma',
  hostel = 'Hostel 4',
  room = 'B-204',
  role = 'CSE • 4th Sem'
}) => {
  const cardRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useFrame((state) => {
    if (cardRef.current && !prefersReducedMotion) {
      const pointer = state.pointer;
      // Interactive 3D tilt tracking cursor
      cardRef.current.rotation.y = THREE.MathUtils.lerp(
        cardRef.current.rotation.y,
        pointer.x * 0.35,
        0.05
      );
      cardRef.current.rotation.x = THREE.MathUtils.lerp(
        cardRef.current.rotation.x,
        -pointer.y * 0.25,
        0.05
      );
    }
  });

  return (
    <group ref={cardRef} position={[0, 0, 0]}>
      {/* Top Lanyard Clip Ring */}
      <mesh position={[0, 1.45, 0]}>
        <torusGeometry args={[0.16, 0.03, 16, 24]} />
        <meshStandardMaterial color="#89f5e7" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Lanyard Holder Bracket */}
      <RoundedBox args={[0.42, 0.12, 0.08]} radius={0.02} position={[0, 1.34, 0]}>
        <meshStandardMaterial color="#384357" roughness={0.3} metalness={0.5} />
      </RoundedBox>

      {/* Main Student ID Card Body */}
      <RoundedBox args={[1.9, 2.6, 0.06]} radius={0.08} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.2}
          metalness={0.08}
        />
      </RoundedBox>

      {/* Card Header Teal Banner (Front face z = 0.035) */}
      <RoundedBox args={[1.9, 0.6, 0.02]} radius={0.04} smoothness={3} position={[0, 1.0, 0.035]}>
        <meshStandardMaterial
          color="#00685f"
          roughness={0.25}
          metalness={0.2}
        />
      </RoundedBox>

      {/* "H" Logo Badge on Card Header */}
      <RoundedBox args={[0.26, 0.26, 0.03]} radius={0.04} position={[-0.65, 1.0, 0.05]}>
        <meshStandardMaterial color="#89f5e7" roughness={0.2} metalness={0.3} />
      </RoundedBox>
      {/* Header Institution Label */}
      <RoundedBox args={[0.9, 0.08, 0.02]} radius={0.01} position={[0.1, 1.05, 0.05]}>
        <meshStandardMaterial color="#f4fffc" roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.6, 0.05, 0.02]} radius={0.01} position={[-0.05, 0.9, 0.05]}>
        <meshStandardMaterial color="#89f5e7" roughness={0.3} />
      </RoundedBox>

      {/* Student Photo Frame (Dark/Teal Avatar placeholder) */}
      <RoundedBox args={[0.7, 0.75, 0.02]} radius={0.06} position={[-0.45, 0.25, 0.035]}>
        <meshStandardMaterial color="#008378" roughness={0.3} />
      </RoundedBox>
      {/* Photo inner head & shoulder silhouette */}
      <mesh position={[-0.45, 0.32, 0.05]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#89f5e7" roughness={0.3} />
      </mesh>
      <mesh position={[-0.45, 0.1, 0.05]}>
        <cylinderGeometry args={[0.14, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#f4fffc" roughness={0.4} />
      </mesh>

      {/* Golden Smart Card Chip */}
      <RoundedBox args={[0.36, 0.28, 0.02]} radius={0.02} position={[0.42, 0.42, 0.035]}>
        <meshStandardMaterial
          color="#ffb59a"
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Holographic Security Stripe */}
      <RoundedBox args={[0.55, 0.06, 0.02]} radius={0.01} position={[0.35, 0.15, 0.035]}>
        <meshStandardMaterial
          color="#89f5e7"
          emissive="#00685f"
          emissiveIntensity={0.4}
          roughness={0.1}
          metalness={0.6}
        />
      </RoundedBox>

      {/* Student Details Lines */}
      <RoundedBox args={[1.5, 0.08, 0.02]} radius={0.01} position={[0, -0.32, 0.035]}>
        <meshStandardMaterial color="#141b2b" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[1.2, 0.06, 0.02]} radius={0.01} position={[-0.15, -0.48, 0.035]}>
        <meshStandardMaterial color="#585f6c" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[1.4, 0.06, 0.02]} radius={0.01} position={[-0.05, -0.64, 0.035]}>
        <meshStandardMaterial color="#00685f" roughness={0.3} />
      </RoundedBox>

      {/* Bottom Barcode */}
      {[-0.65, -0.5, -0.4, -0.25, -0.1, 0.05, 0.2, 0.35, 0.5, 0.65].map((x, i) => (
        <RoundedBox
          key={i}
          args={[i % 2 === 0 ? 0.04 : 0.02, 0.22, 0.02]}
          radius={0.005}
          position={[x, -0.98, 0.035]}
        >
          <meshStandardMaterial color="#141b2b" roughness={0.5} />
        </RoundedBox>
      ))}

      {/* Backside Details (visible if rotated) */}
      <RoundedBox args={[1.7, 0.3, 0.02]} radius={0.02} position={[0, 0.6, -0.035]}>
        <meshStandardMaterial color="#141b2b" roughness={0.4} />
      </RoundedBox>
    </group>
  );
};

/**
 * Floating Academic Achievement Badges
 */
const AchievementOrbs = () => {
  return (
    <>
      {/* Contributor Golden Star */}
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh position={[1.4, 0.8, 0.4]} scale={0.35}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#ffb59a"
            emissive="#b05e3d"
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Verified Scholar Diamond */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.45}>
        <mesh position={[-1.3, -0.6, 0.5]} scale={0.3}>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#89f5e7"
            emissive="#00685f"
            emissiveIntensity={0.5}
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>
      </Float>
    </>
  );
};

/**
 * Standalone 3D Profile Scene Export
 */
export const ProfileCard3D = ({
  user = {},
  className = 'w-full h-56 md:h-64'
}) => {
  return (
    <CanvasWrapper
      className={className}
      camera={{ position: [0, 0.1, 4.4], fov: 42 }}
      disableOnMobile={false}
      fallback={
        <div className="w-full h-full flex items-center justify-center text-primary/30">
          <span className="material-symbols-outlined text-6xl">badge</span>
        </div>
      }
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 4]} intensity={1.4} />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#89f5e7" />
      <pointLight position={[0, -1, 2]} intensity={0.3} color="#f4fffc" />

      <Float speed={1.6} rotationIntensity={0.1} floatIntensity={0.25}>
        <StudentBadgeCard
          name={user?.full_name || user?.name || 'Kartik Sharma'}
          hostel={user?.hostel || 'Hostel 4'}
          room={user?.room_number || 'B-204'}
          role={user?.role || 'Active Contributor'}
        />
        <AchievementOrbs />
      </Float>
    </CanvasWrapper>
  );
};
