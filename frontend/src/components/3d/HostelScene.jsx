import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasWrapper } from './CanvasWrapper';
import { FloatingDocument } from './FloatingDocument';
import { useReducedMotion } from './useReducedMotion';

/**
 * Low-Poly Modern 3D Hostel Building
 */
const HostelBuilding = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      {/* Main Building Body */}
      <RoundedBox args={[1.8, 2.2, 1.4]} radius={0.06} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#f4f6fa"
          roughness={0.4}
          metalness={0.05}
        />
      </RoundedBox>

      {/* Modern Roof / Top Tier with Teal Trim */}
      <RoundedBox args={[1.9, 0.15, 1.5]} radius={0.03} smoothness={3} position={[0, 1.15, 0]}>
        <meshStandardMaterial
          color="#00685f"
          roughness={0.2}
          metalness={0.2}
        />
      </RoundedBox>

      {/* Roof Penthouse / Solar Hub */}
      <RoundedBox args={[0.9, 0.4, 0.8]} radius={0.04} smoothness={3} position={[-0.2, 1.35, 0]}>
        <meshStandardMaterial
          color="#384357"
          roughness={0.3}
        />
      </RoundedBox>

      {/* Building Windows Grid (Front face: z = 0.71) */}
      {[-0.5, 0, 0.5].map((x) =>
        [0.6, 0.1, -0.4].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.71]}>
            <planeGeometry args={[0.26, 0.32]} />
            <meshStandardMaterial
              color={(x === 0 && y === 0.1) || (x === 0.5 && y === 0.6) ? '#89f5e7' : '#dce2f7'}
              emissive={(x === 0 && y === 0.1) || (x === 0.5 && y === 0.6) ? '#00685f' : '#000000'}
              emissiveIntensity={0.5}
              roughness={0.2}
            />
          </mesh>
        ))
      )}

      {/* Entrance Doorway */}
      <RoundedBox args={[0.42, 0.6, 0.05]} radius={0.02} position={[0, -0.8, 0.72]}>
        <meshStandardMaterial
          color="#00685f"
          roughness={0.3}
        />
      </RoundedBox>

      {/* Entrance Canopy */}
      <RoundedBox args={[0.6, 0.06, 0.3]} radius={0.01} position={[0, -0.48, 0.84]}>
        <meshStandardMaterial
          color="#89f5e7"
          roughness={0.2}
          metalness={0.3}
        />
      </RoundedBox>

      {/* Base Foundation */}
      <RoundedBox args={[2.1, 0.15, 1.7]} radius={0.04} position={[0, -1.15, 0]}>
        <meshStandardMaterial
          color="#dce2f3"
          roughness={0.5}
        />
      </RoundedBox>
    </group>
  );
};

/**
 * 3D Laptop with Glowing Screen
 */
const StudyLaptop = ({ position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation} scale={0.65}>
      {/* Keyboard Base */}
      <RoundedBox args={[1.2, 0.05, 0.85]} radius={0.02} smoothness={3} position={[0, 0, 0]}>
        <meshStandardMaterial color="#404754" roughness={0.3} metalness={0.5} />
      </RoundedBox>
      {/* Keyboard Trackpad & Keys */}
      <mesh position={[0, 0.03, 0.2]}>
        <planeGeometry args={[0.4, 0.25]} />
        <meshStandardMaterial color="#2d3340" />
      </mesh>
      {/* Screen Lid (Opened at 105 degrees) */}
      <group position={[0, 0.025, -0.425]} rotation={[-Math.PI / 2.8, 0, 0]}>
        <RoundedBox args={[1.2, 0.8, 0.04]} radius={0.02} smoothness={3} position={[0, 0.4, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.3} metalness={0.5} />
        </RoundedBox>
        {/* Glowing Screen Display */}
        <mesh position={[0, 0.4, 0.025]}>
          <planeGeometry args={[1.1, 0.7]} />
          <meshStandardMaterial
            color="#008378"
            emissive="#00685f"
            emissiveIntensity={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Code / HostelHub line accents on screen */}
        <mesh position={[-0.2, 0.5, 0.03]}>
          <planeGeometry args={[0.5, 0.04]} />
          <meshBasicMaterial color="#89f5e7" />
        </mesh>
        <mesh position={[-0.1, 0.4, 0.03]}>
          <planeGeometry args={[0.7, 0.04]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-0.25, 0.3, 0.03]}>
          <planeGeometry args={[0.4, 0.04]} />
          <meshBasicMaterial color="#ffdbce" />
        </mesh>
      </group>
    </group>
  );
};

/**
 * 3D Composition for Hostel Login Scene
 */
export const HostelSceneMesh = () => {
  const groupRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useFrame((state) => {
    if (groupRef.current && !prefersReducedMotion) {
      const pointer = state.pointer;
      // Parallax rotation
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.25 + 0.35,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.15 + 0.12,
        0.04
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      {/* Central Modern Hostel Building */}
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.15}>
        <HostelBuilding position={[-0.6, 0.1, -0.4]} />
      </Float>

      {/* Floating Laptop */}
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.35}>
        <StudyLaptop position={[1.1, -0.4, 0.6]} rotation={[0.15, -0.5, 0.05]} />
      </Float>

      {/* Floating Lecture Document */}
      <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.4}>
        <FloatingDocument
          position={[1.2, 0.7, 0.2]}
          rotation={[-0.2, -0.4, 0.1]}
          scale={0.65}
          headerColor="#00685f"
        />
      </Float>

      {/* Floating Study Hardcover Book */}
      <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.3}>
        <RoundedBox
          args={[1.1, 0.18, 0.8]}
          radius={0.03}
          position={[-1.3, -0.6, 0.8]}
          rotation={[0.1, 0.4, -0.1]}
        >
          <meshStandardMaterial color="#008378" roughness={0.3} metalness={0.2} />
        </RoundedBox>
      </Float>

      {/* Floating Resource Orb with Teal Glow */}
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh position={[-1.3, 0.9, 0.3]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#89f5e7"
            emissive="#00685f"
            emissiveIntensity={0.4}
            roughness={0.2}
          />
        </mesh>
      </Float>

      {/* Ambient Floor Shadow Disk */}
      <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 2.4, 32]} />
        <meshBasicMaterial color="#00685f" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/**
 * Standalone Canvas Export for Login Page
 */
export const HostelScene = ({ className = 'w-full h-64 sm:h-72' }) => {
  return (
    <CanvasWrapper
      className={className}
      camera={{ position: [0, 0.5, 4.8], fov: 42 }}
      disableOnMobile={true}
      fallback={
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">apartment</span>
          </div>
        </div>
      }
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#89f5e7" />
      <pointLight position={[1, 1, 3]} intensity={0.4} color="#f4fffc" />
      <HostelSceneMesh />
    </CanvasWrapper>
  );
};
