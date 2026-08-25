import React from 'react';
import { RoundedBox } from '@react-three/drei';
import { Room3D } from './Room3D';

/**
 * Modular Floor Slab with Railing, Corridor Base and Floor Rooms
 */
export const Floor3D = ({
  floorNumber = 1,
  rooms = [],
  selectedRoomId = null,
  onSelectRoom = () => {},
  accentColor = '#00685f',
  showLabels = true
}) => {
  const floorY = (floorNumber - 1) * 0.8;

  return (
    <group position={[0, 0, 0]}>
      {/* Floor Concrete / Ceramic Base Slab */}
      <RoundedBox
        args={[4.4, 0.1, 1.6]}
        radius={0.02}
        smoothness={3}
        position={[0, floorY + 0.05, 0.35]}
      >
        <meshStandardMaterial
          color="#dce2f3"
          roughness={0.4}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Corridor Railing (Front Edge) */}
      <group position={[0, floorY + 0.18, 1.1]}>
        {/* Top Rail Bar */}
        <RoundedBox args={[4.36, 0.03, 0.03]} radius={0.01} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#00685f" roughness={0.3} metalness={0.4} />
        </RoundedBox>
        {/* Railing Vertical Balusters */}
        {[-2.0, -1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5, 2.0].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.2, 6]} />
            <meshStandardMaterial color="#384357" metalness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Side Staircase / Lift Pillar Indicator */}
      <group position={[2.3, floorY + 0.45, 0.35]}>
        <RoundedBox args={[0.3, 0.75, 1.4]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.5} />
        </RoundedBox>
      </group>

      {/* Render Rooms for this floor */}
      {rooms.map((room) => (
        <Room3D
          key={room.id}
          roomData={room}
          selected={selectedRoomId === room.id}
          onSelectRoom={onSelectRoom}
          accentColor={accentColor}
          showLabels={showLabels}
        />
      ))}
    </group>
  );
};
