import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ResourceItem } from '../components/common/ResourceItem';

export const SavedPage = () => {
  const { resources, savedResourceIds } = useApp();

  const savedResources = resources.filter(res => savedResourceIds.has(res.id));

  return (
    <main className="flex-1 max-w-container-max mx-auto w-full px-4 md:px-margin-page py-4 md:py-stack-lg flex flex-col gap-6">
      <div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">
          Saved Resources
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Your bookmarked study notes, videos, and PYQs for quick revision.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {savedResources.length > 0 ? (
          savedResources.map(res => (
            <ResourceItem key={res.id} resource={res} />
          ))
        ) : (
          <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-2 text-primary">bookmark_border</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">No saved items yet</h3>
            <p className="font-body-sm text-body-sm text-secondary mb-4">
              Click the bookmark icon on any note or resource to save it here.
            </p>
            <Link
              to="/notes"
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span>Browse Notes</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};
