import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Floor3D } from './Floor3D';
import { Courtyard3D } from './Courtyard3D';
import { useReducedMotion } from './useReducedMotion';
import { calculateBuildingDimensions, calculateCourtyardBounds } from './layoutEngine';

/**
 * Realistic Multi-Wing Architectural 3D Hostel Building & Digital Twin
 * Supports dynamic layouts (Courtyard, U-Shape, L-Shape, Straight), central courtyard,
 * procedural floor stacking (1 to 10+ floors), dynamic illuminated sign, and Day/Night lighting.
 */
export const Building3D = ({
  hostelData,
  selectedFloorNumber = null,
  selectedRoomId = null,
  onSelectRoom = () => {},
  emergenceProgress = 1,
  isExplodedView = false,
  lightingMode = 'day',
  qualityMode = 'high',
  customLayout = null
}) => {
  const buildingRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  const {
    name = 'Hostel 4',
    floors = [],
    accentColor = '#00685f',
    layoutConfig = {}
  } = hostelData || {};

  const activeConfig = customLayout || layoutConfig || {};
  const isNight = lightingMode === 'night';
  const totalFloors = floors.length || 1;

  // Calculate building dimensions and courtyard bounds via layoutEngine
  const buildingDims = useMemo(() => {
    return calculateBuildingDimensions(hostelData, activeConfig);
  }, [hostelData, activeConfig]);

  const { width: buildingWidth, depth: buildingDepth, floorHeight } = buildingDims;
  const explodedSpacing = isExplodedView ? 0.75 : 0;

  const courtyardData = useMemo(() => {
    return calculateCourtyardBounds(buildingDims, activeConfig);
  }, [buildingDims, activeConfig]);

  useFrame(() => {
    if (buildingRef.current) {
      const progress = prefersReducedMotion ? 1 : emergenceProgress;
      const easedScale = THREE.MathUtils.clamp(progress, 0, 1);
      buildingRef.current.scale.set(easedScale, easedScale, easedScale);
    }
  });

  // Calculate column / pillar positions along front facade
  const pillarXPositions = useMemo(() => {
    const count = Math.max(buildingDims.maxRoomsOnAnyFloor + 1, 4);
    const step = (buildingWidth - 0.5) / (count - 1);
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push(-buildingWidth / 2 + 0.25 + i * step);
    }
    return positions;
  }, [buildingWidth, buildingDims.maxRoomsOnAnyFloor]);

  // Dynamic sign width
  const signWidth = Math.max(name.length * 0.26 + 1.6, 3.2);

  return (
    <group ref={buildingRef} position={[0, -0.65, 0]}>
      {/* =================================================== */}
      {/* 1. GROUND PLATFORM, LANDSCAPED COURTYARD & PATHWAY */}
      {/* =================================================== */}
      <group position={[0, 0.04, 0]}>
        {/* Main Concrete Plinth Base Foundation */}
        <RoundedBox
          args={[buildingWidth + 2.2, 0.16, buildingDepth + 2.2]}
          radius={0.04}
          smoothness={3}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={isNight ? '#151a24' : '#b0b8c9'}
            roughness={0.65}
            metalness={0.1}
          />
        </RoundedBox>

        {/* Landscaped Grass Lawn */}
        <RoundedBox
          args={[buildingWidth + 1.8, 0.05, buildingDepth + 1.8]}
          radius={0.03}
          smoothness={3}
          position={[0, 0.1, 0]}
        >
          <meshStandardMaterial
            color={isNight ? '#13281f' : '#2e5a44'}
            roughness={0.85}
          />
        </RoundedBox>

        {/* Paved Pedestrian Walkway in front of hostel entrance */}
        <RoundedBox
          args={[2.6, 0.06, 1.3]}
          radius={0.02}
          position={[0, 0.11, buildingDepth / 2 + 0.55]}
        >
          <meshStandardMaterial
            color={isNight ? '#222938' : '#d5dbe8'}
            roughness={0.4}
          />
        </RoundedBox>

        {/* Courtyard Pathway Bollard Lights */}
        {[-buildingWidth / 2 + 0.45, -buildingWidth / 3.5, buildingWidth / 3.5, buildingWidth / 2 - 0.45].map((x, i) => (
          <group key={i} position={[x, 0.18, buildingDepth / 2 + 0.65]}>
            <mesh position={[0, 0.09, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.18, 8]} />
              <meshStandardMaterial color="#1a2233" metalness={0.85} />
            </mesh>
            <mesh position={[0, 0.19, 0]}>
              <sphereGeometry args={[0.036, 12, 12]} />
              <meshStandardMaterial
                color={isNight ? '#ffbe98' : '#ffebd8'}
                emissive="#ffb59a"
                emissiveIntensity={isNight ? 1.8 : 0.6}
              />
            </mesh>
            {isNight && qualityMode !== 'performance' && (
              <pointLight color="#ffebd8" intensity={0.5} distance={1.6} position={[0, 0.22, 0]} />
            )}
          </group>
        ))}

        {/* Planter Ceramic Boxes */}
        {[-buildingWidth / 2 + 0.65, buildingWidth / 2 - 0.65].map((x, idx) => (
          <group key={idx} position={[x, 0.18, buildingDepth / 2 + 0.45]}>
            <RoundedBox args={[0.45, 0.18, 0.35]} radius={0.02} position={[0, 0.09, 0]}>
              <meshStandardMaterial color={isNight ? '#242c3b' : '#ffffff'} roughness={0.4} />
            </RoundedBox>
            <mesh position={[0, 0.25, 0]}>
              <sphereGeometry args={[0.16, 12, 12]} />
              <meshStandardMaterial color={isNight ? '#163628' : '#347a57'} roughness={0.75} />
            </mesh>
          </group>
        ))}

        {/* Campus Bench */}
        <group position={[-buildingWidth / 2 + 1.25, 0.18, buildingDepth / 2 + 0.6]} rotation={[0, 0.08, 0]}>
          <RoundedBox args={[0.62, 0.04, 0.2]} radius={0.01} position={[0, 0.1, 0]}>
            <meshStandardMaterial color="#8a5a36" roughness={0.6} />
          </RoundedBox>
          <mesh position={[-0.25, 0.05, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
            <meshStandardMaterial color="#1a2233" metalness={0.8} />
          </mesh>
          <mesh position={[0.25, 0.05, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
            <meshStandardMaterial color="#1a2233" metalness={0.8} />
          </mesh>
        </group>
      </group>

      {/* =================================================== */}
      {/* 2. PROCEDURAL CENTRAL COURTYARD / ATRIUM SPACE      */}
      {/* =================================================== */}
      {courtyardData.enabled && (
        <Courtyard3D
          courtyardData={courtyardData}
          lightingMode={lightingMode}
          accentColor={accentColor}
          qualityMode={qualityMode}
        />
      )}

      {/* =================================================== */}
      {/* 3. RECOGNIZABLE HOSTEL MAIN ENTRANCE & CANOPY       */}
      {/* =================================================== */}
      <group position={[0, 0.1, buildingDepth / 2 + 0.4]}>
        {/* Entrance Steps */}
        <RoundedBox args={[2.5, 0.06, 0.65]} radius={0.015} position={[0, 0, 0.2]}>
          <meshStandardMaterial color={isNight ? '#1d2330' : '#384357'} roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[2.1, 0.06, 0.5]} radius={0.015} position={[0, 0.06, 0.08]}>
          <meshStandardMaterial color={accentColor} roughness={0.35} />
        </RoundedBox>

        {/* Entrance Columns */}
        {[-1.0, 1.0].map((x, idx) => (
          <mesh key={idx} position={[x, 0.52, 0.02]}>
            <cylinderGeometry args={[0.045, 0.045, 0.92, 12]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.85} roughness={0.15} />
          </mesh>
        ))}

        {/* Modern Canopy */}
        <RoundedBox args={[2.5, 0.05, 0.92]} radius={0.015} position={[0, 1.0, 0.08]}>
          <meshStandardMaterial
            color="#89f5e7"
            emissive={accentColor}
            emissiveIntensity={isNight ? 0.8 : 0.3}
            roughness={0.15}
            metalness={0.4}
          />
        </RoundedBox>

        {/* Security / Reception Hub Desk */}
        <group position={[0, 0.22, -0.2]}>
          <RoundedBox args={[0.92, 0.32, 0.35]} radius={0.02} position={[0, 0, 0]}>
            <meshStandardMaterial color={isNight ? '#1a2230' : '#e2e7f4'} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0.2, 0]}>
            <planeGeometry args={[0.72, 0.04]} />
            <meshBasicMaterial color="#89f5e7" />
          </mesh>
        </group>

        {/* Entrance Night Illumination */}
        {isNight && qualityMode !== 'performance' && (
          <pointLight color="#89f5e7" intensity={1.1} distance={2.4} position={[0, 0.92, 0.15]} />
        )}
      </group>

      {/* =================================================== */}
      {/* 4. DYNAMIC PROCEDURAL FLOORS & WINGS (1 to 10+)     */}
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
            layoutConfig={activeConfig}
          />
        );
      })}

      {/* Vertical Structural Facade Columns */}
      {!isExplodedView && (
        <group position={[0, (totalFloors * floorHeight) / 2 + 0.08, buildingDepth / 2 + 0.38]}>
          {pillarXPositions.map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, totalFloors * floorHeight + 0.1, 10]} />
              <meshStandardMaterial
                color={isNight ? '#253042' : '#89f5e7'}
                metalness={0.7}
                roughness={0.25}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* =================================================== */}
      {/* 5. MODERN ARCHITECTURAL ROOFTOP & DYNAMIC SIGN      */}
      {/* =================================================== */}
      <group
        position={[
          0,
          totalFloors * (floorHeight + explodedSpacing) + 0.1,
          0
        ]}
      >
        {/* Main Roof Concrete Slab */}
        <RoundedBox args={[buildingWidth + 0.3, 0.16, buildingDepth + 0.45]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={isNight ? '#002622' : '#004d46'}
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
          <RoundedBox args={[signWidth, 0.52, 0.09]} radius={0.03} position={[0, 0, 0]}>
            <meshStandardMaterial color="#001815" roughness={0.2} metalness={0.6} />
          </RoundedBox>

          {/* Glowing Acrylic Front Board */}
          <RoundedBox args={[signWidth - 0.2, 0.44, 0.02]} radius={0.015} position={[0, 0, 0.05]}>
            <meshStandardMaterial
              color="#00685f"
              emissive="#008378"
              emissiveIntensity={isNight ? 1.0 : 0.6}
              roughness={0.15}
            />
          </RoundedBox>

          {/* Dynamic 3D Text of Selected Hostel Name */}
          <Text
            position={[0, 0, 0.075]}
            fontSize={0.23}
            color={isNight ? '#aefff6' : '#ffffff'}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.07}
          >
            {name.toUpperCase()}
          </Text>

          {/* Sign Top Accent Neon Glow Line */}
          <RoundedBox args={[signWidth - 0.2, 0.025, 0.025]} radius={0.008} position={[0, 0.24, 0.055]}>
            <meshStandardMaterial
              color="#89f5e7"
              emissive="#89f5e7"
              emissiveIntensity={isNight ? 2.2 : 1.2}
            />
          </RoundedBox>
        </group>

        {/* Rooftop Solar Array */}
        <group position={[-buildingWidth / 3.0, 0.14, -0.2]} rotation={[0.15, 0, 0]}>
          <RoundedBox args={[1.9, 0.04, 1.3]} radius={0.01} position={[0, 0, 0]}>
            <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
          </RoundedBox>
          <mesh position={[0, 0.025, 0]}>
            <planeGeometry args={[1.8, 1.2]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        </group>

        {/* Rooftop Water Reservoir Tanks */}
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
