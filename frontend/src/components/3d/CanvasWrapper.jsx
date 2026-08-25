import React, { Component, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { isWebGLAvailable, useIsMobile } from './useReducedMotion';

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.warn('Canvas Error caught by 3D ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

/**
 * Reusable high-performance Canvas wrapper with error boundary,
 * mobile optimization, and Suspense fallback.
 */
export const CanvasWrapper = ({
  children,
  camera = { position: [0, 0, 5], fov: 45 },
  className = 'w-full h-full',
  fallback = null,
  dpr = [1, 1.5],
  shadows = false,
  disableOnMobile = false,
  ...props
}) => {
  const isMobile = useIsMobile();
  const webGLSupported = isWebGLAvailable();

  if (!webGLSupported || (disableOnMobile && isMobile)) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  return (
    <CanvasErrorBoundary fallback={fallback ? <div className={className}>{fallback}</div> : null}>
      <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
        <Canvas
          camera={camera}
          dpr={dpr}
          shadows={shadows}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
          }}
          style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
          {...props}
        >
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
};
