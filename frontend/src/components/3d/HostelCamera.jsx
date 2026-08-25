import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from './useReducedMotion';

/**
 * Smooth Cinematic Camera Controller with Constrained OrbitControls
 */
export const HostelCamera = ({
  phase = 'hostel', // 'book' | 'hostel' | 'room'
  selectedRoom = null,
  isUserInteracting = false
}) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const prefersReducedMotion = useReducedMotion();

  // Target coordinates
  const targetPos = useRef(new THREE.Vector3(0, 3.8, 5.4));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.0, 0.4));

  useEffect(() => {
    if (phase === 'book') {
      targetPos.current.set(0, 4.4, 4.6);
      targetLookAt.current.set(0, 0, 0);
    } else if (phase === 'hostel' || !selectedRoom) {
      targetPos.current.set(0, 2.8, 6.2);
      targetLookAt.current.set(0, 1.3, 0.4);
    } else if (phase === 'room' && selectedRoom) {
      const [rx, ry, rz] = selectedRoom.position;
      targetPos.current.set(rx, ry + 0.35, rz + 2.6);
      targetLookAt.current.set(rx, ry + 0.05, rz);
    }
  }, [phase, selectedRoom]);


  useFrame((state, delta) => {
    // If user is currently dragging/orbiting, don't force camera lerp
    if (!controlsRef.current || isUserInteracting) return;

    if (prefersReducedMotion) {
      camera.position.copy(targetPos.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();
      }
    } else {
      const speed = phase === 'room' ? 3.5 : 2.5;
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
      minDistance={2.4}
      maxDistance={9.5}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.05}
      minAzimuthAngle={-Math.PI / 2.5}
      maxAzimuthAngle={Math.PI / 2.5}
      enablePan={true}
    />
  );
};
