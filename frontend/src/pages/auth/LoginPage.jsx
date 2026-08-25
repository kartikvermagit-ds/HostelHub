import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { HostelScene } from '../../components/3d/HostelScene';
import { Logo3D } from '../../components/3d/Logo3D';

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
    <div className="min-h-screen bg-surface flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Desktop Branding & 3D Hostel Experience (Hidden on Mobile/Tablet) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="hidden lg:flex lg:col-span-6 flex-col justify-between pr-6 space-y-6"
        >
          <div>
            {/* Brand Logo Header with 3D Logo */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm overflow-hidden">
                <Logo3D className="w-11 h-11" scale={0.9} />
              </div>
              <div>
                <span className="font-headline-md text-2xl font-bold text-on-surface tracking-tight block">
                  HostelHub
                </span>
                <span className="text-xs text-on-surface-variant font-medium">
                  Your Hostel's Study Hub
                </span>
              </div>
            </div>

            <h1 className="font-headline-lg text-3xl font-extrabold text-on-surface leading-tight tracking-tight mb-2">
              Everything your hostel needs to prepare better.
            </h1>
            <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
              Access verified lecture notes, previous year solved papers, and class test checklists curated by your hostel community.
            </p>
          </div>

          {/* Interactive 3D Hostel Scene */}
          <div className="w-full h-48 rounded-2xl bg-gradient-to-b from-surface-container-low/50 to-surface-container-highest/30 border border-surface-border overflow-hidden relative shadow-inner">
            <HostelScene className="w-full h-full" />
            <div className="absolute bottom-2 right-3 pointer-events-none text-[10px] text-on-surface-variant/60 font-medium bg-surface/80 px-2 py-0.5 rounded-full backdrop-blur-xs">
              Interactive 3D Study Space
            </div>
          </div>

          {/* 3 Minimal Benefit Cards */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-surface-border academic-shadow hover:border-primary/30 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">description</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface">Share Notes & PDFs</h4>
                <p className="text-[11px] text-on-surface-variant">Class summaries, handwritten formulas, and teacher notes.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-surface-container-lowest rounded-xl border border-surface-border academic-shadow hover:border-primary/30 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">assignment</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-on-surface">Prepare for CTs</h4>
                <p className="text-[11px] text-on-surface-variant">Exam countdowns, topic checklists, and previous year papers.</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-on-surface-variant flex items-center gap-2 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Active academic repository for hostel students</span>
          </div>
        </motion.div>

        {/* Right Column: Authentication Card (Mobile & Desktop) */}
        <div className="w-full lg:col-span-6 flex flex-col justify-center">
          <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl max-w-md w-full mx-auto">
            
            {/* Mobile Header Logo */}
            <div className="flex lg:hidden items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-sm">
                H
              </div>
              <div>
                <span className="font-headline-sm text-xl font-bold text-on-surface tracking-tight block">
                  HostelHub
                </span>
                <span className="text-[11px] text-on-surface-variant font-medium">
                  Your Hostel's Study Hub
                </span>
              </div>
            </div>

            {/* Card Titles */}
            <div className="mb-6">
              <h2 className="font-headline-md text-2xl font-bold text-on-surface">
                Welcome back 👋
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant mt-1">
                Sign in to continue to HostelHub
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-sm animate-fade-in">
                <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-red-600">
                  error
                </span>
                <span className="font-medium text-xs leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1.5" htmlFor="login-email">
                  College Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-surface border border-surface-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/60"
                  />
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1 font-medium">
                  Use your college email to access HostelHub.
                </p>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block font-label-md text-xs font-semibold text-on-surface" htmlFor="login-password">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="font-label-sm text-xs text-primary hover:underline font-semibold"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
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
                    className="w-full pl-10 pr-11 py-2.5 bg-surface border border-surface-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-[19px]">
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
                <label htmlFor="remember-me" className="text-xs text-on-surface-variant font-medium cursor-pointer">
                  Remember me on this device
                </label>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-primary text-on-primary font-label-lg font-bold py-3 px-4 rounded-xl hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">
                      progress_activity
                    </span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Bottom Link to Register */}
            <div className="mt-6 pt-5 border-t border-surface-border text-center">
              <p className="text-xs text-on-surface-variant">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
