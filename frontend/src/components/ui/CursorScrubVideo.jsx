import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useInView } from 'framer-motion';
import { useIsMobile } from '../3d/useReducedMotion';

/**
 * CursorScrubVideo Component (Responsive Desktop & Mobile Video)
 * 
 * Automatically switches between desktopVideo (/dtt.mp4) and mobileVideo (/ptt.mp4)
 * with continuous autoplay, hardware-efficient throttling, and buttery cursor scrubbing.
 */
export const CursorScrubVideo = ({
  desktopVideo = '/dtt.mp4',
  mobileVideo = '/ptt.mp4',
  videoFile = null,
  axis = 'horizontal',
  reverse = false,
  trackingArea = 'window',
  smoothing = 0.15,
  objectFit = 'cover',
  objectPosition = null,
  autoPlay = true,
  loop = true,
  scrubOnMove = true,
  className = '',
  style = {},
}) => {
  const isMobile = useIsMobile(768);
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const durationRef = useRef(0);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const isUserMovingRef = useRef(false);
  const isOver3DStageRef = useRef(false);
  const idleTimeoutRef = useRef(null);
  const lastSeekTimeRef = useRef(0);
  const objectUrlRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const isInView = useInView(rootRef, { amount: 0.05 });

  // Determine active video source based on device breakpoint
  const activeSourceInput = useMemo(() => {
    if (videoFile) return videoFile;
    return isMobile ? (mobileVideo || desktopVideo) : (desktopVideo || mobileVideo);
  }, [isMobile, videoFile, desktopVideo, mobileVideo]);

  // Resolve video source (string, File, or asset object)
  const resolvedVideoSource = useMemo(() => {
    if (!activeSourceInput) return null;
    if (typeof activeSourceInput === 'string') {
      return { src: activeSourceInput, revoke: false };
    }
    if (typeof File !== 'undefined' && activeSourceInput instanceof File) {
      const url = URL.createObjectURL(activeSourceInput);
      return { src: url, revoke: true };
    }
    if (typeof activeSourceInput === 'object') {
      const src = activeSourceInput.src || activeSourceInput.url || null;
      if (typeof src === 'string' && src.length > 0) {
        return { src, revoke: false };
      }
    }
    return null;
  }, [activeSourceInput]);

  // Clean up object URLs
  useEffect(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    if (resolvedVideoSource?.revoke && resolvedVideoSource.src) {
      objectUrlRef.current = resolvedVideoSource.src;
    }
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [resolvedVideoSource]);

  // Responsive object position: center on mobile, right-aligned on desktop
  const effectiveObjectPosition = useMemo(() => {
    if (objectPosition) return objectPosition;
    return isMobile ? 'center center' : '80% center';
  }, [isMobile, objectPosition]);

  // Update target time with throttling
  const updateTargetFromRatio = useCallback(
    (ratio) => {
      if (!scrubOnMove || isOver3DStageRef.current) return;
      const clamped = Math.max(0, Math.min(1, ratio));
      const mapped = reverse ? 1 - clamped : clamped;
      const duration = durationRef.current;
      if (!Number.isFinite(duration) || duration <= 0) return;

      isUserMovingRef.current = true;
      targetTimeRef.current = mapped * duration;

      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      idleTimeoutRef.current = setTimeout(() => {
        isUserMovingRef.current = false;
        const video = videoRef.current;
        if (video && autoPlay && video.paused) {
          video.play().catch(() => {});
        }
      }, 800);
    },
    [autoPlay, reverse, scrubOnMove]
  );

  // Check if target is inside 3D stage
  const checkIsOver3D = (target) => {
    if (!target) return false;
    return Boolean(
      target.closest && (
        target.closest('#hostel-3d-stage') ||
        target.closest('.canvas-wrapper') ||
        target.closest('canvas')
      )
    );
  };

  // Window pointer tracking
  const onWindowPointerMove = useCallback(
    (event) => {
      if (trackingArea !== 'window') return;
      if (typeof window === 'undefined') return;

      isOver3DStageRef.current = checkIsOver3D(event.target);
      if (isOver3DStageRef.current) {
        isUserMovingRef.current = false;
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      if (width <= 0 || height <= 0) return;

      const ratio =
        axis === 'horizontal'
          ? event.clientX / width
          : event.clientY / height;

      updateTargetFromRatio(ratio);
    },
    [axis, trackingArea, updateTargetFromRatio]
  );

  // Touch tracking for mobile
  const onTouchMove = useCallback(
    (event) => {
      if (event.touches && event.touches.length > 0) {
        const touch = event.touches[0];
        if (checkIsOver3D(event.target)) {
          isOver3DStageRef.current = true;
          return;
        }
        isOver3DStageRef.current = false;

        if (trackingArea === 'window') {
          const width = window.innerWidth;
          const height = window.innerHeight;
          const ratio = axis === 'horizontal' ? touch.clientX / width : touch.clientY / height;
          updateTargetFromRatio(ratio);
        }
      }
    },
    [axis, trackingArea, updateTargetFromRatio]
  );

  // Attach pointer & touch event listeners
  useEffect(() => {
    if (trackingArea === 'window' && typeof window !== 'undefined') {
      window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      return () => {
        window.removeEventListener('pointermove', onWindowPointerMove);
        window.removeEventListener('touchmove', onTouchMove);
      };
    }
  }, [onWindowPointerMove, onTouchMove, trackingArea]);

  // Video ready & metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resolvedVideoSource?.src) return;

    const handleMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
      setIsReady(true);
      if (autoPlay) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('loadeddata', handleMetadata);
    video.addEventListener('canplay', handleMetadata);

    if (video.readyState >= 2) {
      handleMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('loadeddata', handleMetadata);
      video.removeEventListener('canplay', handleMetadata);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [autoPlay, resolvedVideoSource]);

  // Throttled RAF loop for video scrubbing
  useEffect(() => {
    const tick = (now) => {
      const video = videoRef.current;
      if (
        video &&
        isInView &&
        durationRef.current > 0 &&
        isUserMovingRef.current &&
        !isOver3DStageRef.current
      ) {
        if (now - lastSeekTimeRef.current >= 50) {
          const duration = durationRef.current;
          const current = currentTimeRef.current;
          const target = targetTimeRef.current;

          const next = current + (target - current) * Math.min(1, Math.max(0.04, smoothing));
          currentTimeRef.current = next;

          if (Math.abs(video.currentTime - next) > 0.02) {
            const clampedNext = Math.max(0, Math.min(duration, next));
            if ('fastSeek' in video && typeof video.fastSeek === 'function') {
              video.fastSeek(clampedNext);
            } else {
              video.currentTime = clampedNext;
            }
            lastSeekTimeRef.current = now;
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    if (typeof window !== 'undefined') {
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isInView, smoothing]);

  const hasVideo = Boolean(resolvedVideoSource?.src);

  if (!hasVideo) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className={`relative overflow-hidden pointer-events-none select-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
    >
      <video
        ref={videoRef}
        key={resolvedVideoSource?.src}
        src={resolvedVideoSource?.src ?? undefined}
        autoPlay={autoPlay}
        loop={loop}
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          objectPosition: effectiveObjectPosition,
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default CursorScrubVideo;
