import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasWrapper } from './CanvasWrapper';
import { FloatingDocument } from './FloatingDocument';
import { useReducedMotion } from './useReducedMotion';

/**
 * 3D Procedural Hardcover Book Mesh
 */
const Book = ({
  color = '#00685f',
  accentColor = '#89f5e7',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [1.8, 0.28, 1.3]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Book Cover */}
      <RoundedBox args={size} radius={0.04} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.15}
        />
      </RoundedBox>

      {/* Book Pages (White interior) */}
      <RoundedBox
        args={[size[0] - 0.08, size[1] - 0.06, size[2] - 0.06]}
        radius={0.02}
        smoothness={2}
        position={[0.04, 0, 0]}
      >
        <meshStandardMaterial
          color="#fbfbfd"
          roughness={0.6}
        />
      </RoundedBox>

      {/* Spine Accent Foil */}
      <RoundedBox
        args={[0.08, size[1] + 0.01, size[2] + 0.01]}
        radius={0.02}
        smoothness={2}
        position={[-size[0] / 2 + 0.04, 0, 0]}
      >
        <meshStandardMaterial
          color={accentColor}
          roughness={0.2}
          metalness={0.4}
        />
      </RoundedBox>
    </group>
  );
};

/**
 * Floating Study Badge (Graduation Cap / Milestone Star)
 */
const StudyBadge = ({ position = [0, 0, 0] }) => {
  const badgeRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useFrame((state) => {
    if (badgeRef.current && !prefersReducedMotion) {
      badgeRef.current.rotation.y = state.clock.elapsedTime * 0.8;
      badgeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
  });

  return (
    <group ref={badgeRef} position={position} scale={0.4}>
      {/* Cap Top Diamond */}
      <mesh rotation={[0.2, 0, Math.PI / 4]}>
        <boxGeometry args={[1.2, 1.2, 0.08]} />
        <meshStandardMaterial color="#00685f" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Cap Skull base */}
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[0.4, 0.45, 0.35, 16]} />
        <meshStandardMaterial color="#004d46" roughness={0.4} />
      </mesh>
      {/* Golden Tassel Bead */}
      <mesh position={[0.45, -0.15, 0.45]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#ffb59a" roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  );
};

/**
 * The 3D Composition for Dashboard
 */
export const FloatingBooksMesh = () => {
  const groupRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useFrame((state) => {
    if (groupRef.current && !prefersReducedMotion) {
      const pointer = state.pointer;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.3,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.2,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Main Floating Book Stack */}
      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.35}>
        {/* Bottom Large Book (Teal) */}
        <Book
          color="#00685f"
          accentColor="#89f5e7"
          position={[0, -0.4, 0]}
          rotation={[0.1, 0.2, -0.05]}
          size={[2.1, 0.34, 1.5]}
        />

        {/* Middle Book (Navy/Secondary) */}
        <Book
          color="#384357"
          accentColor="#ffb59a"
          position={[0.05, -0.08, 0.05]}
          rotation={[-0.05, -0.15, 0.02]}
          size={[1.9, 0.3, 1.4]}
        />

        {/* Top Book (Mint Green / Bright) */}
        <Book
          color="#008378"
          accentColor="#ffffff"
          position={[-0.05, 0.22, -0.02]}
          rotation={[0.08, 0.35, -0.04]}
          size={[1.7, 0.28, 1.25]}
        />
      </Float>

      {/* Floating Document Sheet */}
      <Float speed={2.4} rotationIntensity={0.3} floatIntensity={0.5}>
        <FloatingDocument
          position={[1.3, 0.5, 0.4]}
          rotation={[-0.2, -0.4, 0.15]}
          scale={0.7}
          headerColor="#00685f"
        />
      </Float>

      {/* Floating Study Cap / Badge */}
      <Float speed={2.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <StudyBadge position={[-1.3, 0.7, 0.3]} />
      </Float>

      {/* Small Floating Note Sheet */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <RoundedBox
          args={[0.8, 0.8, 0.03]}
          radius={0.02}
          position={[-1.1, -0.3, 0.6]}
          rotation={[0.2, 0.4, -0.1]}
        >
          <meshStandardMaterial color="#ffdbce" roughness={0.4} />
        </RoundedBox>
      </Float>

      {/* Ground Soft Ambient Shadow Disk */}
      <mesh position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 1.6, 32]} />
        <meshBasicMaterial color="#00685f" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/**
 * Standalone Canvas Export for Dashboard Header
 */
export const FloatingBooks = ({ className = 'w-full h-48 md:h-56' }) => {
  return (
    <CanvasWrapper
      className={className}
      camera={{ position: [0, 0.4, 4.2], fov: 42 }}
      disableOnMobile={false}
      fallback={
        <div className="w-full h-full flex items-center justify-center text-primary/30">
          <span className="material-symbols-outlined text-5xl">auto_stories</span>
        </div>
      }
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 4]} intensity={1.3} />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#89f5e7" />
      <pointLight position={[0, -2, 2]} intensity={0.3} color="#ffdbce" />
      <FloatingBooksMesh />
    </CanvasWrapper>
  );
};
