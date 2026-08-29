import React from 'react';
import { Html } from '@react-three/drei';

/**
 * Clean & Uncluttered 3D Room Number Plaque & Status Indicator
 * Unselected: subtle, compact frosted glass badge
 * Selected: high-contrast prominent pill with status
 */
export const RoomLabel = ({
  roomNumber = '101',
  status = 'available',
  roomType = 'Single',
  hovered = false,
  selected = false,
  dimmed = false,
  branch = '',
  position = [0, 0.28, 0.46]
}) => {
  // Skip expensive HTML DOM projection if this floor/room is dimmed out
  if (dimmed && !selected && !hovered) {
    return null;
  }

  const getStatusDotColor = () => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-emerald-400 shadow-emerald-400/60 ring-1 ring-emerald-300';
      case 'maintenance':
        return 'bg-amber-400 shadow-amber-400/60 ring-1 ring-amber-300';
      case 'reserved':
        return 'bg-blue-400 shadow-blue-400/60 ring-1 ring-blue-300';
      case 'occupied':
      default:
        return 'bg-slate-400 shadow-slate-400/60 ring-1 ring-slate-300';
    }
  };

  return (
    <group position={position}>
      <Html
        center
        distanceFactor={6.8}
        zIndexRange={[10, 0]}
        className="pointer-events-none select-none transition-all duration-200"
      >
        <div
          className={`flex flex-col items-center gap-1 transition-transform ${
            selected
              ? 'scale-110'
              : hovered
              ? 'scale-105'
              : 'scale-90'
          }`}
        >
          {/* Room Number Badge */}
          <div
            className={`rounded-lg font-mono font-bold tracking-wider shadow-sm flex items-center gap-1.5 border transition-all ${
              selected
                ? 'px-3 py-1 bg-primary text-white border-primary-fixed shadow-md shadow-primary/30 ring-2 ring-primary/50 text-[11px]'
                : hovered
                ? 'px-2 py-0.5 bg-white dark:bg-[#153a35] text-[#0e2724] dark:text-[#f0faf8] border-primary/40 text-[10px]'
                : 'px-1.5 py-0.5 bg-white/85 dark:bg-[#12332e]/85 text-[#183631] dark:text-[#d3ede7] border-white/60 dark:border-primary-fixed/20 backdrop-blur-xs text-[9.5px] opacity-85'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shadow-xs ${
                selected ? 'animate-pulse' : ''
              } ${getStatusDotColor()}`}
            ></span>
            <span>{roomNumber}</span>
          </div>

          {/* Selected Status Capsule */}
          {selected && (
            <div className="bg-primary-fixed text-on-primary-fixed text-[9px] font-sans font-extrabold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
              {status}
            </div>
          )}

          {/* Hover Status Tooltip */}
          {hovered && !selected && (
            <div className="bg-white/95 dark:bg-[#0f2c28]/95 text-[#0e2724] dark:text-[#f0faf8] text-[9.5px] font-sans font-semibold px-2 py-0.5 rounded-md border border-surface-border shadow-lg whitespace-nowrap animate-fade-in flex items-center gap-1 backdrop-blur-sm">
              <span className="capitalize text-primary font-bold">{status}</span>
              {roomType && <span className="text-on-surface-variant">• {roomType}</span>}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
