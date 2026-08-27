import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Floor3D } from './Floor3D';
import { useReducedMotion } from './useReducedMotion';

/**
 * Realistic Miniature Architectural 3D Hostel Building
 * Procedural floor stacking, exploded view animation, dynamic sign, entrance porch, and Day/Night lighting!
 */
export const Building3D = ({
  hostelData,
  selectedFloorNumber = null,
  selectedRoomId = null,
  onSelectRoom = () => {},
  emergenceProgress = 1,
  isExplodedView = false,
  lightingMode = 'day',
  qualityMode = 'high'
}) => {
  const buildingRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  const {
    name = 'Hostel 4',
    floors = [],
    accentColor = '#00685f'
  } = hostelData || {};

  const isNight = lightingMode === 'night';
  const totalFloors = floors.length || 1;

  // Calculate building width based on maximum rooms on any floor
  const maxRoomsOnAnyFloor = useMemo(() => {
    return Math.max(...(floors || []).map((f) => f.rooms?.length || 0), 3);
  }, [floors]);

  const buildingWidth = Math.max(maxRoomsOnAnyFloor * 1.45 + 1.4, 5.6);
  const buildingDepth = 2.6;
  const floorHeight = 1.05;
  const explodedSpacing = isExplodedView ? 0.75 : 0;

  useFrame(() => {
    if (buildingRef.current) {
      const progress = prefersReducedMotion ? 1 : emergenceProgress;
      const easedScale = THREE.MathUtils.clamp(progress, 0, 1);
      buildingRef.current.scale.set(easedScale, easedScale, easedScale);
    }
  });

  // Calculate column / pillar positions along the front facade
  const pillarXPositions = useMemo(() => {
    const count = Math.max(maxRoomsOnAnyFloor + 1, 4);
    const step = (buildingWidth - 0.4) / (count - 1);
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push(-buildingWidth / 2 + 0.2 + i * step);
    }
    return positions;
  }, [buildingWidth, maxRoomsOnAnyFloor]);

  return (
    <group ref={buildingRef} position={[0, -0.65, 0]}>
      {/* =================================================== */}
      {/* 1. GROUND PLATFORM, LANDSCAPED COURTYARD & PATHWAY */}
      {/* =================================================== */}
      <group position={[0, 0.04, 0.4]}>
        {/* Main Concrete Plinth / Base Foundation */}
        <RoundedBox
          args={[buildingWidth + 2.0, 0.16, buildingDepth + 2.0]}
          radius={0.05}
          smoothness={3}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={isNight ? '#171c26' : '#b0b8c9'}
            roughness={0.65}
            metalness={0.1}
          />
        </RoundedBox>

        {/* Landscaped Grass Lawn */}
        <RoundedBox
          args={[buildingWidth + 1.6, 0.05, buildingDepth + 1.6]}
          radius={0.04}
          smoothness={3}
          position={[0, 0.1, 0]}
        >
          <meshStandardMaterial
            color={isNight ? '#162e24' : '#2e5a44'}
            roughness={0.85}
          />
        </RoundedBox>

        {/* Paved Pedestrian Walkway in front of hostel entrance */}
        <RoundedBox
          args={[2.4, 0.06, 1.2]}
          radius={0.02}
          position={[0, 0.11, buildingDepth / 2 + 0.55]}
        >
          <meshStandardMaterial
            color={isNight ? '#252d3d' : '#d5dbe8'}
            roughness={0.4}
          />
        </RoundedBox>

        {/* Courtyard Pathway Bollard Lights */}
        {[-buildingWidth / 2 + 0.4, -buildingWidth / 3.5, buildingWidth / 3.5, buildingWidth / 2 - 0.4].map((x, i) => (
          <group key={i} position={[x, 0.18, buildingDepth / 2 + 0.65]}>
            {/* Bollard Post */}
            <mesh position={[0, 0.09, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.18, 8]} />
              <meshStandardMaterial color="#1a2233" metalness={0.85} />
            </mesh>
            {/* Glowing Lamp Cap */}
            <mesh position={[0, 0.19, 0]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial
                color={isNight ? '#ffbe98' : '#ffebd8'}
                emissive="#ffb59a"
                emissiveIntensity={isNight ? 2.0 : 0.8}
              />
            </mesh>
            {isNight && qualityMode !== 'performance' && (
              <pointLight color="#ffebd8" intensity={0.6} distance={1.6} position={[0, 0.22, 0]} />
            )}
          </group>
        ))}

        {/* Decorative Modern Planter Boxes with Greenery */}
        {[-buildingWidth / 2 + 0.6, buildingWidth / 2 - 0.6].map((x, idx) => (
          <group key={idx} position={[x, 0.18, buildingDepth / 2 + 0.45]}>
            {/* Planter Ceramic Box */}
            <RoundedBox args={[0.45, 0.18, 0.35]} radius={0.02} position={[0, 0.09, 0]}>
              <meshStandardMaterial color={isNight ? '#283142' : '#ffffff'} roughness={0.4} />
            </RoundedBox>
            {/* Shrub Top Foliage */}
            <mesh position={[0, 0.26, 0]}>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshStandardMaterial color={isNight ? '#1a3e2e' : '#347a57'} roughness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Campus Bench */}
        <group position={[-buildingWidth / 2 + 1.2, 0.18, buildingDepth / 2 + 0.6]} rotation={[0, 0.1, 0]}>
          <RoundedBox args={[0.6, 0.04, 0.2]} radius={0.01} position={[0, 0.1, 0]}>
            <meshStandardMaterial color="#8a5a36" roughness={0.6} />
          </RoundedBox>
          <mesh position={[-0.24, 0.05, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
            <meshStandardMaterial color="#1a2233" metalness={0.8} />
          </mesh>
          <mesh position={[0.24, 0.05, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
            <meshStandardMaterial color="#1a2233" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* =================================================== */}
      {/* 2. RECOGNIZABLE HOSTEL MAIN ENTRANCE & CANOPY       */}
      {/* =================================================== */}
      <group position={[0, 0.1, buildingDepth / 2 + 0.4]}>
        {/* Entrance Terraced Steps */}
        <RoundedBox args={[2.4, 0.06, 0.65]} radius={0.015} position={[0, 0, 0.2]}>
          <meshStandardMaterial color={isNight ? '#202736' : '#384357'} roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[2.0, 0.06, 0.5]} radius={0.015} position={[0, 0.06, 0.08]}>
          <meshStandardMaterial color={accentColor} roughness={0.35} />
        </RoundedBox>

        {/* Entrance Columns / Pillars */}
        {[-0.95, 0.95].map((x, idx) => (
          <mesh key={idx} position={[x, 0.52, 0.02]}>
            <cylinderGeometry args={[0.05, 0.05, 0.92, 12]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.85} roughness={0.15} />
          </mesh>
        ))}

        {/* Modern Glass & Metal Canopy */}
        <RoundedBox args={[2.4, 0.06, 0.9]} radius={0.02} position={[0, 1.0, 0.08]}>
          <meshStandardMaterial
            color="#89f5e7"
            emissive={accentColor}
            emissiveIntensity={isNight ? 0.9 : 0.4}
            roughness={0.1}
            metalness={0.4}
          />
        </RoundedBox>

        {/* Security / Reception Desk Mini Hub (Ground Floor Center) */}
        <group position={[0, 0.22, -0.2]}>
          <RoundedBox args={[0.9, 0.32, 0.35]} radius={0.02} position={[0, 0, 0]}>
            <meshStandardMaterial color={isNight ? '#1e2636' : '#e2e7f4'} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0.2, 0]}>
            <planeGeometry args={[0.7, 0.04]} />
            <meshBasicMaterial color="#89f5e7" />
          </mesh>
        </group>

        {/* Warm Entrance Illumination */}
        {isNight && qualityMode !== 'performance' && (
          <pointLight color="#89f5e7" intensity={1.2} distance={2.4} position={[0, 0.92, 0.15]} />
        )}
      </group>

      {/* =================================================== */}
      {/* 3. DYNAMIC PROCEDURAL FLOORS & STRUCTURAL PILLARS   */}
      {/* =================================================== */}
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
            isExplodedView={isExplodedView}
          />
        );
      })}

      {/* Vertical Structural Facade Columns */}
      {!isExplodedView && (
        <group position={[0, (totalFloors * floorHeight) / 2 + 0.08, buildingDepth / 2 + 0.38]}>
          {pillarXPositions.map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <cylinderGeometry args={[0.035, 0.035, totalFloors * floorHeight + 0.1, 10]} />
              <meshStandardMaterial
                color={isNight ? '#2a3345' : '#89f5e7'}
                metalness={0.7}
                roughness={0.25}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* =================================================== */}
      {/* 4. MODERN ARCHITECTURAL ROOFTOP & DYNAMIC SIGN      */}
      {/* =================================================== */}
      <group
        position={[
          0,
          totalFloors * (floorHeight + explodedSpacing) + 0.1,
          0.4
        ]}
      >
        {/* Main Roof Concrete Slab */}
        <RoundedBox args={[buildingWidth + 0.3, 0.16, buildingDepth + 0.45]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={isNight ? '#002925' : '#004d46'}
            roughness={0.35}
            metalness={0.25}
          />
        </RoundedBox>

        {/* Roof Perimeter Parapet Railing */}
        <RoundedBox args={[buildingWidth + 0.25, 0.14, 0.04]} radius={0.01} position={[0, 0.14, buildingDepth / 2 + 0.2]}>
          <meshStandardMaterial color="#00685f" roughness={0.4} />
        </RoundedBox>

        {/* DYNAMIC ILLUMINATED ACRYLIC HOSTEL NAME SIGN BOARD */}
        <group position={[0, 0.5, buildingDepth / 2 + 0.2]}>
          {/* Sign Backplate */}
          <RoundedBox args={[Math.max(name.length * 0.28 + 1.4, 3.0), 0.52, 0.09]} radius={0.04} position={[0, 0, 0]}>
            <meshStandardMaterial color="#001815" roughness={0.2} metalness={0.6} />
          </RoundedBox>

          {/* Glowing Acrylic Front Board */}
          <RoundedBox args={[Math.max(name.length * 0.28 + 1.2, 2.8), 0.44, 0.02]} radius={0.02} position={[0, 0, 0.05]}>
            <meshStandardMaterial
              color="#00685f"
              emissive="#008378"
              emissiveIntensity={isNight ? 1.0 : 0.6}
              roughness={0.1}
            />
          </RoundedBox>

          {/* Dynamic 3D Text of Selected Hostel Name */}
          <Text
            position={[0, 0, 0.075]}
            fontSize={0.24}
            color={isNight ? '#aefff6' : '#ffffff'}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.08}
            font={undefined}
          >
            {name.toUpperCase()}
          </Text>

          {/* Sign Top Accent Neon Glow Line */}
          <RoundedBox args={[Math.max(name.length * 0.28 + 1.2, 2.8), 0.025, 0.025]} radius={0.01} position={[0, 0.24, 0.055]}>
            <meshStandardMaterial
              color="#89f5e7"
              emissive="#89f5e7"
              emissiveIntensity={isNight ? 2.4 : 1.4}
            />
          </RoundedBox>
        </group>

        {/* Rooftop Solar Array */}
        <group position={[-buildingWidth / 3.0, 0.14, -0.2]} rotation={[0.15, 0, 0]}>
          <RoundedBox args={[1.9, 0.04, 1.3]} radius={0.01} position={[0, 0, 0]}>
            <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
          </RoundedBox>
          {/* Grid lines */}
          <mesh position={[0, 0.025, 0]}>
            <planeGeometry args={[1.8, 1.2]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        </group>

        {/* Rooftop Cylindrical Water Reservoir Tanks */}
        <group position={[buildingWidth / 3.0, 0.3, -0.2]}>
          {[-0.32, 0.32].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <cylinderGeometry args={[0.32, 0.32, 0.58, 20]} />
              <meshStandardMaterial color="#384357" roughness={0.4} metalness={0.5} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

