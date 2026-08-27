import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHostelStore } from '../../stores/hostelStore';
import { useApp } from '../../context/AppContext';

/**
 * Interactive Modals for Laptop Workspace, Bookshelf Subjects, Study Stats, Room Compare, and Share QR
 * Directly integrated with HostelHub's AppContext for real academic notes, CT test data, and resource viewer!
 */
export const InteractiveRoomModals = () => {
  const {
    activeInteractiveModal,
    setActiveInteractiveModal,
    activeBookSubject,
    getCurrentHostel,
    getCurrentRoom,
    comparedRoomIds,
    clearComparedRooms,
    getAllRoomsForCurrentHostel
  } = useHostelStore();

  const {
    resources = [],
    savedResourceIds = new Set(),
    upcomingTests = [],
    setSelectedResource,
    setIsModalOpen
  } = useApp() || {};

  const [selectedSubject, setSelectedSubject] = useState(activeBookSubject || 'COA');
  const [copySuccess, setCopySuccess] = useState(false);

  const currentHostel = getCurrentHostel();
  const currentRoom = getCurrentRoom();
  const allRooms = getAllRoomsForCurrentHostel();

  if (!activeInteractiveModal) return null;

  const handleOpenResource = (title, subject = 'CSE', type = 'PDF') => {
    // Find matching existing resource in AppContext if available
    const existingRes = resources.find(
      (r) =>
        r.title?.toLowerCase().includes(title.toLowerCase()) ||
        (r.subject?.toLowerCase() === subject.toLowerCase() && r.type === type)
    );

    if (setSelectedResource && setIsModalOpen) {
      if (existingRes) {
        setSelectedResource(existingRes);
      } else {
        setSelectedResource({
          id: `res-${Date.now()}`,
          title,
          subject,
          type,
          size: '2.4 MB',
          author: currentRoom?.occupants?.[0]?.name || 'Hostel Contributor',
          timeAgo: 'Shared by Room Scholar',
          uploadedAt: 'Semester 4'
        });
      }
      setIsModalOpen(true);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/hostel/${currentHostel?.id || 'hostel-4'}/room/${currentRoom?.roomNumber || '303'}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // Filter subject-specific resources from AppContext
  const getSubjectResources = (sub) => {
    const matched = resources.filter(
      (r) =>
        r.subject?.toLowerCase() === sub.toLowerCase() ||
        r.title?.toLowerCase().includes(sub.toLowerCase())
    );

    if (matched.length > 0) return matched;

    // High quality academic fallback items matching prompt
    return [
      { id: `fb-1-${sub}`, title: `${sub} Unit 1 & 2 Comprehensive Notes`, type: 'PDF', size: '3.4 MB', author: 'Hostel Study Wing' },
      { id: `fb-2-${sub}`, title: `${sub} High-Yield Formula & Cheatsheet`, type: 'PDF', size: '1.6 MB', author: 'Academic Cell' },
      { id: `fb-3-${sub}`, title: `${sub} Previous 5-Year CT Solved Papers`, type: 'PYQ', size: '4.8 MB', author: 'Exam Archive' },
      { id: `fb-4-${sub}`, title: `${sub} Important Lab Viva Questions`, type: 'PDF', size: '2.1 MB', author: 'Senior Scholar' }
    ];
  };

  // Saved resources list from AppContext
  const savedResourcesList = resources.filter((r) => savedResourceIds && savedResourceIds.has(r.id));

  // Compared rooms details
  const comparedRooms = allRooms.filter((r) => comparedRoomIds.includes(r.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        {/* =================================================== */}
        {/* 1. LAPTOP: STUDENT WORKSPACE MODAL                  */}
        {/* =================================================== */}
        {activeInteractiveModal === 'laptop-workspace' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl overflow-hidden flex flex-col gap-5 max-h-[85vh]"
          >
            <div className="flex items-start justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold shadow-md">
                  <span className="material-symbols-outlined text-[22px]">laptop_mac</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-on-surface">
                    Student Workspace
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Room {currentRoom?.roomNumber} • {currentRoom?.branch || 'CSE Scholar Pod'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1 text-xs">
              {/* Study Stats Bar */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-surface-container-low border border-surface-border">
                <div className="text-center">
                  <span className="text-[10px] text-on-surface-variant block font-semibold">Study Streak</span>
                  <span className="font-bold text-sm text-primary flex items-center justify-center gap-1">
                    🔥 7 Days
                  </span>
                </div>
                <div className="text-center border-x border-surface-border">
                  <span className="text-[10px] text-on-surface-variant block font-semibold">CT Readiness</span>
                  <span className="font-bold text-sm text-emerald-600">88%</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-on-surface-variant block font-semibold">Saved Files</span>
                  <span className="font-bold text-sm text-on-surface">
                    {savedResourcesList.length || 6} Resources
                  </span>
                </div>
              </div>

              {/* Recent Active Academic Notes */}
              <div>
                <h4 className="font-bold text-on-surface mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px]">menu_book</span>
                  <span>Recent Active Notes</span>
                </h4>
                <div className="space-y-2">
                  {(resources.length > 0 ? resources.slice(0, 3) : [
                    { title: 'COA Instruction Pipelining & Hazards', subject: 'COA', size: '2.4 MB' },
                    { title: 'DSA Graph Algorithms (Dijkstra, Bellman-Ford)', subject: 'DSA', size: '3.1 MB' },
                    { title: 'DBMS SQL Normalization (3NF, BCNF)', subject: 'DBMS', size: '1.8 MB' }
                  ]).map((item, i) => (
                    <div
                      key={i}
                      onClick={() => handleOpenResource(item.title, item.subject)}
                      className="p-3 rounded-xl border border-surface-border bg-surface hover:bg-surface-container-low hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {item.type || 'PDF'}
                        </span>
                        <div>
                          <h5 className="font-bold text-on-surface group-hover:text-primary transition-colors">
                            {item.title}
                          </h5>
                          <p className="text-[11px] text-on-surface-variant">
                            {item.subject} • {item.size || '2.4 MB'}
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">
                        open_in_new
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Class Tests & CT Preparation */}
              <div>
                <h4 className="font-bold text-on-surface mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px]">event_upcoming</span>
                  <span>Upcoming CT Schedule & Prep</span>
                </h4>
                <div className="space-y-2">
                  {(upcomingTests.length > 0 ? upcomingTests.slice(0, 2) : [
                    { subject: 'COA', title: 'Computer Architecture Mid-Term', date: 'Monday, 10:00 AM' },
                    { subject: 'DSA', title: 'Trees & Graph Traversal CT 1', date: 'Wednesday, 2:00 PM' }
                  ]).map((ct, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-surface-container-low border border-surface-border flex items-center justify-between">
                      <div>
                        <span className="font-bold text-primary text-[10px] uppercase tracking-wider">{ct.subject}</span>
                        <h5 className="font-bold text-on-surface">{ct.title}</h5>
                        <p className="text-[11px] text-on-surface-variant">{ct.date || ct.time || 'Upcoming this week'}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                        Prep Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end border-t border-surface-border pt-3">
              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {/* =================================================== */}
        {/* 2. BOOKSHELF: SUBJECT STUDY RESOURCES MODAL         */}
        {/* =================================================== */}
        {activeInteractiveModal === 'bookshelf-resources' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl overflow-hidden flex flex-col gap-4 max-h-[85vh]"
          >
            <div className="flex items-start justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary text-on-secondary flex items-center justify-center font-bold shadow-md">
                  <span className="material-symbols-outlined text-[22px]">library_books</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-on-surface">
                    Bookshelf Study Resources
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Click any academic subject book to inspect notes, PYQs, and lecture files
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Subject Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-surface-border overflow-x-auto scrollbar-none">
              {['COA', 'DSA', 'DBMS', 'Math', 'OS', 'Networks', 'Python', 'AI/ML'].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedSubject.toLowerCase() === sub.toLowerCase()
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Subject Material List */}
            <div className="space-y-2 overflow-y-auto max-h-64 text-xs pr-1">
              {getSubjectResources(selectedSubject).map((res, i) => (
                <div
                  key={i}
                  onClick={() => handleOpenResource(res.title, selectedSubject, res.type || 'PDF')}
                  className="p-3 rounded-xl border border-surface-border bg-surface hover:bg-surface-container-low hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {res.type || 'PDF'}
                    </span>
                    <div>
                      <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">
                        {res.title}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant font-medium">
                        {selectedSubject} • {res.size || '2.8 MB'} {res.author && `• By ${res.author}`}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">
                    open_in_new
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end border-t border-surface-border pt-3">
              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {/* =================================================== */}
        {/* 3. STUDY DESK STATS & DASHBOARD MODAL               */}
        {/* =================================================== */}
        {activeInteractiveModal === 'study-area-stats' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 text-xs"
          >
            <div className="flex items-start justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  Study Desk Dashboard
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Room {currentRoom?.roomNumber} Academic Focus & Study Pod
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                <span className="text-primary font-bold block mb-0.5">Active Focus Group</span>
                <span className="font-semibold text-on-surface text-sm">
                  {currentRoom?.activeStudyGroup || 'DSA & Algorithm Design Group'}
                </span>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold">
                  <span>Semester Exam Readiness</span>
                  <span className="text-primary font-bold">85%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-border">
                <span className="font-bold text-on-surface block mb-1">Recommended Next Steps:</span>
                <ul className="list-disc list-inside space-y-1 text-on-surface-variant text-[11px]">
                  <li>Review COA Instruction Hazards cheatsheet</li>
                  <li>Solve 2024 DSA Graph Traversal CT questions</li>
                  <li>Join evening discussion in Room 301 Annex</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold shadow-xs"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {/* =================================================== */}
        {/* 4. ROOM COMPARISON MODAL                            */}
        {/* =================================================== */}
        {activeInteractiveModal === 'compare' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col gap-4 max-h-[90vh]"
          >
            <div className="flex items-start justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">
                  Room Comparison ({comparedRooms.length}/3)
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Comparing floor, room type, status, and study amenities
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {comparedRooms.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-4xl mb-2 text-primary">compare_arrows</span>
                <p>No rooms selected for comparison yet.</p>
                <p className="mt-1">Click the comparison icon on any room card to add up to 3 rooms.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 overflow-y-auto text-xs">
                {comparedRooms.map((room) => (
                  <div key={room.id} className="p-4 rounded-2xl border border-surface-border bg-surface flex flex-col gap-2.5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-surface-border pb-2">
                      <h4 className="font-bold text-base text-primary">Room {room.roomNumber}</h4>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] font-bold uppercase">
                        {room.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-on-surface">
                      <p><strong>Floor:</strong> Floor {room.floorNumber}</p>
                      <p><strong>Type:</strong> {room.roomType || 'Single'}</p>
                      <p><strong>Capacity:</strong> {room.capacity || 1} Person</p>
                      <p><strong>Focus:</strong> {room.branch || 'Study Pod'}</p>
                    </div>

                    <div className="pt-2 border-t border-surface-border">
                      <span className="text-[11px] font-bold text-on-surface-variant block mb-1">Facilities:</span>
                      <div className="flex flex-wrap gap-1">
                        {(room.facilities || ['Desk', 'Bed', 'Wi-Fi']).map((f, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-surface-container-low text-[10px] font-medium text-on-surface">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-surface-border">
              <button
                type="button"
                onClick={clearComparedRooms}
                className="text-xs text-on-surface-variant hover:text-red-600 font-semibold"
              >
                Clear Comparison
              </button>
              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {/* =================================================== */}
        {/* 5. SHARE ROOM & PRINTABLE QR CODE MODAL             */}
        {/* =================================================== */}
        {activeInteractiveModal === 'share-qr' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-4 text-xs"
          >
            <div className="flex items-start justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  Share Room {currentRoom?.roomNumber}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Direct 3D link & printable hostel door QR
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="w-7 h-7 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Generated SVG QR Code Badge */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-900 border border-surface-border shadow-inner">
              <div className="w-36 h-36 border-4 border-slate-900 rounded-xl p-2 flex flex-col items-center justify-between bg-white">
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 bg-slate-900 rounded-sm"></div>
                  <span className="text-[10px] font-extrabold font-mono tracking-widest text-teal-700">HOSTELHUB</span>
                  <div className="w-7 h-7 bg-slate-900 rounded-sm"></div>
                </div>
                <div className="my-auto font-black text-2xl tracking-wider text-slate-900 font-mono">
                  {currentRoom?.roomNumber || '303'}
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="w-7 h-7 bg-slate-900 rounded-sm"></div>
                  <span className="text-[8px] font-bold text-slate-500 uppercase">{currentHostel?.name}</span>
                  <div className="w-7 h-7 bg-slate-900 rounded-sm"></div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-700 mt-2">Scan to enter 3D Study Hub</span>
            </div>

            {/* Shareable Link Input */}
            <div>
              <label className="font-bold text-on-surface block mb-1">Direct Web Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/hostel/${currentHostel?.id || 'hostel-4'}/room/${currentRoom?.roomNumber || '303'}`}
                  className="flex-1 px-3 py-2 bg-surface border border-surface-border rounded-xl font-mono text-[11px] text-on-surface truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 bg-primary text-on-primary rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copySuccess ? 'check' : 'content_copy'}
                  </span>
                  <span>{copySuccess ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-bold hover:bg-surface-container-high"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {/* =================================================== */}
        {/* 6. HOSTEL COURTYARD ACADEMIC NOTICE BOARD MODAL     */}
        {/* =================================================== */}
        {activeInteractiveModal === 'courtyard-announcements' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl overflow-hidden flex flex-col gap-4 text-xs max-h-[85vh]"
          >
            <div className="flex items-start justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold shadow-md">
                  <span className="material-symbols-outlined text-[22px]">campaign</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-base font-bold text-on-surface">
                    Hostel Academic Notice Board
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {currentHostel?.name} • Central Courtyard Hub
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1">
              <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary text-[11px] uppercase tracking-wide">Urgent Class Test Alert</span>
                  <span className="text-[10px] text-on-surface-variant font-medium">Exam Cell</span>
                </div>
                <h4 className="font-bold text-sm text-on-surface">COA & DSA Mid-Term Tests Scheduled</h4>
                <p className="text-[11px] text-on-surface-variant">
                  CT-1 examinations will commence next Monday. High-yield unit notes and solved PYQs are available on all room bookshelves.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-surface-border flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-600 dark:text-teal-400 text-[11px] uppercase tracking-wide">Study Group Notice</span>
                  <span className="text-[10px] text-on-surface-variant">Room 303 Annex</span>
                </div>
                <h4 className="font-bold text-sm text-on-surface">Evening Peer Review: Graph Algorithms</h4>
                <p className="text-[11px] text-on-surface-variant">
                  Daily 7:00 PM session in the central courtyard study pod. Bring your notebooks and laptops.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-surface-border flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px] uppercase tracking-wide">Campus Maintenance</span>
                  <span className="text-[10px] text-on-surface-variant">Hostel Warden</span>
                </div>
                <h4 className="font-bold text-sm text-on-surface">High-Speed Wi-Fi Mesh Upgrade</h4>
                <p className="text-[11px] text-on-surface-variant">
                  Corridor and courtyard access points have been upgraded to Gigabit speeds.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs"
              >
                Close Notice Board
              </button>
            </div>
          </motion.div>
        )}

        {/* =================================================== */}
        {/* 7. OUTDOOR COURTYARD STUDY SPACE HUB MODAL          */}
        {/* =================================================== */}
        {activeInteractiveModal === 'courtyard-study-space' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl overflow-hidden flex flex-col gap-4 text-xs max-h-[85vh]"
          >
            <div className="flex items-start justify-between border-b border-surface-border pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                  <span className="material-symbols-outlined text-[22px]">nature_people</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-base font-bold text-on-surface">
                    Central Courtyard Study Pod
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    {currentHostel?.name} • Open Air Collaborative Workstation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-border text-center">
                  <span className="text-[10px] text-on-surface-variant font-semibold block">Active Peers Studying</span>
                  <span className="text-base font-bold text-primary">8 Scholars</span>
                </div>
                <div className="p-3 rounded-2xl bg-surface-container-low border border-surface-border text-center">
                  <span className="text-[10px] text-on-surface-variant font-semibold block">Noise Level</span>
                  <span className="text-base font-bold text-emerald-600">Quiet Zone (32 dB)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-surface-border space-y-2">
                <h4 className="font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px]">menu_book</span>
                  <span>Quick-Access Courtyard Subject Notes</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {['COA', 'DSA', 'DBMS', 'Mathematics'].map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => {
                        setActiveInteractiveModal('bookshelf-resources');
                      }}
                      className="p-2.5 rounded-xl border border-surface-border bg-surface-container-low hover:border-primary/50 text-left transition-all flex items-center justify-between"
                    >
                      <span className="font-bold text-on-surface">{sub} Notes & PYQs</span>
                      <span className="material-symbols-outlined text-primary text-[16px]">arrow_forward</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setActiveInteractiveModal(null)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

