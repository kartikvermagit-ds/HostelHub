import React, { useRef, useEffect, useCallback } from 'react';
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
  buildingDims = null
}) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  // Track whether user is actively dragging/orbiting
  const userInteracting = useRef(false);
  const returnTimer = useRef(null);

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

  // Handlers for user interaction detection
  const handleInteractionStart = useCallback(() => {
    userInteracting.current = true;
    // Cancel any pending return-to-target timer
    if (returnTimer.current) {
      clearTimeout(returnTimer.current);
      returnTimer.current = null;
    }
  }, []);

  const handleInteractionEnd = useCallback(() => {
    // After user stops, wait 2.5s then smoothly resume camera target tracking
    returnTimer.current = setTimeout(() => {
      userInteracting.current = false;
    }, 2500);
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (returnTimer.current) clearTimeout(returnTimer.current);
    };
  }, []);

  useFrame((state, delta) => {
    // Don't override camera while user is actively orbiting/panning
    if (!controlsRef.current || userInteracting.current) return;

    if (prefersReducedMotion) {
      camera.position.copy(targetPos.current);
      controlsRef.current.target.copy(targetLookAt.current);
      controlsRef.current.update();
    } else {
      const speed = cameraMode === 'room' ? 3.8 : 2.8;
      camera.position.lerp(targetPos.current, delta * speed);
      controlsRef.current.target.lerp(targetLookAt.current, delta * speed);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={2.8}
      maxDistance={26.0}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.05}
      minAzimuthAngle={-Math.PI / 2.1}
      maxAzimuthAngle={Math.PI / 2.1}
      enablePan={true}
      panSpeed={0.8}
      zoomSpeed={1.0}
      rotateSpeed={0.85}
      onStart={handleInteractionStart}
      onEnd={handleInteractionEnd}
    />
  );
};
