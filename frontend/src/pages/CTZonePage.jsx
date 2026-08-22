import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const CTZonePage = () => {
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get('subject') || 'DSA';
  
  const { upcomingTests, subjectData, selectedSubjectKey, setSelectedSubjectKey, toggleChecklistItem } = useApp();
  const [saveStatus, setSaveStatus] = useState(null);

  const currentSubjectKey = subjectData[selectedSubjectKey] ? selectedSubjectKey : initialSubject;
  const currentSubject = subjectData[currentSubjectKey] || subjectData['DSA'];

  const handleSave = () => {
    setSaveStatus("Progress saved successfully!");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const completedChecklistCount = currentSubject.checklist.filter(i => i.completed).length;

  return (
    <main className="flex-1 w-full max-w-container-max mx-auto px-4 md:px-margin-page py-4 md:py-stack-lg">
      {/* Page Header */}
      <div className="mb-6 md:mb-stack-lg">
        <h1 className="font-headline-lg-mobile md:font-display text-headline-lg-mobile md:text-display text-on-surface mb-1 md:mb-2 tracking-tight">
          CT Zone
        </h1>
        <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-2xl">
          Everything you need before your next class test. Track progress, review materials, and conquer your exams.
        </p>
      </div>

      {/* Section 1: Active Preparations Cards (Desktop & Mobile) */}
      <section className="mb-8 md:mb-stack-lg">
        <div className="flex items-center justify-between mb-4 md:mb-stack-md">
          <h2 className="font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md text-on-surface">
            Active Preparations
          </h2>
          <span className="font-label-sm md:font-label-md text-label-sm md:text-label-md text-secondary font-medium">
            Semester 4
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-gutter-grid">
          {/* Card 1: COA */}
          <div
            onClick={() => setSelectedSubjectKey('COA')}
            className={`bg-surface-container-lowest rounded-2xl border p-6 shadow-card flex flex-col hover:shadow-card-hover cursor-pointer transition-all ${
              selectedSubjectKey === 'COA' ? 'border-primary ring-2 ring-primary/20' : 'border-surface-border'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-2 py-1 bg-surface-variant text-on-surface-variant font-label-sm text-label-sm rounded mb-2 font-medium">
                  Semester 4
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">COA</h3>
                <p className="font-body-sm text-body-sm text-secondary">
                  Computer Organization & Architecture
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">memory</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-2">
                <span>CT Preparation</span>
                <span className="font-bold text-on-surface">{subjectData['COA']?.progressPercent || 72}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${subjectData['COA']?.progressPercent || 72}%` }}
                ></div>
              </div>
              <p className="font-body-sm text-[12px] text-secondary mb-4">
                Topics covered: {subjectData['COA']?.checklist?.filter(c => c.completed).length || 3}/{subjectData['COA']?.checklist?.length || 4}
              </p>
              <button
                type="button"
                className={`w-full font-label-md text-label-md py-2.5 rounded-lg transition-all ${
                  selectedSubjectKey === 'COA'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                {selectedSubjectKey === 'COA' ? 'Active Focus' : 'Select Subject'}
              </button>
            </div>
          </div>

          {/* Card 2: DSA */}
          <div
            onClick={() => setSelectedSubjectKey('DSA')}
            className={`bg-surface-container-lowest rounded-2xl border p-6 shadow-card flex flex-col hover:shadow-card-hover cursor-pointer transition-all border-t-4 border-t-primary ${
              selectedSubjectKey === 'DSA' ? 'border-primary ring-2 ring-primary/20' : 'border-surface-border'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-container text-on-error-container font-label-sm text-label-sm rounded mb-2 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  <span>Test Tomorrow</span>
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">DSA</h3>
                <p className="font-body-sm text-body-sm text-secondary">
                  Data Structures & Algorithms
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">account_tree</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-2">
                <span>CT Preparation</span>
                <span className="font-bold text-on-surface">{subjectData['DSA']?.progressPercent || 45}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${subjectData['DSA']?.progressPercent || 45}%` }}
                ></div>
              </div>
              <p className="font-body-sm text-[12px] text-secondary mb-4">
                Topics covered: {subjectData['DSA']?.checklist?.filter(c => c.completed).length || 2}/{subjectData['DSA']?.checklist?.length || 5}
              </p>
              <button
                type="button"
                className={`w-full font-label-md text-label-md py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  selectedSubjectKey === 'DSA'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span>{selectedSubjectKey === 'DSA' ? 'Active Focus' : 'Select Subject'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Card 3: DBMS */}
          <div
            onClick={() => setSelectedSubjectKey('DBMS')}
            className={`bg-surface-container-lowest rounded-2xl border p-6 shadow-card flex flex-col hover:shadow-card-hover cursor-pointer transition-all ${
              selectedSubjectKey === 'DBMS' ? 'border-primary ring-2 ring-primary/20' : 'border-surface-border'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-2 py-1 bg-surface-variant text-on-surface-variant font-label-sm text-label-sm rounded mb-2 font-medium">
                  Semester 4
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">DBMS</h3>
                <p className="font-body-sm text-body-sm text-secondary">
                  Database Management Systems
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary">database</span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant mb-2">
                <span>CT Preparation</span>
                <span className="font-bold text-on-surface">{subjectData['DBMS']?.progressPercent || 90}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${subjectData['DBMS']?.progressPercent || 90}%` }}
                ></div>
              </div>
              <p className="font-body-sm text-[12px] text-secondary mb-4">
                Topics covered: {subjectData['DBMS']?.checklist?.filter(c => c.completed).length || 3}/{subjectData['DBMS']?.checklist?.length || 4}
              </p>
              <button
                type="button"
                className={`w-full font-label-md text-label-md py-2.5 rounded-lg transition-all ${
                  selectedSubjectKey === 'DBMS'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                {selectedSubjectKey === 'DBMS' ? 'Active Focus' : 'Select Subject'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Subject Deep Dive & Checklist (Asymmetric Layout) */}
      <section>
        <div className="flex items-center justify-between mb-4 md:mb-stack-md">
          <h2 className="font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md text-on-surface">
            Subject Deep Dive: {currentSubject.name}
          </h2>
          {saveStatus && (
            <span className="text-primary font-label-sm text-label-sm font-semibold bg-surface-container-low px-3 py-1 rounded-full animate-fade-in">
              ✓ {saveStatus}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-gutter-grid">
          {/* Left Column: Subject Selector & Quick Stats */}
          <div className="lg:col-span-4 space-y-4">
            {/* Subject Selector */}
            <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-4 shadow-sm">
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3 text-[11px] font-semibold">
                Select Subject
              </h3>
              <ul className="space-y-1">
                {Object.keys(subjectData).map((key) => (
                  <li key={key}>
                    <button
                      onClick={() => setSelectedSubjectKey(key)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-left ${
                        selectedSubjectKey === key
                          ? 'bg-surface-container-high border-l-4 border-primary text-primary font-bold'
                          : 'hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <span className="font-body-md text-body-md">{key} - {subjectData[key].name}</span>
                      <span className="material-symbols-outlined text-[18px]">
                        chevron_right
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subject Focus Stats */}
            <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-6 shadow-sm">
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                {currentSubject.code} Stats
              </h4>
              <div className="flex items-end gap-2 mb-3">
                <span className="font-display text-[36px] leading-none font-bold text-primary">
                  {currentSubject.progressPercent}%
                </span>
                <span className="font-body-sm text-body-sm text-secondary pb-1">
                  ready
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                You have {currentSubject.daysLeft} days left. Focus area: <strong className="text-on-surface">{currentSubject.focusAreas}</strong>.
              </p>
              <div className="p-3 bg-surface-container-low rounded-lg border border-surface-border mb-4">
                <div className="flex justify-between text-label-sm font-label-sm mb-1">
                  <span className="text-on-surface-variant">Checklist Items</span>
                  <span className="font-bold text-primary">{completedChecklistCount}/{currentSubject.checklist.length}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(completedChecklistCount / currentSubject.checklist.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Preparation Checklist */}
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-surface-border shadow-sm overflow-hidden flex flex-col">
            {/* Checklist Header */}
            <div className="border-b border-surface-border p-4 md:p-6 bg-surface-bright flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-headline-sm md:font-headline-md text-headline-sm md:text-headline-md text-on-surface mb-1">
                  Preparation Checklist
                </h3>
                <p className="font-body-sm md:font-body-md text-body-sm md:text-body-md text-secondary">
                  {currentSubject.name} ({currentSubject.unit})
                </p>
              </div>
              <div className="px-3 py-1 bg-primary-container text-on-primary-container rounded-full font-label-sm text-label-sm font-semibold self-start sm:self-auto">
                {completedChecklistCount}/{currentSubject.checklist.length} Categories Complete
              </div>
            </div>

            {/* Checklist Items */}
            <div className="p-4 md:p-6 flex-1">
              <div className="space-y-3 md:space-y-4">
                {currentSubject.checklist.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3.5 md:gap-4 p-3.5 md:p-4 rounded-xl border transition-all cursor-pointer group ${
                      item.completed
                        ? 'bg-surface-container-low/60 border-surface-border text-on-surface-variant'
                        : 'bg-surface-container-lowest border-surface-border hover:border-primary/40 text-on-surface'
                    }`}
                  >
                    <div className="mt-0.5 relative flex items-center justify-center shrink-0">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(currentSubjectKey, item.id)}
                        className="peer w-5 h-5 appearance-none border-2 border-outline rounded-md checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                      />
                      <span className="material-symbols-outlined text-on-primary text-[16px] absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                        check
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-label-md text-label-md font-semibold transition-colors ${
                          item.completed ? 'line-through opacity-70 text-on-surface-variant' : 'group-hover:text-primary text-on-surface'
                        }`}>
                          {item.title}
                        </h4>
                        {item.badge && (
                          <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="font-body-sm text-body-sm text-secondary mt-1">
                        {item.desc}
                      </p>
                    </div>

                    <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors shrink-0">
                      {item.icon}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Checklist Footer */}
            <div className="border-t border-surface-border p-4 bg-surface-bright flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-secondary">
                Auto-saves your checklist state
              </span>
              <button
                onClick={handleSave}
                className="bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Save Progress</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
