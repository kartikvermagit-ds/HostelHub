import React, { useMemo } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { Room3D } from './Room3D';
import { calculateFloorLayout, calculateBuildingDimensions } from './layoutEngine';

/**
 * Multi-Wing Architectural Floor Slab with Corridors, Balustrades, Staircase/Lift Tower & Dynamic Rooms
 * Supports Straight, L-Shape, U-Shape, C-Shape, H-Shape, and Courtyard layouts.
 */
export const Floor3D = ({
  floorData,
  floorIndex = 0,
  floorY: customFloorY = null,
  buildingWidth = 5.8,
  buildingDepth = 2.6,
  floorHeight = 1.05,
  selectedRoomId = null,
  onSelectRoom = () => {},
  accentColor = '#00685f',
  dimmed = false,
  lightingMode = 'day',
  isExplodedView = false,
  layoutConfig = null
}) => {
  const { rooms = [], floorNumber = floorIndex + 1, name: floorName } = floorData || {};
  const floorY = customFloorY !== null ? customFloorY : floorIndex * floorHeight;
  const isNight = lightingMode === 'night';

  const displayFloorLabel = floorName || (floorNumber === 1 ? 'Ground Floor' : `Floor ${floorNumber - 1}`);

  // Calculate building dimensions and floor wing layout via decoupled layoutEngine
  const buildingDims = useMemo(() => {
    return {
      width: buildingWidth,
      depth: buildingDepth,
      floorHeight,
      layoutType: layoutConfig?.layoutType || 'Straight',
      corridorWidth: layoutConfig?.corridorWidth || 0.8
    };
  }, [buildingWidth, buildingDepth, floorHeight, layoutConfig]);

  const { wings = [], rooms: dynamicRooms = [] } = useMemo(() => {
    return calculateFloorLayout(floorData, buildingDims, layoutConfig);
  }, [floorData, buildingDims, layoutConfig]);

  return (
    <group position={[0, floorY, 0]}>
      {/* =================================================== */}
      {/* 1. MULTI-WING STRUCTURAL FLOOR SLABS & CORRIDORS    */}
      {/* =================================================== */}
      {wings.map((wing) => (
        <group key={wing.id} position={wing.position}>
          {/* Main Structural Load-bearing Concrete Slab */}
          <RoundedBox
            args={wing.size}
            radius={0.02}
            smoothness={3}
            position={[0, 0.06, 0]}
          >
            <meshStandardMaterial
              color={dimmed ? '#6e7686' : isNight ? '#1e2634' : '#d8dfea'}
              roughness={0.5}
              metalness={0.08}
              transparent={dimmed}
              opacity={dimmed ? 0.35 : 1}
            />
          </RoundedBox>

          {/* Cantilevered Edge Trim Underneath */}
          <RoundedBox
            args={[wing.size[0] + 0.06, 0.03, wing.size[2] + 0.06]}
            radius={0.008}
            position={[0, 0.015, 0]}
          >
            <meshStandardMaterial
              color={isNight ? '#111722' : '#334155'}
              roughness={0.4}
              metalness={0.2}
              transparent={dimmed}
              opacity={dimmed ? 0.35 : 1}
            />
          </RoundedBox>

          {/* Corridor Finished Walkway Deck */}
          <RoundedBox
            args={[wing.size[0] - 0.06, 0.02, Math.min(wing.size[2] * 0.45, 0.65)]}
            radius={0.005}
            position={[0, 0.125, wing.size[2] * 0.25]}
          >
            <meshStandardMaterial
              color={dimmed ? '#505664' : isNight ? '#171f2b' : '#c5cddb'}
              roughness={0.35}
              transparent={dimmed}
              opacity={dimmed ? 0.35 : 1}
            />
          </RoundedBox>
        </group>
      ))}

      {/* =================================================== */}
      {/* 2. FRONT CORRIDOR BALUSTRADE / RAILING              */}
      {/* =================================================== */}
      <group position={[0, 0.22, buildingDepth / 2 + 0.25]}>
        {/* Sleek Top Handrail */}
        <RoundedBox args={[buildingWidth - 0.1, 0.03, 0.03]} radius={0.008} position={[0, 0.14, 0]}>
          <meshStandardMaterial
            color={dimmed ? '#585f6c' : isNight ? '#89f5e7' : accentColor}
            roughness={0.25}
            metalness={0.6}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </RoundedBox>

        {/* Translucent Glass Infill Panels */}
        <RoundedBox args={[buildingWidth - 0.25, 0.21, 0.012]} radius={0.008} position={[0, 0.02, 0]}>
          <meshStandardMaterial
            color={isNight ? '#89f5e7' : '#b2f0e8'}
            transparent
            opacity={dimmed ? 0.1 : isNight ? 0.4 : 0.3}
            roughness={0.1}
            metalness={0.15}
          />
        </RoundedBox>

        {/* Slim Vertical Stainless Steel Railing Posts */}
        {[-buildingWidth / 2 + 0.25, -buildingWidth / 3.5, 0, buildingWidth / 3.5, buildingWidth / 2 - 0.25].map((x, i) => (
          <mesh key={i} position={[x, 0.01, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.27, 8]} />
            <meshStandardMaterial
              color="#2a3345"
              metalness={0.8}
              roughness={0.2}
              transparent={dimmed}
              opacity={dimmed ? 0.35 : 1}
            />
          </mesh>
        ))}
      </group>

      {/* =================================================== */}
      {/* 3. SIDE STAIRCASE & LIFT CORE TOWER                 */}
      {/* =================================================== */}
      <group position={[buildingWidth / 2 - 0.3, 0.52, 0.4]}>
        <RoundedBox args={[0.52, floorHeight - 0.08, 1.8]} radius={0.025} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={isNight ? '#161c26' : '#334155'}
            roughness={0.55}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </RoundedBox>

        {/* Staircase Steps Visible Architectural Landings */}
        {[-0.32, -0.16, 0.02, 0.20, 0.36].map((y, idx) => (
          <group key={idx} position={[0.262, y, 0]}>
            <mesh>
              <planeGeometry args={[0.02, 0.24]} />
              <meshBasicMaterial color={isNight ? '#89f5e7' : '#00685f'} />
            </mesh>
          </group>
        ))}

        {/* Lift Entrance Door */}
        <group position={[-0.262, -0.05, 0.2]}>
          <mesh rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.42, 0.62]} />
            <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[-0.01, 0.36, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.12, 0.04]} />
            <meshBasicMaterial color={isNight ? '#89f5e7' : '#00a396'} />
          </mesh>
        </group>
      </group>

      {/* =================================================== */}
      {/* 4. CORRIDOR CEILING SOFFIT & RECESSED DOWNLIGHTS    */}
      {/* =================================================== */}
      <RoundedBox
        args={[buildingWidth - 0.1, 0.03, 0.54]}
        radius={0.005}
        position={[0, floorHeight - 0.02, buildingDepth / 2 + 0.14]}
      >
        <meshStandardMaterial
          color={isNight ? '#141a24' : '#e2e8f0'}
          roughness={0.4}
          transparent={dimmed}
          opacity={dimmed ? 0.35 : 1}
        />
      </RoundedBox>

      {/* Corridor Recessed Warm Downlights in Night Mode */}
      {isNight && (
        <group position={[0, floorHeight - 0.035, buildingDepth / 2 + 0.14]}>
          {[-buildingWidth / 3, 0, buildingWidth / 3].map((x, idx) => (
            <group key={idx} position={[x, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.04, 0.04, 0.015, 8]} />
                <meshBasicMaterial color="#ffeedd" />
              </mesh>
              <pointLight color="#ffc49e" intensity={0.5} distance={1.5} />
            </group>
          ))}
        </group>
      )}

      {/* =================================================== */}
      {/* 5. DYNAMIC FLOATING FLOOR LABELS (Exploded View)    */}
      {/* =================================================== */}
      {isExplodedView && (
        <group position={[-buildingWidth / 2 - 1.05, 0.5, 0.4]}>
          {/* Label Pill Backdrop */}
          <RoundedBox args={[1.75, 0.36, 0.06]} radius={0.03} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={isNight ? '#00201d' : '#004d46'}
              roughness={0.2}
              metalness={0.3}
            />
          </RoundedBox>
          <Text
            position={[0, 0, 0.04]}
            fontSize={0.13}
            color="#89f5e7"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.06}
          >
            {displayFloorLabel.toUpperCase()}
          </Text>
        </group>
      )}

      {/* =================================================== */}
      {/* 6. DYNAMICALLY DISTRIBUTED ROOMS ACROSS WINGS       */}
      {/* =================================================== */}
      {dynamicRooms.map((roomWithPosition, idx) => (
        <Room3D
          key={roomWithPosition.id || `room-${floorNumber}-${idx}`}
          roomData={roomWithPosition}
          selected={selectedRoomId === roomWithPosition.id}
          onSelectRoom={onSelectRoom}
          accentColor={accentColor}
          dimmed={dimmed}
          lightingMode={lightingMode}
        />
      ))}
    </group>
  );
};
