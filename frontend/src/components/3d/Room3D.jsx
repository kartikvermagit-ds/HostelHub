import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { RoomLabel } from './RoomLabel';
import { useReducedMotion } from './useReducedMotion';

/**
 * Architectural 3D Hostel Room with Modular Walls, Recessed Doorway, Framed Windows,
 * Dynamic Door Opening Hinge, and Day/Night Status Lighting.
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
  const roomGroupRef = useRef();
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
  const isOccupied = status?.toLowerCase() === 'occupied';
  const isAvailable = status?.toLowerCase() === 'available';

  // Smooth door pivot opening when room is selected & smooth hover elevation
  useFrame((state, delta) => {
    // Door opening animation
    if (doorHingeRef.current) {
      const targetAngle = selected && !prefersReducedMotion ? -Math.PI / 2.2 : 0;
      doorHingeRef.current.rotation.y = THREE.MathUtils.damp(
        doorHingeRef.current.rotation.y,
        targetAngle,
        6,
        delta
      );
    }

    // Subtle hover elevation
    if (roomGroupRef.current && !prefersReducedMotion) {
      const targetElevation = (hovered || selected) ? 0.025 : 0;
      roomGroupRef.current.position.y = THREE.MathUtils.damp(
        roomGroupRef.current.position.y,
        targetElevation,
        8,
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

  // Subtle Status Accent Colors
  const getStatusLedColor = () => {
    switch (status?.toLowerCase()) {
      case 'available':
        return '#00a396'; // Subtle teal
      case 'maintenance':
        return '#f59e0b'; // Amber
      case 'reserved':
        return '#3b82f6'; // Blue
      case 'occupied':
      default:
        return '#64748b'; // Neutral slate
    }
  };

  // Scaled dimensions for sub-elements
  const [width, height, depth] = dimensions;
  const doorWidth = Math.min(width * 0.38, 0.44);
  const doorHeight = Math.min(height * 0.82, 0.68);
  const doorX = -width * 0.24;

  const windowWidth = Math.min(width * 0.42, 0.5);
  const windowHeight = Math.min(height * 0.54, 0.44);
  const windowX = width * 0.24;

  return (
    <group position={position}>
      <group ref={roomGroupRef}>
        {/* Interactive Mesh Container */}
        <group
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          {/* =================================================== */}
          {/* 1. MAIN ARCHITECTURAL ROOM BODY (Matte Plaster)     */}
          {/* =================================================== */}
          <RoundedBox args={dimensions} radius={0.025} smoothness={1} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={
                selected
                  ? isNight ? '#1e2d3d' : '#f0fdfa'
                  : hovered
                  ? isNight ? '#253347' : '#f1f5f9'
                  : isNight ? '#18212e' : '#f8fafc'
              }
              roughness={0.65}
              metalness={0.05}
              transparent={dimmed}
              opacity={dimmed ? 0.35 : 1}
            />
          </RoundedBox>

          {/* Selected / Hover Highlighting Outline */}
          {(hovered || selected) && (
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[width + 0.03, height + 0.03, depth + 0.03]} />
              <meshStandardMaterial
                color={selected ? '#89f5e7' : '#00a396'}
                emissive={selected ? '#00685f' : '#004d46'}
                emissiveIntensity={selected ? 0.75 : 0.25}
                wireframe
              />
            </mesh>
          )}

          {/* =================================================== */}
          {/* 2. FRONT CORRIDOR FACADE (Door + Window System)     */}
          {/* =================================================== */}
          <group position={[0, 0, depth / 2 + 0.005]}>
            {/* Front Wall Surface Finish */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[width - 0.02, height - 0.02]} />
              <meshStandardMaterial
                color={isNight ? '#1c2534' : '#f1f5f9'}
                roughness={0.6}
                transparent={dimmed}
                opacity={dimmed ? 0.35 : 1}
              />
            </mesh>

            {/* =================================================== */}
            {/* 3. RECESSED ENTRANCE DOORWAY (Corridor-facing)      */}
            {/* =================================================== */}
            <group position={[doorX, -height * 0.08, 0]}>
              {/* Outer Architectural Dark Frame */}
              <RoundedBox args={[doorWidth + 0.04, doorHeight + 0.04, 0.035]} radius={0.008} position={[0, 0, 0.005]}>
                <meshStandardMaterial
                  color={isNight ? '#0f141d' : '#1e293b'}
                  roughness={0.5}
                  metalness={0.2}
                  transparent={dimmed}
                  opacity={dimmed ? 0.35 : 1}
                />
              </RoundedBox>

              {/* Recessed Door Hinge Pivot */}
              <group ref={doorHingeRef} position={[-doorWidth / 2 + 0.02, 0, 0.015]}>
                {/* Door Leaf */}
                <RoundedBox args={[doorWidth - 0.03, doorHeight - 0.03, 0.02]} radius={0.008} position={[(doorWidth - 0.03) / 2, 0, 0]}>
                  <meshStandardMaterial
                    color={
                      selected
                        ? accentColor
                        : hovered
                        ? '#00685f'
                        : isNight
                        ? '#142028'
                        : '#005850'
                    }
                    emissive={isAvailable ? '#00685f' : '#000000'}
                    emissiveIntensity={isAvailable ? (isNight ? 0.35 : 0.1) : 0}
                    roughness={0.4}
                    metalness={0.15}
                    transparent={dimmed}
                    opacity={dimmed ? 0.35 : 1}
                  />
                </RoundedBox>

                {/* Brushed Metal Door Handle */}
                <mesh position={[doorWidth - 0.09, 0, 0.018]}>
                  <cylinderGeometry args={[0.012, 0.012, 0.08, 8]} />
                  <meshStandardMaterial color="#89f5e7" metalness={0.85} roughness={0.15} />
                </mesh>

                {/* Bottom Architectural Kickplate */}
                <mesh position={[(doorWidth - 0.03) / 2, -doorHeight / 2 + 0.06, 0.015]}>
                  <planeGeometry args={[doorWidth - 0.05, 0.06]} />
                  <meshStandardMaterial color="#89f5e7" metalness={0.7} roughness={0.3} />
                </mesh>
              </group>

              {/* Top Lintel LED Status Strip */}
              <mesh position={[0, doorHeight / 2 + 0.028, 0.02]}>
                <planeGeometry args={[doorWidth - 0.04, 0.02]} />
                <meshBasicMaterial color={getStatusLedColor()} />
              </mesh>
            </group>

            {/* =================================================== */}
            {/* 4. FRAMED ARCHITECTURAL WINDOW WITH MULLIONS & SILL */}
            {/* =================================================== */}
            <group position={[windowX, height * 0.08, 0.01]}>
              {/* Outer Window Frame */}
              <RoundedBox args={[windowWidth, windowHeight, 0.028]} radius={0.008} position={[0, 0, 0]}>
                <meshStandardMaterial
                  color={isNight ? '#111722' : '#334155'}
                  roughness={0.4}
                  metalness={0.2}
                  transparent={dimmed}
                  opacity={dimmed ? 0.35 : 1}
                />
              </RoundedBox>

              {/* Glass Pane with Day Sunlight / Night Warm Window Lighting */}
              <mesh position={[0, 0, 0.012]}>
                <planeGeometry args={[windowWidth - 0.05, windowHeight - 0.05]} />
                <meshStandardMaterial
                  color={isNight ? (isOccupied ? '#ffd8a8' : '#0b1d28') : '#e0f2fe'}
                  emissive={
                    isOccupied
                      ? isNight ? '#ffbe98' : '#89f5e7'
                      : isNight ? '#001815' : '#89f5e7'
                  }
                  emissiveIntensity={isNight ? (isOccupied ? 0.65 : 0.15) : 0.15}
                  roughness={0.12}
                  metalness={0.15}
                  transparent={dimmed}
                  opacity={dimmed ? 0.35 : 1}
                />
              </mesh>

              {/* Window Vertical Divider (Mullion) */}
              <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[0.016, windowHeight - 0.05]} />
                <meshBasicMaterial color="#1e293b" />
              </mesh>

              {/* Window Horizontal Divider (Transom Bar) */}
              <mesh position={[0, 0, 0.02]}>
                <planeGeometry args={[windowWidth - 0.05, 0.016]} />
                <meshBasicMaterial color="#1e293b" />
              </mesh>

              {/* Chamfered Window Sill Underneath */}
              <RoundedBox args={[windowWidth + 0.06, 0.022, 0.045]} radius={0.004} position={[0, -windowHeight / 2 - 0.015, 0.02]}>
                <meshStandardMaterial color={isNight ? '#222d3d' : '#cbd5e1'} roughness={0.5} />
              </RoundedBox>
            </group>
          </group>
        </group>

        {/* =================================================== */}
        {/* 5. ROOM NUMBER PLAQUE (Strictly Above the Door!)    */}
        {/* =================================================== */}
        <RoomLabel
          roomNumber={roomNumber}
          status={status}
          roomType={roomType}
          branch={branch}
          hovered={hovered}
          selected={selected}
          dimmed={dimmed}
          position={[doorX, height / 2 + 0.11, depth / 2 + 0.06]}
        />
      </group>
    </group>
  );
};
