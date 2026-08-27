import * as THREE from 'three';

/**
 * HostelHub Decoupled 3D Layout & Architectural Calculation Engine
 * Pure math and layout logic independent of React rendering.
 * Supports Straight, L-Shape, U-Shape, C-Shape, H-Shape, and Courtyard digital twins.
 */

export const LAYOUT_TYPES = {
  STRAIGHT: 'Straight',
  L_SHAPE: 'L',
  U_SHAPE: 'U',
  C_SHAPE: 'C',
  H_SHAPE: 'H',
  COURTYARD: 'Courtyard'
};

export const CENTRAL_SPACE_TYPES = {
  COURTYARD: 'Courtyard',
  GARDEN: 'Garden',
  STUDY_AREA: 'Study Area',
  COMMON_AREA: 'Common Area',
  ATRIUM: 'Atrium'
};

/**
 * Calculates building dimensions based on layout configuration and room counts
 */
export function calculateBuildingDimensions(hostelData = {}, customLayout = null) {
  const { floors = [], layoutConfig = {} } = hostelData || {};
  const config = customLayout || layoutConfig || {};

  const totalFloors = Math.max((floors || []).length, 1);
  const maxRoomsOnAnyFloor = Math.max(
    ...(floors || []).map((f) => (f.rooms ? f.rooms.length : 0)),
    3
  );

  const layoutType = config.layoutType || LAYOUT_TYPES.STRAIGHT;
  const configuredWidth = config.buildingWidth ? parseFloat(config.buildingWidth) : null;
  const configuredDepth = config.buildingDepth ? parseFloat(config.buildingDepth) : null;
  const floorHeight = config.floorHeight ? parseFloat(config.floorHeight) : 1.05;

  let baseWidth = configuredWidth || Math.max(maxRoomsOnAnyFloor * 1.4 + 1.8, 5.8);
  let baseDepth = configuredDepth || 2.6;

  // Adjust dimensions based on layout wing requirements
  if (layoutType === LAYOUT_TYPES.COURTYARD) {
    baseWidth = configuredWidth || Math.max(baseWidth, 7.8);
    baseDepth = configuredDepth || Math.max(baseWidth * 0.65, 5.2);
  } else if (layoutType === LAYOUT_TYPES.U_SHAPE || layoutType === LAYOUT_TYPES.C_SHAPE) {
    baseWidth = configuredWidth || Math.max(baseWidth, 7.2);
    baseDepth = configuredDepth || 4.6;
  } else if (layoutType === LAYOUT_TYPES.L_SHAPE) {
    baseWidth = configuredWidth || Math.max(baseWidth, 6.6);
    baseDepth = configuredDepth || 4.2;
  } else if (layoutType === LAYOUT_TYPES.H_SHAPE) {
    baseWidth = configuredWidth || Math.max(baseWidth, 8.2);
    baseDepth = configuredDepth || 5.0;
  }

  return {
    width: baseWidth,
    depth: baseDepth,
    floorHeight,
    totalFloors,
    totalHeight: totalFloors * floorHeight,
    corridorWidth: config.corridorWidth ? parseFloat(config.corridorWidth) : 0.8,
    layoutType,
    maxRoomsOnAnyFloor
  };
}

/**
 * Calculates wing geometry and slab pieces for a floor based on layout shape
 */
export function calculateFloorLayout(floorData = {}, buildingDims = {}, customLayout = null) {
  const { rooms = [], floorNumber = 1 } = floorData || {};
  const { width, depth, floorHeight, layoutType } = buildingDims;
  const roomCount = (rooms || []).length;

  const wings = [];
  const roomDistribution = [];

  const mainWingThickness = 1.4;
  const sideWingThickness = 1.4;

  if (layoutType === LAYOUT_TYPES.COURTYARD) {
    // 4 enclosing wings (North, South, East, West) around open central space
    const courtyardW = width - sideWingThickness * 2 - 0.4;
    const courtyardD = depth - mainWingThickness * 2 - 0.4;

    // Slabs
    wings.push(
      // Front (South) Wing
      { id: 'wing-south', position: [0, 0, depth / 2 - mainWingThickness / 2], size: [width, 0.12, mainWingThickness] },
      // Back (North) Wing
      { id: 'wing-north', position: [0, 0, -depth / 2 + mainWingThickness / 2], size: [width, 0.12, mainWingThickness] },
      // Left (West) Wing
      { id: 'wing-west', position: [-width / 2 + sideWingThickness / 2, 0, 0], size: [sideWingThickness, 0.12, depth - mainWingThickness * 2] },
      // Right (East) Wing
      { id: 'wing-east', position: [width / 2 - sideWingThickness / 2, 0, 0], size: [sideWingThickness, 0.12, depth - mainWingThickness * 2] }
    );

    // Distribute rooms across wings
    const perWing = Math.max(Math.ceil(roomCount / 2), 1);
    const southRooms = rooms.slice(0, perWing);
    const northRooms = rooms.slice(perWing);

    // Front wing rooms
    southRooms.forEach((r, idx) => {
      const step = (width - 1.8) / Math.max(southRooms.length, 1);
      const xPos = -((width - 1.8) / 2) + (idx + 0.5) * step;
      roomDistribution.push({
        ...r,
        wing: 'south',
        position: [xPos, floorHeight * 0.48, depth / 2 - mainWingThickness / 2 + 0.05],
        dimensions: [Math.min(step * 0.86, 1.35), floorHeight * 0.78, 1.05]
      });
    });

    // Back wing rooms (facing courtyard)
    northRooms.forEach((r, idx) => {
      const step = (width - 1.8) / Math.max(northRooms.length, 1);
      const xPos = -((width - 1.8) / 2) + (idx + 0.5) * step;
      roomDistribution.push({
        ...r,
        wing: 'north',
        position: [xPos, floorHeight * 0.48, -depth / 2 + mainWingThickness / 2 - 0.05],
        dimensions: [Math.min(step * 0.86, 1.35), floorHeight * 0.78, 1.05]
      });
    });
  } else if (layoutType === LAYOUT_TYPES.U_SHAPE || layoutType === LAYOUT_TYPES.C_SHAPE) {
    // 3 wings: Main back wing + Left wing + Right wing extending forward
    wings.push(
      // Back Wing
      { id: 'wing-back', position: [0, 0, -depth / 2 + mainWingThickness / 2], size: [width, 0.12, mainWingThickness] },
      // Left Wing
      { id: 'wing-left', position: [-width / 2 + sideWingThickness / 2, 0, 0.2], size: [sideWingThickness, 0.12, depth - 0.4] },
      // Right Wing
      { id: 'wing-right', position: [width / 2 - sideWingThickness / 2, 0, 0.2], size: [sideWingThickness, 0.12, depth - 0.4] }
    );

    const step = (width - 1.8) / Math.max(roomCount, 1);
    rooms.forEach((r, idx) => {
      const xPos = -((width - 1.8) / 2) + (idx + 0.5) * step;
      roomDistribution.push({
        ...r,
        wing: 'back',
        position: [xPos, floorHeight * 0.48, -depth / 2 + mainWingThickness / 2 + 0.05],
        dimensions: [Math.min(step * 0.86, 1.35), floorHeight * 0.78, 1.05]
      });
    });
  } else if (layoutType === LAYOUT_TYPES.L_SHAPE) {
    // 2 wings: Main facade + Left side wing
    wings.push(
      { id: 'wing-main', position: [0, 0, 0.4], size: [width, 0.12, 1.8] },
      { id: 'wing-side', position: [-width / 2 + sideWingThickness / 2, 0, -depth / 2 + 1.0], size: [sideWingThickness, 0.12, depth - 1.2] }
    );

    const step = (width - 1.8) / Math.max(roomCount, 1);
    rooms.forEach((r, idx) => {
      const xPos = -((width - 1.8) / 2) + (idx + 0.5) * step;
      roomDistribution.push({
        ...r,
        wing: 'main',
        position: [xPos, floorHeight * 0.48, 0.42],
        dimensions: [Math.min(step * 0.86, 1.35), floorHeight * 0.78, 1.05]
      });
    });
  } else {
    // STRAIGHT layout (Linear)
    wings.push({
      id: 'wing-straight',
      position: [0, 0, 0.4],
      size: [width, 0.12, depth]
    });

    const step = (width - 1.6) / Math.max(roomCount, 1);
    rooms.forEach((r, idx) => {
      const xPos = -((width - 1.6) / 2) + (idx + 0.5) * step;
      roomDistribution.push({
        ...r,
        wing: 'straight',
        position: [xPos, floorHeight * 0.48, 0.42],
        dimensions: [Math.min(step * 0.88, 1.4), floorHeight * 0.78, 1.05]
      });
    });
  }

  return {
    wings,
    rooms: roomDistribution
  };
}

/**
 * Calculates central space / courtyard dimensions and procedural elements
 */
export function calculateCourtyardBounds(buildingDims = {}, customLayout = null) {
  const { width, depth, layoutType } = buildingDims;
  const config = customLayout || {};
  const centralSpace = config.centralSpace || {};

  const isCourtyardOrU =
    layoutType === LAYOUT_TYPES.COURTYARD ||
    layoutType === LAYOUT_TYPES.U_SHAPE ||
    layoutType === LAYOUT_TYPES.C_SHAPE;

  const enabled = centralSpace.enabled !== undefined ? centralSpace.enabled : isCourtyardOrU;
  const type = centralSpace.type || CENTRAL_SPACE_TYPES.COURTYARD;

  const courtyardWidth = centralSpace.width ? parseFloat(centralSpace.width) : Math.max(width - 3.2, 3.2);
  const courtyardDepth = centralSpace.depth ? parseFloat(centralSpace.depth) : Math.max(depth - 2.6, 2.2);

  // Procedural courtyard items
  const items = [];
  if (enabled) {
    // Trees
    items.push(
      { type: 'tree', position: [-courtyardWidth * 0.32, 0, -courtyardDepth * 0.25], scale: 1.0 },
      { type: 'tree', position: [courtyardWidth * 0.32, 0, -courtyardDepth * 0.25], scale: 0.9 }
    );

    // Benches
    items.push(
      { type: 'bench', position: [-courtyardWidth * 0.3, 0, courtyardDepth * 0.25], rotation: [0, Math.PI / 6, 0] },
      { type: 'bench', position: [courtyardWidth * 0.3, 0, courtyardDepth * 0.25], rotation: [0, -Math.PI / 6, 0] }
    );

    // Study Tables / Common Seating
    if (type === CENTRAL_SPACE_TYPES.STUDY_AREA || type === CENTRAL_SPACE_TYPES.COMMON_AREA) {
      items.push(
        { type: 'study_table', position: [0, 0, 0], rotation: [0, 0, 0] }
      );
    }

    // Courtyard Central Lamp / Bollard
    items.push(
      { type: 'courtyard_light', position: [-courtyardWidth * 0.38, 0, 0] },
      { type: 'courtyard_light', position: [courtyardWidth * 0.38, 0, 0] }
    );

    // Modern Planter Boxes
    items.push(
      { type: 'planter', position: [-courtyardWidth * 0.18, 0, courtyardDepth * 0.35] },
      { type: 'planter', position: [courtyardWidth * 0.18, 0, courtyardDepth * 0.35] }
    );
  }

  return {
    enabled,
    type,
    width: courtyardWidth,
    depth: courtyardDepth,
    position: [0, 0.05, 0],
    items
  };
}

/**
 * Calculates camera target and approach coordinates dynamically
 */
export function calculateCameraTarget({
  buildingDims,
  selectedFloorNumber = null,
  selectedRoom = null,
  isExplodedView = false,
  cameraMode = 'overview'
}) {
  const { width = 6.0, totalHeight = 3.5, floorHeight = 1.05 } = buildingDims || {};

  const targetPos = new THREE.Vector3(0, 2.2, 9.4);
  const targetLookAt = new THREE.Vector3(0, 1.1, 0.4);

  if (cameraMode === 'room' && selectedRoom && selectedRoom.position) {
    const [rx, ry, rz] = selectedRoom.position;
    targetPos.set(rx * 0.5, ry + 0.38, Math.max(rz + 6.2, 7.2));
    targetLookAt.set(rx * 0.55, ry + 0.12, rz || 0.4);
  } else if (cameraMode === 'floor' || selectedFloorNumber !== null) {
    const floorIdx = Math.max((selectedFloorNumber || 1) - 1, 0);
    const floorY = floorIdx * (floorHeight + (isExplodedView ? 0.75 : 0));
    targetPos.set(0, floorY + 1.25, Math.max(width * 1.1, 8.2));
    targetLookAt.set(0, floorY + 0.35, 0.4);
  } else if (isExplodedView) {
    targetPos.set(0, totalHeight + 1.8, Math.max(width * 1.25, 10.4));
    targetLookAt.set(0, totalHeight * 0.5, 0.4);
  } else {
    // Overview mode
    targetPos.set(0, totalHeight * 0.65 + 0.6, Math.max(width * 1.15, 9.4));
    targetLookAt.set(0, totalHeight * 0.4, 0.4);
  }

  return { targetPos, targetLookAt };
}
