import React from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Procedural 3D Central / Middle Space Component
 * Renders Courtyard, Garden, Study Area, Common Area, or Atrium with procedural
 * low-poly trees, ceramic planter boxes, campus benches, wooden study tables,
 * central bollards, and academic notice board.
 */
export const Courtyard3D = ({
  courtyardData = {},
  lightingMode = 'day',
  accentColor = '#00685f',
  qualityMode = 'high'
}) => {
  const {
    enabled = true,
    type = 'Courtyard',
    width = 4.2,
    depth = 3.2,
    items = []
  } = courtyardData;

  const isNight = lightingMode === 'night';

  if (!enabled) return null;

  return (
    <group position={[0, 0.08, 0]}>
      {/* =================================================== */}
      {/* 1. COURTYARD BASE PLATFORM (Lawn / Stone Courtyard) */}
      {/* =================================================== */}
      {/* Main Ground Infill */}
      <RoundedBox args={[width, 0.04, depth]} radius={0.02} smoothness={3} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={
            type === 'Garden'
              ? isNight ? '#12261b' : '#27523d'
              : isNight ? '#1b2230' : '#cfd7e6'
          }
          roughness={0.8}
        />
      </RoundedBox>

      {/* Criss-Cross Paved Walkway Pathway */}
      <RoundedBox args={[width * 0.9, 0.045, 0.7]} radius={0.01} position={[0, 0.005, 0]}>
        <meshStandardMaterial
          color={isNight ? '#252e3d' : '#e2e7f4'}
          roughness={0.4}
        />
      </RoundedBox>
      <RoundedBox args={[0.7, 0.045, depth * 0.9]} radius={0.01} position={[0, 0.005, 0]}>
        <meshStandardMaterial
          color={isNight ? '#252e3d' : '#e2e7f4'}
          roughness={0.4}
        />
      </RoundedBox>

      {/* Center Garden Focal Flowerbed / Water Feature Accent */}
      <RoundedBox args={[1.2, 0.06, 1.2]} radius={0.04} position={[0, 0.02, 0]}>
        <meshStandardMaterial
          color={isNight ? '#163628' : '#2e6b4d'}
          roughness={0.6}
        />
      </RoundedBox>

      {/* =================================================== */}
      {/* 2. PROCEDURAL COURTYARD ELEMENTS                    */}
      {/* =================================================== */}
      {items.map((item, idx) => {
        if (item.type === 'tree') {
          return (
            <group key={`tree-${idx}`} position={item.position} scale={item.scale || 1}>
              {/* Tree Trunk */}
              <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.04, 0.06, 0.5, 8]} />
                <meshStandardMaterial color="#5c3a21" roughness={0.9} />
              </mesh>
              {/* Low-Poly Foliage Spheres */}
              <mesh position={[0, 0.6, 0]}>
                <sphereGeometry args={[0.28, 10, 10]} />
                <meshStandardMaterial
                  color={isNight ? '#163628' : '#2d6a4f'}
                  roughness={0.8}
                />
              </mesh>
              <mesh position={[0.08, 0.72, 0.05]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial
                  color={isNight ? '#1a4232' : '#40916c'}
                  roughness={0.8}
                />
              </mesh>
            </group>
          );
        }

        if (item.type === 'bench') {
          return (
            <group key={`bench-${idx}`} position={item.position} rotation={item.rotation || [0, 0, 0]}>
              {/* Wooden Planks */}
              <RoundedBox args={[0.65, 0.04, 0.22]} radius={0.01} position={[0, 0.12, 0]}>
                <meshStandardMaterial color="#8a5a36" roughness={0.65} />
              </RoundedBox>
              {/* Metal Legs */}
              <mesh position={[-0.24, 0.06, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.12, 6]} />
                <meshStandardMaterial color="#1a2233" metalness={0.8} />
              </mesh>
              <mesh position={[0.24, 0.06, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.12, 6]} />
                <meshStandardMaterial color="#1a2233" metalness={0.8} />
              </mesh>
            </group>
          );
        }

        if (item.type === 'study_table') {
          return (
            <group key={`table-${idx}`} position={item.position} rotation={item.rotation || [0, 0, 0]}>
              {/* Wooden Table Top */}
              <RoundedBox args={[0.9, 0.04, 0.6]} radius={0.015} position={[0, 0.22, 0]}>
                <meshStandardMaterial color="#9c6644" roughness={0.5} />
              </RoundedBox>
              {/* Table Legs */}
              {[-0.38, 0.38].map((x, xi) =>
                [-0.24, 0.24].map((z, zi) => (
                  <mesh key={`${xi}-${zi}`} position={[x, 0.11, z]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.22, 6]} />
                    <meshStandardMaterial color="#222a38" metalness={0.8} />
                  </mesh>
                ))
              )}
              {/* Two Chairs */}
              {[-0.45, 0.45].map((z, ci) => (
                <group key={`chair-${ci}`} position={[0, 0, z]} rotation={[0, ci === 0 ? 0 : Math.PI, 0]}>
                  <RoundedBox args={[0.32, 0.03, 0.32]} radius={0.01} position={[0, 0.14, 0]}>
                    <meshStandardMaterial color="#7f5539" roughness={0.6} />
                  </RoundedBox>
                  <mesh position={[0, 0.26, -0.14]}>
                    <planeGeometry args={[0.3, 0.22]} />
                    <meshStandardMaterial color="#7f5539" roughness={0.6} />
                  </mesh>
                </group>
              ))}
            </group>
          );
        }

        if (item.type === 'courtyard_light') {
          return (
            <group key={`light-${idx}`} position={item.position}>
              <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
                <meshStandardMaterial color="#1a2233" metalness={0.9} />
              </mesh>
              {/* Glowing Lamp Cap */}
              <mesh position={[0, 0.52, 0]}>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshStandardMaterial
                  color={isNight ? '#ffbe98' : '#ffebd8'}
                  emissive="#ffb59a"
                  emissiveIntensity={isNight ? 2.0 : 0.6}
                />
              </mesh>
              {isNight && qualityMode !== 'performance' && (
                <pointLight color="#ffd8a8" intensity={0.8} distance={2.2} position={[0, 0.55, 0]} />
              )}
            </group>
          );
        }

        if (item.type === 'planter') {
          return (
            <group key={`planter-${idx}`} position={item.position}>
              <RoundedBox args={[0.42, 0.16, 0.32]} radius={0.02} position={[0, 0.08, 0]}>
                <meshStandardMaterial color={isNight ? '#222a38' : '#ffffff'} roughness={0.4} />
              </RoundedBox>
              <mesh position={[0, 0.22, 0]}>
                <sphereGeometry args={[0.15, 10, 10]} />
                <meshStandardMaterial color={isNight ? '#163828' : '#387c5b'} roughness={0.7} />
              </mesh>
            </group>
          );
        }

        return null;
      })}

      {/* Academic Notice Board in the Courtyard */}
      <group position={[width * 0.38, 0, depth * 0.35]} rotation={[0, -Math.PI / 4, 0]}>
        {/* Posts */}
        <mesh position={[-0.2, 0.3, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
          <meshStandardMaterial color="#1a2233" metalness={0.8} />
        </mesh>
        <mesh position={[0.2, 0.3, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.6, 6]} />
          <meshStandardMaterial color="#1a2233" metalness={0.8} />
        </mesh>
        {/* Board Panel */}
        <RoundedBox args={[0.48, 0.32, 0.02]} radius={0.01} position={[0, 0.42, 0.01]}>
          <meshStandardMaterial color="#004d46" roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0.42, 0.022]}>
          <planeGeometry args={[0.42, 0.26]} />
          <meshBasicMaterial color={isNight ? '#89f5e7' : '#e0f2fe'} />
        </mesh>
      </group>
    </group>
  );
};
