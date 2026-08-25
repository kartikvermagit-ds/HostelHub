import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasWrapper } from './CanvasWrapper';
import { useReducedMotion } from './useReducedMotion';
import { useHostelStore } from '../../stores/hostelStore';

/**
 * Highly Detailed Interactive 3D Room Interior Mesh
 * Supports clickable laptop (Student Workspace), clickable books (Subject Materials), and clickable study desk (Stats)
 */
export const RoomInteriorMesh = ({
  activeTab = 'interior',
  accentColor = '#00685f',
  lightingMode = 'day'
}) => {
  const fanRef = useRef();
  const prefersReducedMotion = useReducedMotion();
  const { setActiveInteractiveModal } = useHostelStore();

  const [laptopHovered, setLaptopHovered] = useState(false);
  const [booksHovered, setBooksHovered] = useState(false);
  const [tableHovered, setTableHovered] = useState(false);

  const isNight = lightingMode === 'night';

  // Ceiling Fan smooth rotation
  useFrame((state, delta) => {
    if (fanRef.current && !prefersReducedMotion) {
      fanRef.current.rotation.y += delta * 4.2;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Dynamic Ambient & Lighting depending on Day / Night */}
      <ambientLight intensity={isNight ? 0.35 : 0.75} />
      <directionalLight position={[4, 6, 4]} intensity={isNight ? 0.6 : 1.3} />
      {/* Sunlight or Moonlight through Window */}
      <pointLight
        position={[1.8, 1.2, -1.2]}
        intensity={isNight ? 0.4 : 1.5}
        color={isNight ? '#89f5e7' : '#ffeedd'}
        distance={4.5}
      />
      {/* Warm Desk Lamp Point Light */}
      <pointLight
        position={[-1.05, 0.48, -0.6]}
        intensity={isNight ? 2.6 : 1.6}
        color="#ffbe98"
        distance={2.8}
      />

      {/* Room Enclosing Architectural Shell */}
      <group position={[0, 0, 0]}>
        {/* Floor (Warm Oak Wood / Ceramic Parquet) */}
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.4, 4.4]} />
          <meshStandardMaterial color={isNight ? '#a89d90' : '#ded7cc'} roughness={0.6} />
        </mesh>

        {/* Soft Area Rug Carpet */}
        <RoundedBox args={[1.7, 0.02, 2.1]} radius={0.02} position={[0.1, -1.18, 0.2]}>
          <meshStandardMaterial color="#b3aaa0" roughness={0.9} />
        </RoundedBox>

        {/* Back Wall */}
        <mesh position={[0, 0.4, -2.1]}>
          <planeGeometry args={[4.4, 3.2]} />
          <meshStandardMaterial color={isNight ? '#d9d2c7' : '#f0eae1'} roughness={0.7} />
        </mesh>

        {/* Left Wall */}
        <mesh position={[-2.1, 0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4.4, 3.2]} />
          <meshStandardMaterial color={isNight ? '#d0c8bd' : '#e8e2d8'} roughness={0.7} />
        </mesh>

        {/* Right Wall with Window */}
        <mesh position={[2.1, 0.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[4.4, 3.2]} />
          <meshStandardMaterial color={isNight ? '#d4ccc1' : '#eae4da'} roughness={0.7} />
        </mesh>
      </group>

      {/* Window with Outside Light & Curtains (Right Wall) */}
      <group position={[2.08, 0.6, -0.2]} rotation={[0, -Math.PI / 2, 0]}>
        <RoundedBox args={[1.25, 1.45, 0.06]} radius={0.02} position={[0, 0, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.15, 1.35]} />
          <meshStandardMaterial
            color={isNight ? '#142838' : '#89f5e7'}
            emissive={isNight ? '#001a15' : '#00685f'}
            emissiveIntensity={0.3}
            roughness={0.1}
          />
        </mesh>
        {/* Curtains */}
        {[-0.68, 0.68].map((x, i) => (
          <RoundedBox key={i} args={[0.28, 1.65, 0.08]} radius={0.04} position={[x, -0.05, 0.08]}>
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
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
          <group key={i} rotation={[0, angle, 0]}>
            <RoundedBox args={[0.7, 0.015, 0.12]} radius={0.01} position={[0.42, 0, 0]}>
              <meshStandardMaterial color="#384357" roughness={0.4} />
            </RoundedBox>
          </group>
        ))}
      </group>

      {/* =================================================== */}
      {/* 1. STUDY AREA (Interactive Table, Laptop & Lamp)    */}
      {/* =================================================== */}
      <group position={[-1.1, -0.4, -1.2]}>
        {/* Wooden Study Desk (Clickable -> Study Area Stats) */}
        <group
          onPointerOver={(e) => {
            e.stopPropagation();
            setTableHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setTableHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveInteractiveModal('study-area-stats');
          }}
        >
          <RoundedBox args={[1.45, 0.08, 0.85]} radius={0.02} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={tableHovered ? '#b5825d' : '#a0714f'}
              roughness={0.4}
            />
          </RoundedBox>
          {/* Desk Drawers / Metal Legs */}
          <RoundedBox args={[0.42, 0.68, 0.76]} radius={0.02} position={[-0.46, -0.38, 0]}>
            <meshStandardMaterial color="#384357" roughness={0.5} />
          </RoundedBox>
          {/* Drawer Metal Handles */}
          {[-0.2, -0.42].map((y, idx) => (
            <mesh key={idx} position={[-0.46, y, 0.39]}>
              <cylinderGeometry args={[0.01, 0.01, 0.16, 8]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#89f5e7" metalness={0.8} />
            </mesh>
          ))}
          {/* Desk Right Legs */}
          <mesh position={[0.48, -0.38, 0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.72, 8]} />
            <meshStandardMaterial color="#222" metalness={0.8} />
          </mesh>
          <mesh position={[0.48, -0.38, -0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.72, 8]} />
            <meshStandardMaterial color="#222" metalness={0.8} />
          </mesh>
        </group>

        {/* INTERACTIVE LAPTOP (Clickable -> Student Workspace Modal) */}
        <group
          position={[0, 0.1, 0]}
          scale={0.68}
          onPointerOver={(e) => {
            e.stopPropagation();
            setLaptopHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setLaptopHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveInteractiveModal('laptop-workspace');
          }}
        >
          {/* Keyboard Base */}
          <RoundedBox args={[0.78, 0.035, 0.54]} radius={0.01} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={laptopHovered ? '#00685f' : '#1e2430'}
              metalness={0.7}
            />
          </RoundedBox>
          {/* Glowing Trackpad */}
          <mesh position={[0, 0.02, 0.14]}>
            <planeGeometry args={[0.22, 0.14]} />
            <meshStandardMaterial color="#384357" />
          </mesh>
          {/* Screen Lid (Opened at 110 deg) */}
          <group position={[0, 0.02, -0.26]} rotation={[-Math.PI / 2.8, 0, 0]}>
            <RoundedBox args={[0.78, 0.52, 0.02]} radius={0.01} position={[0, 0.26, 0]}>
              <meshStandardMaterial color="#2a3240" metalness={0.6} />
            </RoundedBox>
            {/* Illuminated Screen with HostelHub UI Visual */}
            <mesh position={[0, 0.26, 0.015]}>
              <planeGeometry args={[0.72, 0.46]} />
              <meshStandardMaterial
                color="#00685f"
                emissive="#89f5e7"
                emissiveIntensity={laptopHovered ? 0.9 : 0.6}
                roughness={0.2}
              />
            </mesh>
          </group>
        </group>

        {/* Glowing Desk Study Lamp */}
        <group position={[-0.52, 0.04, -0.15]}>
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
            <meshStandardMaterial color="#2d3340" emissive="#ffdbce" emissiveIntensity={0.6} />
          </mesh>
        </group>

        {/* Student Ergonomic Chair */}
        <group position={[0, -0.25, 0.68]} rotation={[0, -0.25, 0]}>
          <RoundedBox args={[0.44, 0.08, 0.44]} radius={0.03} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1a2230" roughness={0.5} />
          </RoundedBox>
          <RoundedBox args={[0.42, 0.46, 0.04]} radius={0.02} position={[0, 0.28, -0.19]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#00685f" roughness={0.6} />
          </RoundedBox>
          <mesh position={[0, -0.26, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
            <meshStandardMaterial color="#141b2b" metalness={0.9} />
          </mesh>
        </group>

        {/* Desk Accessories: Water Bottle, Notebook, Smartphone */}
        {/* Notebook */}
        <RoundedBox args={[0.26, 0.02, 0.34]} radius={0.01} position={[0.36, 0.05, 0.05]} rotation={[0, 0.15, 0]}>
          <meshStandardMaterial color="#ffdbce" roughness={0.6} />
        </RoundedBox>
        {/* Pen on notebook */}
        <mesh position={[0.38, 0.065, 0.05]} rotation={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.2, 8]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#00685f" metalness={0.8} />
        </mesh>
        {/* Steel Water Bottle */}
        <group position={[0.54, 0.14, -0.22]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.24, 12]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 10]} />
            <meshStandardMaterial color="#141b2b" metalness={0.9} />
          </mesh>
        </group>
        {/* Smartphone */}
        <RoundedBox args={[0.1, 0.01, 0.18]} radius={0.005} position={[0.28, 0.045, -0.22]} rotation={[0, -0.2, 0]}>
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        {/* Student Backpack leaning against desk */}
        <group position={[-0.78, -0.4, 0.2]} rotation={[0, 0.4, 0]}>
          <RoundedBox args={[0.34, 0.48, 0.24]} radius={0.06} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1d3557" roughness={0.8} />
          </RoundedBox>
        </group>
      </group>

      {/* =================================================== */}
      {/* 2. BOOKSHELF (Clickable Books -> Subject Materials) */}
      {/* =================================================== */}
      <group
        position={[-1.1, 0.7, -1.9]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setBooksHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setBooksHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Bookshelf Planks */}
        <RoundedBox args={[1.55, 0.04, 0.32]} radius={0.01} position={[0, 0.35, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[1.55, 0.04, 0.32]} radius={0.01} position={[0, -0.15, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.4} />
        </RoundedBox>

        {/* Clickable Books with Subject Names */}
        {[
          { x: -0.58, label: 'COA', color: '#00685f', height: 0.35 },
          { x: -0.46, label: 'DSA', color: '#b05e3d', height: 0.38 },
          { x: -0.34, label: 'DBMS', color: '#3b82f6', height: 0.32 },
          { x: -0.22, label: 'Math', color: '#6d28d9', height: 0.34 },
          { x: -0.08, label: 'OS', color: '#00685f', height: 0.30 },
          { x: 0.06, label: 'Networks', color: '#b05e3d', height: 0.36 },
          { x: 0.22, label: 'AI/ML', color: '#3b82f6', height: 0.34 },
          { x: 0.36, label: 'PYQ Book', color: '#10b981', height: 0.32 },
          { x: 0.50, label: 'Notes File', color: '#f59e0b', height: 0.28, tilt: 0.2 }
        ].map((b, idx) => (
          <group
            key={idx}
            position={[b.x, 0.04, 0]}
            rotation={[0, 0, b.tilt || 0]}
            onClick={(e) => {
              e.stopPropagation();
              setActiveInteractiveModal('bookshelf-resources', b.label);
            }}
          >
            <RoundedBox args={[0.07, b.height, 0.22]} radius={0.01} position={[0, 0, 0]}>
              <meshStandardMaterial
                color={booksHovered ? '#89f5e7' : b.color}
                roughness={0.4}
                metalness={0.1}
              />
            </RoundedBox>
          </group>
        ))}

        {/* Small Succulent Pot on Top Shelf */}
        <group position={[0.54, 0.46, 0]}>
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
      {/* 3. SLEEPING AREA (Student Bed, Nightstand, Wardrobe)*/}
      {/* =================================================== */}
      <group position={[1.1, -0.65, 0.1]}>
        {/* Bed Wooden Base */}
        <RoundedBox args={[0.98, 0.3, 1.95]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.5} />
        </RoundedBox>

        {/* Mattress */}
        <RoundedBox args={[0.9, 0.18, 1.86]} radius={0.03} position={[0, 0.22, 0]}>
          <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
        </RoundedBox>

        {/* Quilt / Blanket */}
        <RoundedBox args={[0.91, 0.12, 1.25]} radius={0.03} position={[0, 0.26, 0.32]}>
          <meshStandardMaterial color="#1b4d3e" roughness={0.7} />
        </RoundedBox>

        {/* Soft Pillow */}
        <RoundedBox args={[0.68, 0.1, 0.4]} radius={0.03} position={[0, 0.34, -0.66]} rotation={[-0.1, 0, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </RoundedBox>

        {/* Bedside Nightstand with Digital Clock */}
        <group position={[-0.78, 0.05, -0.66]}>
          <RoundedBox args={[0.44, 0.45, 0.44]} radius={0.02} position={[0, 0, 0]}>
            <meshStandardMaterial color="#a0714f" roughness={0.4} />
          </RoundedBox>
          {/* Digital Clock */}
          <RoundedBox args={[0.16, 0.06, 0.08]} radius={0.01} position={[0, 0.26, 0]}>
            <meshStandardMaterial color="#141b2b" metalness={0.9} />
          </RoundedBox>
          <mesh position={[0, 0.26, 0.042]}>
            <planeGeometry args={[0.14, 0.04]} />
            <meshBasicMaterial color="#89f5e7" />
          </mesh>
        </group>

        {/* Tall Wardrobe Closet (Back corner) */}
        <group position={[0.2, 0.75, -1.5]}>
          <RoundedBox args={[0.78, 1.8, 0.58]} radius={0.03} position={[0, 0, 0]}>
            <meshStandardMaterial color="#404754" roughness={0.4} />
          </RoundedBox>
          {/* Handles */}
          <mesh position={[-0.04, 0, 0.3]}>
            <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.9} />
          </mesh>
          <mesh position={[0.04, 0, 0.3]}>
            <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

/**
 * Interactive 3D Room Interior Canvas Component
 */
export const RoomInterior3D = ({
  activeTab = 'interior',
  lightingMode = 'day',
  className = 'w-full h-full'
}) => {
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
      <RoomInteriorMesh activeTab={activeTab} lightingMode={lightingMode} />
    </CanvasWrapper>
  );
};
