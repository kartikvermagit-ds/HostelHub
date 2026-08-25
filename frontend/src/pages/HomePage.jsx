import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CTCard } from '../components/common/CTCard';
import { QuickActions } from '../components/common/QuickActions';
import { ResourceItem } from '../components/common/ResourceItem';
import { FloatingBooks } from '../components/3d/FloatingBooks';

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

  return (
    <main className="flex-1 max-w-container-max mx-auto w-full px-4 md:px-margin-page py-4 md:py-stack-lg flex flex-col gap-6 md:gap-stack-lg">
      {/* Welcome Section with Subtle 3D Floating Books Element */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-surface-container-lowest border border-surface-border rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden relative"
      >
        <div className="flex-1 flex flex-col gap-2 z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hostel Academic Space</span>
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
            Good morning, {user.full_name ? user.full_name.split(' ')[0] : user.name || 'Kartik'} 👋
          </h1>
          <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-xl">
            Everything your hostel needs to prepare better. Search notes, prepare for CTs, and access past papers.
          </p>
        </div>

        {/* 3D Floating Study Element */}
        <div className="w-full md:w-64 h-36 md:h-44 shrink-0 flex items-center justify-center relative">
          <FloatingBooks className="w-full h-full" />
        </div>
      </motion.section>

      {/* Mobile-Only: Next CT Compact Card */}
      <section className="md:hidden">
        {nextCT && (
          <CTCard ct={nextCT} variant="compact" />
        )}
      </section>

      {/* Desktop Upcoming CTs Section */}
      <section className="hidden md:flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            Upcoming CTs
          </h2>
          <Link
            to="/ct-zone"
            className="font-label-md text-label-md text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {upcomingTests.slice(0, 3).map((ct) => (
            <CTCard key={ct.id} ct={ct} />
          ))}
        </div>
      </section>

      {/* Quick Actions Bento Grid */}
      <QuickActions />

      {/* Latest Resources List */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-border pb-3 gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Latest Resources
            </h2>
            <Link
              to="/notes"
              className="sm:hidden font-label-sm text-label-sm text-primary font-semibold"
            >
              View All
            </Link>
          </div>

          {/* Filter Tabs (Horizontal scrollable on mobile) */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryTab(cat)}
                className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all ${
                  activeCategoryTab === cat
                    ? "bg-surface-container-highest text-on-surface font-bold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources list container */}
        <div className="flex flex-col gap-3">
          {filteredResources.length > 0 ? (
            filteredResources.map((res) => (
              <ResourceItem key={res.id} resource={res} />
            ))
          ) : (
            <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-8 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline">search_off</span>
              <p className="font-label-md text-label-md">No resources found matching your filter.</p>
              <button
                onClick={() => { setActiveCategoryTab("All"); }}
                className="mt-3 text-primary text-label-sm font-semibold hover:underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
