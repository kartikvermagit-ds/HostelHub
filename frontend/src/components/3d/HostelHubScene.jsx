import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CanvasWrapper } from './CanvasWrapper';
import { Book3D } from './Book3D';
import { Hostel3D } from './Hostel3D';
import { HostelCamera } from './HostelCamera';
import { SceneControls } from './SceneControls';
import { hostelsData } from './data/hostelData';
import { useReducedMotion, useIsMobile } from './useReducedMotion';

/**
 * 3D Scene Controller handling opening timing and emergence interpolation
 */
const SceneDirector = ({
  openProgress,
  emergenceProgress,
  hostelData,
  selectedRoom,
  onSelectRoom,
  phase
}) => {
  return (
    <>
      {/* Studio Academic Lighting */}
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 8, 5]} intensity={1.4} castShadow />
      <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#89f5e7" />
      <pointLight position={[0, 2, 2]} intensity={0.4} color="#ffdbce" />
      <pointLight position={[0, -0.5, 0]} intensity={0.3} color="#89f5e7" />

      {/* Cinematic Camera Controller */}
      <HostelCamera
        phase={phase}
        selectedRoom={selectedRoom}
      />

      {/* Main 3D Book Base (Opens from spine) */}
      <Book3D openProgress={openProgress} />

      {/* Emerging 3D Modular Hostel (Rises from center of the open book) */}
      <Hostel3D
        hostelData={hostelData}
        emergenceProgress={emergenceProgress}
        selectedRoomId={selectedRoom?.id || null}
        onSelectRoom={onSelectRoom}
        showLabels={phase !== 'book'}
      />

      {/* Ground Desk Soft Ambient Shadow Disk */}
      <mesh position={[0, -0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 3.8, 32]} />
        <meshBasicMaterial
          color="#004d46"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

/**
 * Interactive 3D HostelHub Experience Root Component
 */
export const HostelHubScene = ({ className = 'w-full h-full' }) => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const [selectedHostelKey, setSelectedHostelKey] = useState('hostel-4');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [phase, setPhase] = useState(prefersReducedMotion ? 'hostel' : 'book'); // 'book' | 'hostel' | 'room'
  const [openProgress, setOpenProgress] = useState(prefersReducedMotion ? 1 : 0);
  const [emergenceProgress, setEmergenceProgress] = useState(prefersReducedMotion ? 1 : 0);
  const [isPlayingIntro, setIsPlayingIntro] = useState(!prefersReducedMotion);

  const currentHostelData = hostelsData[selectedHostelKey] || hostelsData['hostel-4'];

  // Run initial book opening and hostel emergence animation sequence
  useEffect(() => {
    if (prefersReducedMotion) {
      setOpenProgress(1);
      setEmergenceProgress(1);
      setPhase('hostel');
      setIsPlayingIntro(false);
      return;
    }

    let animationFrame;
    const startTime = performance.now();

    const animateSequence = (now) => {
      const elapsed = (now - startTime) / 1000; // in seconds

      // Step 1 & 2: Book Opens (0 to 2.2s)
      const bookProg = THREE.MathUtils.clamp(elapsed / 2.0, 0, 1);
      // Smooth cubic ease out
      const easedBook = 1 - Math.pow(1 - bookProg, 3);
      setOpenProgress(easedBook);

      // Step 3: Hostel Emerges from Book (1.6s to 3.8s)
      if (elapsed > 1.4) {
        const emergenceProg = THREE.MathUtils.clamp((elapsed - 1.4) / 2.2, 0, 1);
        const easedEmergence = 1 - Math.pow(1 - emergenceProg, 3);
        setEmergenceProgress(easedEmergence);
      }

      if (elapsed < 3.8) {
        animationFrame = requestAnimationFrame(animateSequence);
      } else {
        setPhase('hostel');
        setIsPlayingIntro(false);
      }
    };

    animationFrame = requestAnimationFrame(animateSequence);
    return () => cancelAnimationFrame(animationFrame);
  }, [prefersReducedMotion]);

  // Handler to replay introduction
  const handleReplayIntro = () => {
    setSelectedRoom(null);
    setPhase('book');
    setIsPlayingIntro(true);
    setOpenProgress(0);
    setEmergenceProgress(0);

    const startTime = performance.now();
    const animateSequence = (now) => {
      const elapsed = (now - startTime) / 1000;

      const bookProg = THREE.MathUtils.clamp(elapsed / 2.0, 0, 1);
      const easedBook = 1 - Math.pow(1 - bookProg, 3);
      setOpenProgress(easedBook);

      if (elapsed > 1.4) {
        const emergenceProg = THREE.MathUtils.clamp((elapsed - 1.4) / 2.2, 0, 1);
        const easedEmergence = 1 - Math.pow(1 - emergenceProg, 3);
        setEmergenceProgress(easedEmergence);
      }

      if (elapsed < 3.8) {
        requestAnimationFrame(animateSequence);
      } else {
        setPhase('hostel');
        setIsPlayingIntro(false);
      }
    };

    requestAnimationFrame(animateSequence);
  };

  const handleSelectRoom = (roomData) => {
    if (selectedRoom?.id === roomData.id) {
      setSelectedRoom(null);
      setPhase('hostel');
    } else {
      setSelectedRoom(roomData);
      setPhase('room');
    }
  };

  const handleResetView = () => {
    setSelectedRoom(null);
    setPhase('hostel');
  };

  return (
    <div className={`relative ${className} bg-gradient-to-b from-surface-container-low/30 to-surface-container-high/20 rounded-2xl border border-surface-border overflow-hidden shadow-inner`}>
      {/* 3D Canvas Scene */}
      <CanvasWrapper
        className="w-full h-full min-h-[340px] md:min-h-[420px]"
        camera={{ position: [0, 3.8, 5.4], fov: 45 }}
        disableOnMobile={false}
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-primary">
            <span className="material-symbols-outlined text-5xl mb-2">apartment</span>
            <p className="font-label-md text-sm font-semibold">HostelHub 3D Experience</p>
          </div>
        }
      >
        <SceneDirector
          openProgress={openProgress}
          emergenceProgress={emergenceProgress}
          hostelData={currentHostelData}
          selectedRoom={selectedRoom}
          onSelectRoom={handleSelectRoom}
          phase={phase}
        />
      </CanvasWrapper>

      {/* Interactive Overlay Controls */}
      <SceneControls
        hostels={hostelsData}
        selectedHostelKey={selectedHostelKey}
        onSelectHostel={(key) => {
          setSelectedHostelKey(key);
          setSelectedRoom(null);
          setPhase('hostel');
        }}
        selectedRoom={selectedRoom}
        onCloseRoom={() => {
          setSelectedRoom(null);
          setPhase('hostel');
        }}
        onResetView={handleResetView}
        onReplayIntro={handleReplayIntro}
        isPlayingIntro={isPlayingIntro}
      />
    </div>
  );
};
