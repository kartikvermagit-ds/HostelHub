import React from 'react';
import { useApp } from '../context/AppContext';
import { ResourceItem } from '../components/common/ResourceItem';

export const ProfilePage = () => {
  const { user, resources } = useApp();

  const myUploads = resources.filter(res => res.author.includes(user.name) || res.author.includes("Kartik"));

  return (
    <main className="flex-1 max-w-container-max mx-auto w-full px-4 md:px-margin-page py-4 md:py-stack-lg flex flex-col gap-6">
      <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-6 md:p-8 shadow-card flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 p-1 bg-surface-container shrink-0">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
                {user.fullName}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                {user.role}
              </p>
            </div>
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-label-sm text-label-sm font-semibold rounded-full self-center md:self-start">
              Active Contributor
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-surface-border">
            <div className="text-center md:text-left">
              <span className="block font-headline-md text-headline-md font-bold text-primary">
                {user.stats.notesShared}
              </span>
              <span className="font-label-sm text-[12px] text-on-surface-variant">
                Notes Uploaded
              </span>
            </div>
            <div className="text-center md:text-left">
              <span className="block font-headline-md text-headline-md font-bold text-primary">
                {user.stats.downloads}
              </span>
              <span className="font-label-sm text-[12px] text-on-surface-variant">
                Total Downloads
              </span>
            </div>
            <div className="text-center md:text-left">
              <span className="block font-headline-md text-headline-md font-bold text-primary">
                {user.stats.studyHours}h
              </span>
              <span className="font-label-sm text-[12px] text-on-surface-variant">
                Study Time
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">
          My Shared Materials ({myUploads.length})
        </h2>
        <div className="flex flex-col gap-3">
          {myUploads.map(res => (
            <ResourceItem key={res.id} resource={res} />
          ))}
        </div>
      </section>
    </main>
  );
};
