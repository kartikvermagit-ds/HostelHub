import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from './useReducedMotion';

/**
 * Smooth Cinematic Camera Controller with Constrained OrbitControls
 * Supports 4 States: Full Overview, Floor Focus, Room Focus, and Exploded View
 */
export const HostelCamera = ({
  cameraMode = 'overview', // 'overview' | 'floor' | 'room'
  selectedFloorNumber = null,
  selectedRoom = null,
  isExplodedView = false,
  floorHeight = 1.05,
  isUserInteracting = false
}) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  // Target vectors
  const targetPos = useRef(new THREE.Vector3(0, 2.2, 9.6));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.1, 0.4));

  useEffect(() => {
    if (cameraMode === 'room' && selectedRoom && selectedRoom.position) {
      // Room Focus State - Angled approach giving focus while maintaining building context
      const [rx, ry, rz] = selectedRoom.position;
      targetPos.current.set(rx * 0.45, ry + 0.35, 7.8);
      targetLookAt.current.set(rx * 0.5, ry + 0.1, 0.4);
    } else if (cameraMode === 'floor' || selectedFloorNumber !== null) {
      // Floor Focus State
      const floorIdx = Math.max((selectedFloorNumber || 1) - 1, 0);
      const floorY = floorIdx * (floorHeight + (isExplodedView ? 0.75 : 0));
      targetPos.current.set(0, floorY + 1.2, 8.2);
      targetLookAt.current.set(0, floorY + 0.35, 0.4);
    } else if (isExplodedView) {
      // Exploded View State
      targetPos.current.set(0, 3.8, 10.5);
      targetLookAt.current.set(0, 1.8, 0.4);
    } else {
      // Full Overview State
      targetPos.current.set(0, 2.2, 9.6);
      targetLookAt.current.set(0, 1.1, 0.4);
    }
  }, [cameraMode, selectedFloorNumber, selectedRoom, isExplodedView, floorHeight]);

  useFrame((state, delta) => {
    // If user is currently actively dragging/orbiting, don't override camera lerp
    if (!controlsRef.current || isUserInteracting) return;

    if (prefersReducedMotion) {
      camera.position.copy(targetPos.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();
      }
    } else {
      const speed = cameraMode === 'room' ? 3.8 : 2.8;
      camera.position.lerp(targetPos.current, delta * speed);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, delta * speed);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={3.5}
      maxDistance={14.0}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.02}
      minAzimuthAngle={-Math.PI / 2.2}
      maxAzimuthAngle={Math.PI / 2.2}
      enablePan={true}
      panSpeed={0.8}
      zoomSpeed={1.0}
      rotateSpeed={0.85}
    />
  );
};


