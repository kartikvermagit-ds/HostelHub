import React, { useState } from 'react';
import { useHostelStore } from '../../stores/hostelStore';

/**
 * Comprehensive 3D Hostel, Floor & Room Management Panel for Admins
 */
export const HostelAdminManager = ({ onToast = () => {} }) => {
  const {
    hostels,
    addHostel,
    updateHostel,
    deleteHostel,
    addFloor,
    deleteFloor,
    addRoom,
    updateRoom,
    deleteRoom,
    resetToDefaultHostels
  } = useHostelStore();

  const [activeHostelId, setActiveHostelId] = useState(hostels[0]?.id || 'hostel-4');
  const [selectedFloorFilter, setSelectedFloorFilter] = useState('ALL');
  const [roomSearch, setRoomSearch] = useState('');

  // Modals state
  const [isHostelModalOpen, setIsHostelModalOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);

  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const activeHostel = hostels.find((h) => h.id === activeHostelId) || hostels[0];

  // Flat list of rooms for the active hostel
  const allRoomsInActiveHostel = (activeHostel?.floors || []).flatMap((f) =>
    (f.rooms || []).map((r) => ({ ...r, floorName: f.name || `Floor ${f.floorNumber}` }))
  );

  const filteredRooms = allRoomsInActiveHostel.filter((r) => {
    const matchesFloor =
      selectedFloorFilter === 'ALL' || String(r.floorNumber) === String(selectedFloorFilter);
    const matchesSearch =
      roomSearch === '' ||
      r.roomNumber?.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.status?.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.occupants?.some((occ) => occ.name?.toLowerCase().includes(roomSearch.toLowerCase()));
    return matchesFloor && matchesSearch;
  });

  // Handle Hostel Save (Create / Edit)
  const handleSaveHostel = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const displayName = formData.get('displayName');
    const description = formData.get('description');
    const hostelType = formData.get('hostelType');
    const floorCount = parseInt(formData.get('floorCount') || '3', 10);
    const roomsPerFloor = parseInt(formData.get('roomsPerFloor') || '3', 10);

    if (editingHostel) {
      updateHostel(editingHostel.id, {
        name,
        displayName,
        description,
        hostelType
      });
      onToast(`Updated "${name}" details successfully! 3D building sign updated.`);
    } else {
      const newHostelId = `hostel-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`;
      // Generate default floors and rooms
      const newFloors = Array.from({ length: floorCount }, (_, fIdx) => {
        const floorNum = fIdx + 1;
        const floorId = `${newHostelId}-f${floorNum}`;
        const rooms = Array.from({ length: roomsPerFloor }, (_, rIdx) => {
          const roomNum = `${floorNum}0${rIdx + 1}`;
          return {
            id: `${newHostelId}-${roomNum}`,
            hostelId: newHostelId,
            floorId,
            floorNumber: floorNum,
            roomNumber: roomNum,
            status: rIdx === 0 ? 'available' : rIdx === 1 ? 'occupied' : 'available',
            roomType: 'Single',
            capacity: 1,
            occupants: rIdx === 1 ? [{ name: 'Assigned Scholar', roll: '23BTECH', branch: 'Engineering' }] : [],
            branch: 'General Study Wing',
            facilities: ['Study Table', 'Chair', 'Bed', 'Bookshelf', 'Wi-Fi'],
            description: `Room ${roomNum} on Floor ${floorNum}`,
            sharedNotesCount: 15,
            activeStudyGroup: 'Hostel Study Group',
            resources: []
          };
        });

        return {
          id: floorId,
          hostelId: newHostelId,
          floorNumber: floorNum,
          name: floorNum === 1 ? 'Ground Floor' : `Floor ${floorNum}`,
          rooms
        };
      });

      const newHostel = {
        id: newHostelId,
        name,
        displayName: displayName || name,
        description: description || 'Academic Hostel Block',
        hostelType: hostelType || 'boys',
        accentColor: '#00685f',
        floors: newFloors
      };

      addHostel(newHostel);
      setActiveHostelId(newHostelId);
      onToast(`Created new 3D Hostel "${name}" with ${floorCount} floors!`);
    }

    setIsHostelModalOpen(false);
    setEditingHostel(null);
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

    const targetFloor = activeHostel.floors.find((f) => f.floorNumber === floorNumber) || activeHostel.floors[0];

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
      onToast(`Room ${roomNumber} updated! 3D model status refreshed.`);
    } else {
      const newRoom = {
        id: `${activeHostel.id}-${roomNumber}-${Date.now().toString().slice(-3)}`,
        hostelId: activeHostel.id,
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

      addRoom(activeHostel.id, targetFloor.id, newRoom);
      onToast(`Created Room ${roomNumber} in ${activeHostel.name}!`);
    }

    setIsRoomModalOpen(false);
    setEditingRoom(null);
  };

  // Handle Add Floor to current hostel
  const handleAddFloorToActiveHostel = () => {
    const nextFloorNum = (activeHostel.floors?.length || 0) + 1;
    const floorId = `${activeHostel.id}-f${nextFloorNum}`;
    const newFloor = {
      id: floorId,
      hostelId: activeHostel.id,
      floorNumber: nextFloorNum,
      name: `Floor ${nextFloorNum}`,
      rooms: [
        {
          id: `${activeHostel.id}-${nextFloorNum}01`,
          hostelId: activeHostel.id,
          floorId,
          floorNumber: nextFloorNum,
          roomNumber: `${nextFloorNum}01`,
          status: 'available',
          roomType: 'Single',
          capacity: 1,
          occupants: [],
          branch: 'New Wing Lounge',
          facilities: ['Study Table', 'Chair', 'Bed', 'Wi-Fi'],
          description: `Newly added Floor ${nextFloorNum} Room ${nextFloorNum}01`,
          sharedNotesCount: 8,
          activeStudyGroup: 'Open Study Space',
          resources: []
        }
      ]
    };

    addFloor(activeHostel.id, newFloor);
    onToast(`Added Floor ${nextFloorNum} to ${activeHostel.name}! 3D Building expanded.`);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 1. Hostels Management Bar */}
      <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-headline-md text-base font-bold text-on-surface">
              Configured 3D Hostels ({hostels.length})
            </h2>
            <p className="text-xs text-on-surface-variant">
              Select a hostel to manage its floors and rooms. Changes update the 3D model in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingHostel(null);
                setIsHostelModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">add_business</span>
              <span>Add New Hostel</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all 3D hostel configurations to defaults?')) {
                  resetToDefaultHostels();
                  onToast('All 3D hostels restored to default configuration.');
                }
              }}
              className="px-3 py-2 rounded-xl border border-surface-border bg-surface hover:bg-surface-container-low text-xs font-semibold text-on-surface-variant transition-colors"
              title="Reset to Factory Defaults"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>

        {/* Hostels Tabs Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
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
                    {h.hostelType || 'Boys'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-surface-border/60">
                  <span>{h.floors?.length || 1} Floors • {totalRooms} Rooms</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingHostel(h);
                        setIsHostelModalOpen(true);
                      }}
                      className="p-1 hover:text-primary transition-colors"
                      title="Edit Hostel Details"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    {hostels.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete "${h.name}" and all its rooms?`)) {
                            deleteHostel(h.id);
                            onToast(`Deleted ${h.name}`);
                          }
                        }}
                        className="p-1 hover:text-red-600 transition-colors"
                        title="Delete Hostel"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Active Hostel Floor & Room Manager */}
      {activeHostel && (
        <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          {/* Header & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  {activeHostel.name} — Floor & Room Manager
                </h3>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {activeHostel.floors?.length || 1} Floors configured • {allRoomsInActiveHostel.length} total rooms
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddFloorToActiveHostel}
                className="px-3 py-1.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-container-low text-xs font-semibold text-on-surface flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Floor</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingRoom(null);
                  setIsRoomModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-xs hover:opacity-90"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Room</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Floor Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedFloorFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedFloorFilter === 'ALL'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                All Floors ({allRoomsInActiveHostel.length})
              </button>

              {(activeHostel.floors || []).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFloorFilter(String(f.floorNumber))}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedFloorFilter === String(f.floorNumber)
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  Floor {f.floorNumber} ({f.rooms?.length || 0})
                </button>
              ))}
            </div>

            {/* Room Search */}
            <div className="relative max-w-xs w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">
                search
              </span>
              <input
                type="text"
                placeholder="Filter room or student..."
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-surface border border-surface-border rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
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
                  <th className="py-2.5 px-3">Occupants / Student</th>
                  <th className="py-2.5 px-3">Facilities</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      {room.roomNumber}
                    </td>
                    <td className="py-3 px-3 text-on-surface">
                      Floor {room.floorNumber}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          room.status === 'available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : room.status === 'maintenance'
                            ? 'bg-amber-100 text-amber-800'
                            : room.status === 'reserved'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            room.status === 'available'
                              ? 'bg-emerald-500'
                              : room.status === 'maintenance'
                              ? 'bg-amber-500'
                              : room.status === 'reserved'
                              ? 'bg-blue-500'
                              : 'bg-slate-500'
                          }`}
                        ></span>
                        <span>{room.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant font-medium">
                      {room.roomType || 'Single'}
                    </td>
                    <td className="py-3 px-3">
                      {room.occupants && room.occupants.length > 0 ? (
                        <div className="font-semibold text-on-surface">
                          {room.occupants.map((occ) => occ.name).join(', ')}
                        </div>
                      ) : (
                        <span className="text-on-surface-variant italic">Unassigned (Vacant)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant">
                      {(room.facilities || []).slice(0, 3).join(', ')}
                      {room.facilities?.length > 3 && ` +${room.facilities.length - 3}`}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
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

      {/* 3. Add / Edit Hostel Modal */}
      {isHostelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="font-headline-md text-lg font-bold text-on-surface mb-4">
              {editingHostel ? `Edit ${editingHostel.name}` : 'Create New 3D Hostel'}
            </h3>

            <form onSubmit={handleSaveHostel} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">Hostel Name (Appears on 3D Sign)</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingHostel?.name || 'Hostel C'}
                  required
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                  placeholder="e.g. Hostel 4, Hostel C, Aryabhata Hostel"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Display Title / Tagline</label>
                <input
                  type="text"
                  name="displayName"
                  defaultValue={editingHostel?.displayName || ''}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                  placeholder="e.g. Boys Hostel 4 (Aryabhata Block)"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Hostel Type</label>
                <select
                  name="hostelType"
                  defaultValue={editingHostel?.hostelType || 'boys'}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                >
                  <option value="boys">Boys Hostel</option>
                  <option value="girls">Girls Hostel</option>
                  <option value="co-ed">Co-Ed Scholars Block</option>
                </select>
              </div>

              {!editingHostel && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Floors to Generate</label>
                    <input
                      type="number"
                      name="floorCount"
                      defaultValue="3"
                      min="1"
                      max="6"
                      className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-on-surface block mb-1">Rooms per Floor</label>
                    <input
                      type="number"
                      name="roomsPerFloor"
                      defaultValue="3"
                      min="1"
                      max="8"
                      className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-on-surface block mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingHostel?.description || ''}
                  rows={2}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                  placeholder="Brief description of resident student branches..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsHostelModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-on-surface hover:bg-surface-container font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm"
                >
                  {editingHostel ? 'Save Changes' : 'Generate 3D Hostel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Add / Edit Room Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
            <h3 className="font-headline-md text-lg font-bold text-on-surface mb-4">
              {editingRoom ? `Edit Room ${editingRoom.roomNumber}` : `Add Room to ${activeHostel.name}`}
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
                    className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface block mb-1">Floor</label>
                  <select
                    name="floorNumber"
                    defaultValue={editingRoom?.floorNumber || 1}
                    className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                  >
                    {(activeHostel.floors || []).map((f) => (
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
                  <select
                    name="status"
                    defaultValue={editingRoom?.status || 'available'}
                    className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="available">Available (Teal)</option>
                    <option value="occupied">Occupied (Dark)</option>
                    <option value="maintenance">Maintenance (Amber)</option>
                    <option value="reserved">Reserved (Blue)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-on-surface block mb-1">Room Type</label>
                  <select
                    name="roomType"
                    defaultValue={editingRoom?.roomType || 'Single'}
                    className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="Single">Single Occupancy</option>
                    <option value="Double">Double Occupancy</option>
                    <option value="Triple">Triple Occupancy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Assigned Student Name (Optional)</label>
                <input
                  type="text"
                  name="studentName"
                  defaultValue={editingRoom?.occupants?.[0]?.name || ''}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                  placeholder="e.g. Kartik Verma"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Branch / Specialization</label>
                <input
                  type="text"
                  name="branch"
                  defaultValue={editingRoom?.branch || 'CSE Data Science'}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                  placeholder="e.g. CSE Data Science • 4th Sem"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Facilities (Comma Separated)</label>
                <input
                  type="text"
                  name="facilities"
                  defaultValue={editingRoom?.facilities?.join(', ') || 'Study Table, Chair, Bed, Bookshelf, Wi-Fi, Fan'}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingRoom?.description || ''}
                  rows={2}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-xs focus:outline-none focus:border-primary"
                  placeholder="Room notes, orientation, or study group information..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsRoomModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-on-surface hover:bg-surface-container font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-sm"
                >
                  {editingRoom ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
