import React from 'react';
import { Html } from '@react-three/drei';

/**
 * Crisp 3D Room Number Plaque & Interactive Status Tooltip
 */
export const RoomLabel = ({
  roomNumber = '101',
  status = 'occupied',

  hovered = false,
  selected = false,
  branch = '',
  position = [0, 0.28, 0.46]
}) => {
  // If the room is selected, hide the large floating label so the 3D interior is fully visible
  if (selected) return null;

  return (
    <group position={position}>
      <Html
        center
        distanceFactor={6}
        zIndexRange={[50, 0]}
        className="pointer-events-none select-none transition-all duration-200"
      >
        <div
          className={`flex flex-col items-center gap-1 ${
            hovered ? 'scale-110' : 'scale-95'
          }`}
        >
          {/* Room Number Badge */}
          <div
            className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold tracking-wider shadow-sm flex items-center gap-1 border transition-all ${
              hovered
                ? 'bg-primary text-on-primary border-primary-fixed shadow-md ring-2 ring-primary/40'
                : 'bg-surface/90 text-on-surface border-surface-border/80 backdrop-blur-xs'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                status === 'available'
                  ? 'bg-emerald-500'
                  : status === 'maintenance'
                  ? 'bg-amber-500'
                  : 'bg-primary'
              }`}
            ></span>
            <span>{roomNumber}</span>
          </div>

          {/* Hover Status Tooltip */}
          {hovered && (
            <div className="bg-surface-container-lowest/95 text-on-surface text-[9px] font-sans font-semibold px-2 py-0.5 rounded-md border border-surface-border shadow-lg whitespace-nowrap animate-fade-in flex items-center gap-1">
              <span className="capitalize text-primary font-bold">{status}</span>
              {branch && <span className="text-on-surface-variant font-normal">• {branch.split('•')[0]}</span>}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

