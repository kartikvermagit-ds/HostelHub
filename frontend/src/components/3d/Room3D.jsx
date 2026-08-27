import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { RoomLabel } from './RoomLabel';
import { useReducedMotion } from './useReducedMotion';

/**
 * Modular 3D Hostel Room with Recessed Door, Framed Windows, Animated Door Opening, and Status Lighting
 */
export const Room3D = ({
  roomData,
  selected = false,
  onSelectRoom = () => {},
  accentColor = '#00685f',
  dimmed = false,
  lightingMode = 'day'
}) => {
  const [hovered, setHovered] = useState(false);
  const doorHingeRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  const {
    id,
    roomNumber = '101',
    status = 'available',
    roomType = 'Single',
    branch = '',
    position = [0, 0.52, 0.45],
    dimensions = [1.32, 0.82, 1.05]
  } = roomData;

  const isNight = lightingMode === 'night';

  // Smooth door pivot opening when room is selected
  useFrame((state, delta) => {
    if (doorHingeRef.current) {
      const targetAngle = selected && !prefersReducedMotion ? -Math.PI / 2.3 : 0;
      doorHingeRef.current.rotation.y = THREE.MathUtils.damp(
        doorHingeRef.current.rotation.y,
        targetAngle,
        6,
        delta
      );
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onSelectRoom(roomData);
  };

  const getStatusLightColor = () => {
    switch (status?.toLowerCase()) {
      case 'available':
        return '#008378';
      case 'maintenance':
        return '#f59e0b';
      case 'reserved':
        return '#3b82f6';
      case 'occupied':
      default:
        return '#64748b';
    }
  };

  const isAvailable = status?.toLowerCase() === 'available';

  return (
    <group position={position}>
      {/* Interactive Mesh Container */}
      <group
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {/* Main Room Outer Shell Cube */}
        <RoundedBox args={dimensions} radius={0.03} smoothness={3} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={
              selected
                ? isNight ? '#1e2d3d' : '#f0fdfa'
                : hovered
                ? isNight ? '#253347' : '#f1f5f9'
                : isNight ? '#1b2330' : '#ffffff'
            }
            roughness={0.35}
            metalness={0.05}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </RoundedBox>

        {/* Selected / Hover Highlighting Outline */}
        {(hovered || selected) && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[dimensions[0] + 0.04, dimensions[1] + 0.04, dimensions[2] + 0.04]} />
            <meshStandardMaterial
              color={selected ? '#89f5e7' : '#008378'}
              emissive={selected ? '#00685f' : '#004d46'}
              emissiveIntensity={selected ? 0.8 : 0.3}
              wireframe
            />
          </mesh>
        )}

        {/* =================================================== */}
        {/* FRONT ROOM FACADE (Recessed Door + Framed Window)   */}
        {/* =================================================== */}
        <group position={[0, 0, dimensions[2] / 2 + 0.01]}>
          {/* Front Wall Panel */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[dimensions[0] - 0.04, dimensions[1] - 0.04]} />
            <meshStandardMaterial
              color={isNight ? '#1f2838' : '#f8fafc'}
              roughness={0.4}
              transparent={dimmed}
              opacity={dimmed ? 0.35 : 1}
            />
          </mesh>

          {/* Recessed Door Frame & Door (Left Side) */}
          <group position={[-0.32, -0.05, 0]}>
            {/* Outer Dark Wooden/Metallic Door Frame */}
            <RoundedBox args={[0.44, 0.68, 0.03]} radius={0.01} position={[0, 0, 0.005]}>
              <meshStandardMaterial
                color={isNight ? '#131924' : '#1e293b'}
                roughness={0.5}
                transparent={dimmed}
                opacity={dimmed ? 0.35 : 1}
              />
            </RoundedBox>

            {/* Recessed Door Hinge Pivot (Rotates open when selected!) */}
            <group ref={doorHingeRef} position={[-0.18, 0, 0.015]}>
              {/* Door Leaf */}
              <RoundedBox args={[0.38, 0.62, 0.02]} radius={0.01} position={[0.19, 0, 0]}>
                <meshStandardMaterial
                  color={
                    selected
                      ? accentColor
                      : hovered
                      ? '#00685f'
                      : isNight
                      ? '#0f2924'
                      : '#005b53'
                  }
                  emissive={isAvailable ? '#00685f' : '#000000'}
                  emissiveIntensity={isAvailable ? (isNight ? 0.4 : 0.15) : 0}
                  roughness={0.3}
                  transparent={dimmed}
                  opacity={dimmed ? 0.35 : 1}
                />
              </RoundedBox>

              {/* Door Handle */}
              <mesh position={[0.32, 0, 0.018]}>
                <sphereGeometry args={[0.018, 12, 12]} />
                <meshStandardMaterial color="#89f5e7" metalness={0.9} roughness={0.1} />
              </mesh>

              {/* Bottom Kickplate */}
              <mesh position={[0.19, -0.26, 0.015]}>
                <planeGeometry args={[0.34, 0.06]} />
                <meshStandardMaterial color="#89f5e7" metalness={0.7} roughness={0.3} />
              </mesh>
            </group>

            {/* Top Lintel LED Status Strip */}
            <mesh position={[0, 0.32, 0.02]}>
              <planeGeometry args={[0.36, 0.025]} />
              <meshBasicMaterial color={getStatusLightColor()} />
            </mesh>
          </group>

          {/* Framed Window with Cross Panes & Glass (Right Side) */}
          <group position={[0.32, 0.06, 0.01]}>
            {/* Outer Window Frame */}
            <RoundedBox args={[0.48, 0.44, 0.025]} radius={0.01} position={[0, 0, 0]}>
              <meshStandardMaterial
                color={isNight ? '#131924' : '#334155'}
                roughness={0.4}
                transparent={dimmed}
                opacity={dimmed ? 0.35 : 1}
              />
            </RoundedBox>

            {/* Glass Pane with Interior Glow */}
            <mesh position={[0, 0, 0.015]}>
              <planeGeometry args={[0.42, 0.38]} />
              <meshStandardMaterial
                color={isNight ? '#0b1d28' : '#e0f2fe'}
                emissive={
                  status === 'occupied'
                    ? isNight ? '#ffbe98' : '#89f5e7'
                    : isNight ? '#003830' : '#89f5e7'
                }
                emissiveIntensity={isNight ? (status === 'occupied' ? 0.7 : 0.3) : 0.2}
                roughness={0.1}
                metalness={0.2}
                transparent={dimmed}
                opacity={dimmed ? 0.35 : 1}
              />
            </mesh>

            {/* Window Mullions / Cross Frame */}
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[0.42, 0.018]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[0.018, 0.38]} />
              <meshBasicMaterial color="#1e293b" />
            </mesh>

            {/* Exterior Window Sill */}
            <RoundedBox args={[0.52, 0.02, 0.05]} radius={0.005} position={[0, -0.22, 0.02]}>
              <meshStandardMaterial color={isNight ? '#222d3d' : '#cbd5e1'} roughness={0.5} />
            </RoundedBox>
          </group>
        </group>
      </group>

      {/* 3D Room Number Plaque (Positioned precisely over the room door) */}
      <RoomLabel
        roomNumber={roomNumber}
        status={status}
        roomType={roomType}
        branch={branch}
        hovered={hovered}
        selected={selected}
        position={[-0.32, dimensions[1] / 2 + 0.12, dimensions[2] / 2 + 0.06]}
      />
    </group>
  );
};

