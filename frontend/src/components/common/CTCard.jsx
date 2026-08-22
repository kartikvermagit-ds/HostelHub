import React from 'react';
import { Link } from 'react-router-dom';

export const CTCard = ({ ct, variant = 'dashboard' }) => {
  const isUrgent = ct.statusType === 'urgent' || ct.daysLeftNum <= 3;

  if (variant === 'compact') {
    return (
      <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-4 ambient-shadow flex justify-between items-center relative overflow-hidden hover:border-primary transition-all">
        {isUrgent && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
        )}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined">{ct.icon || 'event'}</span>
          </div>
          <div>
            <h3 className="font-label-md text-label-md text-on-surface line-clamp-1">{ct.title}</h3>
            <p className={`font-body-sm text-[12px] ${isUrgent ? 'text-error font-semibold' : 'text-on-surface-variant'}`}>
              {ct.timeLeftShort || ct.timeLeft}
            </p>
          </div>
        </div>
        <Link
          to={`/ct-zone?subject=${ct.code}`}
          className="bg-primary text-on-primary px-3 py-1.5 rounded-lg font-label-sm text-label-sm hover:opacity-90 active:bg-primary-container transition-colors shrink-0"
        >
          Prepare Now
        </Link>
      </div>
    );
  }

  return (
    <div className={`bg-surface-container-lowest border border-surface-border rounded-xl p-stack-md academic-shadow flex flex-col gap-4 hover:border-primary transition-all group ${
      ct.isTomorrow ? 'border-t-4 border-t-primary' : ''
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-block px-2 py-1 bg-surface-container text-on-surface-variant font-label-sm text-label-sm rounded-md mb-2">
            {ct.code}
          </span>
          <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
            {ct.title}
          </h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {ct.dateTime}
          </p>
        </div>

        <div
          className={`font-label-sm text-label-sm px-3 py-1.5 rounded-full flex items-center gap-1 shrink-0 ${
            isUrgent
              ? 'bg-error-container text-on-error-container font-medium'
              : 'bg-surface-container-high text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {isUrgent ? 'timer' : 'event'}
          </span>
          <span>{ct.timeLeft}</span>
        </div>
      </div>

      {ct.progress !== undefined && (
        <div className="mt-1">
          <div className="flex justify-between text-label-sm font-label-sm text-on-surface-variant mb-1.5">
            <span>CT Preparation</span>
            <span className="font-bold text-on-surface">{ct.progress}%</span>
          </div>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${ct.progress}%` }}
            ></div>
          </div>
          {ct.topicsCovered && (
            <p className="font-body-sm text-[12px] text-secondary mt-2">
              Topics covered: {ct.topicsCovered}
            </p>
          )}
        </div>
      )}

      <Link
        to={`/ct-zone?subject=${ct.code}`}
        className="mt-auto w-full text-center border border-surface-border text-on-surface font-label-md text-label-md py-2 rounded-lg hover:bg-surface-container-low hover:text-primary transition-colors block"
      >
        View Resources
      </Link>
    </div>
  );
};
