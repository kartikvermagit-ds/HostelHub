import React, { useState } from 'react';
import { RoundedBox } from '@react-three/drei';
import { RoomLabel } from './RoomLabel';

/**
 * Dynamic Modular 3D Hostel Room
 */
export const Room3D = ({
  roomData,
  selected = false,
  onSelectRoom = () => {},
  accentColor = '#00685f',
  dimmed = false
}) => {
  const [hovered, setHovered] = useState(false);

  const {
    id,
    roomNumber = '101',
    status = 'available',
    roomType = 'Single',
    branch = '',
    position = [0, 0.45, 0.45],
    dimensions = [1.25, 0.75, 0.95]
  } = roomData;

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

  const getStatusLightColor = () => {
    switch (status?.toLowerCase()) {
      case 'available':
        return '#89f5e7';
      case 'maintenance':
        return '#f59e0b';
      case 'reserved':
        return '#3b82f6';
      case 'occupied':
      default:
        return '#585f6c';
    }
  };

  return (
    <group position={position}>
      {/* Interactive Mesh Container */}
      <group
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {/* Main Room Cube */}
        <RoundedBox args={dimensions} radius={0.03} smoothness={3} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={
              selected
                ? '#f4fffc'
                : hovered
                ? '#e9edff'
                : '#ffffff'
            }
            roughness={0.3}
            metalness={0.05}
            transparent={dimmed}
            opacity={dimmed ? 0.35 : 1}
          />
        </RoundedBox>

        {/* Selection & Hover Glowing Wireframe Border */}
        {(hovered || selected) && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[dimensions[0] + 0.05, dimensions[1] + 0.05, dimensions[2] + 0.05]} />
            <meshStandardMaterial
              color={selected ? '#89f5e7' : '#008378'}
              emissive={selected ? '#00685f' : '#004d46'}
              emissiveIntensity={selected ? 0.6 : 0.3}
              wireframe
            />
          </mesh>
        )}

        {/* Front Room Facade (Door + Window + Status Indicator) */}
        <group position={[0, 0, dimensions[2] / 2 + 0.01]}>
          {/* Front Wall Background */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[dimensions[0] - 0.04, dimensions[1] - 0.04]} />
            <meshStandardMaterial
              color="#f4f6fa"
              roughness={0.4}
              transparent={dimmed}
              opacity={dimmed ? 0.35 : 1}
            />
          </mesh>

          {/* Room Door (Left side) */}
          <group position={[-0.28, -0.04, 0.01]}>
            <RoundedBox args={[0.36, 0.56, 0.02]} radius={0.01} position={[0, 0, 0]}>
              <meshStandardMaterial
                color={hovered || selected ? accentColor : '#00685f'}
                roughness={0.3}
                transparent={dimmed}
                opacity={dimmed ? 0.35 : 1}
              />
            </RoundedBox>
            {/* Door Handle */}
            <mesh position={[0.12, 0, 0.02]}>
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshStandardMaterial color="#89f5e7" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Glowing Door Status Frame / Top LED */}
            <mesh position={[0, 0.31, 0.02]}>
              <planeGeometry args={[0.3, 0.03]} />
              <meshBasicMaterial color={getStatusLightColor()} />
            </mesh>
          </group>

          {/* Room Window (Right side) */}
          <group position={[0.28, 0.06, 0.01]}>
            <RoundedBox args={[0.42, 0.36, 0.02]} radius={0.01} position={[0, 0, 0]}>
              <meshStandardMaterial
                color="#dce2f7"
                emissive={status === 'occupied' ? '#89f5e7' : '#000000'}
                emissiveIntensity={status === 'occupied' ? 0.3 : 0}
                roughness={0.1}
                metalness={0.2}
                transparent={dimmed}
                opacity={dimmed ? 0.35 : 1}
              />
            </RoundedBox>
            {/* Window Cross Grids */}
            <mesh position={[0, 0, 0.015]}>
              <planeGeometry args={[0.42, 0.02]} />
              <meshBasicMaterial color="#384357" />
            </mesh>
            <mesh position={[0, 0, 0.015]}>
                <planeGeometry args={[0.02, 0.36]} />
                <meshBasicMaterial color="#384357" />
            </mesh>
          </group>
        </group>
      </group>

      {/* 3D Room Number Plaque */}
      <RoomLabel
        roomNumber={roomNumber}
        status={status}
        roomType={roomType}
        branch={branch}
        hovered={hovered}
        selected={selected}
        position={[0, dimensions[1] / 2 + 0.08, dimensions[2] / 2 + 0.05]}
      />
    </group>
  );
};
