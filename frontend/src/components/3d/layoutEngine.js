import * as THREE from 'three';

/**
 * HostelHub Advanced 3D Layout & Architectural Calculation Engine
 * Decoupled mathematical engine for multi-wing digital twins, dynamic courtyards,
 * non-overlapping room distributions, and multi-mode cinematic camera framing.
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
    baseWidth = configuredWidth || Math.max(baseWidth, 8.0);
    baseDepth = configuredDepth || Math.max(baseWidth * 0.62, 5.2);
  } else if (layoutType === LAYOUT_TYPES.U_SHAPE || layoutType === LAYOUT_TYPES.C_SHAPE) {
    baseWidth = configuredWidth || Math.max(baseWidth, 7.4);
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
    // 4 enclosing wings (South, North, West, East) around open central space
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

    // Distribute rooms across front and back wings
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
      { id: 'wing-back', position: [0, 0, -depth / 2 + mainWingThickness / 2], size: [width, 0.12, mainWingThickness] },
      { id: 'wing-left', position: [-width / 2 + sideWingThickness / 2, 0, 0.2], size: [sideWingThickness, 0.12, depth - 0.4] },
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
 * Checks if a 2D coordinate is safely within the courtyard boundaries
 */
export function isInsideCourtyardBounds(x, z, width, depth, margin = 0.3) {
  const halfW = (width / 2) - margin;
  const halfD = (depth / 2) - margin;
  return x >= -halfW && x <= halfW && z >= -halfD && z <= halfD;
}

/**
 * Calculates central space / courtyard dimensions and deterministic procedural elements
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

  const courtyardWidth = centralSpace.width ? parseFloat(centralSpace.width) : Math.max(width - 3.2, 3.4);
  const courtyardDepth = centralSpace.depth ? parseFloat(centralSpace.depth) : Math.max(depth - 2.4, 2.4);

  // Density multipliers if customized
  const customTrees = centralSpace.treeCount !== undefined ? parseInt(centralSpace.treeCount, 10) : null;
  const customBenches = centralSpace.benchCount !== undefined ? parseInt(centralSpace.benchCount, 10) : null;
  const customTables = centralSpace.studyTableCount !== undefined ? parseInt(centralSpace.studyTableCount, 10) : null;
  const customLights = centralSpace.lightCount !== undefined ? parseInt(centralSpace.lightCount, 10) : null;

  const items = [];

  if (enabled) {
    const halfW = courtyardWidth / 2;
    const halfD = courtyardDepth / 2;

    // 1. CENTRAL FOCAL FEATURE (Specific to Type)
    if (type === CENTRAL_SPACE_TYPES.COURTYARD) {
      items.push({
        type: 'water_feature',
        position: [0, 0, 0],
        scale: 1.0,
        title: 'Central Fountain & Reflection Pond'
      });
    } else if (type === CENTRAL_SPACE_TYPES.GARDEN) {
      items.push({
        type: 'central_planter',
        position: [0, 0, 0],
        scale: 1.1,
        title: 'Botanical Garden Center'
      });
    } else if (type === CENTRAL_SPACE_TYPES.STUDY_AREA) {
      const tableCount = customTables !== null ? customTables : (courtyardWidth > 4.5 ? 2 : 1);
      if (tableCount === 1) {
        items.push({
          type: 'study_table',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          title: 'Central Study Pod'
        });
      } else {
        items.push(
          { type: 'study_table', position: [-halfW * 0.38, 0, 0], rotation: [0, 0, 0], title: 'Study Station Alpha' },
          { type: 'study_table', position: [halfW * 0.38, 0, 0], rotation: [0, 0, 0], title: 'Study Station Beta' }
        );
      }
    } else if (type === CENTRAL_SPACE_TYPES.COMMON_AREA) {
      items.push({
        type: 'social_lounge',
        position: [0, 0, 0],
        title: 'Open Student Lounge'
      });
    } else if (type === CENTRAL_SPACE_TYPES.ATRIUM) {
      items.push({
        type: 'atrium_centerpiece',
        position: [0, 0, 0],
        title: 'Architectural Atrium Core'
      });
    }

    // 2. PROCEDURAL TREES (Clustered away from center and pathways)
    const treePositions = [
      [-halfW * 0.72, -halfD * 0.65, 1.05],
      [halfW * 0.72, -halfD * 0.65, 0.95],
      [-halfW * 0.72, halfD * 0.65, 0.9],
      [halfW * 0.72, halfD * 0.65, 1.0]
    ];
    const treeLimit = customTrees !== null ? customTrees : (type === CENTRAL_SPACE_TYPES.GARDEN ? 4 : 3);
    treePositions.slice(0, treeLimit).forEach(([tx, tz, ts]) => {
      if (isInsideCourtyardBounds(tx, tz, courtyardWidth, courtyardDepth, 0.2)) {
        items.push({
          type: 'tree',
          position: [tx, 0, tz],
          scale: ts
        });
      }
    });

    // 3. CAMPUS BENCHES (Facing inward toward focal area)
    const benchConfigs = [
      { pos: [-halfW * 0.55, 0, halfD * 0.45], rot: [0, -Math.PI / 4, 0] },
      { pos: [halfW * 0.55, 0, halfD * 0.45], rot: [0, Math.PI / 4, 0] },
      { pos: [-halfW * 0.55, 0, -halfD * 0.45], rot: [0, Math.PI / 4, 0] },
      { pos: [halfW * 0.55, 0, -halfD * 0.45], rot: [0, -Math.PI / 4, 0] }
    ];
    const benchLimit = customBenches !== null ? customBenches : (type === CENTRAL_SPACE_TYPES.COMMON_AREA ? 4 : 2);
    benchConfigs.slice(0, benchLimit).forEach(({ pos, rot }) => {
      if (isInsideCourtyardBounds(pos[0], pos[2], courtyardWidth, courtyardDepth, 0.25)) {
        items.push({
          type: 'bench',
          position: pos,
          rotation: rot
        });
      }
    });

    // 4. COURTYARD LIGHTING (Sleek Bollards / Lanterns)
    const lightPositions = [
      [-halfW * 0.75, 0, 0],
      [halfW * 0.75, 0, 0]
    ];
    const lightLimit = customLights !== null ? customLights : 2;
    lightPositions.slice(0, lightLimit).forEach((lpos) => {
      items.push({
        type: 'courtyard_light',
        position: lpos
      });
    });

    // 5. MODERN PLANTER BOXES & SHRUBS (Border Greenery)
    items.push(
      { type: 'planter', position: [-halfW * 0.28, 0, halfD * 0.7] },
      { type: 'planter', position: [halfW * 0.28, 0, halfD * 0.7] }
    );

    // 6. ACADEMIC NOTICE BOARD (Translucent Glassmorphic Notice Board)
    items.push({
      type: 'notice_board',
      position: [halfW * 0.7, 0, halfD * 0.55],
      rotation: [0, -Math.PI / 3.8, 0],
      title: 'Hostel Academic Notice Board'
    });
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
 * Calculates camera target and approach coordinates dynamically with support for
 * Overview, Floor Focus, Room Focus, Interior, and dedicated Courtyard View.
 */
export function calculateCameraTarget({
  buildingDims,
  selectedFloorNumber = null,
  selectedRoom = null,
  isExplodedView = false,
  cameraMode = 'overview'
}) {
  const { width = 6.0, depth = 4.0, totalHeight = 3.5, floorHeight = 1.05 } = buildingDims || {};

  const targetPos = new THREE.Vector3(0, 2.2, 9.4);
  const targetLookAt = new THREE.Vector3(0, 1.1, 0.4);

  if (cameraMode === 'courtyard') {
    // Dedicated Courtyard Camera State: Angled focus into the central social/academic hub
    targetPos.set(0, 2.6, Math.max(depth * 0.85 + 4.5, 6.2));
    targetLookAt.set(0, 0.4, 0);
  } else if (cameraMode === 'room' && selectedRoom && selectedRoom.position) {
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
