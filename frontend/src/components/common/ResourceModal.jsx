import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { downloadResourceFile, openResourcePreview } from '../../utils/fileHelper';

export const ResourceModal = ({ resource, isOpen, onClose }) => {
  const { savedResourceIds, toggleSaveResource, user } = useApp();
  const [downloaded, setDownloaded] = useState(false);
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
    setDownloaded(true);
    downloadResourceFile(resource);
    setTimeout(() => setDownloaded(false), 2500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest border border-surface-border rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 md:p-6 border-b border-surface-border bg-surface-bright">
          <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                resource.bgColor || (isVideo ? 'bg-secondary-container' : 'bg-surface-variant')
              }`}
            >
              <span
                className={`material-symbols-outlined text-[28px] ${
                  resource.iconColor || (isVideo ? 'text-on-secondary-container' : 'text-primary')
                }`}
              >
                {resource.icon || (isVideo ? 'play_circle' : 'description')}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface font-semibold text-[11px] uppercase tracking-wider">
                  {resource.subject || 'CS'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-semibold text-[11px] uppercase tracking-wider">
                  {resource.type || 'PDF'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-semibold text-[11px]">
                  📅 {uploadTimestamp}
                </span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                {resource.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 space-y-5">
          {/* Metadata Grid with Exact Date & Time */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-surface-container-low rounded-xl border border-surface-border text-center">
            <div>
              <span className="block font-label-sm text-[11px] text-on-surface-variant">Uploaded By</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate block">
                {resource.author || 'Kartik'}
              </span>
            </div>
            <div>
              <span className="block font-label-sm text-[11px] text-on-surface-variant">Upload Date & Time</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold block text-xs">
                {uploadTimestamp}
              </span>
            </div>
            <div>
              <span className="block font-label-sm text-[11px] text-on-surface-variant">File Size</span>
              <span className="font-label-md text-label-md text-on-surface font-semibold block">
                {resource.size || '2.4 MB'}
              </span>
            </div>
            <div>
              <span className="block font-label-sm text-[11px] text-on-surface-variant">Downloads</span>
              <span className="font-label-md text-label-md text-primary font-semibold block">
                {resource.downloads || 124}
              </span>
            </div>
          </div>

          {/* Interactive Document / Media Preview */}
          <div className="p-4 bg-surface rounded-xl border border-surface-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">visibility</span>
                <span>Document Preview</span>
              </span>

              <button
                onClick={handlePreview}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Open in New Window</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>

            {/* If uploaded file is an image */}
            {resource.rawFile && resource.rawFile.type && resource.rawFile.type.startsWith('image/') ? (
              <div className="rounded-xl overflow-hidden max-h-64 flex items-center justify-center bg-black/5 border border-surface-border">
                <img
                  src={resource.file_url}
                  alt={resource.title}
                  className="max-h-60 object-contain"
                />
              </div>
            ) : (
              <div className="p-3.5 bg-surface-container-lowest rounded-lg border border-surface-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">
                      {isVideo ? 'play_circle' : 'picture_as_pdf'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">{resource.fileName || `${resource.title}.pdf`}</p>
                    <p className="text-[11px] text-on-surface-variant">Ready to view or download directly</p>
                  </div>
                </div>

                <button
                  onClick={handlePreview}
                  className="px-3 py-1.5 bg-primary/10 text-primary font-bold text-xs rounded-lg hover:bg-primary/20 transition-colors"
                >
                  Preview Document
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          {resource.description && (
            <div>
              <h3 className="font-label-md text-label-md font-semibold text-on-surface mb-1.5">
                Overview & Coverage
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed bg-surface p-3.5 rounded-xl border border-surface-border">
                {resource.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div>
              <h3 className="font-label-sm text-[12px] uppercase tracking-wider font-semibold text-on-surface-variant mb-2">
                Tags & Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-surface-container text-on-surface font-label-sm text-label-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Discussion & Comments Section */}
          <div className="pt-3 border-t border-surface-border space-y-3">
            <h3 className="font-headline-sm text-[16px] font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">forum</span>
              <span>Hostel Discussion ({comments.length})</span>
            </h3>

            {/* Comment List */}
            <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
              {comments.map((comm) => (
                <div key={comm.id} className="p-3 bg-surface rounded-xl border border-surface-border text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-on-surface">{comm.author}</span>
                    <span className="text-[11px] text-on-surface-variant">{comm.time}</span>
                  </div>
                  <p className="text-on-surface-variant text-[13px]">{comm.text}</p>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ask a question or leave feedback..."
                className="flex-1 px-3.5 py-2 bg-surface-container-low border border-surface-border rounded-lg text-sm focus:outline-none focus:border-primary text-on-surface"
              />
              <button
                type="submit"
                className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
              >
                Post
              </button>
            </form>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 md:p-5 border-t border-surface-border bg-surface-bright flex items-center justify-between gap-3">
          {/* Bookmark Button */}
          <button
            onClick={() => toggleSaveResource(resource.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-label-md text-label-md transition-all ${
              isSaved
                ? 'bg-primary text-on-primary border-primary'
                : 'border-surface-border text-on-surface hover:bg-surface-container'
            }`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={isSaved ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              bookmark
            </span>
            <span>{isSaved ? 'Saved in Library' : 'Bookmark'}</span>
          </button>

          <div className="flex items-center gap-2.5">
            {/* View Fullscreen Button */}
            <button
              onClick={handlePreview}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-surface-border text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              <span>Open View</span>
            </button>

            {/* Direct Download Button */}
            <button
              onClick={handleDownload}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-sm transition-all ${
                downloaded
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-primary text-on-primary hover:opacity-90'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {downloaded ? 'check' : 'download'}
              </span>
              <span>{downloaded ? 'Saved to Device!' : 'Download File'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
