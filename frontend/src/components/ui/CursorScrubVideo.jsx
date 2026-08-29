import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useInView } from 'framer-motion';

/**
 * CursorScrubVideo Component
 * 
 * Enables buttery cursor-scrubbed video playback controlled by pointer position,
 * with exponential smoothing, buffering-safe seeking, and touch/window tracking.
 */
export const CursorScrubVideo = ({
  videoFile = '/tt.mp4',
  axis = 'horizontal',
  reverse = false,
  trackingArea = 'window',
  smoothing = 0.15,
  objectFit = 'cover',
  showPoster = false,
  borderRadius = 0,
  className = '',
  style = {},
  opacity = 1,
}) => {
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const durationRef = useRef(0);
  const targetTimeRef = useRef(0);
  const currentTimeRef = useRef(0);
  const objectUrlRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const isInView = useInView(rootRef, { amount: 0.05 });

  // Resolve video source (string, File, or asset object)
  const resolvedVideoSource = useMemo(() => {
    if (!videoFile) return null;
    if (typeof videoFile === 'string') {
      return { src: videoFile, revoke: false };
    }
    if (typeof File !== 'undefined' && videoFile instanceof File) {
      const url = URL.createObjectURL(videoFile);
      return { src: url, revoke: true };
    }
    if (typeof videoFile === 'object') {
      const src = videoFile.src || videoFile.url || null;
      if (typeof src === 'string' && src.length > 0) {
        return { src, revoke: false };
      }
    }
    return null;
  }, [videoFile]);

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

  // Update target time from normalized 0..1 ratio
  const updateTargetFromRatio = useCallback(
    (ratio) => {
      const clamped = Math.max(0, Math.min(1, ratio));
      const mapped = reverse ? 1 - clamped : clamped;
      const duration = durationRef.current;
      if (!Number.isFinite(duration) || duration <= 0) return;
      targetTimeRef.current = mapped * duration;
    },
    [reverse]
  );

  // Component pointer tracking
  const onComponentPointerMove = useCallback(
    (event) => {
      const root = rootRef.current;
      if (!root || trackingArea !== 'component') return;
      const rect = root.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const ratio =
        axis === 'horizontal'
          ? (event.clientX - rect.left) / rect.width
          : (event.clientY - rect.top) / rect.height;

      updateTargetFromRatio(ratio);
    },
    [axis, trackingArea, updateTargetFromRatio]
  );

  // Window pointer tracking
  const onWindowPointerMove = useCallback(
    (event) => {
      if (trackingArea !== 'window') return;
      if (typeof window === 'undefined') return;
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
        if (trackingArea === 'window') {
          const width = window.innerWidth;
          const height = window.innerHeight;
          const ratio = axis === 'horizontal' ? touch.clientX / width : touch.clientY / height;
          updateTargetFromRatio(ratio);
        } else if (rootRef.current) {
          const rect = rootRef.current.getBoundingClientRect();
          const ratio =
            axis === 'horizontal'
              ? (touch.clientX - rect.left) / rect.width
              : (touch.clientY - rect.top) / rect.height;
          updateTargetFromRatio(ratio);
        }
      }
    },
    [axis, trackingArea, updateTargetFromRatio]
  );

  // Attach pointer & touch event listeners
  useEffect(() => {
    const root = rootRef.current;
    if (trackingArea === 'component' && root) {
      root.addEventListener('pointermove', onComponentPointerMove, { passive: true });
      root.addEventListener('touchmove', onTouchMove, { passive: true });
      return () => {
        root.removeEventListener('pointermove', onComponentPointerMove);
        root.removeEventListener('touchmove', onTouchMove);
      };
    } else if (trackingArea === 'window' && typeof window !== 'undefined') {
      window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      return () => {
        window.removeEventListener('pointermove', onWindowPointerMove);
        window.removeEventListener('touchmove', onTouchMove);
      };
    }
  }, [onComponentPointerMove, onWindowPointerMove, onTouchMove, trackingArea]);

  // Video metadata & ready state listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !resolvedVideoSource?.src) return;

    setIsReady(false);
    targetTimeRef.current = 0;
    currentTimeRef.current = 0;
    durationRef.current = 0;

    const handleMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
      if (video.readyState >= 2) {
        setIsReady(true);
      }
    };

    const handleCanPlay = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
      setIsReady(true);
    };

    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('loadeddata', handleCanPlay);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlay);

    if (video.readyState >= 2) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('loadeddata', handleCanPlay);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, [resolvedVideoSource]);

  // Smooth RAF Scrubbing Engine with lerp
  useEffect(() => {
    const tick = () => {
      const video = videoRef.current;
      if (video && isInView && durationRef.current > 0) {
        const duration = durationRef.current;
        const current = currentTimeRef.current;
        const target = targetTimeRef.current;

        // Exponential smoothing interpolation
        const next = current + (target - current) * Math.min(1, Math.max(0.02, smoothing));
        currentTimeRef.current = next;

        // Seek threshold to prevent frame thrashing
        if (Math.abs(video.currentTime - next) > 0.01) {
          const clampedNext = Math.max(0, Math.min(duration, next));
          if ('fastSeek' in video && typeof video.fastSeek === 'function') {
            video.fastSeek(clampedNext);
          } else {
            video.currentTime = clampedNext;
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
        borderRadius,
        opacity,
        ...style,
      }}
    >
      <video
        ref={videoRef}
        src={resolvedVideoSource?.src ?? undefined}
        muted
        playsInline
        preload="auto"
        disableRemotePlayback
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          display: 'block',
          borderRadius,
          pointerEvents: 'none',
        }}
      />

      {!isReady && showPoster && (
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white text-xs"
        >
          Loading video…
        </div>
      )}
    </div>
  );
};

export default CursorScrubVideo;
