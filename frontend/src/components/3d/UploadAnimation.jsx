import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasWrapper } from './CanvasWrapper';
import { useReducedMotion } from './useReducedMotion';

/**
 * 3D Low-Poly Cloud Mesh
 */
const CloudMesh = ({ position = [0, 1.2, 0], scale = 1, active = false }) => {
  const cloudRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useFrame((state) => {
    if (cloudRef.current && !prefersReducedMotion) {
      cloudRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      if (active) {
        cloudRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  return (
    <group ref={cloudRef} position={position} scale={scale}>
      {/* Central Cloud Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial
          color={active ? '#89f5e7' : '#ffffff'}
          roughness={0.2}
          metalness={0.1}
          emissive={active ? '#00685f' : '#000000'}
          emissiveIntensity={active ? 0.4 : 0}
        />
      </mesh>
      {/* Left Puff */}
      <mesh position={[-0.55, -0.1, 0.1]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={active ? '#89f5e7' : '#ffffff'}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      {/* Right Puff */}
      <mesh position={[0.55, -0.15, 0.05]}>
        <sphereGeometry args={[0.48, 16, 16]} />
        <meshStandardMaterial
          color={active ? '#89f5e7' : '#ffffff'}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      {/* Top Puff */}
      <mesh position={[0.15, 0.35, -0.05]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial
          color={active ? '#89f5e7' : '#ffffff'}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};

/**
 * 3D Upload File Document with dynamic upload progress animation
 */
const AnimatedUploadDocument = ({ uploadState = 'idle' }) => {
  const docRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (!docRef.current) return;

    if (uploadState === 'idle') {
      // Resting subtle float
      docRef.current.position.y = -0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      docRef.current.position.z = 0.2;
      docRef.current.rotation.x = 0.1;
      docRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
      docRef.current.scale.set(1, 1, 1);
    } else if (uploadState === 'uploading') {
      // Moves smoothly upward toward the cloud and shrinks slightly
      if (prefersReducedMotion) {
        docRef.current.position.y = 0.8;
      } else {
        docRef.current.position.y = THREE.MathUtils.lerp(docRef.current.position.y, 1.1, delta * 3);
        docRef.current.rotation.y += delta * 4;
        docRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 6) * 0.2;
        const currentScale = docRef.current.scale.x;
        const targetScale = THREE.MathUtils.lerp(currentScale, 0.4, delta * 2.5);
        docRef.current.scale.set(targetScale, targetScale, targetScale);
      }
    } else if (uploadState === 'success') {
      // Disappears into cloud, glowing success state
      docRef.current.scale.set(0, 0, 0);
    }
  });

  return (
    <group ref={docRef} position={[0, -0.4, 0.2]}>
      {/* 3D Paper Sheet */}
      <RoundedBox args={[1.0, 1.3, 0.04]} radius={0.03} smoothness={3} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.05} />
      </RoundedBox>

      {/* Header Teal Stripe */}
      <RoundedBox args={[0.88, 0.22, 0.02]} radius={0.02} position={[0, 0.44, 0.025]}>
        <meshStandardMaterial color="#00685f" roughness={0.2} metalness={0.2} />
      </RoundedBox>

      {/* Text Lines */}
      {[-0.05, -0.2, -0.35].map((y, i) => (
        <RoundedBox
          key={i}
          args={[i === 2 ? 0.5 : 0.8, 0.04, 0.01]}
          radius={0.01}
          position={[i === 2 ? -0.15 : 0, y, 0.025]}
        >
          <meshStandardMaterial color="#dce2f3" roughness={0.4} />
        </RoundedBox>
      ))}
    </group>
  );
};

/**
 * 3D Success Checkmark Orb
 */
const SuccessOrb = ({ visible = false }) => {
  const orbRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (!orbRef.current) return;
    if (visible) {
      orbRef.current.scale.x = THREE.MathUtils.lerp(orbRef.current.scale.x, 1, delta * 5);
      orbRef.current.scale.y = orbRef.current.scale.x;
      orbRef.current.scale.z = orbRef.current.scale.x;
      if (!prefersReducedMotion) {
        orbRef.current.rotation.y += delta * 2;
      }
    } else {
      orbRef.current.scale.set(0, 0, 0);
    }
  });

  return (
    <group ref={orbRef} position={[0, 0.2, 0.5]} scale={[0, 0, 0]}>
      {/* Glowing Sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#00685f"
          emissive="#89f5e7"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>
      {/* Outer Pulse Ring */}
      <mesh rotation={[-Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.7, 0.04, 16, 32]} />
        <meshStandardMaterial
          color="#89f5e7"
          emissive="#89f5e7"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};

/**
 * Full 3D Upload Scene
 */
export const UploadAnimationScene = ({ uploadState = 'idle' }) => {
  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.3} />
      <directionalLight position={[-3, -1, -2]} intensity={0.4} color="#89f5e7" />
      <pointLight position={[0, 1, 2]} intensity={uploadState === 'success' ? 0.8 : 0.2} color="#89f5e7" />

      {/* Cloud Anchor */}
      <CloudMesh
        position={[0, 0.7, 0]}
        scale={0.9}
        active={uploadState === 'uploading' || uploadState === 'success'}
      />

      {/* Uploading Document */}
      <AnimatedUploadDocument uploadState={uploadState} />

      {/* Success Badge */}
      <SuccessOrb visible={uploadState === 'success'} />
    </>
  );
};

/**
 * Standalone Canvas Export for Upload Component
 */
export const UploadAnimation = ({
  uploadState = 'idle',
  className = 'w-full h-44',
  fileName = null
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <CanvasWrapper
        className={className}
        camera={{ position: [0, 0.2, 3.4], fov: 45 }}
        disableOnMobile={false}
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center text-primary">
            <span className="material-symbols-outlined text-4xl animate-bounce">
              {uploadState === 'success' ? 'check_circle' : 'cloud_upload'}
            </span>
          </div>
        }
      >
        <UploadAnimationScene uploadState={uploadState} />
      </CanvasWrapper>
      {fileName && (
        <div className="text-center -mt-2 mb-2 px-4 py-1 rounded-full bg-surface-container border border-surface-border text-xs font-semibold text-on-surface truncate max-w-[280px]">
          {fileName}
        </div>
      )}
    </div>
  );
};
