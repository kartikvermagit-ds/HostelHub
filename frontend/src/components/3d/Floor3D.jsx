import React from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { Room3D } from './Room3D';

/**
 * Dynamic Architectural Floor Slab with Corridors, Balustrades, Staircase & Rooms
 */
export const Floor3D = ({
  floorData,
  floorIndex = 0,
  floorY: customFloorY = null,
  buildingWidth = 5.6,
  buildingDepth = 2.6,
  floorHeight = 1.05,
  selectedRoomId = null,
  onSelectRoom = () => {},
  accentColor = '#00685f',
  dimmed = false,
  lightingMode = 'day',
  isExplodedView = false
}) => {
  const { rooms = [], floorNumber = floorIndex + 1, name: floorName } = floorData || {};
  const floorY = customFloorY !== null ? customFloorY : floorIndex * floorHeight;
  const roomCount = (rooms || []).length;
  const isNight = lightingMode === 'night';

  const displayFloorLabel = floorName || (floorNumber === 1 ? 'Ground Floor' : `Floor ${floorNumber - 1}`);

  return (
    <group position={[0, floorY, 0]}>
      {/* =================================================== */}
      {/* 1. FLOOR SLAB BASE & CORRIDOR DECK                  */}
      {/* =================================================== */}
      <RoundedBox
        args={[buildingWidth, 0.12, buildingDepth]}
        radius={0.025}
        smoothness={3}
        position={[0, 0.06, 0.4]}
      >
        <meshStandardMaterial
          color={dimmed ? '#7a8292' : isNight ? '#222a38' : '#d8dfea'}
          roughness={0.4}
          metalness={0.1}
          transparent={dimmed}
          opacity={dimmed ? 0.35 : 1}
        />
      </RoundedBox>

      {/* Corridor Floor Trim Line */}
      <RoundedBox
        args={[buildingWidth - 0.05, 0.02, 0.5]}
        radius={0.005}
        position={[0, 0.125, buildingDepth / 2 + 0.15]}
      >
        <meshStandardMaterial
          color={dimmed ? '#505664' : isNight ? '#1b2330' : '#c5cddb'}
          roughness={0.3}
          transparent={dimmed}
          opacity={dimmed ? 0.35 : 1}
        />
      </RoundedBox>

      {/* =================================================== */}
      {/* 2. FRONT CORRIDOR BALUSTRADE / RAILING              */}
      {/* =================================================== */}
      <group position={[0, 0.22, buildingDepth / 2 + 0.38]}>
        {/* Top Handrail with Accent Trim */}
        <RoundedBox args={[buildingWidth - 0.1, 0.035, 0.035]} radius={0.01} position={[0, 0.14, 0]}>
          <meshStandardMaterial
            color={dimmed ? '#585f6c' : isNight ? '#89f5e7' : accentColor}
            roughness={0.3}
            metalness={0.5}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </RoundedBox>

        {/* Translucent Glass Infill Panels */}
        <RoundedBox args={[buildingWidth - 0.3, 0.22, 0.012]} radius={0.01} position={[0, 0.02, 0]}>
          <meshStandardMaterial
            color={isNight ? '#89f5e7' : '#b2f0e8'}
            transparent
            opacity={dimmed ? 0.12 : isNight ? 0.45 : 0.35}
            roughness={0.1}
            metalness={0.1}
          />
        </RoundedBox>

        {/* Railing Vertical Metal Posts */}
        {[-buildingWidth / 2 + 0.3, -buildingWidth / 4, 0, buildingWidth / 4, buildingWidth / 2 - 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0.01, 0]}>
            <cylinderGeometry args={[0.016, 0.016, 0.28, 6]} />
            <meshStandardMaterial
              color="#2a3345"
              metalness={0.7}
              transparent={dimmed}
              opacity={dimmed ? 0.35 : 1}
            />
          </mesh>
        ))}
      </group>

      {/* =================================================== */}
      {/* 3. SIDE STAIRCASE & LIFT CORE BLOCK (Right Side)    */}
      {/* =================================================== */}
      <group position={[buildingWidth / 2 - 0.32, 0.52, 0.4]}>
        <RoundedBox args={[0.48, floorHeight - 0.08, buildingDepth - 0.2]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={isNight ? '#1c222e' : '#384357'}
            roughness={0.5}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </RoundedBox>
        {/* Staircase Steps Visible Architectural Slits */}
        {[-0.32, -0.12, 0.08, 0.28].map((y, idx) => (
          <mesh key={idx} position={[0.245, y, 0]}>
            <planeGeometry args={[0.02, 0.18]} />
            <meshBasicMaterial color={isNight ? '#89f5e7' : '#00685f'} />
          </mesh>
        ))}
      </group>

      {/* =================================================== */}
      {/* 4. CORRIDOR CEILING WARM DOWNLIGHTS (Night Mode)   */}
      {/* =================================================== */}
      {isNight && (
        <group position={[0, floorHeight - 0.04, buildingDepth / 2 + 0.1]}>
          {[-buildingWidth / 3, 0, buildingWidth / 3].map((x, idx) => (
            <group key={idx} position={[x, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.045, 0.045, 0.02, 8]} />
                <meshBasicMaterial color="#ffdbce" />
              </mesh>
              <pointLight color="#ffbe98" intensity={0.55} distance={1.4} />
            </group>
          ))}
        </group>
      )}

      {/* =================================================== */}
      {/* 5. BACK WALL SOLID ARCHITECTURAL PARTITION         */}
      {/* =================================================== */}
      <RoundedBox
        args={[buildingWidth - 0.1, floorHeight - 0.06, 0.08]}
        radius={0.01}
        position={[0, 0.52, -buildingDepth / 2 + 0.35]}
      >
        <meshStandardMaterial
          color={dimmed ? '#6b7280' : isNight ? '#171f2b' : '#f1f5f9'}
          roughness={0.5}
          transparent={dimmed}
          opacity={dimmed ? 0.35 : 1}
        />
      </RoundedBox>

      {/* =================================================== */}
      {/* 6. DYNAMIC FLOATING FLOOR LABELS (Exploded View)    */}
      {/* =================================================== */}
      {isExplodedView && (
        <group position={[-buildingWidth / 2 - 0.95, 0.5, 0.4]}>
          {/* Label Pill Backdrop */}
          <RoundedBox args={[1.6, 0.34, 0.06]} radius={0.03} position={[0, 0, 0]}>
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
            letterSpacing={0.05}
          >
            {displayFloorLabel.toUpperCase()}
          </Text>
        </group>
      )}

      {/* =================================================== */}
      {/* 7. DYNAMICALLY POSITIONED ROOMS                     */}
      {/* =================================================== */}
      {rooms.map((room, idx) => {
        const totalSpacing = buildingWidth - 1.4;
        const step = totalSpacing / Math.max(roomCount, 1);
        const xPos = -totalSpacing / 2 + (idx + 0.5) * step;
        const roomPosition = [xPos, 0.52, 0.45];

        const roomWithPosition = {
          ...room,
          position: roomPosition,
          dimensions: [Math.min(step * 0.88, 1.35), 0.82, 1.05]
        };

        return (
          <Room3D
            key={room.id || `room-${floorNumber}-${idx}`}
            roomData={roomWithPosition}
            selected={selectedRoomId === room.id}
            onSelectRoom={onSelectRoom}
            accentColor={accentColor}
            dimmed={dimmed}
            lightingMode={lightingMode}
          />
        );
      })}
    </group>
  );
};


