import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ResourceModal } from './ResourceModal';
import { downloadResourceFile } from '../../utils/fileHelper';

export const ResourceItem = ({ resource }) => {
  const { savedResourceIds, toggleSaveResource } = useApp();
  const isSaved = savedResourceIds.has(resource.id);
  const [downloaded, setDownloaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = (e) => {
    e.stopPropagation();
    setDownloaded(true);
    downloadResourceFile(resource);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const isVideo = resource.type === 'VID' || resource.type?.toLowerCase().includes('video');
  const uploadDateDisplay = resource.uploadedAt || resource.timeAgo || 'Just now';

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-surface-container-lowest border border-surface-border rounded-xl p-3.5 md:p-4 flex items-center justify-between hover:bg-surface-container-low hover:border-primary/40 transition-all group academic-shadow cursor-pointer"
      >
        {/* Left side: Icon & Title & Metadata */}
        <div className="flex items-center gap-3.5 md:gap-4 flex-1 min-w-0 pr-2">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              resource.bgColor || (isVideo ? 'bg-secondary-container' : 'bg-surface-variant')
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                resource.iconColor || (isVideo ? 'text-on-secondary-container' : 'text-primary')
              }`}
            >
              {resource.icon || (isVideo ? 'play_circle' : 'description')}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors truncate font-semibold">
              {resource.title}
            </h4>

            {/* Desktop & Mobile Metadata with Upload Date */}
            <div className="flex flex-wrap items-center gap-2 mt-1 text-on-surface-variant font-body-sm text-[12px] md:text-[13px]">
              <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-on-surface">
                {resource.subject || resource.type}
              </span>
              <span className="text-surface-border">•</span>
              <span className="truncate font-medium">{resource.author}</span>
              <span className="text-surface-border">•</span>
              <span className="shrink-0 text-[11px] md:text-[12px] text-on-surface-variant font-medium bg-surface-container-low px-1.5 py-0.5 rounded border border-surface-border">
                📅 {uploadDateDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Desktop stats & actions */}
        <div className="hidden md:flex items-center gap-5 shrink-0">
          <div className="flex flex-col items-end text-on-surface-variant font-body-sm text-body-sm">
            <span className="font-medium text-on-surface">{resource.size || resource.duration || '2.4 MB'}</span>
            <span className="flex items-center gap-1 text-[12px]">
              <span className="material-symbols-outlined text-[14px]">
                {isVideo ? 'visibility' : 'download'}
              </span>
              <span>{isVideo ? resource.views || 250 : resource.downloads || 120}</span>
            </span>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Bookmark Button */}
            <button
              onClick={() => toggleSaveResource(resource.id)}
              title={isSaved ? "Saved" : "Save resource"}
              className={`p-2 rounded-lg border transition-colors ${
                isSaved
                  ? "bg-primary text-on-primary border-primary"
                  : "border-surface-border text-on-surface-variant hover:text-primary hover:bg-surface-container"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={isSaved ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                bookmark
              </span>
            </button>

            {/* View/Watch Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg border border-surface-border text-on-surface font-label-sm text-label-sm hover:bg-surface-container hover:text-primary transition-colors font-medium"
            >
              {isVideo ? "Watch" : "View"}
            </button>

            {/* Direct Download Button */}
            <button
              onClick={handleDownload}
              className={`px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm transition-all flex items-center gap-1.5 font-bold ${
                downloaded
                  ? "bg-emerald-600 text-white"
                  : "bg-primary text-on-primary hover:opacity-90 shadow-sm"
              }`}
            >
              {downloaded ? (
                <>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Downloaded</span>
                </>
              ) : (
                <span>Download</span>
              )}
            </button>
          </div>
        </div>

        {/* Right side: Mobile compact action buttons */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => toggleSaveResource(resource.id)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              isSaved ? "text-primary bg-surface-container" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={isSaved ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              bookmark
            </span>
          </button>

          <button
            onClick={handleDownload}
            className="w-8 h-8 flex items-center justify-center text-primary bg-surface-container-low rounded-lg active:bg-secondary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {downloaded ? 'check' : isVideo ? 'play_arrow' : 'download'}
            </span>
          </button>
        </div>
      </div>

      {/* Detail & Preview Modal */}
      <ResourceModal
        resource={resource}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
