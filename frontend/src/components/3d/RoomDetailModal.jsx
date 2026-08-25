import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

/**
 * Full Room Details & Academic Resources Modal
 */
export const RoomDetailModal = ({
  isOpen = false,
  room = null,
  onClose = () => {}
}) => {
  const { setSelectedResource, setIsModalOpen } = useApp() || {};

  if (!isOpen || !room) return null;

  const handleOpenResource = (res) => {
    if (setSelectedResource && setIsModalOpen) {
      setSelectedResource({
        id: res.id || 'res-demo',
        title: res.title,
        subject: room.branch ? room.branch.split('•')[0].trim() : 'CS',
        type: res.type || 'PDF',
        size: res.size || '2.4 MB',
        author: room.occupants?.[0]?.name || 'Hostel Contributor',
        timeAgo: 'Shared by Room',
        uploadedAt: 'Semester 4'
      });
      setIsModalOpen(true);
    }
  };

  const getStatusBadge = () => {
    switch (room.status?.toLowerCase()) {
      case 'available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'reserved':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'occupied':
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-surface-container-lowest border border-surface-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-surface-border pb-4 mb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-headline-md text-2xl font-bold text-on-surface">
                  Room {room.roomNumber}
                </h2>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadge()}`}>
                  {room.status}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                  {room.roomType || 'Single Occupancy'}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant mt-1">
                {room.hostelId?.toUpperCase() || 'HOSTEL 4'} • Floor {room.floorNumber} • {room.branch || 'General Study Space'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Modal Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-6 pr-1">
            {/* Description */}
            {room.description && (
              <div className="p-4 rounded-xl bg-surface-container-low/60 border border-surface-border text-sm text-on-surface leading-relaxed">
                {room.description}
              </div>
            )}

            {/* Occupants / Student Information */}
            <div>
              <h3 className="font-headline-sm text-sm font-bold text-on-surface uppercase tracking-wider mb-3">
                Occupant Information
              </h3>
              {room.occupants && room.occupants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {room.occupants.map((occ, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-surface-border bg-surface flex items-center gap-3 shadow-xs"
                    >
                      <img
                        src={occ.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                        alt={occ.name}
                        className="w-11 h-11 rounded-xl object-cover border border-primary/20"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-on-surface">{occ.name}</h4>
                        <p className="text-xs text-on-surface-variant font-medium">{occ.branch || room.branch}</p>
                        {occ.roll && <p className="text-[11px] text-primary font-mono">{occ.roll}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Room is currently vacant & available for study session allocation.</span>
                </div>
              )}
            </div>

            {/* Facilities Grid */}
            <div>
              <h3 className="font-headline-sm text-sm font-bold text-on-surface uppercase tracking-wider mb-3">
                Room Facilities & Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {(room.facilities || ["Study Table", "Chair", "Bed", "Bookshelf", "Wi-Fi", "Fan"]).map((fac, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-surface-border text-xs font-semibold text-on-surface shadow-xs"
                  >
                    <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                    <span>{fac}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Linked Academic Resources */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-headline-sm text-sm font-bold text-on-surface uppercase tracking-wider">
                  Shared Academic Resources ({room.resources?.length || 0})
                </h3>
                <span className="text-xs text-primary font-semibold">
                  {room.sharedNotesCount || 12} community downloads
                </span>
              </div>

              {room.resources && room.resources.length > 0 ? (
                <div className="space-y-2">
                  {room.resources.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => handleOpenResource(res)}
                      className="p-3 rounded-xl border border-surface-border bg-surface hover:border-primary/50 hover:bg-surface-container-low transition-all cursor-pointer flex items-center justify-between group shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          <span className="material-symbols-outlined text-[18px]">description</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-on-surface group-hover:text-primary transition-colors">
                            {res.title}
                          </h4>
                          <span className="text-[11px] text-on-surface-variant font-medium">
                            {res.type} • {res.size}
                          </span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">
                        open_in_new
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant italic">
                  No direct resource files attached to this room yet.
                </p>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-surface-border pt-4 mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-surface-border text-on-surface font-semibold text-xs hover:bg-surface-container-low transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
