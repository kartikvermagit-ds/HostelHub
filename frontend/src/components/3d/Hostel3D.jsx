import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Floor3D } from './Floor3D';
import { useReducedMotion } from './useReducedMotion';

/**
 * 3D Modular Hostel Building with Animated Emergence & Floor Hierarchy
 */
export const Hostel3D = ({
  hostelData,
  emergenceProgress = 1,
  selectedRoomId = null,
  onSelectRoom = () => {},
  showLabels = true
}) => {
  const buildingGroupRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  const { name = 'Hostel 4', totalFloors = 3, rooms = [], accentColor = '#00685f' } = hostelData;

  // Group rooms by floor
  const floor1Rooms = rooms.filter((r) => r.floor === 1);
  const floor2Rooms = rooms.filter((r) => r.floor === 2);
  const floor3Rooms = rooms.filter((r) => r.floor === 3);

  // Smooth upward scaling from center of the book
  useFrame((state) => {
    if (buildingGroupRef.current) {
      const progress = prefersReducedMotion ? 1 : emergenceProgress;
      // Easing curve
      const easedScale = THREE.MathUtils.clamp(progress, 0, 1);
      buildingGroupRef.current.scale.set(easedScale, easedScale, easedScale);
      buildingGroupRef.current.position.y = THREE.MathUtils.lerp(-0.4, 0, easedScale);
    }
  });

  return (
    <group ref={buildingGroupRef} position={[0, 0, 0]}>
      {/* Ground Foundation Slab (resting directly on top of open book pages) */}
      <RoundedBox args={[4.8, 0.12, 2.2]} radius={0.03} position={[0, 0.06, 0.3]}>
        <meshStandardMaterial color="#c0c7d6" roughness={0.5} />
      </RoundedBox>

      {/* Main Hostel Entrance Porch / Canopy */}
      <group position={[0, 0.1, 1.25]}>
        {/* Entrance Steps */}
        <RoundedBox args={[1.6, 0.06, 0.4]} radius={0.01} position={[0, 0, 0.15]}>
          <meshStandardMaterial color="#384357" roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[1.4, 0.06, 0.3]} radius={0.01} position={[0, 0.05, 0.05]}>
          <meshStandardMaterial color="#00685f" roughness={0.3} />
        </RoundedBox>
        {/* Entrance Columns */}
        {[-0.65, 0.65].map((x, idx) => (
          <mesh key={idx} position={[x, 0.32, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.55, 12]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        {/* Modern Glass Canopy */}
        <RoundedBox args={[1.6, 0.04, 0.6]} radius={0.02} position={[0, 0.6, 0.05]}>
          <meshStandardMaterial
            color="#89f5e7"
            emissive="#00685f"
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.3}
          />
        </RoundedBox>
      </group>

      {/* Floor 1 (Ground Floor) */}
      {floor1Rooms.length > 0 && (
        <Floor3D
          floorNumber={1}
          rooms={floor1Rooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={onSelectRoom}
          accentColor={accentColor}
          showLabels={showLabels && emergenceProgress > 0.85}
        />
      )}

      {/* Floor 2 */}
      {floor2Rooms.length > 0 && (
        <Floor3D
          floorNumber={2}
          rooms={floor2Rooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={onSelectRoom}
          accentColor={accentColor}
          showLabels={showLabels && emergenceProgress > 0.85}
        />
      )}

      {/* Floor 3 */}
      {floor3Rooms.length > 0 && (
        <Floor3D
          floorNumber={3}
          rooms={floor3Rooms}
          selectedRoomId={selectedRoomId}
          onSelectRoom={onSelectRoom}
          accentColor={accentColor}
          showLabels={showLabels && emergenceProgress > 0.85}
        />
      )}

      {/* Building Modern Roof Structure */}
      <group position={[0, totalFloors * 0.8 + 0.08, 0.35]}>
        {/* Main Roof Plate */}
        <RoundedBox args={[4.6, 0.12, 1.8]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial color="#00685f" roughness={0.3} metalness={0.2} />
        </RoundedBox>

        {/* Illuminated Acrylic Hostel Name Sign */}
        <group position={[0, 0.28, 0.85]}>
          <RoundedBox args={[1.8, 0.36, 0.06]} radius={0.03} position={[0, 0, 0]}>
            <meshStandardMaterial
              color="#00201d"
              roughness={0.2}
            />
          </RoundedBox>
          {/* Glowing Acrylic Front Plate */}
          <mesh position={[0, 0, 0.035]}>
            <planeGeometry args={[1.7, 0.28]} />
            <meshStandardMaterial
              color="#89f5e7"
              emissive="#008378"
              emissiveIntensity={0.8}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* Solar Panels Grid */}
        <group position={[-1.2, 0.1, 0]}>
          <RoundedBox args={[1.4, 0.04, 1.1]} radius={0.01} position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
            <meshStandardMaterial color="#141b2b" metalness={0.9} roughness={0.1} />
          </RoundedBox>
        </group>

        {/* Rooftop Water Reservoir / Chill Hub */}
        <group position={[1.4, 0.2, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.45, 16]} />
            <meshStandardMaterial color="#384357" roughness={0.4} metalness={0.4} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
