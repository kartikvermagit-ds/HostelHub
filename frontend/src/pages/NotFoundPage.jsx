import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Building2,
  Compass,
  MapPin,
  Sparkles,
  Layers,
  Search,
  Moon,
  Sun,
  BookOpen,
  FileText,
  Video,
  GraduationCap,
  ExternalLink,
  Mail,
  Home as HomeIcon,
  Box
} from 'lucide-react';
import { useHostelStore } from '../stores/hostelStore';
import { NotFoundSpatialBackground } from '../components/3d/NotFoundSpatialBackground';
import { CursorScrubVideo } from '../components/ui/CursorScrubVideo';

/**
 * HostelHub Premium 404 / Lost In The Digital Twin Experience
 * 
 * Cinematic spatial computing interface for unmapped rooms & missing routes.
 */
export const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCurrentHostel, resetView, setSelectedRoomId } = useHostelStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync theme with document class
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

  // Retrieve current active hostel context
  const currentHostel = getCurrentHostel();
  const hostelName = currentHostel?.name || 'Aryabhata Hostel';
  const totalFloors = currentHostel?.floors?.length || 4;
  
  // Extract path and identify any potential room query/subpath
  const currentPath = location.pathname;
  const pathSegments = currentPath.split('/').filter(Boolean);
  const attemptedRoomOrPath = pathSegments.length > 0
    ? pathSegments[pathSegments.length - 1]
    : 'Unknown';

  const handleReturnToHostel = () => {
    setSelectedRoomId(null);
    navigate('/');
  };

  const handleExplore3DHostel = () => {
    setSelectedRoomId(null);
    resetView();
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('hostel-3d-stage');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Notes', to: '/notes' },
    { label: 'CT Zone', to: '/ct-zone' },
    { label: 'PYQs', to: '/pyqs' },
    { label: 'Videos', to: '/videos' },
    { label: '3D Hostel', to: '/#hostel-3d-stage', is3D: true },
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-[#071d19] text-[#e8f7f4] font-sans selection:bg-[#89f5e7]/30 selection:text-[#89f5e7]">
      {/* =================================================== */}
      {/* 1. CINEMATIC BACKGROUND & ATMOSPHERIC LIGHTING      */}
      {/* =================================================== */}
      {/* Radial Atmospheric Lighting Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Top Center Teal Glow */}
        <div
          className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full blur-[140px] opacity-45 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(137,245,231,0.25) 0%, rgba(0,104,95,0.20) 50%, transparent 80%)'
          }}
        />

        {/* Ambient Left Emerald Hue */}
        <div
          className="absolute top-[40%] -left-[10%] w-[500px] h-[500px] rounded-full blur-[160px] opacity-35 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,104,95,0.3) 0%, transparent 70%)'
          }}
        />

        {/* Ambient Right Cyan Hue */}
        <div
          className="absolute top-[30%] -right-[10%] w-[550px] h-[550px] rounded-full blur-[160px] opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(137,245,231,0.2) 0%, transparent 70%)'
          }}
        />

        {/* Architectural Subtle Spatial Grid Overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(137,245,231,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(137,245,231,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(circle at 50% 45%, black 30%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 45%, black 30%, transparent 85%)'
          }}
        />
      </div>

      {/* Cursor Scrub Video Background (tt.mp4) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 mix-blend-screen filter saturate-150 contrast-125">
        <CursorScrubVideo
          videoFile="/tt.mp4"
          axis="horizontal"
          trackingArea="window"
          smoothing={0.18}
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* 3D Digital Twin Abstract Stage in Background */}
      <NotFoundSpatialBackground />

      {/* Dark Atmospheric Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08201C]/70 via-[#0a2822]/50 to-[#071d19]/90 pointer-events-none z-0" />

      {/* =================================================== */}
      {/* 2. FLOATING GLASSMORPHIC NAVIGATION BAR             */}
      {/* =================================================== */}
      <header className="relative z-30 w-full px-4 sm:px-6 md:px-12 lg:px-16 pt-5 pb-3">
        <nav
          className="max-w-6xl mx-auto rounded-2xl md:rounded-full px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(18px) saturate(140%)',
            WebkitBackdropFilter: 'blur(18px) saturate(140%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 12px 40px rgba(0, 0, 0, 0.18)',
          }}
          aria-label="404 Page Navigation"
        >
          {/* LEFT: Brand Logo & Title */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#89f5e7] rounded-xl"
          >
            {/* Minimal "H" Logo Badge */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-white text-base shadow-sm border border-white/20 group-hover:scale-105 transition-transform"
              style={{
                background: 'linear-gradient(135deg, #008378 0%, #00685f 100%)',
                boxShadow: '0 0 18px rgba(0, 104, 95, 0.45)',
              }}
            >
              H
            </div>
            <div className="flex flex-col text-left">
              <span className="font-headline-md text-base sm:text-lg font-bold text-white tracking-tight leading-none group-hover:text-[#89f5e7] transition-colors">
                HostelHub
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#89f5e7]/80 font-medium tracking-wide uppercase leading-tight mt-0.5">
                Academic Digital Twin
              </span>
            </div>
          </Link>

          {/* CENTER: Desktop Navigation Links (Visible from lg) */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              if (link.is3D) {
                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={handleExplore3DHostel}
                    className="text-sm font-medium text-white/75 hover:text-white transition-colors duration-200 flex items-center gap-1.5 focus:outline-none focus-visible:text-white"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#89f5e7] animate-pulse" />
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm font-medium text-white/75 hover:text-white transition-colors duration-200 focus:outline-none focus-visible:text-white"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: Actions (Theme switch + Explore CTA + Mobile Hamburger) */}
          <div className="flex items-center gap-3">
            {/* Theme Atmosphere Switcher */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 border border-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#89f5e7]"
              title={isDarkMode ? 'Switch to daylight atmosphere' : 'Switch to cinematic night atmosphere'}
              aria-label="Toggle Theme Mode"
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Glass Teal Primary CTA: EXPLORE HOSTEL */}
            <button
              type="button"
              onClick={handleExplore3DHostel}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-xs text-white tracking-wide uppercase transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#89f5e7]"
              style={{
                background: '#00685f',
                boxShadow: '0 0 24px rgba(0, 104, 95, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(137, 245, 231, 0.3)',
              }}
            >
              <span>EXPLORE HOSTEL</span>
              <ArrowRight size={14} className="text-[#89f5e7]" />
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-white/90 hover:text-white hover:bg-white/10 border border-white/15 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#89f5e7]"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              <motion.div
                key={mobileMenuOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </button>
          </div>
        </nav>
      </header>

      {/* =================================================== */}
      {/* 3. MOBILE FULL-SCREEN GLASS MENU OVERLAY           */}
      {/* =================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden flex flex-col justify-between p-6 bg-[#071d19]/90 backdrop-blur-2xl"
          >
            {/* Header in overlay */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00685f] flex items-center justify-center text-white font-bold text-sm shadow-sm border border-white/20">
                  H
                </div>
                <span className="font-headline-md font-bold text-lg text-white">
                  HostelHub
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#89f5e7]"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Staggered Navigation Items */}
            <nav className="flex flex-col gap-3 my-auto py-6">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, delay: 0.2 + idx * 0.05 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (link.is3D) {
                        handleExplore3DHostel();
                      } else {
                        navigate(link.to);
                      }
                    }}
                    className="w-full text-left px-5 py-3 rounded-xl flex items-center justify-between text-base font-semibold text-white/90 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all"
                  >
                    <span>{link.label}</span>
                    <ArrowRight size={16} className="text-[#89f5e7]" />
                  </button>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="pt-4 border-t border-white/10 space-y-3"
            >
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleExplore3DHostel();
                }}
                className="w-full py-3.5 rounded-full flex items-center justify-center gap-2 text-white font-bold text-sm uppercase tracking-wider shadow-lg"
                style={{
                  background: '#00685f',
                  boxShadow: '0 0 28px rgba(0, 104, 95, 0.5)',
                  border: '1px solid rgba(137, 245, 231, 0.4)',
                }}
              >
                <span>EXPLORE HOSTEL</span>
                <ArrowRight size={16} className="text-[#89f5e7]" />
              </button>
              <p className="text-center text-xs text-white/50">
                Your Hostel's Academic Digital Twin
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =================================================== */}
      {/* 4. HERO SECTION / 404 SPATIAL COMPOSITION           */}
      {/* =================================================== */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-8 py-10 md:py-16 max-w-5xl mx-auto w-full">
        {/* Floating Top Pill Label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-wider uppercase text-[#89f5e7]"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(137, 245, 231, 0.25)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#89f5e7] animate-ping" />
          <span>LOCATION NOT FOUND</span>
        </motion.div>

        {/* Elegant Headline Message */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-2xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-tight max-w-3xl"
        >
          This room seems to have
          <span className="block font-normal text-white/90 mt-1">
            slipped off the map.
          </span>
        </motion.h1>

        {/* Giant Centered 404 Typography with Ambient Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="my-3 sm:my-5 relative select-none"
        >
          <span
            className="font-headline-lg font-black tracking-tighter leading-none text-white block text-[90px] sm:text-[130px] md:text-[180px] lg:text-[230px] xl:text-[260px]"
            style={{
              textShadow: `
                0 0 70px rgba(255, 255, 255, 0.18),
                0 0 140px rgba(0, 104, 95, 0.35),
                0 0 200px rgba(137, 245, 231, 0.2)
              `
            }}
          >
            404
          </span>
        </motion.div>

        {/* Digital Twin Error Detail Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-md mx-auto rounded-2xl p-5 mb-8 text-left transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(18px) saturate(140%)',
            WebkitBackdropFilter: 'blur(18px) saturate(140%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 12px 40px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Top Reflection Highlight */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#89f5e7]" />
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                ROOM NOT FOUND
              </span>
            </div>
            <span className="text-[11px] font-mono font-medium text-[#89f5e7]/90 px-2 py-0.5 rounded-md bg-[#00685f]/30 border border-[#89f5e7]/20">
              {currentPath}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
            The spatial coordinates or room path you are searching for do not exist in the active hostel digital twin layout.
          </p>

          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-white/40 block uppercase tracking-wider text-[9px] font-semibold">Active Hostel</span>
              <span className="text-white/90 font-medium">{hostelName}</span>
            </div>
            <div>
              <span className="text-white/40 block uppercase tracking-wider text-[9px] font-semibold">Floors Monitored</span>
              <span className="text-white/90 font-medium">{totalFloors} Floors Available</span>
            </div>
          </div>
        </motion.div>

        {/* Primary & Secondary Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto"
        >
          {/* Primary CTA: RETURN TO HOSTEL */}
          <button
            type="button"
            onClick={handleReturnToHostel}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#89f5e7] group"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#00685f';
              e.currentTarget.style.borderColor = 'rgba(137, 245, 231, 0.5)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 104, 95, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            }}
          >
            <ArrowLeft size={16} className="text-[#89f5e7] group-hover:-translate-x-1 transition-transform duration-200" />
            <span>RETURN TO HOSTEL</span>
          </button>

          {/* Secondary CTA: EXPLORE 3D HOSTEL */}
          <button
            type="button"
            onClick={handleExplore3DHostel}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white/80 hover:text-white transition-all duration-200 hover:bg-white/10 border border-white/10 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#89f5e7]"
          >
            <Building2 size={16} className="text-[#89f5e7]" />
            <span>Explore 3D Hostel</span>
            <ArrowRight size={14} className="opacity-70" />
          </button>
        </motion.div>
      </main>

      {/* =================================================== */}
      {/* 5. SIX-COLUMN SPATIAL FOOTER                        */}
      {/* =================================================== */}
      <footer
        className="relative z-10 w-full px-5 sm:px-8 md:px-12 lg:px-16 pt-10 sm:pt-14 pb-8 mt-auto border-t border-white/10"
        style={{
          background: 'rgba(4, 18, 15, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Responsive 6-column Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
            {/* COLUMN 1: HOSTELHUB */}
            <div>
              <h3 className="text-white text-xs font-semibold tracking-[0.15em] uppercase mb-4">
                HOSTELHUB
              </h3>
              <ul className="space-y-2.5 text-xs text-white/45">
                <li>
                  <Link to="/" className="hover:text-white/90 transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white/90 transition-colors duration-200">
                    About HostelHub
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleExplore3DHostel}
                    className="hover:text-white/90 transition-colors duration-200 text-left"
                  >
                    3D Digital Twin
                  </button>
                </li>
                <li>
                  <Link to="/admin" className="hover:text-white/90 transition-colors duration-200">
                    Hostel Builder
                  </Link>
                </li>
                <li>
                  <Link to="/discussions" className="hover:text-white/90 transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 2: ACADEMICS */}
            <div>
              <h3 className="text-white text-xs font-semibold tracking-[0.15em] uppercase mb-4">
                ACADEMICS
              </h3>
              <ul className="space-y-2.5 text-xs text-white/45">
                <li>
                  <Link to="/notes" className="hover:text-white/90 transition-colors duration-200">
                    Notes
                  </Link>
                </li>
                <li>
                  <Link to="/ct-zone" className="hover:text-white/90 transition-colors duration-200">
                    CT Zone
                  </Link>
                </li>
                <li>
                  <Link to="/pyqs" className="hover:text-white/90 transition-colors duration-200">
                    PYQs
                  </Link>
                </li>
                <li>
                  <Link to="/notes" className="hover:text-white/90 transition-colors duration-200">
                    Study Resources
                  </Link>
                </li>
                <li>
                  <Link to="/videos" className="hover:text-white/90 transition-colors duration-200">
                    Videos
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: HOSTEL */}
            <div>
              <h3 className="text-white text-xs font-semibold tracking-[0.15em] uppercase mb-4">
                HOSTEL
              </h3>
              <ul className="space-y-2.5 text-xs text-white/45">
                <li>
                  <button
                    type="button"
                    onClick={handleExplore3DHostel}
                    className="hover:text-white/90 transition-colors duration-200 text-left"
                  >
                    Rooms
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleExplore3DHostel}
                    className="hover:text-white/90 transition-colors duration-200 text-left"
                  >
                    Floors
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleExplore3DHostel}
                    className="hover:text-white/90 transition-colors duration-200 text-left"
                  >
                    Central Study Area
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleExplore3DHostel}
                    className="hover:text-white/90 transition-colors duration-200 text-left"
                  >
                    Room Explorer
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleExplore3DHostel}
                    className="hover:text-white/90 transition-colors duration-200 text-left"
                  >
                    Hostel Map
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 4: COMMUNITY */}
            <div>
              <h3 className="text-white text-xs font-semibold tracking-[0.15em] uppercase mb-4">
                COMMUNITY
              </h3>
              <ul className="space-y-2.5 text-xs text-white/45">
                <li>
                  <Link to="/discussions" className="hover:text-white/90 transition-colors duration-200">
                    Discussions
                  </Link>
                </li>
                <li>
                  <Link to="/announcements" className="hover:text-white/90 transition-colors duration-200">
                    Announcements
                  </Link>
                </li>
                <li>
                  <Link to="/saved" className="hover:text-white/90 transition-colors duration-200">
                    Saved
                  </Link>
                </li>
                <li>
                  <Link to="/my-uploads" className="hover:text-white/90 transition-colors duration-200">
                    My Uploads
                  </Link>
                </li>
                <li>
                  <Link to="/discussions" className="hover:text-white/90 transition-colors duration-200">
                    Student Hub
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 5: TOOLS */}
            <div>
              <h3 className="text-white text-xs font-semibold tracking-[0.15em] uppercase mb-4">
                TOOLS
              </h3>
              <ul className="space-y-2.5 text-xs text-white/45">
                <li>
                  <Link to="/notes" className="hover:text-white/90 transition-colors duration-200">
                    Search
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleExplore3DHostel}
                    className="hover:text-white/90 transition-colors duration-200 text-left"
                  >
                    Room Search
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleExplore3DHostel}
                    className="hover:text-white/90 transition-colors duration-200 text-left"
                  >
                    3D View
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="hover:text-white/90 transition-colors duration-200 text-left flex items-center gap-1"
                  >
                    <span>{isDarkMode ? 'Day Mode' : 'Night Mode'}</span>
                  </button>
                </li>
                <li>
                  <Link to="/settings" className="hover:text-white/90 transition-colors duration-200">
                    Settings
                  </Link>
                </li>
              </ul>
            </div>

            {/* COLUMN 6: CONNECT */}
            <div>
              <h3 className="text-white text-xs font-semibold tracking-[0.15em] uppercase mb-4">
                CONNECT
              </h3>
              <ul className="space-y-2.5 text-xs text-white/45">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/90 transition-colors duration-200 flex items-center gap-1.5"
                    aria-label="GitHub Repository"
                  >
                    <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/90 transition-colors duration-200 flex items-center gap-1.5"
                    aria-label="LinkedIn Page"
                  >
                    <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <Link to="/discussions" className="hover:text-white/90 transition-colors duration-200 flex items-center gap-1.5">
                    <Mail size={13} />
                    <span>Contact</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Brand Message & Copyright */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-white/40">
            <p className="font-medium text-white/60">
              HostelHub — Your Hostel's Academic Digital Twin.
            </p>
            <p className="tracking-wide">
              Explore. Learn. Connect.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFoundPage;
