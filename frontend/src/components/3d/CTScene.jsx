import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasWrapper } from './CanvasWrapper';
import { useReducedMotion } from './useReducedMotion';

/**
 * 3D Modern Desk Calendar Mesh
 */
const CalendarMesh = ({ subject = 'DSA', daysLeft = 1 }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Calendar Base Stand (Wood / Minimal Slate) */}
      <RoundedBox args={[1.9, 0.1, 1.2]} radius={0.02} smoothness={3} position={[0, -0.7, 0]}>
        <meshStandardMaterial color="#384357" roughness={0.3} />
      </RoundedBox>

      {/* Calendar Slanted Backplate */}
      <group position={[0, 0, 0]} rotation={[-0.18, 0, 0]}>
        {/* Calendar Backboard */}
        <RoundedBox args={[1.7, 1.35, 0.06]} radius={0.04} smoothness={3} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.05} />
        </RoundedBox>

        {/* Top Header Bar (Teal / Red for Urgent CT) */}
        <RoundedBox args={[1.7, 0.36, 0.07]} radius={0.03} smoothness={3} position={[0, 0.5, 0.005]}>
          <meshStandardMaterial
            color={daysLeft <= 1 ? '#ba1a1a' : '#00685f'}
            roughness={0.25}
            metalness={0.1}
          />
        </RoundedBox>

        {/* Spiral Binder Rings */}
        {[-0.6, -0.3, 0, 0.3, 0.6].map((x, idx) => (
          <mesh key={idx} position={[x, 0.68, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.07, 0.02, 12, 24]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Calendar Date Number Block */}
        <RoundedBox args={[0.75, 0.55, 0.02]} radius={0.02} position={[0, -0.05, 0.04]}>
          <meshStandardMaterial color="#f1f3ff" roughness={0.4} />
        </RoundedBox>

        {/* Date Day Lines Indicator */}
        <mesh position={[0, -0.05, 0.055]}>
          <planeGeometry args={[0.4, 0.25]} />
          <meshBasicMaterial color="#00685f" />
        </mesh>

        {/* Subject Label Tag */}
        <RoundedBox args={[1.2, 0.18, 0.02]} radius={0.02} position={[0, -0.48, 0.04]}>
          <meshStandardMaterial
            color={daysLeft <= 1 ? '#ffdad6' : '#dce2f3'}
            roughness={0.3}
          />
        </RoundedBox>
      </group>
    </group>
  );
};

/**
 * 3D Pencil Object
 */
const Pencil = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation} scale={0.7}>
      {/* Pencil Shaft (Hexagonal cylinder) */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 6]} />
        <meshStandardMaterial color="#b05e3d" roughness={0.3} />
      </mesh>
      {/* Wood Cone Tip */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0, 0.08, 0.16, 6]} />
        <meshStandardMaterial color="#ffdbce" roughness={0.5} />
      </mesh>
      {/* Graphite Tip */}
      <mesh position={[0, 0.77, 0]}>
        <cylinderGeometry args={[0, 0.03, 0.06, 6]} />
        <meshStandardMaterial color="#141b2b" roughness={0.2} />
      </mesh>
      {/* Eraser Band */}
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.082, 0.082, 0.08, 16]} />
        <meshStandardMaterial color="#89f5e7" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

/**
 * 3D Clock / Stopwatch Ring
 */
const TimerOrb = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position} scale={0.5}>
      {/* Ring Frame */}
      <mesh>
        <torusGeometry args={[0.6, 0.08, 16, 32]} />
        <meshStandardMaterial color="#00685f" roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Clock Hands */}
      <RoundedBox args={[0.04, 0.38, 0.02]} radius={0.01} position={[0, 0.14, 0]}>
        <meshStandardMaterial color="#141b2b" />
      </RoundedBox>
      <RoundedBox
        args={[0.04, 0.26, 0.02]}
        radius={0.01}
        position={[0.09, 0, 0]}
        rotation={[0, 0, -Math.PI / 3]}
      >
        <meshStandardMaterial color="#ba1a1a" />
      </RoundedBox>
    </group>
  );
};

/**
 * CT Scene Composition
 */
export const CTSceneMesh = ({ subject = 'DSA', daysLeft = 1 }) => {
  const groupRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useFrame((state) => {
    if (groupRef.current && !prefersReducedMotion) {
      const pointer = state.pointer;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.25,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.15,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main 3D Calendar */}
      <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.25}>
        <CalendarMesh subject={subject} daysLeft={daysLeft} />
      </Float>

      {/* Floating 3D Pencil */}
      <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.45}>
        <Pencil position={[1.4, 0.3, 0.3]} rotation={[0.4, 0.2, -0.6]} />
      </Float>

      {/* Floating Timer Orb */}
      <Float speed={1.9} rotationIntensity={0.25} floatIntensity={0.4}>
        <TimerOrb position={[-1.3, 0.5, 0.2]} />
      </Float>

      {/* Ground Soft Ambient Shadow */}
      <mesh position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 1.8, 32]} />
        <meshBasicMaterial color="#00685f" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/**
 * Standalone Canvas Export for CT Zone Banner
 */
export const CTScene = ({
  subject = 'DSA',
  daysLeft = 1,
  className = 'w-full h-48 md:h-56'
}) => {
  return (
    <CanvasWrapper
      className={className}
      camera={{ position: [0, 0.2, 4.0], fov: 42 }}
      disableOnMobile={false}
      fallback={
        <div className="w-full h-full flex items-center justify-center text-primary/40">
          <span className="material-symbols-outlined text-5xl">event_available</span>
        </div>
      }
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#89f5e7" />
      <pointLight position={[0, -1, 2]} intensity={0.3} color="#f4fffc" />
      <CTSceneMesh subject={subject} daysLeft={daysLeft} />
    </CanvasWrapper>
  );
};
