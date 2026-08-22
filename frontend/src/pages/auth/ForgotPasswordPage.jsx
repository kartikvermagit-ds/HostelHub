import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your college email.');
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email.trim());
      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/login" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-sm">
              H
            </div>
            <span className="font-headline-md text-2xl font-bold text-on-surface tracking-tight">
              HostelHub
            </span>
          </Link>
          <h1 className="font-headline-lg text-2xl font-extrabold text-on-surface">
            Reset your password
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1.5">
            Enter your college email and we'll send you a password reset link.
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-6 sm:p-8 shadow-xl">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">mark_email_read</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  Check your email
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  We've sent a password reset link to <span className="font-bold text-on-surface">{email}</span> if an account exists.
                </p>
              </div>
              <div className="pt-3">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full bg-primary text-on-primary font-label-md font-bold py-2.5 px-4 rounded-xl hover:opacity-95 transition-all shadow-sm text-sm"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1.5" htmlFor="reset-email">
                  College Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    mail
                  </span>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your college email"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface border border-surface-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-primary text-on-primary font-label-lg font-bold py-3 px-4 rounded-xl hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">
                      progress_activity
                    </span>
                    <span>Sending reset link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              <div className="pt-3 text-center">
                <Link to="/login" className="text-xs text-primary font-bold hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
