import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from './useReducedMotion';
import { calculateCameraTarget, calculateBuildingDimensions } from './layoutEngine';

/**
 * Smooth Cinematic Architectural Camera Controller with Constrained OrbitControls
 * Supports dynamic 3D room coordinates, multi-wing layout boundaries, floor focusing,
 * exploded views, and overview perspectives with smooth damping.
 */
export const HostelCamera = ({
  cameraMode = 'overview', // 'overview' | 'floor' | 'room'
  selectedFloorNumber = null,
  selectedRoom = null,
  isExplodedView = false,
  floorHeight = 1.05,
  isUserInteracting = false,
  buildingDims = null
}) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  // Target camera position and look-at target vectors
  const targetPos = useRef(new THREE.Vector3(0, 2.2, 9.4));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.1, 0.4));

  useEffect(() => {
    const { targetPos: calculatedPos, targetLookAt: calculatedLookAt } = calculateCameraTarget({
      buildingDims: buildingDims || { width: 6.0, totalHeight: 3.5, floorHeight },
      selectedFloorNumber,
      selectedRoom,
      isExplodedView,
      cameraMode
    });

    targetPos.current.copy(calculatedPos);
    targetLookAt.current.copy(calculatedLookAt);
  }, [cameraMode, selectedFloorNumber, selectedRoom, isExplodedView, floorHeight, buildingDims]);

  useFrame((state, delta) => {
    // If user is actively dragging/orbiting, don't override manual camera placement
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
      minDistance={3.2}
      maxDistance={16.0}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.05}
      minAzimuthAngle={-Math.PI / 2.1}
      maxAzimuthAngle={Math.PI / 2.1}
      enablePan={true}
      panSpeed={0.8}
      zoomSpeed={1.0}
      rotateSpeed={0.85}
    />
  );
};
