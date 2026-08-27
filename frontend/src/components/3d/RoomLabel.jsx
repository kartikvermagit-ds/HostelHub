import React from 'react';
import { Html } from '@react-three/drei';

/**
 * Crisp 3D Room Number Plaque & Status Indicator
 * Always faces camera with subtle drop shadow and status colors
 */
export const RoomLabel = ({
  roomNumber = '101',
  status = 'available',
  roomType = 'Single',
  hovered = false,
  selected = false,
  branch = '',
  position = [0, 0.28, 0.46]
}) => {
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
              : 'scale-95'
          }`}
        >
          {/* Room Number Badge */}
          <div
            className={`px-2.5 py-0.5 rounded-lg font-mono text-[11px] font-bold tracking-wider shadow-md flex items-center gap-1.5 border transition-all ${
              selected
                ? 'bg-primary text-on-primary border-primary-fixed shadow-primary/40 ring-2 ring-primary/60'
                : hovered
                ? 'bg-surface-container-highest text-on-surface border-primary shadow-sm ring-1 ring-primary/30'
                : 'bg-surface/95 text-on-surface border-surface-border/90 backdrop-blur-xs'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shadow-sm ${
                status === 'available' || selected ? 'animate-pulse' : ''
              } ${getStatusDotColor()}`}
            ></span>
            <span>{roomNumber}</span>
          </div>

          {/* Hover Status Tooltip */}
          {hovered && !selected && (
            <div className="bg-surface-container-lowest/95 text-on-surface text-[10px] font-sans font-semibold px-2.5 py-1 rounded-md border border-surface-border shadow-xl whitespace-nowrap animate-fade-in flex items-center gap-1.5 backdrop-blur-sm">
              <span className="capitalize text-primary font-bold">{status}</span>
              {roomType && <span className="text-on-surface-variant">• {roomType}</span>}
              {branch && <span className="text-on-surface-variant font-normal">({branch.split('•')[0].trim()})</span>}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

