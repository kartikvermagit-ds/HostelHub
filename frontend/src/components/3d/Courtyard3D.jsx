import React, { useState } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useHostelStore } from '../../stores/hostelStore';

/**
 * Advanced Procedural 3D Central / Middle Space Component
 * Architecturally bounded inside the hostel wings with multi-tier paving,
 * organic clustered trees, study stations, social lounges, water features,
 * glassmorphic academic notice boards, and Day/Night atmospheric lighting.
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
    width = 4.6,
    depth = 3.2,
    items = []
  } = courtyardData;

  const { setActiveInteractiveModal, setCameraMode } = useHostelStore();
  const [hoveredItem, setHoveredItem] = useState(null);

  const isNight = lightingMode === 'night';

  if (!enabled) return null;

  const handlePointerOver = (name) => (e) => {
    e.stopPropagation();
    setHoveredItem(name);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => (e) => {
    e.stopPropagation();
    setHoveredItem(null);
    document.body.style.cursor = 'auto';
  };

  return (
    <group position={[0, 0.07, 0]}>
      {/* =================================================== */}
      {/* 1. MULTI-TIER COURTYARD FLOOR & WALKWAYS            */}
      {/* =================================================== */}
      {/* Outer Stone Curb Boundary */}
      <RoundedBox args={[width + 0.16, 0.03, depth + 0.16]} radius={0.015} position={[0, 0, 0]}>
        <meshStandardMaterial
          color={isNight ? '#101620' : '#8c95a6'}
          roughness={0.6}
          metalness={0.1}
        />
      </RoundedBox>

      {/* Main Ground Infill (Grass Lawn / Patio Slab) */}
      <RoundedBox args={[width, 0.045, depth]} radius={0.02} position={[0, 0.01, 0]}>
        <meshStandardMaterial
          color={
            type === 'Garden' || type === 'Courtyard'
              ? isNight ? '#122b1f' : '#2d6349'
              : isNight ? '#1c2432' : '#d2d9e8'
          }
          roughness={0.85}
        />
      </RoundedBox>

      {/* Primary Geometric Architectural Paved Walkway System */}
      <group position={[0, 0.02, 0]}>
        {/* Main Center Walkway Spine */}
        <RoundedBox args={[width * 0.94, 0.03, 0.72]} radius={0.008} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={isNight ? '#253040' : '#e6ebf5'}
            roughness={0.4}
          />
        </RoundedBox>

        {/* Cross-Walkway Connecting Entrance to Wings */}
        <RoundedBox args={[0.72, 0.03, depth * 0.94]} radius={0.008} position={[0, 0, 0]}>
          <meshStandardMaterial
            color={isNight ? '#253040' : '#e6ebf5'}
            roughness={0.4}
          />
        </RoundedBox>

        {/* Stepping Stone Perimeter Accent Trim */}
        <RoundedBox args={[width * 0.88, 0.025, depth * 0.88]} radius={0.01} position={[0, -0.002, 0]}>
          <meshStandardMaterial
            color={isNight ? '#18202c' : '#c7cfde'}
            roughness={0.5}
            wireframe={false}
          />
        </RoundedBox>
      </group>

      {/* =================================================== */}
      {/* 2. CENTRAL FOCAL FEATURE BY TYPE                    */}
      {/* =================================================== */}
      {type === 'Courtyard' && (
        /* Architectural Tiered Fountain & Reflection Pool */
        <group
          position={[0, 0.03, 0]}
          onPointerOver={handlePointerOver('water_feature')}
          onPointerOut={handlePointerOut()}
          onClick={(e) => {
            e.stopPropagation();
            setCameraMode('courtyard');
          }}
        >
          {/* Outer Basin Curb */}
          <RoundedBox args={[1.3, 0.1, 1.3]} radius={0.03} position={[0, 0.05, 0]}>
            <meshStandardMaterial color={isNight ? '#1e2634' : '#ffffff'} roughness={0.3} metalness={0.2} />
          </RoundedBox>
          {/* Shimmering Reflection Water Pool */}
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.1, 1.1]} />
            <meshStandardMaterial
              color="#00a396"
              emissive={accentColor}
              emissiveIntensity={isNight ? 0.6 : 0.25}
              roughness={0.05}
              metalness={0.4}
              transparent
              opacity={0.88}
            />
          </mesh>
          {/* Central Fountain Spire */}
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.2, 12]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.8} roughness={0.15} />
          </mesh>
        </group>
      )}

      {type === 'Garden' && (
        /* Central Botanical Flowerbed Cluster */
        <group position={[0, 0.03, 0]}>
          <RoundedBox args={[1.4, 0.1, 1.4]} radius={0.04} position={[0, 0.05, 0]}>
            <meshStandardMaterial color={isNight ? '#1a2230' : '#475569'} roughness={0.4} />
          </RoundedBox>
          <mesh position={[0, 0.11, 0]}>
            <sphereGeometry args={[0.42, 12, 10]} />
            <meshStandardMaterial color={isNight ? '#1b4d36' : '#2d6a4f'} roughness={0.7} />
          </mesh>
        </group>
      )}

      {type === 'Atrium' && (
        /* Architectural Atrium Monument Pylon */
        <group position={[0, 0.03, 0]}>
          <RoundedBox args={[0.75, 0.45, 0.75]} radius={0.02} position={[0, 0.22, 0]}>
            <meshStandardMaterial color={isNight ? '#00201d' : '#004d46'} roughness={0.2} metalness={0.5} />
          </RoundedBox>
          <mesh position={[0, 0.46, 0]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color="#89f5e7"
              emissive="#89f5e7"
              emissiveIntensity={isNight ? 1.4 : 0.8}
              roughness={0.1}
            />
          </mesh>
        </group>
      )}

      {/* =================================================== */}
      {/* 3. PROCEDURAL COURTYARD ITEMS & WORKSTATIONS        */}
      {/* =================================================== */}
      {items.map((item, idx) => {
        // A. ORGANIC PROCEDURAL TREES (Multi-tier Foliage Clusters)
        if (item.type === 'tree') {
          return (
            <group key={`tree-${idx}`} position={item.position} scale={item.scale || 1}>
              {/* Tapered Trunk */}
              <mesh position={[0, 0.28, 0]}>
                <cylinderGeometry args={[0.038, 0.065, 0.56, 8]} />
                <meshStandardMaterial color="#4a2e18" roughness={0.9} />
              </mesh>
              {/* Clustered Foliage Spheres (Natural organic canopy) */}
              <mesh position={[0, 0.65, 0]}>
                <sphereGeometry args={[0.29, 10, 10]} />
                <meshStandardMaterial
                  color={isNight ? '#143625' : '#2d6a4f'}
                  roughness={0.8}
                />
              </mesh>
              <mesh position={[0.09, 0.76, 0.06]}>
                <sphereGeometry args={[0.22, 8, 8]} />
                <meshStandardMaterial
                  color={isNight ? '#18422e' : '#40916c'}
                  roughness={0.8}
                />
              </mesh>
              <mesh position={[-0.08, 0.72, -0.05]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial
                  color={isNight ? '#163d2a' : '#52b788'}
                  roughness={0.8}
                />
              </mesh>
            </group>
          );
        }

        // B. CAMPUS WOODEN BENCHES WITH METAL SUPPORTS
        if (item.type === 'bench') {
          return (
            <group
              key={`bench-${idx}`}
              position={item.position}
              rotation={item.rotation || [0, 0, 0]}
              onPointerOver={handlePointerOver(`bench-${idx}`)}
              onPointerOut={handlePointerOut()}
              onClick={(e) => {
                e.stopPropagation();
                setCameraMode('courtyard');
              }}
            >
              {/* Wooden Seat Slats */}
              <RoundedBox args={[0.68, 0.035, 0.24]} radius={0.008} position={[0, 0.12, 0]}>
                <meshStandardMaterial color="#8a5a36" roughness={0.6} />
              </RoundedBox>
              {/* Wooden Backrest */}
              <RoundedBox args={[0.68, 0.16, 0.03]} radius={0.008} position={[0, 0.22, -0.1]}>
                <meshStandardMaterial color="#8a5a36" roughness={0.6} />
              </RoundedBox>
              {/* Dark Metal Legs & Armrests */}
              <mesh position={[-0.26, 0.07, 0]}>
                <cylinderGeometry args={[0.014, 0.014, 0.14, 6]} />
                <meshStandardMaterial color="#1a2233" metalness={0.85} />
              </mesh>
              <mesh position={[0.26, 0.07, 0]}>
                <cylinderGeometry args={[0.014, 0.014, 0.14, 6]} />
                <meshStandardMaterial color="#1a2233" metalness={0.85} />
              </mesh>
            </group>
          );
        }

        // C. OUTDOOR STUDY WORKSTATION (Tables, Chairs, Desk Lamp, Notes, Tablet)
        if (item.type === 'study_table') {
          const isHovered = hoveredItem === `table-${idx}`;
          return (
            <group
              key={`table-${idx}`}
              position={item.position}
              rotation={item.rotation || [0, 0, 0]}
              onPointerOver={handlePointerOver(`table-${idx}`)}
              onPointerOut={handlePointerOut()}
              onClick={(e) => {
                e.stopPropagation();
                setActiveInteractiveModal('courtyard-study-space');
              }}
            >
              {/* Wooden Table Top */}
              <RoundedBox args={[0.96, 0.04, 0.62]} radius={0.015} position={[0, 0.23, 0]}>
                <meshStandardMaterial
                  color={isHovered ? '#b07d54' : '#9c6644'}
                  roughness={0.5}
                  emissive={isHovered ? '#00685f' : '#000000'}
                  emissiveIntensity={isHovered ? 0.25 : 0}
                />
              </RoundedBox>

              {/* Table Metal Legs */}
              {[-0.4, 0.4].map((x, xi) =>
                [-0.24, 0.24].map((z, zi) => (
                  <mesh key={`${xi}-${zi}`} position={[x, 0.115, z]}>
                    <cylinderGeometry args={[0.018, 0.018, 0.23, 6]} />
                    <meshStandardMaterial color="#1a2233" metalness={0.85} />
                  </mesh>
                ))
              )}

              {/* Open Notebook & Tablet Silhouette on Table */}
              <mesh position={[-0.18, 0.255, 0.05]} rotation={[-Math.PI / 2, 0, 0.1]}>
                <planeGeometry args={[0.22, 0.16]} />
                <meshStandardMaterial color="#ffffff" roughness={0.4} />
              </mesh>
              <mesh position={[0.16, 0.255, -0.05]} rotation={[-Math.PI / 2, 0, -0.15]}>
                <planeGeometry args={[0.18, 0.24]} />
                <meshStandardMaterial
                  color="#111827"
                  emissive="#89f5e7"
                  emissiveIntensity={isNight ? 0.6 : 0.2}
                  roughness={0.2}
                />
              </mesh>

              {/* Mini Table Study Lamp */}
              <group position={[0.34, 0.25, 0.18]}>
                <mesh position={[0, 0.06, 0]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.12, 6]} />
                  <meshStandardMaterial color="#1a2233" metalness={0.9} />
                </mesh>
                <mesh position={[0, 0.12, 0]}>
                  <sphereGeometry args={[0.03, 8, 8]} />
                  <meshStandardMaterial
                    color={isNight ? '#ffbe98' : '#ffeedd'}
                    emissive="#ffbe98"
                    emissiveIntensity={isNight ? 2.2 : 0.5}
                  />
                </mesh>
                {isNight && qualityMode !== 'performance' && (
                  <pointLight color="#ffd8a8" intensity={0.6} distance={1.4} position={[0, 0.14, 0]} />
                )}
              </group>

              {/* Two Opposite Study Chairs with Backrests */}
              {[-0.48, 0.48].map((z, ci) => (
                <group key={`chair-${ci}`} position={[0, 0, z]} rotation={[0, ci === 0 ? 0 : Math.PI, 0]}>
                  <RoundedBox args={[0.34, 0.03, 0.34]} radius={0.01} position={[0, 0.14, 0]}>
                    <meshStandardMaterial color="#7f5539" roughness={0.6} />
                  </RoundedBox>
                  <RoundedBox args={[0.32, 0.24, 0.02]} radius={0.008} position={[0, 0.28, -0.15]}>
                    <meshStandardMaterial color="#7f5539" roughness={0.6} />
                  </RoundedBox>
                  {/* Chair legs */}
                  {[-0.14, 0.14].map((cx, cxi) => (
                    <mesh key={cxi} position={[cx, 0.07, 0]}>
                      <cylinderGeometry args={[0.012, 0.012, 0.14, 6]} />
                      <meshStandardMaterial color="#1a2233" metalness={0.8} />
                    </mesh>
                  ))}
                </group>
              ))}
            </group>
          );
        }

        // D. COMMON AREA SOCIAL LOUNGE (Circular / Modular Seating)
        if (item.type === 'social_lounge') {
          return (
            <group key={`lounge-${idx}`} position={item.position}>
              <RoundedBox args={[0.85, 0.14, 0.85]} radius={0.03} position={[0, 0.07, 0]}>
                <meshStandardMaterial color="#384357" roughness={0.4} />
              </RoundedBox>
              <mesh position={[0, 0.15, 0]}>
                <cylinderGeometry args={[0.28, 0.28, 0.04, 16]} />
                <meshStandardMaterial color="#89f5e7" metalness={0.7} roughness={0.2} />
              </mesh>
            </group>
          );
        }

        // E. COURTYARD BOLLARD / LANTERN POSTS
        if (item.type === 'courtyard_light') {
          return (
            <group key={`light-${idx}`} position={item.position}>
              <mesh position={[0, 0.26, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.52, 8]} />
                <meshStandardMaterial color="#1a2233" metalness={0.9} />
              </mesh>
              {/* Glowing Lamp Cap */}
              <mesh position={[0, 0.54, 0]}>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshStandardMaterial
                  color={isNight ? '#ffbe98' : '#ffebd8'}
                  emissive="#ffb59a"
                  emissiveIntensity={isNight ? 2.0 : 0.6}
                />
              </mesh>
              {isNight && qualityMode !== 'performance' && (
                <pointLight color="#ffd8a8" intensity={0.8} distance={2.4} position={[0, 0.56, 0]} />
              )}
            </group>
          );
        }

        // F. CERAMIC PLANTER BOXES WITH SHRUBS
        if (item.type === 'planter') {
          return (
            <group key={`planter-${idx}`} position={item.position}>
              <RoundedBox args={[0.44, 0.16, 0.32]} radius={0.02} position={[0, 0.08, 0]}>
                <meshStandardMaterial color={isNight ? '#222a38' : '#ffffff'} roughness={0.4} />
              </RoundedBox>
              <mesh position={[0, 0.22, 0]}>
                <sphereGeometry args={[0.15, 10, 10]} />
                <meshStandardMaterial color={isNight ? '#163828' : '#387c5b'} roughness={0.7} />
              </mesh>
            </group>
          );
        }

        // G. ACADEMIC GLASSMORPHISM NOTICE BOARD (Clickable with Live Announcements!)
        if (item.type === 'notice_board') {
          const isHovered = hoveredItem === 'notice_board';
          return (
            <group
              key={`notice-${idx}`}
              position={item.position}
              rotation={item.rotation || [0, 0, 0]}
              onPointerOver={handlePointerOver('notice_board')}
              onPointerOut={handlePointerOut()}
              onClick={(e) => {
                e.stopPropagation();
                setActiveInteractiveModal('courtyard-announcements');
              }}
            >
              {/* Stainless Steel Posts */}
              <mesh position={[-0.22, 0.32, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.64, 6]} />
                <meshStandardMaterial color="#1a2233" metalness={0.85} />
              </mesh>
              <mesh position={[0.22, 0.32, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.64, 6]} />
                <meshStandardMaterial color="#1a2233" metalness={0.85} />
              </mesh>

              {/* Translucent Glass Backing Board */}
              <RoundedBox args={[0.54, 0.38, 0.02]} radius={0.015} position={[0, 0.44, 0.01]}>
                <meshStandardMaterial
                  color={isNight ? '#00201d' : '#004d46'}
                  roughness={0.2}
                  metalness={0.4}
                  transparent
                  opacity={0.92}
                />
              </RoundedBox>

              {/* Glowing Top Acrylic Banner Strip */}
              <mesh position={[0, 0.58, 0.022]}>
                <planeGeometry args={[0.5, 0.05]} />
                <meshBasicMaterial color="#89f5e7" />
              </mesh>

              {/* 3D Title on Notice Board */}
              <Text
                position={[0, 0.58, 0.025]}
                fontSize={0.034}
                color="#00201d"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.04}
              >
                HOSTEL ACADEMIC BOARD
              </Text>

              {/* Simulated Notice Papers */}
              <mesh position={[-0.12, 0.42, 0.022]}>
                <planeGeometry args={[0.2, 0.18]} />
                <meshStandardMaterial
                  color={isHovered ? '#89f5e7' : '#ffffff'}
                  roughness={0.3}
                />
              </mesh>
              <mesh position={[0.12, 0.42, 0.022]}>
                <planeGeometry args={[0.2, 0.18]} />
                <meshStandardMaterial
                  color={isHovered ? '#ffebd8' : '#f8fafc'}
                  roughness={0.3}
                />
              </mesh>
            </group>
          );
        }

        return null;
      })}
    </group>
  );
};
