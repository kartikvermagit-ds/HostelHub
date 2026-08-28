import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasWrapper } from './CanvasWrapper';
import { useReducedMotion } from './useReducedMotion';

/**
 * Premium Architectural 3D HostelHub "H" Logo Mesh
 * Features solid 3D depth, inset crossbar, subtle edge highlights, mouse parallax tilt,
 * gentle floating, and interactive hover glow.
 */
export const Logo3DMesh = ({
  scale = 1,
  color = '#00685f',
  accentColor = '#89f5e7',
  isHoverable = true
}) => {
  const groupRef = useRef();
  const innerRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Intro animation timer
  const introStartTime = useRef(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (prefersReducedMotion) {
      groupRef.current.scale.set(scale, scale, scale);
      groupRef.current.position.set(0, 0, 0);
      groupRef.current.rotation.set(0, 0, 0);
      return;
    }

    if (introStartTime.current === null) {
      introStartTime.current = state.clock.elapsedTime;
    }

    const elapsedIntro = state.clock.elapsedTime - introStartTime.current;
    const introProgress = THREE.MathUtils.clamp(elapsedIntro / 0.85, 0, 1);
    // Smooth ease-out cubic
    const easedIntro = 1 - Math.pow(1 - introProgress, 3);

    // Target hover scale multiplier
    const targetHoverScale = hovered ? 1.05 : 1.0;
    const currentScale = scale * easedIntro * targetHoverScale;
    groupRef.current.scale.set(
      THREE.MathUtils.damp(groupRef.current.scale.x, currentScale, 6, delta),
      THREE.MathUtils.damp(groupRef.current.scale.y, currentScale, 6, delta),
      THREE.MathUtils.damp(groupRef.current.scale.z, currentScale, 6, delta)
    );

    // Gentle float & intro elevation
    const floatY = Math.sin(state.clock.elapsedTime * 1.6) * 0.04;
    const introY = THREE.MathUtils.lerp(-0.25, 0, easedIntro);
    groupRef.current.position.y = introY + floatY;

    // Slow continuous rotation + mouse parallax tilt
    const pointer = state.pointer;
    const rotSpeed = hovered ? 0.6 : 0.35;
    if (innerRef.current) {
      innerRef.current.rotation.y += delta * rotSpeed;
      // Parallax tilt towards pointer
      const targetTiltX = -pointer.y * 0.08;
      const targetTiltZ = pointer.x * 0.06;
      innerRef.current.rotation.x = THREE.MathUtils.damp(innerRef.current.rotation.x, targetTiltX, 4, delta);
      innerRef.current.rotation.z = THREE.MathUtils.damp(innerRef.current.rotation.z, targetTiltZ, 4, delta);
    }

    // Gentle pulsing ring
    if (ringRef.current) {
      const ringPulse = 0.15 + Math.sin(state.clock.elapsedTime * 2.2) * 0.05;
      ringRef.current.material.opacity = hovered ? ringPulse * 1.8 : ringPulse;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        if (!isHoverable) return;
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        if (!isHoverable) return;
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <group ref={innerRef}>
        {/* =================================================== */}
        {/* 1. LEFT ARCHITECTURAL PILLAR                        */}
        {/* =================================================== */}
        <group position={[-0.46, 0, 0]}>
          {/* Main Pillar Body */}
          <RoundedBox args={[0.34, 1.42, 0.34]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={color}
              roughness={0.25}
              metalness={0.2}
              envMapIntensity={1.2}
            />
          </RoundedBox>

          {/* Front Architectural Inset Trim */}
          <mesh position={[0, 0, 0.172]}>
            <planeGeometry args={[0.22, 1.26]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={hovered ? 0.35 : 0.12}
              roughness={0.2}
            />
          </mesh>

          {/* Top Architectural Coping Bevel */}
          <RoundedBox args={[0.36, 0.04, 0.36]} radius={0.015} position={[0, 0.72, 0]}>
            <meshStandardMaterial color="#004d46" roughness={0.3} metalness={0.3} />
          </RoundedBox>
        </group>

        {/* =================================================== */}
        {/* 2. RIGHT ARCHITECTURAL PILLAR                       */}
        {/* =================================================== */}
        <group position={[0.46, 0, 0]}>
          {/* Main Pillar Body */}
          <RoundedBox args={[0.34, 1.42, 0.34]} radius={0.05} smoothness={4} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={color}
              roughness={0.25}
              metalness={0.2}
              envMapIntensity={1.2}
            />
          </RoundedBox>

          {/* Front Architectural Inset Trim */}
          <mesh position={[0, 0, 0.172]}>
            <planeGeometry args={[0.22, 1.26]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={hovered ? 0.35 : 0.12}
              roughness={0.2}
            />
          </mesh>

          {/* Top Architectural Coping Bevel */}
          <RoundedBox args={[0.36, 0.04, 0.36]} radius={0.015} position={[0, 0.72, 0]}>
            <meshStandardMaterial color="#004d46" roughness={0.3} metalness={0.3} />
          </RoundedBox>
        </group>

        {/* =================================================== */}
        {/* 3. INTEGRATED INSET CROSSBAR                        */}
        {/* =================================================== */}
        <group position={[0, 0, 0]}>
          {/* Core Crossbar linking the pillars */}
          <RoundedBox args={[0.62, 0.32, 0.3]} radius={0.04} smoothness={4} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={accentColor}
              emissive={color}
              emissiveIntensity={hovered ? 0.45 : 0.2}
              roughness={0.18}
              metalness={0.35}
            />
          </RoundedBox>

          {/* Top & Bottom Accent Accentuation Bevels */}
          <mesh position={[0, 0.162, 0]}>
            <planeGeometry args={[0.56, 0.28]} />
            <meshStandardMaterial color="#89f5e7" roughness={0.1} metalness={0.5} />
          </mesh>
          <mesh position={[0, -0.162, 0]} rotation={[Math.PI, 0, 0]}>
            <planeGeometry args={[0.56, 0.28]} />
            <meshStandardMaterial color="#004d46" roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* =================================================== */}
      {/* 4. SOFT GROUND SHADOW & AMBIENT HALO GLOW           */}
      {/* =================================================== */}
      <mesh
        ref={ringRef}
        position={[0, -0.82, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.35, 0.78, 32]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Soft Center Contact Shadow */}
      <mesh position={[0, -0.83, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 32]} />
        <meshBasicMaterial
          color="#001815"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

/**
 * Standalone 3D Logo Scene with Canvas & Cinematic 3-Point Lighting
 */
export const Logo3D = ({ className = 'w-16 h-16', scale = 1.2 }) => {
  return (
    <CanvasWrapper
      className={className}
      camera={{ position: [0, 0, 3.2], fov: 38 }}
      disableOnMobile={false}
      fallback={
        <img
          src="/logo-icon.png"
          alt="HostelHub Logo"
          className="w-full h-full object-contain drop-shadow-md rounded-xl"
        />
      }
    >
      {/* Soft Cinematic 3-Point Lighting Setup */}
      <ambientLight intensity={0.85} />
      <directionalLight position={[3.5, 4.5, 3.5]} intensity={1.3} />
      <directionalLight position={[-3.5, -2, -2.5]} intensity={0.4} color="#89f5e7" />
      <pointLight position={[0, -1.2, 1.5]} intensity={0.5} color="#89f5e7" distance={4} />

      <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.35}>
        <Logo3DMesh scale={scale} />
      </Float>
    </CanvasWrapper>
  );
};

/**
 * Upgraded 3D Loading Spinner with Animated Progress Ring & Dynamic Messages
 */
export const LoadingSpinner3D = ({ message = 'Loading resources...' }) => {
  const prefersReducedMotion = useReducedMotion();
  const ringRef = useRef();

  // Gentle rotating progress ring around the 3D H
  const SpinnerScene = () => {
    useFrame((state, delta) => {
      if (ringRef.current && !prefersReducedMotion) {
        ringRef.current.rotation.z -= delta * 2.4;
      }
    });

    return (
      <group position={[0, 0, 0]}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 2]} intensity={1.3} />
        <pointLight position={[-2, 1, 2]} intensity={0.6} color="#89f5e7" />

        <Logo3DMesh scale={0.95} isHoverable={false} />

        {/* Orbiting Circular Progress Ring */}
        <group ref={ringRef} position={[0, 0, 0.05]}>
          <mesh>
            <ringGeometry args={[0.92, 0.98, 48, 1, 0, Math.PI * 1.4]} />
            <meshBasicMaterial
              color="#89f5e7"
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI]}>
            <ringGeometry args={[0.92, 0.98, 48, 1, 0, Math.PI * 0.5]} />
            <meshBasicMaterial
              color="#00685f"
              side={THREE.DoubleSide}
              transparent
              opacity={0.5}
            />
          </mesh>
        </group>
      </group>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="w-28 h-28 relative">
        <CanvasWrapper
          camera={{ position: [0, 0, 3.4], fov: 40 }}
          disableOnMobile={false}
          fallback={
            <img
              src="/logo-icon.png"
              alt="HostelHub Logo"
              className="w-12 h-12 object-contain animate-pulse drop-shadow-md rounded-xl"
            />
          }
        >
          <SpinnerScene />
        </CanvasWrapper>
      </div>
      {message && (
        <p className="font-label-md text-xs sm:text-sm text-on-surface-variant font-semibold animate-pulse tracking-wide text-center">
          {message}
        </p>
      )}
    </div>
  );
};
