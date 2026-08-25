import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHostelStore } from '../../stores/hostelStore';
import { useApp } from '../../context/AppContext';

/**
 * Interactive Modals for Laptop Workspace, Bookshelf Subjects, Study Stats, Room Compare, and Share QR
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

  const { setSelectedResource, setIsModalOpen, upcomingTests = [] } = useApp() || {};
  const [selectedSubject, setSelectedSubject] = useState(activeBookSubject || 'COA');
  const [copySuccess, setCopySuccess] = useState(false);

  const currentHostel = getCurrentHostel();
  const currentRoom = getCurrentRoom();
  const allRooms = getAllRoomsForCurrentHostel();

  if (!activeInteractiveModal) return null;

  const handleOpenResource = (title, subject = 'CSE', type = 'PDF') => {
    if (setSelectedResource && setIsModalOpen) {
      setSelectedResource({
        id: `res-${Date.now()}`,
        title,
        subject,
        type,
        size: '2.4 MB',
        author: currentRoom?.occupants?.[0]?.name || 'Hostel Contributor',
        timeAgo: 'Shared by Room',
        uploadedAt: 'Semester 4'
      });
      setIsModalOpen(true);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/hostel/${currentHostel?.id || 'hostel-4'}/room/${currentRoom?.roomNumber || '303'}`;
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  // Compared rooms details
  const comparedRooms = allRooms.filter((r) => comparedRoomIds.includes(r.id));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs">
        {/* 1. LAPTOP: STUDENT WORKSPACE MODAL */}
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
                    Room {currentRoom?.roomNumber} • {currentRoom?.branch || 'CSE Data Science'}
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
                  <span className="text-[10px] text-on-surface-variant block font-semibold">Active Streak</span>
                  <span className="font-bold text-sm text-primary flex items-center justify-center gap-1">
                    🔥 5 Days
                  </span>
                </div>
                <div className="text-center border-x border-surface-border">
                  <span className="text-[10px] text-on-surface-variant block font-semibold">CT Readiness</span>
                  <span className="font-bold text-sm text-emerald-600">84%</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-on-surface-variant block font-semibold">Shared Notes</span>
                  <span className="font-bold text-sm text-on-surface">32 Files</span>
                </div>
              </div>

              {/* Recent Saved Notes & Resources */}
              <div>
                <h4 className="font-bold text-on-surface mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px]">menu_book</span>
                  <span>Recent Active Notes</span>
                </h4>
                <div className="space-y-2">
                  {[
                    { title: 'COA Instruction Pipelining & Hazards', sub: 'COA • Unit 2', size: '2.4 MB' },
                    { title: 'DSA Graph Algorithms (Dijkstra, Bellman-Ford)', sub: 'DSA • Unit 4', size: '3.1 MB' },
                    { title: 'DBMS SQL Normalization (3NF, BCNF)', sub: 'DBMS • Unit 3', size: '1.8 MB' }
                  ].map((item, i) => (
                    <div
                      key={i}
                      onClick={() => handleOpenResource(item.title, item.sub.split('•')[0].trim())}
                      className="p-3 rounded-xl border border-surface-border bg-surface hover:bg-surface-container-low hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <h5 className="font-bold text-on-surface group-hover:text-primary transition-colors">
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-on-surface-variant">{item.sub} • {item.size}</p>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">
                        open_in_new
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Class Tests */}
              <div>
                <h4 className="font-bold text-on-surface mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[16px]">event_upcoming</span>
                  <span>Upcoming CT Test Reminders</span>
                </h4>
                <div className="space-y-2">
                  {(upcomingTests.length > 0 ? upcomingTests.slice(0, 2) : [
                    { subject: 'COA', title: 'Computer Architecture CT 1', date: 'Monday, 10:00 AM' },
                    { subject: 'DSA', title: 'Linear Algebra & DSA Mid-term', date: 'Wednesday, 2:00 PM' }
                  ]).map((ct, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-surface-container-low border border-surface-border flex items-center justify-between">
                      <div>
                        <span className="font-bold text-primary text-[10px] uppercase tracking-wider">{ct.subject}</span>
                        <h5 className="font-bold text-on-surface">{ct.title}</h5>
                        <p className="text-[11px] text-on-surface-variant">{ct.date}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                        3 Days Left
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
                Done
              </button>
            </div>
          </motion.div>
        )}

        {/* 2. BOOKSHELF: SUBJECT STUDY RESOURCES MODAL */}
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
                    Click any subject textbook to inspect notes & solved papers
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
            <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-surface-border overflow-x-auto">
              {['COA', 'DSA', 'DBMS', 'Math', 'OS'].map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedSubject === sub
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
              {[
                { title: `${selectedSubject} Unit 1 Comprehensive Notes`, type: 'PDF', size: '3.4 MB' },
                { title: `${selectedSubject} Unit 2 High-Yield Formula Sheet`, type: 'PDF', size: '1.2 MB' },
                { title: `${selectedSubject} 2024 Midterm Solved Papers`, type: 'PYQ', size: '4.5 MB' },
                { title: `${selectedSubject} Previous 5-Year CT Questions`, type: 'PDF', size: '2.8 MB' }
              ].map((res, i) => (
                <div
                  key={i}
                  onClick={() => handleOpenResource(res.title, selectedSubject, res.type)}
                  className="p-3 rounded-xl border border-surface-border bg-surface hover:bg-surface-container-low hover:border-primary/50 transition-all cursor-pointer flex items-center justify-between group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {res.type}
                    </span>
                    <div>
                      <h4 className="font-bold text-on-surface group-hover:text-primary transition-colors">
                        {res.title}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant font-medium">
                        {selectedSubject} • {res.size}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">
                    download
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

        {/* 3. STUDY DESK STATS MODAL */}
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
                  Room {currentRoom?.roomNumber} Academic Focus
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
                <span className="font-semibold text-on-surface text-sm">{currentRoom?.activeStudyGroup || 'Class Test Revision'}</span>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold">
                  <span>CT Preparation Progress</span>
                  <span className="text-primary font-bold">85%</span>
                </div>
                <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
                </div>
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

        {/* 4. ROOM COMPARISON MODAL */}
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
                  Comparing floor, type, status, and study amenities
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

        {/* 5. SHARE ROOM & PRINTABLE QR CODE MODAL */}
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
      </div>
    </AnimatePresence>
  );
};
