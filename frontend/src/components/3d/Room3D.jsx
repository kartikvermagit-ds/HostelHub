import React, { useState } from 'react';
import { RoundedBox } from '@react-three/drei';
import { RoomInterior } from './RoomInterior';
import { RoomLabel } from './RoomLabel';

/**
 * Individual Modular 3D Hostel Room with Interactive Hover & Interior Reveal
 */
export const Room3D = ({
  roomData,
  selected = false,
  onSelectRoom = () => {},
  accentColor = '#00685f',
  showLabels = true
}) => {
  const [hovered, setHovered] = useState(false);

  const { id, status, branch, position, dimensions = [1.2, 0.7, 0.9] } = roomData;

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

  return (
    <group position={position}>
      {/* Interactive Bounding Box / Click Trigger */}
      <group
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {/* Main Room Body (Back, Top, Bottom, Side Walls) */}
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
          />
        </RoundedBox>

        {/* Outer Accent Rim / Selection Glow */}
        {(hovered || selected) && (
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[dimensions[0] + 0.04, dimensions[1] + 0.04, dimensions[2] + 0.04]} />
            <meshStandardMaterial
              color={selected ? '#89f5e7' : '#008378'}
              emissive={selected ? '#00685f' : '#004d46'}
              emissiveIntensity={selected ? 0.4 : 0.2}
              wireframe
            />
          </mesh>
        )}

        {/* Front Wall with Door & Window (Slides open / transparent when room is selected) */}
        {!selected ? (
          <group position={[0, 0, dimensions[2] / 2 + 0.01]}>
            {/* Front Wall Frame */}
            <mesh position={[0, 0, 0]}>
              <planeGeometry args={[dimensions[0] - 0.04, dimensions[1] - 0.04]} />
              <meshStandardMaterial
                color="#f4f6fa"
                roughness={0.4}
              />
            </mesh>

            {/* Room Door (Left side of front wall) */}
            <group position={[-0.26, -0.05, 0.01]}>
              <RoundedBox args={[0.34, 0.52, 0.02]} radius={0.01} position={[0, 0, 0]}>
                <meshStandardMaterial
                  color={hovered ? accentColor : '#00685f'}
                  roughness={0.3}
                />
              </RoundedBox>
              {/* Door Handle */}
              <mesh position={[0.11, 0, 0.02]}>
                <sphereGeometry args={[0.02, 12, 12]} />
                <meshStandardMaterial color="#89f5e7" metalness={0.9} roughness={0.1} />
              </mesh>
            </group>

            {/* Room Window (Right side of front wall) */}
            <group position={[0.26, 0.05, 0.01]}>
              <RoundedBox args={[0.38, 0.32, 0.02]} radius={0.01} position={[0, 0, 0]}>
                <meshStandardMaterial
                  color="#dce2f7"
                  emissive={status === 'occupied' ? '#89f5e7' : '#000000'}
                  emissiveIntensity={status === 'occupied' ? 0.25 : 0}
                  roughness={0.1}
                  metalness={0.2}
                />
              </RoundedBox>
              {/* Window Cross Grids */}
              <mesh position={[0, 0, 0.015]}>
                <planeGeometry args={[0.38, 0.02]} />
                <meshBasicMaterial color="#384357" />
              </mesh>
              <mesh position={[0, 0, 0.015]}>
                <planeGeometry args={[0.02, 0.32]} />
                <meshBasicMaterial color="#384357" />
              </mesh>
            </group>
          </group>
        ) : (
          /* Interior Reveal when Room is Selected */
          <RoomInterior visible={true} accentColor={accentColor} />
        )}
      </group>

      {/* 3D Room Number Label */}
      {showLabels && (
        <RoomLabel
          roomNumber={id}
          status={status}
          branch={branch}
          hovered={hovered}
          selected={selected}
          position={[0, dimensions[1] / 2 + 0.06, dimensions[2] / 2 + 0.04]}
        />
      )}
    </group>
  );
};
