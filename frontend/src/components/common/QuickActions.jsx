import React from 'react';
import { Link } from 'react-router-dom';

export const QuickActions = () => {
  return (
    <>
      {/* Desktop Bento Grid */}
      <section className="hidden md:grid md:grid-cols-4 gap-4">
        <Link
          to="/upload"
          className="bg-surface-container-lowest border border-surface-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 academic-shadow hover:bg-primary-container hover:text-on-primary-container hover:border-primary transition-all group text-on-surface text-center shadow-card hover:shadow-card-hover"
        >
          <span className="material-symbols-outlined text-[32px] text-primary group-hover:text-on-primary-container transition-colors">
            upload_file
          </span>
          <span className="font-label-md text-label-md font-semibold">Upload Resource</span>
        </Link>

        <Link
          to="/notes"
          className="bg-surface-container-lowest border border-surface-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 academic-shadow hover:bg-surface-container-low hover:border-primary/40 transition-all text-on-surface text-center shadow-card hover:shadow-card-hover group"
        >
          <span className="material-symbols-outlined text-[32px] text-secondary group-hover:text-primary transition-colors">
            folder_open
          </span>
          <span className="font-label-md text-label-md font-semibold">Browse Notes</span>
        </Link>

        <Link
          to="/ct-zone"
          className="bg-surface-container-lowest border border-surface-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 academic-shadow hover:bg-surface-container-low hover:border-primary/40 transition-all text-on-surface text-center shadow-card hover:shadow-card-hover group"
        >
          <span className="material-symbols-outlined text-[32px] text-secondary group-hover:text-primary transition-colors">
            psychology
          </span>
          <span className="font-label-md text-label-md font-semibold">CT Preparation</span>
        </Link>

        <Link
          to="/notes?filter=trending"
          className="bg-surface-container-lowest border border-surface-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 academic-shadow hover:bg-surface-container-low hover:border-primary/40 transition-all text-on-surface text-center shadow-card hover:shadow-card-hover group"
        >
          <span className="material-symbols-outlined text-[32px] text-secondary group-hover:text-primary transition-colors">
            trending_up
          </span>
          <span className="font-label-md text-label-md font-semibold">Trending Resources</span>
        </Link>
      </section>

      {/* Mobile 4-Item Quick Action Row */}
      <section className="grid grid-cols-4 gap-2 md:hidden">
        <Link
          to="/upload"
          className="flex flex-col items-center justify-center gap-1.5 bg-surface-container-lowest border border-surface-border p-3 rounded-xl ambient-shadow active:bg-surface-container transition-colors text-center"
        >
          <span className="material-symbols-outlined text-primary text-[24px]">upload_file</span>
          <span className="font-label-sm text-[11px] text-on-surface font-medium">Upload</span>
        </Link>

        <Link
          to="/notes"
          className="flex flex-col items-center justify-center gap-1.5 bg-surface-container-lowest border border-surface-border p-3 rounded-xl ambient-shadow active:bg-surface-container transition-colors text-center"
        >
          <span className="material-symbols-outlined text-primary text-[24px]">description</span>
          <span className="font-label-sm text-[11px] text-on-surface font-medium">Notes</span>
        </Link>

        <Link
          to="/pyqs"
          className="flex flex-col items-center justify-center gap-1.5 bg-surface-container-lowest border border-surface-border p-3 rounded-xl ambient-shadow active:bg-surface-container transition-colors text-center"
        >
          <span className="material-symbols-outlined text-primary text-[24px]">history_edu</span>
          <span className="font-label-sm text-[11px] text-on-surface font-medium">PYQs</span>
        </Link>

        <Link
          to="/videos"
          className="flex flex-col items-center justify-center gap-1.5 bg-surface-container-lowest border border-surface-border p-3 rounded-xl ambient-shadow active:bg-surface-container transition-colors text-center"
        >
          <span className="material-symbols-outlined text-primary text-[24px]">videocam</span>
          <span className="font-label-sm text-[11px] text-on-surface font-medium">Videos</span>
        </Link>
      </section>
    </>
  );
};
