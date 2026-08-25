import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Floor3D } from './Floor3D';
import { useReducedMotion } from './useReducedMotion';

/**
 * Realistic Miniature Architectural 3D Hostel Building
 * Procedural floor stacking, exploded view animation, dynamic sign, and Day/Night lighting!
 */
export const Building3D = ({
  hostelData,
  selectedFloorNumber = null,
  selectedRoomId = null,
  onSelectRoom = () => {},
  emergenceProgress = 1,
  isExplodedView = false,
  lightingMode = 'day'
}) => {
  const buildingRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  const {
    name = 'Hostel 4',
    floors = [],
    accentColor = '#00685f'
  } = hostelData;

  const isNight = lightingMode === 'night';
  const totalFloors = floors.length || 1;

  // Calculate building width based on maximum rooms on any floor
  const maxRoomsOnAnyFloor = useMemo(() => {
    return Math.max(...floors.map((f) => f.rooms?.length || 0), 3);
  }, [floors]);

  const buildingWidth = Math.max(maxRoomsOnAnyFloor * 1.35 + 1.2, 5.2);
  const buildingDepth = 2.4;
  const floorHeight = 0.95;
  const explodedSpacing = isExplodedView ? 0.65 : 0;

  useFrame(() => {
    if (buildingRef.current) {
      const progress = prefersReducedMotion ? 1 : emergenceProgress;
      const easedScale = THREE.MathUtils.clamp(progress, 0, 1);
      buildingRef.current.scale.set(easedScale, easedScale, easedScale);
    }
  });

  return (
    <group ref={buildingRef} position={[0, -0.6, 0]}>
      {/* Ground Foundation Slab & Landscaped Courtyard Base */}
      <group position={[0, 0.05, 0.4]}>
        {/* Foundation Base Concrete */}
        <RoundedBox args={[buildingWidth + 1.2, 0.14, buildingDepth + 1.4]} radius={0.04} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={isNight ? '#1e2430' : '#c0c7d6'}
            roughness={0.6}
          />
        </RoundedBox>

        {/* Landscaped Grass Verge */}
        <RoundedBox args={[buildingWidth + 1.0, 0.04, buildingDepth + 1.2]} radius={0.03} position={[0, 0.09, 0]}>
          <meshStandardMaterial
            color={isNight ? '#1a3328' : '#2d4a3e'}
            roughness={0.8}
          />
        </RoundedBox>

        {/* Garden Pathway Bollard Lights */}
        {[-buildingWidth / 2 + 0.3, -buildingWidth / 4, 0, buildingWidth / 4, buildingWidth / 2 - 0.3].map((x, i) => (
          <group key={i} position={[x, 0.16, buildingDepth / 2 + 0.45]}>
            {/* Bollard Light Post */}
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.16, 8]} />
              <meshStandardMaterial color="#141b2b" metalness={0.8} />
            </mesh>
            {/* Glowing Lamp Cap */}
            <mesh position={[0, 0.18, 0]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial
                color={isNight ? '#ffb59a' : '#ffdbce'}
                emissive="#ffb59a"
                emissiveIntensity={isNight ? 1.8 : 0.8}
              />
            </mesh>
            {isNight && (
              <pointLight color="#ffdbce" intensity={0.6} distance={1.4} position={[0, 0.22, 0]} />
            )}
          </group>
        ))}

        {/* Miniature Landscaped Shrubs */}
        {[-buildingWidth / 2 + 0.8, buildingWidth / 2 - 0.8].map((x, idx) => (
          <group key={idx} position={[x, 0.18, buildingDepth / 2 + 0.4]}>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.1, 0.08, 0.12, 10]} />
              <meshStandardMaterial color="#8d735a" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <sphereGeometry args={[0.13, 10, 10]} />
              <meshStandardMaterial color={isNight ? '#16382a' : '#2d6a4f'} roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Main Entrance Porch with Pillars & Modern Glass Canopy */}
      <group position={[0, 0.1, buildingDepth / 2 + 0.3]}>
        {/* Entrance Steps */}
        <RoundedBox args={[2.0, 0.06, 0.55]} radius={0.01} position={[0, 0, 0.18]}>
          <meshStandardMaterial color={isNight ? '#222938' : '#384357'} roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[1.7, 0.06, 0.42]} radius={0.01} position={[0, 0.06, 0.08]}>
          <meshStandardMaterial color={accentColor} roughness={0.3} />
        </RoundedBox>

        {/* Entrance Columns */}
        {[-0.75, 0.75].map((x, idx) => (
          <mesh key={idx} position={[x, 0.44, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.76, 12]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Modern Glass Canopy */}
        <RoundedBox args={[2.0, 0.06, 0.8]} radius={0.02} position={[0, 0.84, 0.06]}>
          <meshStandardMaterial
            color="#89f5e7"
            emissive={accentColor}
            emissiveIntensity={isNight ? 0.9 : 0.4}
            roughness={0.1}
            metalness={0.3}
          />
        </RoundedBox>
        {isNight && (
          <pointLight color="#89f5e7" intensity={0.9} distance={1.8} position={[0, 0.78, 0.1]} />
        )}
      </group>

      {/* Dynamic Stacking of Floors with Exploded View Spacing */}
      {floors.map((floor, floorIndex) => {
        const floorNum = floor.floorNumber || floorIndex + 1;
        const isIsolated = selectedFloorNumber !== null && selectedFloorNumber !== floorNum;
        const currentFloorY = floorIndex * (floorHeight + explodedSpacing);

        return (
          <Floor3D
            key={floor.id || `floor-${floorNum}`}
            floorData={floor}
            floorIndex={floorIndex}
            floorY={currentFloorY}
            buildingWidth={buildingWidth}
            buildingDepth={buildingDepth}
            floorHeight={floorHeight}
            selectedRoomId={selectedRoomId}
            onSelectRoom={onSelectRoom}
            accentColor={accentColor}
            dimmed={isIsolated}
            lightingMode={lightingMode}
          />
        );
      })}

      {/* Building Modern Rooftop */}
      <group
        position={[
          0,
          totalFloors * (floorHeight + explodedSpacing) + 0.1,
          0.4
        ]}
      >
        {/* Main Roof Parapet Plate */}
        <RoundedBox args={[buildingWidth + 0.2, 0.14, buildingDepth + 0.4]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={isNight ? '#00332e' : '#004d46'}
            roughness={0.3}
            metalness={0.3}
          />
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
              emissiveIntensity={isNight ? 0.9 : 0.5}
              roughness={0.1}
            />
          </RoundedBox>

          {/* Dynamic 3D Text of Hostel Name */}
          <Text
            position={[0, 0, 0.065]}
            fontSize={0.22}
            color={isNight ? '#aefff6' : '#89f5e7'}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
          >
            {name.toUpperCase()}
          </Text>

          {/* Sign Top Accent Neon Glow Bar */}
          <RoundedBox args={[Math.max(name.length * 0.26 + 1.0, 2.4), 0.02, 0.02]} radius={0.01} position={[0, 0.22, 0.05]}>
            <meshStandardMaterial
              color="#89f5e7"
              emissive="#89f5e7"
              emissiveIntensity={isNight ? 2.0 : 1.2}
            />
          </RoundedBox>
        </group>

        {/* Rooftop Solar Array */}
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
