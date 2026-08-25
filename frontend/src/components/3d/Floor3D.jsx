import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { Room3D } from './Room3D';

/**
 * Dynamic Architectural Floor Slab with Corridors, Balustrades, Staircase & Rooms
 */
export const Floor3D = ({
  floorData,
  floorIndex = 0,
  floorY: customFloorY = null,
  buildingWidth = 5.6,
  buildingDepth = 2.4,
  floorHeight = 0.95,
  selectedRoomId = null,
  onSelectRoom = () => {},
  accentColor = '#00685f',
  dimmed = false,
  lightingMode = 'day'
}) => {
  const { rooms = [], floorNumber = floorIndex + 1 } = floorData;
  const floorY = customFloorY !== null ? customFloorY : floorIndex * floorHeight;
  const roomCount = rooms.length;
  const isNight = lightingMode === 'night';

  return (
    <group position={[0, floorY, 0]}>
      {/* Floor Concrete / Ceramic Base Slab */}
      <RoundedBox
        args={[buildingWidth, 0.1, buildingDepth]}
        radius={0.02}
        smoothness={3}
        position={[0, 0.05, 0.4]}
      >
        <meshStandardMaterial
          color={dimmed ? '#8d95a5' : isNight ? '#262f3d' : '#dce2f3'}
          roughness={0.4}
          metalness={0.1}
          transparent={dimmed}
          opacity={dimmed ? 0.35 : 1}
        />
      </RoundedBox>

      {/* Front Corridor Balustrade / Railing */}
      <group position={[0, 0.18, buildingDepth / 2 + 0.38]}>
        {/* Top Handrail */}
        <RoundedBox args={[buildingWidth - 0.1, 0.03, 0.03]} radius={0.01} position={[0, 0.12, 0]}>
          <meshStandardMaterial
            color={dimmed ? '#585f6c' : accentColor}
            roughness={0.3}
            metalness={0.4}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </RoundedBox>
        {/* Glass / Acrylic Infill Panels */}
        <RoundedBox args={[buildingWidth - 0.3, 0.18, 0.01]} radius={0.01} position={[0, 0.02, 0]}>
          <meshStandardMaterial
            color="#89f5e7"
            transparent
            opacity={dimmed ? 0.15 : 0.4}
            roughness={0.1}
          />
        </RoundedBox>
        {/* Railing Vertical Posts */}
        {[-buildingWidth / 2 + 0.3, -buildingWidth / 4, 0, buildingWidth / 4, buildingWidth / 2 - 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.014, 0.014, 0.24, 6]} />
            <meshStandardMaterial
              color="#384357"
              metalness={0.6}
              transparent={dimmed}
              opacity={dimmed ? 0.35 : 1}
            />
          </mesh>
        ))}
      </group>

      {/* Side Staircase / Lift Core (Right side) */}
      <group position={[buildingWidth / 2 - 0.3, 0.45, 0.4]}>
        <RoundedBox args={[0.42, floorHeight - 0.08, buildingDepth - 0.2]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={isNight ? '#202633' : '#384357'}
            roughness={0.5}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </RoundedBox>
        {/* Staircase Steps Visible Slits */}
        {[-0.3, -0.1, 0.1, 0.3].map((y, idx) => (
          <mesh key={idx} position={[0.215, y, 0]}>
            <planeGeometry args={[0.02, 0.15]} />
            <meshBasicMaterial color={isNight ? '#89f5e7' : '#00685f'} />
          </mesh>
        ))}
      </group>

      {/* Corridor Ceiling Warm Downlights (Visible in Night Mode) */}
      {isNight && (
        <group position={[0, floorHeight - 0.02, buildingDepth / 2 + 0.1]}>
          {[-buildingWidth / 3, 0, buildingWidth / 3].map((x, idx) => (
            <group key={idx} position={[x, 0, 0]}>
              <mesh>
                <cylinderGeometry args={[0.04, 0.04, 0.02, 8]} />
                <meshBasicMaterial color="#ffdbce" />
              </mesh>
              <pointLight color="#ffbe98" intensity={0.5} distance={1.2} />
            </group>
          ))}
        </group>
      )}

      {/* Dynamically Positioned Rooms */}
      {rooms.map((room, idx) => {
        const totalSpacing = buildingWidth - 1.2;
        const step = roomCount > 1 ? totalSpacing / (roomCount - 1) : 0;
        const xPos = roomCount > 1 ? -totalSpacing / 2 + idx * step : 0;
        const roomPosition = [xPos, 0.45, 0.45];

        const roomWithPosition = {
          ...room,
          position: roomPosition
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
