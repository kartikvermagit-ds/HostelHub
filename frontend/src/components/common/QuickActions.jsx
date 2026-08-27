import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../ui';

export const QuickActions = () => {
  return (
    <>
      {/* Desktop Bento Grid */}
      <section className="hidden md:grid md:grid-cols-4 gap-4">
        <Link to="/upload" className="group">
          <GlassCard
            interactive
            className="p-6 flex flex-col items-center justify-center gap-3 text-center border-white/60 dark:border-primary-fixed/20 shadow-md group-hover:border-primary/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-2xs">
              <span className="material-symbols-outlined text-[28px]">upload_file</span>
            </div>
            <div>
              <span className="font-headline-sm text-xs font-bold text-on-surface block group-hover:text-primary transition-colors">
                Upload Resource
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium">
                Share notes & solutions
              </span>
            </div>
          </GlassCard>
        </Link>

        <Link to="/notes" className="group">
          <GlassCard
            interactive
            className="p-6 flex flex-col items-center justify-center gap-3 text-center border-white/60 dark:border-primary-fixed/20 shadow-md group-hover:border-primary/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary-container/60 text-secondary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-2xs">
              <span className="material-symbols-outlined text-[28px]">folder_open</span>
            </div>
            <div>
              <span className="font-headline-sm text-xs font-bold text-on-surface block group-hover:text-primary transition-colors">
                Browse Notes
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium">
                Lecture files & formulas
              </span>
            </div>
          </GlassCard>
        </Link>

        <Link to="/ct-zone" className="group">
          <GlassCard
            interactive
            className="p-6 flex flex-col items-center justify-center gap-3 text-center border-white/60 dark:border-primary-fixed/20 shadow-md group-hover:border-primary/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 shadow-2xs">
              <span className="material-symbols-outlined text-[28px]">psychology</span>
            </div>
            <div>
              <span className="font-headline-sm text-xs font-bold text-on-surface block group-hover:text-primary transition-colors">
                CT Preparation
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium">
                Checklists & tests
              </span>
            </div>
          </GlassCard>
        </Link>

        <Link to="/pyqs" className="group">
          <GlassCard
            interactive
            className="p-6 flex flex-col items-center justify-center gap-3 text-center border-white/60 dark:border-primary-fixed/20 shadow-md group-hover:border-primary/50"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed/25 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 shadow-2xs">
              <span className="material-symbols-outlined text-[28px]">history_edu</span>
            </div>
            <div>
              <span className="font-headline-sm text-xs font-bold text-on-surface block group-hover:text-primary transition-colors">
                Solved PYQs
              </span>
              <span className="text-[11px] text-on-surface-variant font-medium">
                Previous year papers
              </span>
            </div>
          </GlassCard>
        </Link>
      </section>

      {/* Mobile 4-Item Quick Action Row */}
      <section className="grid grid-cols-4 gap-2 md:hidden">
        <Link
          to="/upload"
          className="flex flex-col items-center justify-center gap-1.5 glass-panel p-3 rounded-2xl active:scale-95 transition-all text-center border-white/60 dark:border-primary-fixed/20 shadow-xs"
        >
          <span className="material-symbols-outlined text-primary text-[22px]">upload_file</span>
          <span className="text-[10px] text-on-surface font-bold">Upload</span>
        </Link>

        <Link
          to="/notes"
          className="flex flex-col items-center justify-center gap-1.5 glass-panel p-3 rounded-2xl active:scale-95 transition-all text-center border-white/60 dark:border-primary-fixed/20 shadow-xs"
        >
          <span className="material-symbols-outlined text-primary text-[22px]">description</span>
          <span className="text-[10px] text-on-surface font-bold">Notes</span>
        </Link>

        <Link
          to="/pyqs"
          className="flex flex-col items-center justify-center gap-1.5 glass-panel p-3 rounded-2xl active:scale-95 transition-all text-center border-white/60 dark:border-primary-fixed/20 shadow-xs"
        >
          <span className="material-symbols-outlined text-primary text-[22px]">history_edu</span>
          <span className="text-[10px] text-on-surface font-bold">PYQs</span>
        </Link>

        <Link
          to="/videos"
          className="flex flex-col items-center justify-center gap-1.5 glass-panel p-3 rounded-2xl active:scale-95 transition-all text-center border-white/60 dark:border-primary-fixed/20 shadow-xs"
        >
          <span className="material-symbols-outlined text-primary text-[22px]">videocam</span>
          <span className="text-[10px] text-on-surface font-bold">Videos</span>
        </Link>
      </section>
    </>
  );
};
