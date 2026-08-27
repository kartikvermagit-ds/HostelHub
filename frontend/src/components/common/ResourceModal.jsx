import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { downloadResourceFile, openResourcePreview } from '../../utils/fileHelper';
import { GlassModal, GlassButton, GlassBadge, GlassCard, GlassInput } from '../ui';

export const ResourceModal = ({ resource, isOpen, onClose }) => {
  const { savedResourceIds, toggleSaveResource, user } = useApp();
  const [downloadState, setDownloadState] = useState('idle'); // 'idle' | 'downloading' | 'downloaded'
  const [zoomLevel, setZoomLevel] = useState(100);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'Priya S.', time: '1 hour ago', text: 'This was super helpful for Unit 2 prep! Thanks for sharing.' },
    { id: 2, author: 'Aman V.', time: '30 mins ago', text: 'Are the numerical solutions verified?' }
  ]);

  if (!isOpen || !resource) return null;

  const isSaved = savedResourceIds.has(resource.id);
  const isVideo = resource.type === 'VID' || resource.type?.toLowerCase().includes('video');
  const uploadTimestamp = resource.uploadedAt || resource.timeAgo || 'Today, Just now';

  const handleDownload = () => {
    setDownloadState('downloading');
    setTimeout(() => {
      downloadResourceFile(resource);
      setDownloadState('downloaded');
      setTimeout(() => setDownloadState('idle'), 3000);
    }, 600);
  };

  const handlePreview = () => {
    openResourcePreview(resource);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now(),
        author: user?.full_name || user?.name || 'Kartik Sharma',
        time: 'Just now',
        text: newComment.trim()
      }
    ]);
    setNewComment('');
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      className="p-0 overflow-hidden"
    >
      {/* Modal Header */}
      <div className="flex items-start justify-between p-5 md:p-6 border-b border-surface-border/50">
        <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              resource.bgColor || (isVideo ? 'bg-secondary-container/80 text-on-secondary-container' : 'bg-primary/15 text-primary')
            }`}
          >
            <span className="material-symbols-outlined text-[26px]">
              {resource.icon || (isVideo ? 'play_circle' : 'description')}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <GlassBadge variant="accent" size="sm">
                {resource.subject || 'CS'}
              </GlassBadge>
              <GlassBadge variant="primary" size="sm">
                {resource.type || 'PDF'}
              </GlassBadge>
              <GlassBadge variant="neutral" size="sm">
                📅 {uploadTimestamp}
              </GlassBadge>
            </div>
            <h2 className="font-headline-sm text-base sm:text-lg text-on-surface font-bold truncate">
              {resource.title}
            </h2>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-on-surface-variant hover:bg-surface-container/60 hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Modal Scrollable Content */}
      <div className="p-5 md:p-6 overflow-y-auto max-h-[68vh] space-y-5">
        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 glass-panel rounded-2xl border border-white/60 dark:border-primary-fixed/15 text-center text-xs">
          <div>
            <span className="block text-[10px] text-on-surface-variant/80 font-medium">Uploaded By</span>
            <span className="font-bold text-on-surface truncate block mt-0.5">
              {resource.author || 'Kartik'}
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-on-surface-variant/80 font-medium">Upload Time</span>
            <span className="font-bold text-on-surface block mt-0.5">
              {uploadTimestamp}
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-on-surface-variant/80 font-medium">File Size</span>
            <span className="font-bold text-on-surface block mt-0.5">
              {resource.size || '2.4 MB'}
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-on-surface-variant/80 font-medium">Downloads</span>
            <span className="font-bold text-primary block mt-0.5">
              {resource.downloads || 124}
            </span>
          </div>
        </div>

        {/* PDF / Document Viewer Shell with Floating Glass Zoom Toolbar */}
        <div className="rounded-2xl glass-panel p-4 border border-white/60 dark:border-primary-fixed/15 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[17px] text-primary">visibility</span>
              <span>Document Viewer</span>
            </span>

            {/* Floating Glass Toolbar for Zoom & Fit */}
            <div className="flex items-center gap-1 p-1 glass-floating rounded-xl border border-white/60 dark:border-primary-fixed/20 shadow-xs text-xs">
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(prev - 15, 70))}
                className="px-2 py-0.5 rounded-lg hover:bg-surface-container/60 text-on-surface-variant hover:text-on-surface font-mono font-bold"
                title="Zoom Out"
              >
                −
              </button>
              <span className="px-2 py-0.5 text-[11px] font-mono font-bold text-primary">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(prev + 15, 150))}
                className="px-2 py-0.5 rounded-lg hover:bg-surface-container/60 text-on-surface-variant hover:text-on-surface font-mono font-bold"
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="px-2 py-0.5 rounded-lg hover:bg-surface-container/60 text-[10px] font-bold text-on-surface-variant"
              >
                Fit
              </button>
              <button
                type="button"
                onClick={handlePreview}
                className="px-2 py-0.5 rounded-lg hover:bg-surface-container/60 text-[10px] font-bold text-primary flex items-center gap-0.5"
                title="Open in new window"
              >
                <span className="material-symbols-outlined text-[14px]">fullscreen</span>
              </button>
            </div>
          </div>

          {/* Actual Unblurred Document Preview Canvas */}
          <div className="p-4 bg-surface rounded-xl border border-surface-border text-center overflow-auto max-h-56">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center top' }}
              className="transition-transform duration-200"
            >
              <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-surface-border max-w-lg mx-auto text-left space-y-3">
                <div className="flex items-center justify-between border-b border-surface-border pb-2">
                  <span className="text-xs font-mono font-bold text-primary">{resource.subject} • {resource.title}</span>
                  <span className="text-[10px] text-on-surface-variant">Page 1 of 8</span>
                </div>
                <p className="text-xs text-on-surface leading-relaxed font-sans">
                  {resource.description || 'Comprehensive handwritten & typed exam preparation guide covering unit-wise solved questions, formula derivations, and step-by-step algorithms.'}
                </p>
                <div className="p-2.5 bg-surface-container/50 rounded-lg text-[11px] font-mono text-on-surface-variant">
                  ✓ Verified by Hostel Academic Council
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discussion & Comments */}
        <div className="pt-2 border-t border-surface-border/50 space-y-3">
          <h3 className="font-headline-sm text-xs font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">forum</span>
            <span>Hostel Academic Discussion ({comments.length})</span>
          </h3>

          <div className="space-y-2 max-h-32 overflow-y-auto pr-1 scrollbar-none">
            {comments.map((comm) => (
              <div key={comm.id} className="p-2.5 glass-panel rounded-xl text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-on-surface">{comm.author}</span>
                  <span className="text-[10px] text-on-surface-variant/80">{comm.time}</span>
                </div>
                <p className="text-on-surface-variant text-[11px]">{comm.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ask a question or leave feedback..."
              className="flex-1 px-3 py-1.5 glass-panel rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary placeholder:text-on-surface-variant/70"
            />
            <GlassButton variant="primary" size="sm" type="submit">
              Post
            </GlassButton>
          </form>
        </div>
      </div>

      {/* Modal Footer Actions */}
      <div className="p-4 md:p-5 border-t border-surface-border/50 flex items-center justify-between gap-3 bg-surface-container/30">
        <GlassButton
          variant={isSaved ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => toggleSaveResource(resource.id)}
          icon="bookmark"
        >
          {isSaved ? 'Saved in Library' : 'Save'}
        </GlassButton>

        <div className="flex items-center gap-2.5">
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={handlePreview}
            icon="open_in_new"
          >
            Open Window
          </GlassButton>

          <GlassButton
            variant="primary"
            size="sm"
            onClick={handleDownload}
            icon={downloadState === 'downloaded' ? 'check' : downloadState === 'downloading' ? 'hourglass_top' : 'download'}
            className={downloadState === 'downloaded' ? 'bg-emerald-600 border-emerald-500 text-white' : ''}
          >
            {downloadState === 'downloading'
              ? 'Downloading...'
              : downloadState === 'downloaded'
              ? 'Downloaded ✓'
              : 'Download File'}
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
