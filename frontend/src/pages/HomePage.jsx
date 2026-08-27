import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CTCard } from '../components/common/CTCard';
import { QuickActions } from '../components/common/QuickActions';
import { ResourceItem } from '../components/common/ResourceItem';
import { HostelExperience } from '../components/3d/HostelExperience';
import { GlassCard, GlassBadge } from '../components/ui';

export const HomePage = () => {
  const { user, resources, upcomingTests, searchQuery, activeCategoryTab, setActiveCategoryTab } = useApp();

  const categories = ["All", "Notes", "PDFs", "PYQs", "Videos"];

  // Filter resources based on selected category tab and search query
  const filteredResources = resources.filter(res => {
    const matchesSearch = searchQuery === "" || 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategoryTab === "All") return true;
    if (activeCategoryTab === "Notes") return res.type === "PDF" || res.type === "Note" || res.type?.includes("notes");
    if (activeCategoryTab === "PDFs") return res.type === "PDF";
    if (activeCategoryTab === "PYQs") return res.title.toLowerCase().includes("pyq") || res.type === "PYQ";
    if (activeCategoryTab === "Videos") return res.type === "VID" || res.type?.toLowerCase().includes("video");

    return true;
  });

  const nextCT = upcomingTests[0];
  const firstName = (user?.full_name || user?.name || 'Kartik').split(' ')[0];

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 md:py-6 flex flex-col gap-6 md:gap-8">
      {/* 1. Architectural Glass Welcome Hero (Crisp & Luminous) */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <GlassCard className="w-full relative overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-white/70 dark:border-primary-fixed/20 shadow-xl">
          <div className="space-y-2 z-10 max-w-xl">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[11px] font-bold text-primary border border-primary/25 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>HOSTEL ACADEMIC SPACE</span>
            </div>

            {/* Greeting */}
            <h1 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-[#0e2724] dark:text-[#f0faf8] tracking-tight">
              Good morning, {firstName} 👋
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#33534d] dark:text-[#b0d2cc] font-medium leading-relaxed">
              Everything your hostel needs to prepare better. Explore your 3D digital hostel twin, collaborate with wingmates, and access verified exam papers.
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <GlassBadge variant="primary" icon="description">
                {resources.length} Academic Resources
              </GlassBadge>
              <GlassBadge variant="warning" icon="quiz">
                {upcomingTests.length} Upcoming CTs
              </GlassBadge>
              <GlassBadge variant="accent" icon="domain">
                {user?.hostel || 'Aryabhata Hostel'} • 3D Twin
              </GlassBadge>
            </div>
          </div>

          {/* Right Hero Visual Mark */}
          <div className="relative shrink-0 hidden sm:flex items-center justify-center p-3 rounded-2xl glass-panel shadow-lg border border-white/70 dark:border-primary-fixed/20">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden"
            >
              <img
                src="/logo-app.png"
                alt="HostelHub 3D Logo"
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </motion.div>
          </div>
        </GlassCard>
      </motion.section>

      {/* 2. Interactive 3D Digital Twin Hostel Hero */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        className="w-full"
      >
        <HostelExperience className="w-full" />
      </motion.section>

      {/* 3. Mobile-Only: Next CT Compact Card */}
      <section className="md:hidden">
        {nextCT && (
          <CTCard ct={nextCT} variant="compact" />
        )}
      </section>

      {/* 4. Desktop Upcoming CTs Section (Floating Glass Cards) */}
      <section className="hidden md:flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-sm text-lg font-extrabold text-[#0e2724] dark:text-[#f0faf8]">
              Upcoming Class Tests (CT Zone)
            </h2>
            <p className="text-xs text-[#33534d] dark:text-[#b0d2cc] font-medium">Exam countdowns, topic checklists, and previous year solutions.</p>
          </div>
          <Link
            to="/ct-zone"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All CTs</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {upcomingTests.slice(0, 3).map((ct) => (
            <CTCard key={ct.id} ct={ct} />
          ))}
        </div>
      </section>

      {/* 5. Quick Actions Bento Grid */}
      <QuickActions />

      {/* 6. Latest Resources List */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-border/60 pb-3 gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-lg font-extrabold text-[#0e2724] dark:text-[#f0faf8]">
              Latest Academic Resources
            </h2>
            <Link
              to="/notes"
              className="sm:hidden text-xs text-primary font-bold hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Filter Tabs Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategoryTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryTab(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white font-bold shadow-xs shadow-primary/25"
                      : "glass-panel text-[#2b4742] dark:text-[#c4dfda] hover:text-primary dark:hover:text-[#89f5e7] hover:bg-surface-container"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources list container */}
        <div className="flex flex-col gap-3">
          {filteredResources.length > 0 ? (
            filteredResources.map((res) => (
              <ResourceItem key={res.id} resource={res} />
            ))
          ) : (
            <GlassCard className="p-8 text-center text-[#425e59] dark:text-[#9fc0ba]">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline">search_off</span>
              <p className="font-semibold text-xs">No resources found matching your filter.</p>
              <button
                type="button"
                onClick={() => { setActiveCategoryTab("All"); }}
                className="mt-3 text-primary text-xs font-bold hover:underline"
              >
                Reset filters
              </button>
            </GlassCard>
          )}
        </div>
      </section>
    </main>
  );
};
