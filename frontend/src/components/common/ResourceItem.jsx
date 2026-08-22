import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const ResourceItem = ({ resource }) => {
  const { savedResourceIds, toggleSaveResource } = useApp();
  const isSaved = savedResourceIds.has(resource.id);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = (e) => {
    e.stopPropagation();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const isVideo = resource.type === 'VID' || resource.type?.toLowerCase().includes('video');

  return (
    <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-3.5 md:p-4 flex items-center justify-between hover:bg-surface-container-low hover:border-primary/40 transition-all group academic-shadow">
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

          {/* Desktop & Mobile Metadata */}
          <div className="flex flex-wrap items-center gap-2 mt-1 text-on-surface-variant font-body-sm text-[12px] md:text-[13px]">
            <span className="bg-surface-container px-2 py-0.5 rounded text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-on-surface">
              {resource.subject || resource.type}
            </span>
            <span className="text-surface-border">•</span>
            <span className="truncate">{resource.author}</span>
            <span className="text-surface-border">•</span>
            <span className="shrink-0">{resource.timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Right side: Desktop stats & actions */}
      <div className="hidden md:flex items-center gap-6 shrink-0">
        <div className="flex flex-col items-end text-on-surface-variant font-body-sm text-body-sm">
          <span className="font-medium text-on-surface">{resource.size || resource.duration || '2.4 MB'}</span>
          <span className="flex items-center gap-1 text-[12px]">
            <span className="material-symbols-outlined text-[14px]">
              {isVideo ? 'visibility' : 'download'}
            </span>
            <span>{isVideo ? resource.views || 250 : resource.downloads || 120}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
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
            onClick={() => alert(`Opening ${resource.title}`)}
            className="px-3.5 py-1.5 rounded-lg border border-surface-border text-on-surface font-label-sm text-label-sm hover:bg-surface-container hover:text-primary transition-colors"
          >
            {isVideo ? "Watch" : "View"}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isVideo}
            className={`px-3.5 py-1.5 rounded-lg font-label-sm text-label-sm transition-all flex items-center gap-1.5 ${
              isVideo
                ? "bg-surface-container text-on-surface-variant opacity-50 cursor-not-allowed"
                : downloaded
                ? "bg-primary-container text-on-primary font-bold"
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
      <div className="flex md:hidden items-center gap-1.5 shrink-0">
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
            {isVideo ? 'play_arrow' : 'download'}
          </span>
        </button>
      </div>
    </div>
  );
};
