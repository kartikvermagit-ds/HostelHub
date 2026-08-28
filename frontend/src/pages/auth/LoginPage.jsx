import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { HostelScene } from '../../components/3d/HostelScene';
import { GlassCard } from '../../components/ui';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your college email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password, rememberMe);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.isNetworkError) {
        setErrorMessage('Unable to connect. Please check your internet connection and try again.');
      } else {
        setErrorMessage(err.message || 'Incorrect email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 relative selection:bg-primary/20 selection:text-primary">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Desktop Branding & 3D Architectural Scene */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="hidden lg:flex lg:col-span-6 flex-col justify-between pr-6 space-y-6"
        >
          <div>
            {/* Brand Logo Header with Official 3D Mark */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center shadow-sm overflow-hidden p-1 border border-white/70 dark:border-primary-fixed/20">
                <img
                  src="/logo-icon.png"
                  alt="HostelHub Logo"
                  className="w-full h-full object-contain rounded-xl drop-shadow-sm"
                />
              </div>
              <div>
                <span className="font-headline-md text-2xl font-extrabold text-[#0e2724] dark:text-[#f0faf8] tracking-tight block">
                  HostelHub
                </span>
                <span className="text-xs text-primary font-bold">
                  Academic Digital Twin • Live • Learn • Grow
                </span>
              </div>
            </div>

            <h1 className="font-headline-lg text-3xl font-extrabold text-[#0e2724] dark:text-[#f0faf8] leading-tight tracking-tight mb-2">
              Everything your hostel needs to prepare better.
            </h1>
            <p className="text-sm text-[#35544e] dark:text-[#a6cdc7] leading-relaxed font-medium">
              Access verified lecture notes, previous year solved papers, and class test checklists curated by your hostel community.
            </p>
          </div>

          {/* Interactive 3D Hostel Spatial Canvas */}
          <div className="w-full h-48 rounded-3xl glass-panel border border-white/70 dark:border-primary-fixed/20 overflow-hidden relative shadow-inner">
            <HostelScene className="w-full h-full" />
            <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] text-[#2b4742] dark:text-[#c4dfda] font-bold glass-panel-strong px-2.5 py-0.5 rounded-full border border-white/60 dark:border-primary-fixed/30 shadow-2xs">
              Interactive 3D Study Space
            </div>
          </div>

          {/* Minimal Feature Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 p-3.5 glass-panel rounded-2xl border border-white/70 dark:border-primary-fixed/15 hover:border-primary/30 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">description</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0e2724] dark:text-[#f0faf8]">Share Notes & PDFs</h4>
                <p className="text-[11px] text-[#45635e] dark:text-[#a2c5bf] font-medium">Class summaries, handwritten formulas, and teacher notes.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 glass-panel rounded-2xl border border-white/70 dark:border-primary-fixed/15 hover:border-primary/30 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-secondary-container/80 text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">assignment</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0e2724] dark:text-[#f0faf8]">Prepare for CTs</h4>
                <p className="text-[11px] text-[#45635e] dark:text-[#a2c5bf] font-medium">Exam countdowns, topic checklists, and previous year papers.</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#45635e] dark:text-[#a2c5bf] flex items-center gap-2 pt-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active academic digital twin repository</span>
          </div>
        </motion.div>

        {/* Right Column: Floating Glass Authentication Card */}
        <div className="w-full lg:col-span-6 flex flex-col justify-center">
          <GlassCard className="p-6 sm:p-8 md:p-10 shadow-2xl max-w-md w-full mx-auto border-white/80 dark:border-primary-fixed/25">
            
            {/* Mobile Header Logo */}
            <div className="flex lg:hidden items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-2xl glass-panel flex items-center justify-center shadow-sm overflow-hidden p-1 border border-white/60 dark:border-primary-fixed/20">
                <img
                  src="/logo-icon.png"
                  alt="HostelHub Logo"
                  className="w-full h-full object-contain rounded-lg drop-shadow-sm"
                />
              </div>
              <div>
                <span className="font-headline-sm text-xl font-extrabold text-[#0e2724] dark:text-[#f0faf8] tracking-tight block">
                  HostelHub
                </span>
                <span className="text-[11px] text-primary font-bold">
                  Academic Digital Twin
                </span>
              </div>
            </div>

            {/* Card Titles */}
            <div className="mb-6">
              <h2 className="font-headline-md text-2xl font-extrabold text-[#0e2724] dark:text-[#f0faf8]">
                Welcome back 👋
              </h2>
              <p className="text-xs text-[#35544e] dark:text-[#a6cdc7] mt-1 font-medium">
                Sign in to continue to your hostel's academic workspace
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-600 dark:text-red-400 text-xs animate-fade-in">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                  error
                </span>
                <span className="font-medium leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-[#0e2724] dark:text-[#f0faf8] mb-1.5" htmlFor="login-email">
                  College Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#45635e] dark:text-[#a2c5bf] text-[19px]">
                    mail
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your college email"
                    className="w-full pl-10 pr-4 py-2.5 glass-panel rounded-xl text-xs sm:text-sm text-[#0e2724] dark:text-[#f0faf8] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#6a8b85] dark:placeholder:text-[#7ba19b] font-medium"
                  />
                </div>
                <p className="text-[10px] text-[#45635e] dark:text-[#a2c5bf] mt-1 font-medium">
                  Use your student college ID to access resources.
                </p>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-[#0e2724] dark:text-[#f0faf8]" htmlFor="login-password">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline font-bold"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#45635e] dark:text-[#a2c5bf] text-[19px]">
                    lock
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-2.5 glass-panel rounded-xl text-xs sm:text-sm text-[#0e2724] dark:text-[#f0faf8] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-[#6a8b85] dark:placeholder:text-[#7ba19b] font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#45635e] dark:text-[#a2c5bf] hover:text-primary p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-primary border-surface-border focus:ring-primary accent-primary cursor-pointer"
                />
                <label htmlFor="remember-me" className="text-xs text-[#35544e] dark:text-[#a6cdc7] font-medium cursor-pointer select-none">
                  Remember me on this device
                </label>
              </div>

              {/* Primary Solid Teal Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">
                      progress_activity
                    </span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In to Digital Hub</span>
                )}
              </button>
            </form>

            {/* Bottom Link to Register */}
            <div className="mt-6 pt-5 border-t border-surface-border/50 text-center">
              <p className="text-xs text-[#35544e] dark:text-[#a6cdc7] font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

          </GlassCard>
        </div>

      </div>
    </div>
  );
};
