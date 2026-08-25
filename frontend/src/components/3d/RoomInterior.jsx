import React from 'react';
import { RoundedBox } from '@react-three/drei';

/**
 * Stylized 3D Room Interior with Study Desk, Bed, Chair, Bookshelf & Lamp
 */
export const RoomInterior = ({ visible = false, accentColor = '#00685f' }) => {
  if (!visible) return null;

  return (
    <group position={[0, 0, 0]} scale={0.92}>
      {/* Interior Floor Carpet */}
      <mesh position={[0, -0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.95, 0.75]} />
        <meshStandardMaterial color="#e9edff" roughness={0.7} />
      </mesh>

      {/* Student Compact Bed (Left side) */}
      <group position={[-0.32, -0.16, 0.1]}>
        {/* Bed Wooden Frame */}
        <RoundedBox args={[0.34, 0.12, 0.65]} radius={0.02} position={[0, 0, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.4} />
        </RoundedBox>
        {/* Mattress & Teal Blanket */}
        <RoundedBox args={[0.3, 0.08, 0.6]} radius={0.02} position={[0, 0.08, 0]}>
          <meshStandardMaterial color={accentColor} roughness={0.5} />
        </RoundedBox>
        {/* White Pillow */}
        <RoundedBox args={[0.24, 0.06, 0.15]} radius={0.02} position={[0, 0.14, -0.2]}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </RoundedBox>
      </group>

      {/* Study Desk (Right side, back wall) */}
      <group position={[0.26, -0.1, -0.16]}>
        {/* Wooden Desktop */}
        <RoundedBox args={[0.42, 0.04, 0.28]} radius={0.01} position={[0, 0.08, 0]}>
          <meshStandardMaterial color="#b05e3d" roughness={0.3} />
        </RoundedBox>
        {/* Desk Legs */}
        {[-0.18, 0.18].map((x, i) => (
          <mesh key={i} position={[x, -0.06, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.24, 8]} />
            <meshStandardMaterial color="#384357" metalness={0.6} />
          </mesh>
        ))}

        {/* Laptop on Desk */}
        <group position={[0, 0.12, 0]} scale={0.25}>
          <RoundedBox args={[0.6, 0.04, 0.45]} radius={0.01} position={[0, 0, 0]}>
            <meshStandardMaterial color="#141b2b" metalness={0.5} />
          </RoundedBox>
          <mesh position={[0, 0.2, -0.2]} rotation={[0.2, 0, 0]}>
            <planeGeometry args={[0.55, 0.35]} />
            <meshBasicMaterial color="#89f5e7" />
          </mesh>
        </group>

        {/* Glowing Desk Study Lamp */}
        <group position={[0.15, 0.12, -0.08]}>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.12, 8]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <coneGeometry args={[0.04, 0.05, 12]} />
            <meshStandardMaterial color="#ffb59a" emissive="#ffdbce" emissiveIntensity={0.8} />
          </mesh>
          <pointLight color="#ffdbce" intensity={0.9} distance={0.9} position={[0, 0.1, 0]} />
        </group>
      </group>

      {/* Ergonomic Student Chair */}
      <group position={[0.26, -0.15, 0.12]} rotation={[0, -0.3, 0]}>
        {/* Seat */}
        <RoundedBox args={[0.18, 0.03, 0.18]} radius={0.01} position={[0, 0.05, 0]}>
          <meshStandardMaterial color="#00685f" roughness={0.4} />
        </RoundedBox>
        {/* Chair Backrest */}
        <RoundedBox args={[0.18, 0.16, 0.02]} radius={0.01} position={[0, 0.14, -0.08]}>
          <meshStandardMaterial color="#004d46" roughness={0.4} />
        </RoundedBox>
        {/* Stem & Base */}
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.14, 8]} />
          <meshStandardMaterial color="#384357" metalness={0.7} />
        </mesh>
      </group>

      {/* Wall Bookshelf (Back wall) */}
      <group position={[-0.1, 0.14, -0.32]}>
        <RoundedBox args={[0.45, 0.03, 0.14]} radius={0.01} position={[0, 0, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.5} />
        </RoundedBox>
        {/* Mini Book Spines */}
        {[-0.16, -0.09, -0.02, 0.06, 0.13].map((x, idx) => (
          <RoundedBox
            key={idx}
            args={[0.04, 0.12, 0.1]}
            radius={0.01}
            position={[x, 0.07, 0]}
            rotation={[0, 0, idx === 4 ? 0.2 : 0]}
          >
            <meshStandardMaterial
              color={idx % 2 === 0 ? '#00685f' : '#b05e3d'}
              roughness={0.4}
            />
          </RoundedBox>
        ))}
      </group>
    </group>
  );
};
