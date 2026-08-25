import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Floor3D } from './Floor3D';
import { useReducedMotion } from './useReducedMotion';

/**
 * Procedural Dynamic 3D Hostel Building
 * Automatically scales, stacks floors, and generates room positions based on database/store data!
 */
export const Building3D = ({
  hostelData,
  selectedFloorNumber = null,
  selectedRoomId = null,
  onSelectRoom = () => {},
  emergenceProgress = 1
}) => {
  const buildingRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  const {
    name = 'Hostel 4',
    floors = [],
    accentColor = '#00685f'
  } = hostelData;

  const totalFloors = floors.length || 1;

  // Calculate building width based on maximum rooms on any floor
  const maxRoomsOnAnyFloor = useMemo(() => {
    return Math.max(...floors.map((f) => f.rooms?.length || 0), 3);
  }, [floors]);

  const buildingWidth = Math.max(maxRoomsOnAnyFloor * 1.35 + 1.2, 5.2);
  const buildingDepth = 2.4;
  const floorHeight = 0.95;

  useFrame(() => {
    if (buildingRef.current) {
      const progress = prefersReducedMotion ? 1 : emergenceProgress;
      const easedScale = THREE.MathUtils.clamp(progress, 0, 1);
      buildingRef.current.scale.set(easedScale, easedScale, easedScale);
    }
  });

  return (
    <group ref={buildingRef} position={[0, -0.6, 0]}>
      {/* Ground Foundation Slab / Green Courtyard Base */}
      <group position={[0, 0.05, 0.4]}>
        {/* Foundation Base Concrete */}
        <RoundedBox args={[buildingWidth + 1.0, 0.12, buildingDepth + 1.2]} radius={0.04} position={[0, 0, 0]}>
          <meshStandardMaterial color="#c0c7d6" roughness={0.6} />
        </RoundedBox>

        {/* Landscaped Grass Verge */}
        <RoundedBox args={[buildingWidth + 0.8, 0.04, buildingDepth + 1.0]} radius={0.03} position={[0, 0.08, 0]}>
          <meshStandardMaterial color="#2d4a3e" roughness={0.8} />
        </RoundedBox>

        {/* Small Garden Shrubs / Bollard Lights (Front border) */}
        {[-buildingWidth / 2 + 0.4, -buildingWidth / 4, 0, buildingWidth / 4, buildingWidth / 2 - 0.4].map((x, i) => (
          <group key={i} position={[x, 0.15, buildingDepth / 2 + 0.35]}>
            {/* Bollard Light Post */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} />
              <meshStandardMaterial color="#141b2b" metalness={0.8} />
            </mesh>
            {/* Glowing Amber Lamp Cap */}
            <mesh position={[0, 0.18, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial
                color="#ffdbce"
                emissive="#ffb59a"
                emissiveIntensity={0.9}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Main Entrance Porch with Pillars & Canopy */}
      <group position={[0, 0.1, buildingDepth / 2 + 0.3]}>
        {/* Steps */}
        <RoundedBox args={[1.8, 0.06, 0.5]} radius={0.01} position={[0, 0, 0.15]}>
          <meshStandardMaterial color="#384357" roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[1.6, 0.06, 0.4]} radius={0.01} position={[0, 0.06, 0.05]}>
          <meshStandardMaterial color="#00685f" roughness={0.3} />
        </RoundedBox>

        {/* Entrance Columns */}
        {[-0.7, 0.7].map((x, idx) => (
          <mesh key={idx} position={[x, 0.42, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.72, 12]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Canopy Glass Roof */}
        <RoundedBox args={[1.9, 0.06, 0.75]} radius={0.02} position={[0, 0.8, 0.05]}>
          <meshStandardMaterial
            color="#89f5e7"
            emissive="#00685f"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.3}
          />
        </RoundedBox>
      </group>

      {/* Dynamic Stacking of Floors */}
      {floors.map((floor, floorIndex) => {
        const floorNum = floor.floorNumber || floorIndex + 1;
        const isIsolated = selectedFloorNumber !== null && selectedFloorNumber !== floorNum;

        return (
          <Floor3D
            key={floor.id || `floor-${floorNum}`}
            floorData={floor}
            floorIndex={floorIndex}
            buildingWidth={buildingWidth}
            buildingDepth={buildingDepth}
            floorHeight={floorHeight}
            selectedRoomId={selectedRoomId}
            onSelectRoom={onSelectRoom}
            accentColor={accentColor}
            dimmed={isIsolated}
          />
        );
      })}

      {/* Building Modern Rooftop */}
      <group position={[0, totalFloors * floorHeight + 0.1, 0.4]}>
        {/* Main Roof Parapet Plate */}
        <RoundedBox args={[buildingWidth + 0.2, 0.14, buildingDepth + 0.4]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial color="#004d46" roughness={0.3} metalness={0.3} />
        </RoundedBox>

        {/* Parapet Railing / Border */}
        <RoundedBox args={[buildingWidth + 0.16, 0.12, 0.04]} radius={0.01} position={[0, 0.12, buildingDepth / 2 + 0.18]}>
          <meshStandardMaterial color="#00685f" roughness={0.4} />
        </RoundedBox>

        {/* DYNAMIC ILLUMINATED ACRYLIC HOSTEL NAME SIGN */}
        <group position={[0, 0.45, buildingDepth / 2 + 0.18]}>
          {/* Sign Backplate */}
          <RoundedBox args={[Math.max(name.length * 0.26 + 1.2, 2.6), 0.48, 0.08]} radius={0.04} position={[0, 0, 0]}>
            <meshStandardMaterial color="#00201d" roughness={0.2} metalness={0.5} />
          </RoundedBox>

          {/* Glowing Acrylic Front Board */}
          <RoundedBox args={[Math.max(name.length * 0.26 + 1.0, 2.4), 0.4, 0.02]} radius={0.02} position={[0, 0, 0.045]}>
            <meshStandardMaterial
              color="#00685f"
              emissive="#008378"
              emissiveIntensity={0.6}
              roughness={0.1}
            />
          </RoundedBox>

          {/* Dynamic 3D Text of Hostel Name */}
          <Text
            position={[0, 0, 0.065]}
            fontSize={0.22}
            color="#89f5e7"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
          >
            {name.toUpperCase()}
          </Text>

          {/* Sign Top Accent Neon Glow Bar */}
          <RoundedBox args={[Math.max(name.length * 0.26 + 1.0, 2.4), 0.02, 0.02]} radius={0.01} position={[0, 0.22, 0.05]}>
            <meshStandardMaterial color="#89f5e7" emissive="#89f5e7" emissiveIntensity={1.2} />
          </RoundedBox>
        </group>


        {/* Rooftop Solar Panels */}
        <group position={[-buildingWidth / 3.2, 0.12, 0]} rotation={[0.12, 0, 0]}>
          <RoundedBox args={[1.8, 0.04, 1.2]} radius={0.01} position={[0, 0, 0]}>
            <meshStandardMaterial color="#141b2b" metalness={0.9} roughness={0.1} />
          </RoundedBox>
        </group>

        {/* Rooftop Water Reservoir Tank */}
        <group position={[buildingWidth / 3.2, 0.25, -0.2]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.55, 20]} />
            <meshStandardMaterial color="#384357" roughness={0.4} metalness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
