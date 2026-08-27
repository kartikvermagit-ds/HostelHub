import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ResourceModal } from './ResourceModal';
import { downloadResourceFile } from '../../utils/fileHelper';
import { GlassBadge } from '../ui';

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
        className="glass-panel rounded-2xl p-4 flex items-center justify-between hover:glass-panel-strong hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer border-white/70 dark:border-primary-fixed/20 shadow-sm"
      >
        {/* Left side: Icon & Title & Metadata */}
        <div className="flex items-center gap-3.5 md:gap-4 flex-1 min-w-0 pr-2">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              resource.bgColor || (isVideo ? 'bg-secondary-container/80 text-on-secondary-container' : 'bg-primary/10 text-primary')
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {resource.icon || (isVideo ? 'play_circle' : 'description')}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-headline-sm text-xs sm:text-sm font-extrabold text-[#0e2724] dark:text-[#f0faf8] group-hover:text-primary transition-colors truncate">
              {resource.title}
            </h4>

            {/* Desktop & Mobile Metadata with Glass Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-[#45635e] dark:text-[#a2c5bf]">
              <GlassBadge variant="accent" size="sm">
                {resource.subject || resource.type}
              </GlassBadge>
              <span className="text-surface-border">•</span>
              <span className="truncate font-medium">{resource.author}</span>
              <span className="text-surface-border">•</span>
              <span className="shrink-0 font-medium px-2 py-0.5 rounded-lg glass-panel-subtle text-[10px] text-[#35544e] dark:text-[#a6cdc7]">
                {uploadDateDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Desktop stats & actions */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <div className="flex flex-col items-end text-xs text-[#45635e] dark:text-[#a2c5bf]">
            <span className="font-extrabold text-[#0e2724] dark:text-[#f0faf8]">{resource.size || resource.duration || '2.4 MB'}</span>
            <span className="flex items-center gap-1 text-[11px]">
              <span className="material-symbols-outlined text-[13px]">
                {isVideo ? 'visibility' : 'download'}
              </span>
              <span>{isVideo ? resource.views || 250 : resource.downloads || 120}</span>
            </span>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Bookmark Button */}
            <button
              type="button"
              onClick={() => toggleSaveResource(resource.id)}
              title={isSaved ? "Saved" : "Save resource"}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "glass-panel text-[#45635e] dark:text-[#a2c5bf] hover:text-primary hover:border-primary/30"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={isSaved ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                bookmark
              </span>
            </button>

            {/* View / Watch Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl glass-panel text-[#0e2724] dark:text-[#f0faf8] text-xs font-bold hover:bg-primary hover:text-white hover:border-primary-fixed/40 transition-all shadow-2xs"
            >
              {isVideo ? "Watch" : "View"}
            </button>

            {/* Direct Download Button (Solid Teal or Emerald) */}
            <button
              type="button"
              onClick={handleDownload}
              title="Download file"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                downloaded
                  ? "bg-emerald-600 text-white"
                  : "bg-primary text-white hover:opacity-95"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {downloaded ? 'check_circle' : 'download'}
              </span>
              <span>{downloaded ? 'Saved' : 'Download'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resource Modal */}
      {isModalOpen && (
        <ResourceModal
          resource={resource}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
