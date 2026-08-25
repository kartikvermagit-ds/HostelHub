import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { Room3D } from './Room3D';

/**
 * Dynamic Floor Slab with Calculated Room Spacing, Railings, and Staircase
 */
export const Floor3D = ({
  floorData,
  floorIndex = 0,
  buildingWidth = 5.6,
  buildingDepth = 2.4,
  floorHeight = 0.95,
  selectedRoomId = null,
  onSelectRoom = () => {},
  accentColor = '#00685f',
  dimmed = false
}) => {
  const { rooms = [], floorNumber = floorIndex + 1 } = floorData;
  const floorY = floorIndex * floorHeight;
  const roomCount = rooms.length;

  return (
    <group position={[0, floorY, 0]}>
      {/* Floor Concrete Slab */}
      <RoundedBox
        args={[buildingWidth, 0.1, buildingDepth]}
        radius={0.02}
        smoothness={3}
        position={[0, 0.05, 0.4]}
      >
        <meshStandardMaterial
          color={dimmed ? '#8d95a5' : '#dce2f3'}
          roughness={0.4}
          metalness={0.1}
          transparent={dimmed}
          opacity={dimmed ? 0.35 : 1}
        />
      </RoundedBox>

      {/* Front Corridor Railing */}
      <group position={[0, 0.18, buildingDepth / 2 + 0.38]}>
        {/* Top Handrail */}
        <RoundedBox args={[buildingWidth - 0.1, 0.03, 0.03]} radius={0.01} position={[0, 0.12, 0]}>
          <meshStandardMaterial
            color={dimmed ? '#585f6c' : '#00685f'}
            roughness={0.3}
            metalness={0.4}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </RoundedBox>
        {/* Railing Vertical Posts */}
        {[-buildingWidth / 2 + 0.3, -buildingWidth / 4, 0, buildingWidth / 4, buildingWidth / 2 - 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.24, 6]} />
            <meshStandardMaterial
              color="#384357"
              metalness={0.6}
              transparent={dimmed}
              opacity={dimmed ? 0.35 : 1}
            />
          </mesh>
        ))}
      </group>

      {/* Side Staircase / Lift Pillar (Right side) */}
      <group position={[buildingWidth / 2 - 0.3, 0.45, 0.4]}>
        <RoundedBox args={[0.4, floorHeight - 0.1, buildingDepth - 0.2]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#384357"
            roughness={0.5}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </RoundedBox>
        {/* Staircase Steps Texture Lines */}
        {[-0.3, -0.1, 0.1, 0.3].map((y, idx) => (
          <mesh key={idx} position={[0.205, y, 0]}>
            <planeGeometry args={[0.02, 0.15]} />
            <meshBasicMaterial color="#89f5e7" />
          </mesh>
        ))}
      </group>

      {/* Dynamically Positioned Rooms */}
      {rooms.map((room, idx) => {
        // Calculate horizontal position dynamically across the building width
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
          />
        );
      })}
    </group>
  );
};
