import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasWrapper } from './CanvasWrapper';
import { useReducedMotion } from './useReducedMotion';

/**
 * 3D Stylized Room Interior Mesh matching the high-end reference image
 */
export const RoomInteriorMesh = ({
  activeTab = 'interior',
  accentColor = '#00685f'
}) => {
  const fanRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  // Ceiling Fan continuous smooth rotation
  useFrame((state, delta) => {
    if (fanRef.current && !prefersReducedMotion) {
      fanRef.current.rotation.y += delta * 4.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Warm Room Ambient & Accent Lights */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 4]} intensity={1.2} />
      {/* Sunlight through Window */}
      <pointLight position={[1.8, 1.2, -1.2]} intensity={1.4} color="#ffeedd" distance={4.5} />
      {/* Warm Desk Lamp Point Light */}
      <pointLight position={[-0.9, 0.45, -0.6]} intensity={1.8} color="#ffbe98" distance={2.5} />

      {/* Room Enclosing Walls (Cream/Warm Grey Interior) */}
      <group position={[0, 0, 0]}>
        {/* Floor (Ceramic Tiles / Parquet) */}
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.2, 4.2]} />
          <meshStandardMaterial color="#ded7cc" roughness={0.6} />
        </mesh>

        {/* Soft Rug Carpet */}
        <RoundedBox args={[1.6, 0.02, 2.0]} radius={0.02} position={[0.1, -1.18, 0.2]}>
          <meshStandardMaterial color="#beb6aa" roughness={0.9} />
        </RoundedBox>

        {/* Back Wall */}
        <mesh position={[0, 0.4, -2.1]}>
          <planeGeometry args={[4.2, 3.2]} />
          <meshStandardMaterial color="#f0eae1" roughness={0.7} />
        </mesh>

        {/* Left Wall */}
        <mesh position={[-2.1, 0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4.2, 3.2]} />
          <meshStandardMaterial color="#e8e2d8" roughness={0.7} />
        </mesh>

        {/* Right Wall with Window */}
        <mesh position={[2.1, 0.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[4.2, 3.2]} />
          <meshStandardMaterial color="#eae4da" roughness={0.7} />
        </mesh>
      </group>

      {/* Window with Outside Light & Curtains (Right Wall) */}
      <group position={[2.08, 0.6, -0.2]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Window Frame */}
        <RoundedBox args={[1.2, 1.4, 0.06]} radius={0.02} position={[0, 0, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.4} />
        </RoundedBox>
        {/* Window Glass Pane */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.1, 1.3]} />
          <meshStandardMaterial color="#89f5e7" emissive="#00685f" emissiveIntensity={0.3} roughness={0.1} />
        </mesh>
        {/* Curtains (Dark Green matching theme) */}
        {[-0.65, 0.65].map((x, i) => (
          <RoundedBox key={i} args={[0.26, 1.6, 0.08]} radius={0.04} position={[x, -0.05, 0.08]}>
            <meshStandardMaterial color="#1a3d35" roughness={0.8} />
          </RoundedBox>
        ))}
      </group>

      {/* Ceiling Fan */}
      <group position={[0, 1.7, 0]} ref={fanRef}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
          <meshStandardMaterial color="#384357" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
          <meshStandardMaterial color="#2d3340" metalness={0.7} />
        </mesh>
        {/* 3 Blades */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
          <group key={i} rotation={[0, angle, 0]}>
            <RoundedBox args={[0.7, 0.015, 0.12]} radius={0.01} position={[0.42, 0, 0]}>
              <meshStandardMaterial color="#384357" roughness={0.4} />
            </RoundedBox>
          </group>
        ))}
      </group>

      {/* =================================================== */}
      {/* 1. STUDY AREA (Left & Back corner)                  */}
      {/* =================================================== */}
      <group position={[-1.1, -0.4, -1.2]}>
        {/* Wooden Study Desk */}
        <RoundedBox args={[1.4, 0.08, 0.8]} radius={0.02} position={[0, 0, 0]}>
          <meshStandardMaterial color="#a0714f" roughness={0.4} />
        </RoundedBox>
        {/* Desk Metal Frame / Drawers */}
        <RoundedBox args={[0.4, 0.68, 0.74]} radius={0.02} position={[-0.45, -0.38, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.5} />
        </RoundedBox>
        <mesh position={[0.45, -0.38, 0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.72, 8]} />
          <meshStandardMaterial color="#222" metalness={0.8} />
        </mesh>
        <mesh position={[0.45, -0.38, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.72, 8]} />
          <meshStandardMaterial color="#222" metalness={0.8} />
        </mesh>

        {/* Laptop with HostelHub Logo Display */}
        <group position={[0, 0.1, 0]} scale={0.65}>
          {/* Base Keyboard */}
          <RoundedBox args={[0.75, 0.03, 0.52]} radius={0.01} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1e2430" metalness={0.7} />
          </RoundedBox>
          {/* Screen Lid (Opened at 110 deg) */}
          <group position={[0, 0.02, -0.25]} rotation={[-Math.PI / 2.8, 0, 0]}>
            <RoundedBox args={[0.75, 0.5, 0.02]} radius={0.01} position={[0, 0.25, 0]}>
              <meshStandardMaterial color="#2a3240" metalness={0.6} />
            </RoundedBox>
            <mesh position={[0, 0.25, 0.015]}>
              <planeGeometry args={[0.68, 0.44]} />
              <meshStandardMaterial
                color="#00685f"
                emissive="#89f5e7"
                emissiveIntensity={0.6}
                roughness={0.2}
              />
            </mesh>
          </group>
        </group>

        {/* Glowing Desk Lamp */}
        <group position={[-0.48, 0.04, -0.15]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
            <meshStandardMaterial color="#141b2b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.2, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.38, 8]} />
            <meshStandardMaterial color="#ffb59a" metalness={0.8} />
          </mesh>
          <mesh position={[0.06, 0.36, 0]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.09, 0.12, 16]} />
            <meshStandardMaterial color="#2d3340" emissive="#ffdbce" emissiveIntensity={0.5} />
          </mesh>
        </group>

        {/* Student Ergonomic Chair */}
        <group position={[0, -0.25, 0.65]} rotation={[0, -0.3, 0]}>
          {/* Seat Cushion */}
          <RoundedBox args={[0.42, 0.08, 0.42]} radius={0.03} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1a2230" roughness={0.5} />
          </RoundedBox>
          {/* Mesh Backrest */}
          <RoundedBox args={[0.4, 0.45, 0.04]} radius={0.02} position={[0, 0.28, -0.18]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#00685f" roughness={0.6} />
          </RoundedBox>
          {/* Chair Stem & Wheels */}
          <mesh position={[0, -0.26, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
            <meshStandardMaterial color="#141b2b" metalness={0.9} />
          </mesh>
        </group>

        {/* Notebook & Pen on Desk */}
        <RoundedBox args={[0.26, 0.02, 0.34]} radius={0.01} position={[0.35, 0.05, 0.05]} rotation={[0, 0.15, 0]}>
          <meshStandardMaterial color="#ffdbce" roughness={0.6} />
        </RoundedBox>
      </group>

      {/* Multi-tier Wall Bookshelf (Above Desk) */}
      <group position={[-1.1, 0.7, -1.9]}>
        {/* Top Shelf Plank */}
        <RoundedBox args={[1.5, 0.04, 0.32]} radius={0.01} position={[0, 0.35, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.4} />
        </RoundedBox>
        {/* Bottom Shelf Plank */}
        <RoundedBox args={[1.5, 0.04, 0.32]} radius={0.01} position={[0, -0.15, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.4} />
        </RoundedBox>

        {/* Colorful Textbooks & Notes */}
        {[-0.55, -0.45, -0.35, -0.22, -0.1, 0.05, 0.2, 0.35, 0.48].map((x, idx) => (
          <RoundedBox
            key={idx}
            args={[0.07, idx % 2 === 0 ? 0.34 : 0.28, 0.22]}
            radius={0.01}
            position={[x, 0.04, 0]}
            rotation={[0, 0, idx === 8 ? 0.2 : 0]}
          >
            <meshStandardMaterial
              color={
                idx % 3 === 0
                  ? '#00685f'
                  : idx % 3 === 1
                  ? '#b05e3d'
                  : '#3b82f6'
              }
              roughness={0.4}
            />
          </RoundedBox>
        ))}

        {/* Small Potted Plant on Top Shelf */}
        <group position={[0.5, 0.45, 0]}>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.08, 0.06, 0.12, 12]} />
            <meshStandardMaterial color="#f0eae1" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#2d6a4f" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* =================================================== */}
      {/* 2. SLEEPING AREA (Right side)                       */}
      {/* =================================================== */}
      <group position={[1.1, -0.65, 0.1]}>
        {/* Student Bed Wooden Base */}
        <RoundedBox args={[0.95, 0.3, 1.9]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.5} />
        </RoundedBox>

        {/* Comfortable Mattress */}
        <RoundedBox args={[0.88, 0.18, 1.82]} radius={0.03} position={[0, 0.22, 0]}>
          <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
        </RoundedBox>

        {/* Teal Quilt / Blanket */}
        <RoundedBox args={[0.89, 0.12, 1.2]} radius={0.03} position={[0, 0.26, 0.3]}>
          <meshStandardMaterial color="#1b4d3e" roughness={0.7} />
        </RoundedBox>

        {/* Pillow */}
        <RoundedBox args={[0.65, 0.1, 0.38]} radius={0.03} position={[0, 0.34, -0.65]} rotation={[-0.1, 0, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </RoundedBox>

        {/* Bedside Nightstand */}
        <group position={[-0.75, 0.05, -0.65]}>
          <RoundedBox args={[0.42, 0.45, 0.42]} radius={0.02} position={[0, 0, 0]}>
            <meshStandardMaterial color="#a0714f" roughness={0.4} />
          </RoundedBox>
          {/* Small alarm clock / book */}
          <RoundedBox args={[0.14, 0.04, 0.18]} radius={0.01} position={[0, 0.25, 0]}>
            <meshStandardMaterial color="#00685f" roughness={0.4} />
          </RoundedBox>
        </group>

        {/* Tall Wooden Wardrobe (Back right corner) */}
        <group position={[0.2, 0.75, -1.5]}>
          <RoundedBox args={[0.75, 1.8, 0.55]} radius={0.03} position={[0, 0, 0]}>
            <meshStandardMaterial color="#404754" roughness={0.4} />
          </RoundedBox>
          {/* Wardrobe Door Handles */}
          <mesh position={[-0.04, 0, 0.29]}>
            <cylinderGeometry args={[0.01, 0.01, 0.18, 8]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.9} />
          </mesh>
          <mesh position={[0.04, 0, 0.29]}>
            <cylinderGeometry args={[0.01, 0.01, 0.18, 8]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

/**
 * Standalone Canvas for the Interactive 3D Room Interior View
 */
export const RoomInterior3D = ({
  activeTab = 'interior',
  className = 'w-full h-full'
}) => {
  // Camera target coordinates based on active tab
  const getCameraConfig = () => {
    switch (activeTab) {
      case 'study-area':
        return { position: [-1.1, 0.35, 0.8], fov: 42 };
      case 'bed-area':
        return { position: [1.1, 0.4, 1.8], fov: 42 };
      case 'room-view':
      case 'interior':
      default:
        return { position: [0.3, 1.2, 3.2], fov: 45 };
    }
  };

  const cameraConfig = getCameraConfig();

  return (
    <CanvasWrapper
      className={className}
      camera={cameraConfig}
      disableOnMobile={false}
      fallback={
        <div className="w-full h-full flex flex-col items-center justify-center text-primary/40 p-4">
          <span className="material-symbols-outlined text-6xl mb-2">hotel</span>
          <p className="font-semibold text-xs text-on-surface-variant">3D Room Interior View</p>
        </div>
      }
    >
      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={1.6}
        maxDistance={5.2}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.05}
      />
      <RoomInteriorMesh activeTab={activeTab} />
    </CanvasWrapper>
  );
};
