import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ResetPasswordPage = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(password);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
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
            Set new password
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1.5">
            Create a secure password for your account.
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-6 sm:p-8 shadow-xl">
          {isSuccess ? (
            <div className="text-center space-y-4 py-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">check_circle</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  Password updated!
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5">
                  Your password has been changed successfully. You can now sign in with your new credentials.
                </p>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-primary text-on-primary font-label-md font-bold py-2.5 px-4 rounded-xl hover:opacity-95 transition-all shadow-sm text-sm"
                >
                  Go to Sign In
                </button>
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
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1.5" htmlFor="new-password">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-3.5 pr-10 py-2.5 bg-surface border border-surface-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1.5" htmlFor="confirm-new-password">
                  Confirm New Password
                </label>
                <input
                  id="confirm-new-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 bg-surface border border-surface-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-on-surface-variant/60"
                />
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
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <span>Update Password</span>
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
