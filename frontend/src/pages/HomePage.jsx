import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { HeroSection } from '../components/home/HeroSection';
import { CTCard } from '../components/common/CTCard';
import { QuickActions } from '../components/common/QuickActions';
import { ResourceItem } from '../components/common/ResourceItem';
import { GlassCard } from '../components/ui';

export const HomePage = () => {
  const { resources, upcomingTests, searchQuery, activeCategoryTab, setActiveCategoryTab } = useApp();

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

  return (
    <main className="flex-1 max-w-[1680px] mx-auto w-full px-4 sm:px-8 lg:px-12 py-2 flex flex-col gap-8 md:gap-12">
      {/* 1. Spatial 3D Digital Twin Hero (The Star) */}
      <HeroSection />

      {/* 2. Upcoming Class Tests (CT Zone) */}
      <motion.section
        id="upcoming-cts-section"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 pt-4 border-t border-surface-border/50 scroll-mt-20"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full glass-panel text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>TEST COUNTDOWNS & PREP</span>
            </div>
            <h2 className="font-headline-sm text-lg sm:text-xl font-extrabold text-[#0e2724] dark:text-[#f0faf8]">
              Upcoming Class Tests (CT Zone)
            </h2>
            <p className="text-xs text-[#33534d] dark:text-[#b0d2cc] font-medium">
              Exam countdowns, topic checklists, and previous year solutions.
            </p>
          </div>
          <Link
            to="/ct-zone"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All CTs</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {upcomingTests.slice(0, 3).map((ct) => (
            <CTCard key={ct.id} ct={ct} />
          ))}
        </div>
      </motion.section>

      {/* 3. Quick Actions Bento Grid */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <QuickActions />
      </motion.section>

      {/* 4. Latest Academic Resources List */}
      <motion.section
        id="academic-resources-section"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 scroll-mt-20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-border/60 pb-3 gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline-sm text-lg sm:text-xl font-extrabold text-[#0e2724] dark:text-[#f0faf8]">
                Latest Academic Resources
              </h2>
              <p className="text-xs text-[#33534d] dark:text-[#b0d2cc] font-medium">
                Verified lecture notes, past exam papers, and recorded tutorials.
              </p>
            </div>
            <Link
              to="/notes"
              className="sm:hidden text-xs text-primary font-bold hover:underline"
            >
              View All
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = activeCategoryTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryTab(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary text-white font-bold shadow-xs shadow-primary/25"
                      : "glass-panel text-[#2b4742] dark:text-[#c4dfda] hover:text-primary dark:hover:text-[#89f5e7] hover:bg-white/50 dark:hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources list */}
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
                className="mt-3 text-primary text-xs font-bold hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </GlassCard>
          )}
        </div>
      </motion.section>
    </main>
  );
};

