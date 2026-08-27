import React, { useState, useMemo, useEffect } from 'react';
import { useHostelStore } from '../../stores/hostelStore';
import { CanvasWrapper } from '../3d/CanvasWrapper';
import { Building3D } from '../3d/Building3D';
import { HostelCamera } from '../3d/HostelCamera';
import { calculateBuildingDimensions } from '../3d/layoutEngine';

/**
 * Production 6-Tab 3D Hostel Builder & Manager
 * Features: Hostel, Floors, Rooms, Layout, Architecture, and Live 3D Preview
 * with Draft State, Smart Room Generator, and Duplicate Floors/Rooms.
 */
export const HostelAdminManager = ({ onToast = () => {} }) => {
  const {
    hostels,
    addHostel,
    updateHostel,
    updateHostelLayout,
    deleteHostel,
    addFloor,
    updateFloor,
    duplicateFloor,
    deleteFloor,
    addRoom,
    updateRoom,
    duplicateRoom,
    smartGenerateRoomsForFloor,
    deleteRoom,
    resetToDefaultHostels
  } = useHostelStore();

  const [activeHostelId, setActiveHostelId] = useState(hostels[0]?.id || 'hostel-4');
  const [adminTab, setAdminTab] = useState('hostel'); // 'hostel' | 'floors' | 'rooms' | 'layout' | 'architecture' | 'preview'
  const [selectedFloorFilter, setSelectedFloorFilter] = useState('ALL');
  const [roomSearch, setRoomSearch] = useState('');

  // Modals state
  const [isHostelModalOpen, setIsHostelModalOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);

  const [isSmartGenModalOpen, setIsSmartGenModalOpen] = useState(false);

  // Active hostel from store
  const savedHostel = hostels.find((h) => h.id === activeHostelId) || hostels[0];

  // Draft state for live tweaking before saving
  const [draftHostel, setDraftHostel] = useState(savedHostel);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setDraftHostel(savedHostel);
    setHasUnsavedChanges(false);
  }, [activeHostelId, savedHostel]);

  const updateDraft = (updater) => {
    setDraftHostel((prev) => {
      const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const handleSaveDraftToStore = () => {
    if (!draftHostel) return;
    updateHostel(draftHostel.id, draftHostel);
    if (draftHostel.layoutConfig) {
      updateHostelLayout(draftHostel.id, draftHostel.layoutConfig);
    }
    setHasUnsavedChanges(false);
    onToast(`Saved all configurations for "${draftHostel.name}" to 3D Digital Twin!`);
  };

  const handleDiscardDraft = () => {
    setDraftHostel(savedHostel);
    setHasUnsavedChanges(false);
    onToast('Discarded unsaved changes. Reverted to last saved configuration.');
  };

  // Flat list of rooms for the active draft hostel
  const allRoomsInDraft = useMemo(() => {
    return (draftHostel?.floors || []).flatMap((f) =>
      (f.rooms || []).map((r) => ({ ...r, floorName: f.name || `Floor ${f.floorNumber}` }))
    );
  }, [draftHostel]);

  const filteredRooms = allRoomsInDraft.filter((r) => {
    const matchesFloor =
      selectedFloorFilter === 'ALL' || String(r.floorNumber) === String(selectedFloorFilter);
    const matchesSearch =
      roomSearch === '' ||
      r.roomNumber?.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.status?.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.occupants?.some((occ) => occ.name?.toLowerCase().includes(roomSearch.toLowerCase()));
    return matchesFloor && matchesSearch;
  });

  // Handle Hostel Info Save
  const handleSaveHostelInfo = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const displayName = formData.get('displayName');
    const tagline = formData.get('tagline');
    const description = formData.get('description');
    const hostelType = formData.get('hostelType');
    const accentColor = formData.get('accentColor');

    updateDraft({
      name,
      displayName,
      tagline,
      description,
      hostelType,
      accentColor
    });

    onToast(`Hostel details updated in draft. Dynamic sign updated to "${name.toUpperCase()}".`);
  };

  // Handle Floor Edit / Create
  const handleSaveFloor = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const floorNumber = parseInt(formData.get('floorNumber') || '1', 10);

    if (editingFloor) {
      updateFloor(draftHostel.id, editingFloor.id, { name, floorNumber });
      onToast(`Floor ${floorNumber} name updated!`);
    } else {
      const floorId = `${draftHostel.id}-f${floorNumber}-${Date.now().toString().slice(-4)}`;
      const newFloor = {
        id: floorId,
        hostelId: draftHostel.id,
        floorNumber,
        name: name || `Floor ${floorNumber}`,
        rooms: [
          {
            id: `${draftHostel.id}-${floorNumber}01`,
            hostelId: draftHostel.id,
            floorId,
            floorNumber,
            roomNumber: `${floorNumber}01`,
            status: 'available',
            roomType: 'Single',
            capacity: 1,
            occupants: [],
            branch: 'General Wing',
            facilities: ['Study Table', 'Chair', 'Bed', 'Wi-Fi'],
            description: `Room ${floorNumber}01`,
            sharedNotesCount: 10,
            activeStudyGroup: 'Hostel Study Group',
            resources: []
          }
        ]
      };
      addFloor(draftHostel.id, newFloor);
      onToast(`Floor ${floorNumber} added to 3D model!`);
    }
    setIsFloorModalOpen(false);
    setEditingFloor(null);
  };

  // Handle Room Save (Create / Edit)
  const handleSaveRoom = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roomNumber = formData.get('roomNumber');
    const floorNumber = parseInt(formData.get('floorNumber') || '1', 10);
    const status = formData.get('status');
    const roomType = formData.get('roomType');
    const studentName = formData.get('studentName');
    const branch = formData.get('branch');
    const description = formData.get('description');
    const facilitiesStr = formData.get('facilities');

    const facilities = facilitiesStr
      ? facilitiesStr.split(',').map((f) => f.trim()).filter(Boolean)
      : ['Study Table', 'Chair', 'Bed', 'Wi-Fi'];

    const targetFloor = (draftHostel.floors || []).find((f) => f.floorNumber === floorNumber) || draftHostel.floors[0];

    if (editingRoom) {
      updateRoom(editingRoom.id, {
        roomNumber,
        status,
        roomType,
        branch,
        description,
        facilities,
        occupants: studentName ? [{ name: studentName, branch }] : []
      });
      onToast(`Room ${roomNumber} updated!`);
    } else {
      const newRoom = {
        id: `${draftHostel.id}-${roomNumber}-${Date.now().toString().slice(-3)}`,
        hostelId: draftHostel.id,
        floorId: targetFloor.id,
        floorNumber,
        roomNumber,
        status,
        roomType,
        capacity: roomType === 'Double' ? 2 : 1,
        occupants: studentName ? [{ name: studentName, branch }] : [],
        branch: branch || 'Academic Pod',
        facilities,
        description: description || `Room ${roomNumber}`,
        sharedNotesCount: 10,
        activeStudyGroup: 'Hostel Study Group',
        resources: []
      };

      addRoom(draftHostel.id, targetFloor.id, newRoom);
      onToast(`Created Room ${roomNumber}!`);
    }

    setIsRoomModalOpen(false);
    setEditingRoom(null);
  };

  // Handle Smart Generator Submit
  const handleSmartGenerate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const floorNumber = parseInt(formData.get('floorNumber') || '1', 10);
    const roomCount = parseInt(formData.get('roomCount') || '6', 10);
    const startNumber = parseInt(formData.get('startNumber') || '1', 10);
    const roomType = formData.get('roomType') || 'Single';

    const targetFloor = (draftHostel.floors || []).find((f) => f.floorNumber === floorNumber);
    if (!targetFloor) return;

    smartGenerateRoomsForFloor(draftHostel.id, targetFloor.id, roomCount, startNumber, roomType);
    setIsSmartGenModalOpen(false);
    onToast(`Smart generated ${roomCount} rooms for Floor ${floorNumber} (${floorNumber}0${startNumber} - ${floorNumber}0${startNumber + roomCount - 1})!`);
  };

  const previewDims = useMemo(() => {
    return calculateBuildingDimensions(draftHostel, draftHostel?.layoutConfig);
  }, [draftHostel]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 1. Hostels Selector & Action Bar */}
      <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              <h2 className="font-headline-md text-base font-bold text-on-surface">
                3D Digital Twin Hostel Builder
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Configure hostel architecture, floor wings, dynamic rooms, courtyards, and live 3D preview.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {hasUnsavedChanges && (
              <>
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  className="px-3 py-1.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-container-low text-xs font-semibold text-on-surface-variant transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraftToStore}
                  className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save Configuration</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all 3D hostel configurations to defaults (including Aryabhata Courtyard)?')) {
                  resetToDefaultHostels();
                  onToast('All 3D hostels restored to factory defaults.');
                }
              }}
              className="px-3 py-1.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-container-low text-xs font-semibold text-on-surface-variant transition-colors"
              title="Reset to Factory Defaults"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Hostels Tabs Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {hostels.map((h) => {
            const isActive = activeHostelId === h.id;
            const totalRooms = (h.floors || []).reduce((acc, f) => acc + (f.rooms?.length || 0), 0);
            return (
              <div
                key={h.id}
                onClick={() => setActiveHostelId(h.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isActive
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/30 shadow-sm'
                    : 'border-surface-border bg-surface hover:border-primary/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-on-surface">{h.name}</h3>
                    <p className="text-[11px] text-on-surface-variant font-medium line-clamp-1">
                      {h.displayName || h.description}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] font-bold text-primary uppercase">
                    {h.layoutConfig?.layoutType || 'Straight'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-border/60">
                  <span>{h.floors?.length || 1} Floors • {totalRooms} Rooms</span>
                  <span className="text-[11px] font-semibold text-primary">Edit 3D</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ADMIN MULTI-TAB BUILDER NAVIGATION */}
      <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-5 shadow-sm flex flex-col gap-5">
        <div className="flex items-center gap-2 border-b border-surface-border pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'hostel', label: 'Hostel Info', icon: 'badge' },
            { id: 'floors', label: 'Floors', icon: 'layers' },
            { id: 'rooms', label: 'Rooms', icon: 'meeting_room' },
            { id: 'layout', label: 'Layout & Wings', icon: 'domain' },
            { id: 'central-space', label: 'Central Space', icon: 'park' },
            { id: 'architecture', label: 'Architecture', icon: 'apartment' },
            { id: 'preview', label: 'Live 3D Preview', icon: 'view_in_ar' }
          ].map((tab) => {
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAdminTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: HOSTEL INFO */}
        {adminTab === 'hostel' && (
          <form onSubmit={handleSaveHostelInfo} className="space-y-4 text-xs max-w-xl">
            <div>
              <label className="font-bold text-on-surface block mb-1">
                Hostel Name (Source of Truth for 3D Sign)
              </label>
              <input
                type="text"
                name="name"
                defaultValue={draftHostel.name}
                required
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs font-bold text-on-surface focus:outline-none focus:border-primary"
                placeholder="e.g. Aryabhata Hostel, Sarabhai Hostel, Hostel 4"
              />
              <p className="text-[11px] text-on-surface-variant mt-1">
                This exact name will be illuminated on top of the 3D building and updated everywhere across the application.
              </p>
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Display Title</label>
              <input
                type="text"
                name="displayName"
                defaultValue={draftHostel.displayName || ''}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                placeholder="e.g. Boys Hostel 4 (Aryabhata Block)"
              />
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                defaultValue={draftHostel.tagline || ''}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                placeholder="e.g. Engineering Scholars & Tech Innovation"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-on-surface block mb-1">Hostel Type</label>
                <select
                  name="hostelType"
                  defaultValue={draftHostel.hostelType || 'boys'}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                >
                  <option value="boys">Boys Hostel</option>
                  <option value="girls">Girls Hostel</option>
                  <option value="co-ed">Co-Ed Scholars Block</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Accent Theme Color</label>
                <input
                  type="color"
                  name="accentColor"
                  defaultValue={draftHostel.accentColor || '#00685f'}
                  className="w-full h-9 bg-surface border border-surface-border rounded-xl cursor-pointer p-1"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Description</label>
              <textarea
                name="description"
                defaultValue={draftHostel.description || ''}
                rows={3}
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-primary text-on-primary font-bold rounded-xl shadow-xs"
            >
              Apply Changes
            </button>
          </form>
        )}

        {/* TAB 2: FLOORS */}
        {adminTab === 'floors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-on-surface">Configured Floors ({draftHostel.floors.length})</h4>
                <p className="text-xs text-on-surface-variant">Manage floor heights, labels, and duplications.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingFloor(null);
                  setIsFloorModalOpen(true);
                }}
                className="px-3 py-1.5 bg-primary text-on-primary rounded-xl font-semibold text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Floor</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-surface-border text-on-surface-variant font-bold">
                    <th className="py-2.5 px-3">Floor #</th>
                    <th className="py-2.5 px-3">Name / Label</th>
                    <th className="py-2.5 px-3">Rooms</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {draftHostel.floors.map((floor) => (
                    <tr key={floor.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-primary">Floor {floor.floorNumber}</td>
                      <td className="py-3 px-3 font-semibold text-on-surface">{floor.name}</td>
                      <td className="py-3 px-3 text-on-surface-variant">{floor.rooms?.length || 0} rooms</td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              duplicateFloor(draftHostel.id, floor.id);
                              onToast(`Duplicated Floor ${floor.floorNumber} with room numbering!`);
                            }}
                            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                            title="Duplicate Floor"
                          >
                            <span className="material-symbols-outlined text-[16px]">content_copy</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingFloor(floor);
                              setIsFloorModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                            title="Edit Floor"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          {draftHostel.floors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete Floor ${floor.floorNumber}?`)) {
                                  deleteFloor(draftHostel.id, floor.id);
                                  onToast(`Deleted Floor ${floor.floorNumber}`);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-red-600 transition-colors"
                              title="Delete Floor"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ROOMS & SMART GENERATOR */}
        {adminTab === 'rooms' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-on-surface">Configured Rooms ({allRoomsInDraft.length})</h4>
                <p className="text-xs text-on-surface-variant">Add, edit, duplicate, or auto-generate rooms.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSmartGenModalOpen(true)}
                  className="px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-xl font-bold text-xs flex items-center gap-1.5 border border-secondary/20"
                >
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  <span>Smart Room Generator</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingRoom(null);
                    setIsRoomModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-primary text-on-primary rounded-xl font-bold text-xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add Room</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedFloorFilter('ALL')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedFloorFilter === 'ALL'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  All Floors ({allRoomsInDraft.length})
                </button>
                {draftHostel.floors.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFloorFilter(String(f.floorNumber))}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedFloorFilter === String(f.floorNumber)
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    Floor {f.floorNumber} ({f.rooms?.length || 0})
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Filter room or student..."
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                className="px-3 py-1.5 bg-surface border border-surface-border rounded-xl text-xs max-w-xs w-full focus:outline-none focus:border-primary"
              />
            </div>

            {/* Rooms Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-surface-border text-on-surface-variant font-bold">
                    <th className="py-2.5 px-3">Room #</th>
                    <th className="py-2.5 px-3">Floor</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Student / Branch</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border/60">
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-primary">{room.roomNumber}</td>
                      <td className="py-3 px-3 text-on-surface">Floor {room.floorNumber}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-surface-container text-on-surface">
                          {room.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-on-surface-variant">{room.roomType}</td>
                      <td className="py-3 px-3 text-on-surface font-medium">
                        {room.occupants?.[0]?.name || <span className="text-on-surface-variant italic">Vacant</span>}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              duplicateRoom(draftHostel.id, room.floorId, room.id);
                              onToast(`Duplicated Room ${room.roomNumber}!`);
                            }}
                            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                            title="Duplicate Room"
                          >
                            <span className="material-symbols-outlined text-[16px]">content_copy</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRoom(room);
                              setIsRoomModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                            title="Edit Room"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete Room ${room.roomNumber}?`)) {
                                deleteRoom(room.id);
                                onToast(`Room ${room.roomNumber} removed.`);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-red-600 transition-colors"
                            title="Delete Room"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: LAYOUT & WINGS */}
        {adminTab === 'layout' && (
          <div className="space-y-5 text-xs max-w-xl">
            <div>
              <label className="font-bold text-on-surface block mb-2">Architectural Layout Shape</label>
              <div className="grid grid-cols-3 gap-2.5">
                {['Straight', 'Courtyard', 'U', 'L', 'C', 'H'].map((shape) => {
                  const isSelected = (draftHostel.layoutConfig?.layoutType || 'Straight') === shape;
                  return (
                    <button
                      key={shape}
                      type="button"
                      onClick={() =>
                        updateDraft((prev) => ({
                          ...prev,
                          layoutConfig: {
                            ...(prev.layoutConfig || {}),
                            layoutType: shape
                          }
                        }))
                      }
                      className={`p-3 rounded-xl border text-center font-bold transition-all ${
                        isSelected
                          ? 'bg-primary text-on-primary border-primary shadow-xs'
                          : 'bg-surface border-surface-border text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {shape} Shape
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-on-surface block mb-1">Building Width (Units)</label>
                <input
                  type="number"
                  step="0.5"
                  defaultValue={draftHostel.layoutConfig?.buildingWidth || 8.0}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      layoutConfig: {
                        ...(prev.layoutConfig || {}),
                        buildingWidth: parseFloat(e.target.value)
                      }
                    }))
                  }
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Building Depth (Units)</label>
                <input
                  type="number"
                  step="0.5"
                  defaultValue={draftHostel.layoutConfig?.buildingDepth || 5.0}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      layoutConfig: {
                        ...(prev.layoutConfig || {}),
                        buildingDepth: parseFloat(e.target.value)
                      }
                    }))
                  }
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-on-surface block mb-1">Floor Height (m)</label>
                <input
                  type="number"
                  step="0.05"
                  defaultValue={draftHostel.layoutConfig?.floorHeight || 1.05}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      layoutConfig: {
                        ...(prev.layoutConfig || {}),
                        floorHeight: parseFloat(e.target.value)
                      }
                    }))
                  }
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Corridor Width (m)</label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={draftHostel.layoutConfig?.corridorWidth || 0.8}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      layoutConfig: {
                        ...(prev.layoutConfig || {}),
                        corridorWidth: parseFloat(e.target.value)
                      }
                    }))
                  }
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CENTRAL SPACE */}
        {adminTab === 'central-space' && (
          <div className="space-y-5 text-xs max-w-xl">
            <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm text-on-surface">Central / Middle Space</h5>
                  <p className="text-xs text-on-surface-variant">Enable open central courtyard, garden, study area, or atrium.</p>
                </div>
                <input
                  type="checkbox"
                  checked={draftHostel.layoutConfig?.centralSpace?.enabled !== false}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      layoutConfig: {
                        ...(prev.layoutConfig || {}),
                        centralSpace: {
                          ...(prev.layoutConfig?.centralSpace || {}),
                          enabled: e.target.checked
                        }
                      }
                    }))
                  }
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
              </div>

              {draftHostel.layoutConfig?.centralSpace?.enabled !== false && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Central Space Typology</label>
                    <select
                      value={draftHostel.layoutConfig?.centralSpace?.type || 'Study Area'}
                      onChange={(e) =>
                        updateDraft((prev) => ({
                          ...prev,
                          layoutConfig: {
                            ...(prev.layoutConfig || {}),
                            centralSpace: {
                              ...(prev.layoutConfig?.centralSpace || {}),
                              type: e.target.value
                            }
                          }
                        }))
                      }
                      className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl font-bold"
                    >
                      <option value="Study Area">Study Area (Outdoor Workstations, Lamps & Notice Board)</option>
                      <option value="Courtyard">Courtyard (Reflection Pool, Benches, Trees, Walkways)</option>
                      <option value="Garden">Garden (Lush Lawn, Botanical Center & Planters)</option>
                      <option value="Common Area">Common Area (Conversational Social Lounge)</option>
                      <option value="Atrium">Atrium (Architectural Monument Core)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-on-surface block mb-1">Courtyard Width (m)</label>
                      <input
                        type="number"
                        step="0.2"
                        defaultValue={draftHostel.layoutConfig?.centralSpace?.width || 4.8}
                        onChange={(e) =>
                          updateDraft((prev) => ({
                            ...prev,
                            layoutConfig: {
                              ...(prev.layoutConfig || {}),
                              centralSpace: {
                                ...(prev.layoutConfig?.centralSpace || {}),
                                width: parseFloat(e.target.value)
                              }
                            }
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-surface border border-surface-border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-on-surface block mb-1">Courtyard Depth (m)</label>
                      <input
                        type="number"
                        step="0.2"
                        defaultValue={draftHostel.layoutConfig?.centralSpace?.depth || 3.4}
                        onChange={(e) =>
                          updateDraft((prev) => ({
                            ...prev,
                            layoutConfig: {
                              ...(prev.layoutConfig || {}),
                              centralSpace: {
                                ...(prev.layoutConfig?.centralSpace || {}),
                                depth: parseFloat(e.target.value)
                              }
                            }
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-surface border border-surface-border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                    <div>
                      <label className="font-semibold text-on-surface-variant block mb-1">Trees Count</label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        defaultValue={draftHostel.layoutConfig?.centralSpace?.treeCount || 3}
                        onChange={(e) =>
                          updateDraft((prev) => ({
                            ...prev,
                            layoutConfig: {
                              ...(prev.layoutConfig || {}),
                              centralSpace: {
                                ...(prev.layoutConfig?.centralSpace || {}),
                                treeCount: parseInt(e.target.value, 10)
                              }
                            }
                          }))
                        }
                        className="w-full px-2 py-1 bg-surface border border-surface-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-on-surface-variant block mb-1">Benches</label>
                      <input
                        type="number"
                        min="1"
                        max="4"
                        defaultValue={draftHostel.layoutConfig?.centralSpace?.benchCount || 2}
                        onChange={(e) =>
                          updateDraft((prev) => ({
                            ...prev,
                            layoutConfig: {
                              ...(prev.layoutConfig || {}),
                              centralSpace: {
                                ...(prev.layoutConfig?.centralSpace || {}),
                                benchCount: parseInt(e.target.value, 10)
                              }
                            }
                          }))
                        }
                        className="w-full px-2 py-1 bg-surface border border-surface-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-on-surface-variant block mb-1">Courtyard Lights</label>
                      <input
                        type="number"
                        min="1"
                        max="4"
                        defaultValue={draftHostel.layoutConfig?.centralSpace?.lightCount || 2}
                        onChange={(e) =>
                          updateDraft((prev) => ({
                            ...prev,
                            layoutConfig: {
                              ...(prev.layoutConfig || {}),
                              centralSpace: {
                                ...(prev.layoutConfig?.centralSpace || {}),
                                lightCount: parseInt(e.target.value, 10)
                              }
                            }
                          }))
                        }
                        className="w-full px-2 py-1 bg-surface border border-surface-border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: ARCHITECTURE */}
        {adminTab === 'architecture' && (
          <div className="space-y-4 text-xs max-w-xl">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-on-surface block mb-1">Entrance Canopy Position</label>
                <select
                  defaultValue={draftHostel.layoutConfig?.architecture?.entrancePosition || 'center'}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      layoutConfig: {
                        ...(prev.layoutConfig || {}),
                        architecture: {
                          ...(prev.layoutConfig?.architecture || {}),
                          entrancePosition: e.target.value
                        }
                      }
                    }))
                  }
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl"
                >
                  <option value="center">Center Facade</option>
                  <option value="left">Left Wing</option>
                  <option value="right">Right Wing</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Staircase & Lift Core</label>
                <select
                  defaultValue={draftHostel.layoutConfig?.architecture?.staircasePosition || 'right'}
                  onChange={(e) =>
                    updateDraft((prev) => ({
                      ...prev,
                      layoutConfig: {
                        ...(prev.layoutConfig || {}),
                        architecture: {
                          ...(prev.layoutConfig?.architecture || {}),
                          staircasePosition: e.target.value
                        }
                      }
                    }))
                  }
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl"
                >
                  <option value="right">Right End Tower</option>
                  <option value="left">Left End Tower</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: LIVE 3D PREVIEW */}
        {adminTab === 'preview' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-on-surface">Live Architectural 3D Preview</h4>
                <p className="text-xs text-on-surface-variant">Real-time visualization of current configuration.</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-surface-container text-xs font-mono font-bold text-primary">
                {previewDims.layoutType} • {draftHostel.floors.length} Floors • {previewDims.width}m x {previewDims.depth}m
              </span>
            </div>

            <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-surface-border bg-gradient-to-b from-surface-container-low/40 to-surface-container-high/20 relative shadow-inner">
              <CanvasWrapper
                className="w-full h-full"
                camera={{ position: [0, 3.5, 9.5], fov: 42 }}
                disableOnMobile={false}
              >
                <ambientLight intensity={0.95} />
                <directionalLight position={[6, 8, 6]} intensity={1.4} />
                <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#89f5e7" />
                <pointLight position={[0, 2, 2]} intensity={0.4} color="#ffdbce" />

                <HostelCamera
                  cameraMode="overview"
                  buildingDims={previewDims}
                  floorHeight={1.05}
                />

                <Building3D
                  hostelData={draftHostel}
                  customLayout={draftHostel.layoutConfig}
                  onSelectRoom={(r) => onToast(`Selected ${r.roomNumber} in 3D Preview`)}
                  qualityMode="high"
                />
              </CanvasWrapper>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Add / Edit Floor */}
      {isFloorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="font-headline-md text-lg font-bold text-on-surface mb-4">
              {editingFloor ? `Edit Floor ${editingFloor.floorNumber}` : 'Add Floor to Hostel'}
            </h3>
            <form onSubmit={handleSaveFloor} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">Floor Number</label>
                <input
                  type="number"
                  name="floorNumber"
                  defaultValue={editingFloor?.floorNumber || (draftHostel.floors.length + 1)}
                  required
                  min="1"
                  max="12"
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-on-surface block mb-1">Floor Label / Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingFloor?.name || `Floor ${draftHostel.floors.length + 1}`}
                  required
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs"
                  placeholder="e.g. Ground Floor, Sky Wing, First Floor"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsFloorModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-on-surface"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm">
                  {editingFloor ? 'Update Floor' : 'Add Floor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Smart Room Generator */}
      {isSmartGenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-[22px]">auto_awesome</span>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">Smart Room Generator</h3>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Auto-generate room series for any floor (e.g., 401..406).
            </p>
            <form onSubmit={handleSmartGenerate} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">Target Floor</label>
                <select name="floorNumber" className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl">
                  {draftHostel.floors.map((f) => (
                    <option key={f.id} value={f.floorNumber}>
                      Floor {f.floorNumber} ({f.name})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Rooms Count</label>
                  <input type="number" name="roomCount" defaultValue="6" min="1" max="15" className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl" />
                </div>
                <div>
                  <label className="font-bold text-on-surface block mb-1">Starting Number</label>
                  <input type="number" name="startNumber" defaultValue="1" min="1" max="50" className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="font-bold text-on-surface block mb-1">Default Room Type</label>
                <select name="roomType" className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl">
                  <option value="Single">Single Occupancy</option>
                  <option value="Double">Double Occupancy</option>
                  <option value="Triple">Triple Occupancy</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button type="button" onClick={() => setIsSmartGenModalOpen(false)} className="px-4 py-2 rounded-xl border border-surface-border text-on-surface">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm">
                  Generate Rooms
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Room */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="font-headline-md text-lg font-bold text-on-surface mb-4">
              {editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add Room'}
            </h3>
            <form onSubmit={handleSaveRoom} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Room Number</label>
                  <input
                    type="text"
                    name="roomNumber"
                    defaultValue={editingRoom?.roomNumber || '305'}
                    required
                    className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface block mb-1">Floor</label>
                  <select name="floorNumber" defaultValue={editingRoom?.floorNumber || 1} className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl">
                    {draftHostel.floors.map((f) => (
                      <option key={f.id} value={f.floorNumber}>
                        Floor {f.floorNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Status</label>
                  <select name="status" defaultValue={editingRoom?.status || 'available'} className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl">
                    <option value="available">Available (Teal)</option>
                    <option value="occupied">Occupied (Dark)</option>
                    <option value="maintenance">Maintenance (Amber)</option>
                    <option value="reserved">Reserved (Blue)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-on-surface block mb-1">Type</label>
                  <select name="roomType" defaultValue={editingRoom?.roomType || 'Single'} className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl">
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-on-surface block mb-1">Student Name (Optional)</label>
                <input
                  type="text"
                  name="studentName"
                  defaultValue={editingRoom?.occupants?.[0]?.name || ''}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl"
                  placeholder="e.g. Kartik Sharma"
                />
              </div>
              <div>
                <label className="font-bold text-on-surface block mb-1">Branch</label>
                <input
                  type="text"
                  name="branch"
                  defaultValue={editingRoom?.branch || 'CSE • 4th Sem'}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl"
                />
              </div>
              <div>
                <label className="font-bold text-on-surface block mb-1">Facilities</label>
                <input
                  type="text"
                  name="facilities"
                  defaultValue={editingRoom?.facilities?.join(', ') || 'Study Table, Chair, Bed, Wi-Fi'}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button type="button" onClick={() => setIsRoomModalOpen(false)} className="px-4 py-2 rounded-xl border border-surface-border text-on-surface">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm">
                  {editingRoom ? 'Save Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
