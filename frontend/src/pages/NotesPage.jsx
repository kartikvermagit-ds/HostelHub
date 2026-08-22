import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ResourceItem } from '../components/common/ResourceItem';

export const NotesPage = () => {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');

  const { resources, searchQuery } = useApp();
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const subjects = ['All', 'COA', 'DSA', 'OS', 'Maths', 'DBMS', 'Physics'];
  const types = ['All', 'PDF', 'VID'];

  const filteredResources = resources.filter(res => {
    const matchesSearch = searchQuery === "" || 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === 'All' || res.subject.toLowerCase() === selectedSubject.toLowerCase();
    const matchesType = selectedType === 'All' || res.type === selectedType;

    return matchesSearch && matchesSubject && matchesType;
  });

  return (
    <main className="flex-1 max-w-container-max mx-auto w-full px-4 md:px-margin-page py-4 md:py-stack-lg flex flex-col gap-6">
      <div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">
          {filterParam === 'trending' ? 'Trending Resources' : 'Browse Study Materials'}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Access shared notes, lecture summaries, formula sheets, and study guides.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="font-label-sm text-secondary font-semibold shrink-0">Subject:</span>
          {subjects.map(subj => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1 rounded-lg font-label-sm text-label-sm transition-all whitespace-nowrap ${
                selectedSubject === subj
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-label-sm text-secondary font-semibold">Format:</span>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-lg font-label-sm text-label-sm transition-all ${
                selectedType === t
                  ? 'bg-secondary-container text-on-secondary-container font-bold'
                  : 'border border-surface-border text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {t === 'All' ? 'All' : t === 'PDF' ? 'PDF Notes' : 'Videos'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-label-sm text-on-surface-variant">
        <span>Showing {filteredResources.length} materials</span>
        {searchQuery && (
          <span>Searching for: <strong>"{searchQuery}"</strong></span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {filteredResources.length > 0 ? (
          filteredResources.map(res => (
            <ResourceItem key={res.id} resource={res} />
          ))
        ) : (
          <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-2 text-outline">description</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">No materials found</h3>
            <p className="font-body-sm text-body-sm text-secondary">
              Try adjusting your subject or search filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};
