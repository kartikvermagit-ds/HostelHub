import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard, GlassBadge } from '../ui';

export const CTCard = ({ ct, variant = 'dashboard' }) => {
  const isUrgent = ct.statusType === 'urgent' || ct.daysLeftNum <= 3;

  if (variant === 'compact') {
    return (
      <GlassCard
        interactive
        className="p-4 flex justify-between items-center relative overflow-hidden border-white/60 dark:border-primary-fixed/20 shadow-md"
      >
        {isUrgent && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">{ct.icon || 'event'}</span>
          </div>
          <div>
            <h3 className="font-headline-sm text-xs font-bold text-on-surface line-clamp-1">{ct.title}</h3>
            <p className={`text-[11px] font-semibold mt-0.5 ${isUrgent ? 'text-amber-600 dark:text-amber-400' : 'text-on-surface-variant'}`}>
              {ct.timeLeftShort || ct.timeLeft}
            </p>
          </div>
        </div>
        <Link
          to={`/ct-zone?subject=${ct.code}`}
          className="bg-primary text-on-primary px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:shadow-primary/20 active:scale-95 transition-all shrink-0"
        >
          Prepare Now
        </Link>
      </GlassCard>
    );
  }

  return (
    <GlassCard
      interactive
      className="flex flex-col gap-4 border-white/60 dark:border-primary-fixed/20 shadow-md group"
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <span className="inline-block px-2.5 py-0.5 glass-panel text-primary font-mono text-[11px] font-bold rounded-lg mb-2 border border-primary/20">
            {ct.code}
          </span>
          <h4 className="font-headline-sm text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
            {ct.title}
          </h4>
          <p className="text-xs text-on-surface-variant mt-1 font-medium">
            {ct.dateTime}
          </p>
        </div>

        <GlassBadge
          variant={isUrgent ? 'warning' : 'default'}
          icon={isUrgent ? 'timer' : 'event'}
          size="sm"
        >
          {ct.timeLeft}
        </GlassBadge>
      </div>

      {ct.progress !== undefined && (
        <div className="mt-1 space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-on-surface-variant">
            <span>Syllabus Covered</span>
            <span className="font-bold text-on-surface">{ct.progress}%</span>
          </div>
          <div className="w-full h-2 bg-surface-container/70 rounded-full overflow-hidden p-0.5 border border-surface-border/50">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500 shadow-2xs"
              style={{ width: `${ct.progress}%` }}
            ></div>
          </div>
          {ct.topicsCovered && (
            <p className="text-[11px] text-on-surface-variant/80 font-medium">
              Topics: {ct.topicsCovered}
            </p>
          )}
        </div>
      )}

      <Link
        to={`/ct-zone?subject=${ct.code}`}
        className="mt-auto w-full text-center py-2 px-3 rounded-xl glass-panel text-xs font-bold text-on-surface group-hover:bg-primary group-hover:text-on-primary group-hover:border-primary-fixed/40 transition-all duration-200 block shadow-2xs"
      >
        View CT Resources →
      </Link>
    </GlassCard>
  );
};
