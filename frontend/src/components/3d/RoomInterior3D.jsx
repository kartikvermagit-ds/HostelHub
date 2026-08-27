import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { CanvasWrapper } from './CanvasWrapper';
import { useReducedMotion } from './useReducedMotion';
import { useHostelStore } from '../../stores/hostelStore';

/**
 * Highly Detailed Interactive 3D Room Interior Mesh
 * Realistic student room: study desk with drawers, clickable laptop with HostelHub workspace,
 * 2-tier bookshelf with 18+ varied academic books, single bed with bedding, wardrobe, and ceiling fan.
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
  const [hoveredBook, setHoveredBook] = useState(null);

  const isNight = lightingMode === 'night';

  // Ceiling Fan smooth rotation
  useFrame((state, delta) => {
    if (fanRef.current && !prefersReducedMotion) {
      fanRef.current.rotation.y += delta * 4.2;
    }
  });

  // 18+ Distinct Books with varied dimensions, colors, tilts, and subjects
  const booksData = [
    // Shelf 1 (Bottom)
    { id: 'coa-1', label: 'COA', subject: 'COA', color: '#00685f', width: 0.065, height: 0.36, depth: 0.24, x: -0.62, y: 0.05, tilt: 0 },
    { id: 'coa-2', label: 'COA PYQ', subject: 'COA', color: '#008378', width: 0.055, height: 0.34, depth: 0.23, x: -0.55, y: 0.04, tilt: 0 },
    { id: 'dsa-1', label: 'DSA', subject: 'DSA', color: '#b05e3d', width: 0.075, height: 0.40, depth: 0.25, x: -0.46, y: 0.07, tilt: 0 },
    { id: 'dsa-2', label: 'DSA Trees', subject: 'DSA', color: '#c2410c', width: 0.06, height: 0.38, depth: 0.24, x: -0.38, y: 0.06, tilt: 0 },
    { id: 'dbms-1', label: 'DBMS', subject: 'DBMS', color: '#2563eb', width: 0.07, height: 0.35, depth: 0.23, x: -0.29, y: 0.045, tilt: 0 },
    { id: 'dbms-2', label: 'SQL 3NF', subject: 'DBMS', color: '#1d4ed8', width: 0.05, height: 0.33, depth: 0.22, x: -0.22, y: 0.035, tilt: 0 },
    { id: 'math-1', label: 'MATHS', subject: 'Math', color: '#7c3aed', width: 0.08, height: 0.38, depth: 0.25, x: -0.13, y: 0.06, tilt: 0 },
    { id: 'math-2', label: 'Fourier', subject: 'Math', color: '#6d28d9', width: 0.06, height: 0.35, depth: 0.23, x: -0.04, y: 0.045, tilt: 0 },
    { id: 'os-1', label: 'OS', subject: 'OS', color: '#047857', width: 0.07, height: 0.37, depth: 0.24, x: 0.05, y: 0.055, tilt: 0 },
    { id: 'os-2', label: 'Semaphores', subject: 'OS', color: '#065f46', width: 0.055, height: 0.34, depth: 0.23, x: 0.13, y: 0.04, tilt: 0 },
    { id: 'net-1', label: 'NETWORKS', subject: 'Networks', color: '#d97706', width: 0.075, height: 0.39, depth: 0.25, x: 0.22, y: 0.065, tilt: 0 },
    { id: 'py-1', label: 'PYTHON', subject: 'Python', color: '#0284c7', width: 0.065, height: 0.36, depth: 0.24, x: 0.31, y: 0.05, tilt: 0 },
    { id: 'ai-1', label: 'AI/ML', subject: 'AI/ML', color: '#9333ea', width: 0.07, height: 0.38, depth: 0.25, x: 0.40, y: 0.06, tilt: 0 },
    { id: 'lean-1', label: 'Lecture File', subject: 'COA', color: '#ea580c', width: 0.06, height: 0.34, depth: 0.23, x: 0.52, y: 0.04, tilt: -0.22 },

    // Shelf 2 (Top Stacked & Standing)
    { id: 'top-1', label: 'PYQ 2025', subject: 'PYQ Book', color: '#00685f', width: 0.06, height: 0.32, depth: 0.22, x: -0.58, y: 0.52, tilt: 0 },
    { id: 'top-2', label: 'CT Notes', subject: 'COA', color: '#384357', width: 0.07, height: 0.30, depth: 0.21, x: -0.50, y: 0.51, tilt: 0 },
    { id: 'top-3', label: 'Algorithms', subject: 'DSA', color: '#b05e3d', width: 0.065, height: 0.33, depth: 0.22, x: -0.42, y: 0.525, tilt: 0 },
    { id: 'top-4', label: 'Lab Manual', subject: 'DBMS', color: '#2563eb', width: 0.055, height: 0.29, depth: 0.20, x: -0.34, y: 0.505, tilt: 0.18 }
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* =================================================== */}
      {/* 1. ATMOSPHERIC DAY & NIGHT LIGHTING                 */}
      {/* =================================================== */}
      <ambientLight intensity={isNight ? 0.35 : 0.85} />
      <directionalLight position={[4, 6, 4]} intensity={isNight ? 0.6 : 1.4} />

      {/* Sunlight or Moonlight Through Window */}
      <pointLight
        position={[2.0, 1.2, -0.6]}
        intensity={isNight ? 0.5 : 1.6}
        color={isNight ? '#89f5e7' : '#fff7ed'}
        distance={4.8}
      />

      {/* Warm Desk Lamp Point Light */}
      <pointLight
        position={[-1.1, 0.48, -0.65]}
        intensity={isNight ? 2.8 : 1.8}
        color="#ffbe98"
        distance={3.0}
      />

      {/* Ceiling Ambient Downlight */}
      <pointLight
        position={[0, 1.4, 0]}
        intensity={isNight ? 0.4 : 0.8}
        color={isNight ? '#89f5e7' : '#ffffff'}
        distance={3.5}
      />

      {/* =================================================== */}
      {/* 2. ROOM ENCLOSING ARCHITECTURAL SHELL               */}
      {/* =================================================== */}
      <group position={[0, 0, 0]}>
        {/* Floor Parquet Ceramic Tiles */}
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.6, 4.6]} />
          <meshStandardMaterial color={isNight ? '#9e9284' : '#dcd5c9'} roughness={0.5} />
        </mesh>

        {/* Soft Woven Area Rug Carpet */}
        <RoundedBox args={[1.8, 0.02, 2.3]} radius={0.02} position={[0.1, -1.18, 0.2]}>
          <meshStandardMaterial color={isNight ? '#2a3342' : '#cbd5e1'} roughness={0.9} />
        </RoundedBox>

        {/* Back Wall */}
        <mesh position={[0, 0.4, -2.1]}>
          <planeGeometry args={[4.6, 3.2]} />
          <meshStandardMaterial color={isNight ? '#d0c7ba' : '#f5f0e8'} roughness={0.7} />
        </mesh>

        {/* Left Wall */}
        <mesh position={[-2.1, 0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4.6, 3.2]} />
          <meshStandardMaterial color={isNight ? '#c6bdaf' : '#ece6dd'} roughness={0.7} />
        </mesh>

        {/* Right Wall with Window */}
        <mesh position={[2.1, 0.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[4.6, 3.2]} />
          <meshStandardMaterial color={isNight ? '#ccc3b6' : '#eee8df'} roughness={0.7} />
        </mesh>

        {/* Wall Baseboard Trim */}
        <RoundedBox args={[4.6, 0.08, 0.02]} radius={0.005} position={[0, -1.16, -2.09]}>
          <meshStandardMaterial color="#384357" roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[0.02, 0.08, 4.6]} radius={0.005} position={[-2.09, -1.16, 0]}>
          <meshStandardMaterial color="#384357" roughness={0.4} />
        </RoundedBox>
      </group>

      {/* =================================================== */}
      {/* 3. WINDOW, CURTAINS & OUTSIDE LIGHT (Right Wall)    */}
      {/* =================================================== */}
      <group position={[2.08, 0.6, -0.2]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Outer Frame */}
        <RoundedBox args={[1.35, 1.55, 0.06]} radius={0.02} position={[0, 0, 0]}>
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </RoundedBox>
        {/* Glass with Sky Reflection */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[1.25, 1.45]} />
          <meshStandardMaterial
            color={isNight ? '#0c2233' : '#89f5e7'}
            emissive={isNight ? '#001a15' : '#00685f'}
            emissiveIntensity={0.35}
            roughness={0.1}
          />
        </mesh>
        {/* Curtains Left and Right */}
        {[-0.72, 0.72].map((x, i) => (
          <RoundedBox key={i} args={[0.3, 1.75, 0.09]} radius={0.04} position={[x, -0.05, 0.09]}>
            <meshStandardMaterial color="#134e4a" roughness={0.8} />
          </RoundedBox>
        ))}
        {/* Curtain Rod */}
        <mesh position={[0, 0.85, 0.1]}>
          <cylinderGeometry args={[0.015, 0.015, 1.7, 8]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1a2233" metalness={0.9} />
        </mesh>
      </group>

      {/* =================================================== */}
      {/* 4. CEILING FAN WITH ROTATING BLADES                */}
      {/* =================================================== */}
      <group position={[0, 1.75, 0]} ref={fanRef}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
          <meshStandardMaterial color="#384357" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} />
        </mesh>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, i) => (
          <group key={i} rotation={[0, angle, 0]}>
            <RoundedBox args={[0.75, 0.015, 0.13]} radius={0.01} position={[0.45, 0, 0]}>
              <meshStandardMaterial color="#334155" roughness={0.4} />
            </RoundedBox>
          </group>
        ))}
      </group>

      {/* =================================================== */}
      {/* 5. STUDY AREA (Table, Clickable Laptop, Lamp, Chair)*/}
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
          {/* Desk Top Plank */}
          <RoundedBox args={[1.5, 0.08, 0.88]} radius={0.02} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={tableHovered ? '#b8865f' : '#a0714f'}
              roughness={0.4}
            />
          </RoundedBox>

          {/* Desk Left Side Drawer Cabinet */}
          <RoundedBox args={[0.44, 0.7, 0.78]} radius={0.02} position={[-0.48, -0.38, 0]}>
            <meshStandardMaterial color="#334155" roughness={0.5} />
          </RoundedBox>

          {/* Drawer Pull Handles */}
          {[-0.18, -0.42].map((y, idx) => (
            <mesh key={idx} position={[-0.48, y, 0.4]}>
              <cylinderGeometry args={[0.01, 0.01, 0.18, 8]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#89f5e7" metalness={0.85} />
            </mesh>
          ))}

          {/* Desk Right Metal Legs */}
          <mesh position={[0.52, -0.38, 0.22]}>
            <cylinderGeometry args={[0.02, 0.02, 0.72, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} />
          </mesh>
          <mesh position={[0.52, -0.38, -0.22]}>
            <cylinderGeometry args={[0.02, 0.02, 0.72, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.85} />
          </mesh>
        </group>

        {/* CLICKABLE LAPTOP -> Student Workspace */}
        <group
          position={[0, 0.1, 0]}
          scale={0.7}
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
          <RoundedBox args={[0.82, 0.035, 0.56]} radius={0.01} position={[0, 0, 0]}>
            <meshStandardMaterial
              color={laptopHovered ? '#00685f' : '#1e293b'}
              metalness={0.75}
            />
          </RoundedBox>

          {/* Trackpad */}
          <mesh position={[0, 0.02, 0.15]}>
            <planeGeometry args={[0.24, 0.15]} />
            <meshStandardMaterial color="#334155" />
          </mesh>

          {/* Screen Lid (Opened at 115 deg) */}
          <group position={[0, 0.02, -0.27]} rotation={[-Math.PI / 2.7, 0, 0]}>
            <RoundedBox args={[0.82, 0.54, 0.02]} radius={0.01} position={[0, 0.27, 0]}>
              <meshStandardMaterial color="#0f172a" metalness={0.7} />
            </RoundedBox>

            {/* Illuminated Screen with HostelHub Workspace UI */}
            <mesh position={[0, 0.27, 0.015]}>
              <planeGeometry args={[0.76, 0.48]} />
              <meshStandardMaterial
                color="#00685f"
                emissive="#89f5e7"
                emissiveIntensity={laptopHovered ? 1.0 : 0.65}
                roughness={0.2}
              />
            </mesh>
          </group>
        </group>

        {/* Glowing Desk Study Lamp */}
        <group position={[-0.54, 0.04, -0.16]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.22, 0]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
            <meshStandardMaterial color="#ffb59a" metalness={0.8} />
          </mesh>
          <mesh position={[0.07, 0.38, 0]} rotation={[0, 0, 0.5]}>
            <coneGeometry args={[0.09, 0.13, 16]} />
            <meshStandardMaterial color="#334155" emissive="#ffdbce" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Student Ergonomic Chair */}
        <group position={[0, -0.25, 0.72]} rotation={[0, -0.2, 0]}>
          <RoundedBox args={[0.46, 0.08, 0.46]} radius={0.03} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1e293b" roughness={0.5} />
          </RoundedBox>
          <RoundedBox args={[0.44, 0.48, 0.04]} radius={0.02} position={[0, 0.3, -0.2]} rotation={[-0.1, 0, 0]}>
            <meshStandardMaterial color="#00685f" roughness={0.6} />
          </RoundedBox>
          <mesh position={[0, -0.26, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
        </group>

        {/* Desk Accessories: Water Bottle, Notebook, Smartphone, Stationery */}
        {/* Notebook */}
        <RoundedBox args={[0.28, 0.02, 0.36]} radius={0.01} position={[0.38, 0.05, 0.06]} rotation={[0, 0.12, 0]}>
          <meshStandardMaterial color="#ffedd5" roughness={0.6} />
        </RoundedBox>
        {/* Pen on notebook */}
        <mesh position={[0.4, 0.065, 0.06]} rotation={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.2, 8]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#00685f" metalness={0.8} />
        </mesh>
        {/* Steel Water Bottle */}
        <group position={[0.56, 0.15, -0.22]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.26, 12]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 10]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>
        </group>
        {/* Smartphone */}
        <RoundedBox args={[0.1, 0.01, 0.18]} radius={0.005} position={[0.3, 0.045, -0.22]} rotation={[0, -0.18, 0]}>
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        {/* Student Backpack leaning against desk */}
        <group position={[-0.82, -0.4, 0.22]} rotation={[0, 0.35, 0]}>
          <RoundedBox args={[0.36, 0.5, 0.26]} radius={0.06} position={[0, 0, 0]}>
            <meshStandardMaterial color="#1e3a8a" roughness={0.8} />
          </RoundedBox>
        </group>
      </group>

      {/* =================================================== */}
      {/* 6. BOOKSHELF WITH 18+ CLICKABLE ACADEMIC BOOKS      */}
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
        {/* Bookshelf Planks (2 Tiers) */}
        <RoundedBox args={[1.65, 0.04, 0.34]} radius={0.01} position={[0, 0.45, 0]}>
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[1.65, 0.04, 0.34]} radius={0.01} position={[0, -0.15, 0]}>
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </RoundedBox>
        {/* Bookshelf Side Uprights */}
        {[-0.8, 0.8].map((x, i) => (
          <RoundedBox key={i} args={[0.04, 0.65, 0.34]} radius={0.01} position={[x, 0.15, 0]}>
            <meshStandardMaterial color="#1e293b" roughness={0.4} />
          </RoundedBox>
        ))}

        {/* 18+ Clickable Academic Books */}
        {booksData.map((b) => {
          const isThisBookHovered = hoveredBook === b.id;
          return (
            <group
              key={b.id}
              position={[b.x, b.y, 0]}
              rotation={[0, 0, b.tilt]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredBook(b.id);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredBook(null);
                document.body.style.cursor = 'auto';
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveInteractiveModal('bookshelf-resources', b.subject);
              }}
            >
              {/* Book Spine / Cover */}
              <RoundedBox args={[b.width, b.height, b.depth]} radius={0.008} position={[0, 0, 0]}>
                <meshStandardMaterial
                  color={isThisBookHovered ? '#89f5e7' : b.color}
                  roughness={0.35}
                  metalness={0.1}
                />
              </RoundedBox>

              {/* Book Spine Label Mark */}
              <mesh position={[0, 0, b.depth / 2 + 0.002]}>
                <planeGeometry args={[b.width * 0.8, b.height * 0.5]} />
                <meshBasicMaterial color={isThisBookHovered ? '#00685f' : '#ffffff'} />
              </mesh>
            </group>
          );
        })}

        {/* Small Succulent Potted Plant on Top Shelf */}
        <group position={[0.56, 0.58, 0]}>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.08, 0.06, 0.12, 12]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#15803d" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* =================================================== */}
      {/* 7. SLEEPING AREA (Single Bed, Mattress, Nightstand) */}
      {/* =================================================== */}
      <group position={[1.1, -0.65, 0.1]}>
        {/* Bed Wooden Base Frame */}
        <RoundedBox args={[1.02, 0.32, 2.0]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </RoundedBox>

        {/* Headboard */}
        <RoundedBox args={[1.02, 0.65, 0.08]} radius={0.02} position={[0, 0.3, -0.96]}>
          <meshStandardMaterial color="#1e293b" roughness={0.4} />
        </RoundedBox>

        {/* Comfortable Mattress */}
        <RoundedBox args={[0.94, 0.2, 1.9]} radius={0.03} position={[0, 0.24, 0]}>
          <meshStandardMaterial color="#f8fafc" roughness={0.8} />
        </RoundedBox>

        {/* Folded Quilt / Blanket */}
        <RoundedBox args={[0.95, 0.14, 1.3]} radius={0.03} position={[0, 0.28, 0.32]}>
          <meshStandardMaterial color="#0f766e" roughness={0.7} />
        </RoundedBox>

        {/* Soft Pillow */}
        <RoundedBox args={[0.7, 0.12, 0.42]} radius={0.03} position={[0, 0.36, -0.68]} rotation={[-0.1, 0, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </RoundedBox>

        {/* Bedside Nightstand */}
        <group position={[-0.82, 0.05, -0.68]}>
          <RoundedBox args={[0.46, 0.46, 0.46]} radius={0.02} position={[0, 0, 0]}>
            <meshStandardMaterial color="#a0714f" roughness={0.4} />
          </RoundedBox>
          {/* Digital Clock */}
          <RoundedBox args={[0.16, 0.06, 0.08]} radius={0.01} position={[0, 0.26, 0]}>
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </RoundedBox>
          <mesh position={[0, 0.26, 0.042]}>
            <planeGeometry args={[0.14, 0.04]} />
            <meshBasicMaterial color="#89f5e7" />
          </mesh>
        </group>

        {/* Wardrobe Closet (Corner) */}
        <group position={[0.2, 0.8, -1.52]}>
          <RoundedBox args={[0.82, 1.85, 0.6]} radius={0.03} position={[0, 0, 0]}>
            <meshStandardMaterial color="#334155" roughness={0.4} />
          </RoundedBox>
          {/* Vertical Split Line */}
          <mesh position={[0, 0, 0.305]}>
            <planeGeometry args={[0.015, 1.75]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          {/* Dual Metallic Handles */}
          <mesh position={[-0.05, 0, 0.31]}>
            <cylinderGeometry args={[0.01, 0.01, 0.22, 8]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.9} />
          </mesh>
          <mesh position={[0.05, 0, 0.31]}>
            <cylinderGeometry args={[0.01, 0.01, 0.22, 8]} />
            <meshStandardMaterial color="#89f5e7" metalness={0.9} />
          </mesh>
        </group>

        {/* Student Slippers / Shoes Under Bed/Desk */}
        <group position={[-0.6, -0.5, 0.4]} rotation={[0, 0.2, 0]}>
          {[-0.08, 0.08].map((x, i) => (
            <RoundedBox key={i} args={[0.1, 0.04, 0.24]} radius={0.02} position={[x, 0, 0]}>
              <meshStandardMaterial color="#0284c7" roughness={0.7} />
            </RoundedBox>
          ))}
        </group>
      </group>
    </group>
  );
};

/**
 * Interactive 3D Room Interior Canvas Component
 * Provides seamless tab-based camera navigation
 */
export const RoomInterior3D = ({
  activeTab = 'interior',
  lightingMode = 'day',
  className = 'w-full h-full'
}) => {
  const getCameraConfig = () => {
    switch (activeTab) {
      case 'study-area':
        return { position: [-1.05, 0.3, 0.85], fov: 42 };
      case 'bed-area':
        return { position: [1.05, 0.35, 1.85], fov: 42 };
      case 'room-view':
      case 'interior':
      default:
        return { position: [0.35, 1.25, 3.3], fov: 45 };
    }
  };

  const cameraConfig = getCameraConfig();

  return (
    <CanvasWrapper
      key={`interior-${activeTab}-${lightingMode}`}
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
        minDistance={1.4}
        maxDistance={5.5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.02}
      />
      <RoomInteriorMesh activeTab={activeTab} lightingMode={lightingMode} />
    </CanvasWrapper>
  );
};

