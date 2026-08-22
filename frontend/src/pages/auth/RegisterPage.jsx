import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    branch: 'Computer Science',
    year: 2,
    hostel: 'Hostel 4',
    room_number: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid college email.';
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must contain at least 8 characters.';
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match.';
    }

    if (!formData.room_number.trim()) {
      newErrors.room_number = 'Room number is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      await register({
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        branch: formData.branch,
        year: Number(formData.year),
        hostel: formData.hostel,
        room_number: formData.room_number.trim(),
      });
      navigate('/', { replace: true });
    } catch (err) {
      if (err.isNetworkError) {
        setGlobalError('Unable to connect. Please check your internet connection and try again.');
      } else {
        setGlobalError(err.message || 'Registration failed. Please verify your details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <Link to="/login" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-sm">
              H
            </div>
            <span className="font-headline-md text-2xl font-bold text-on-surface tracking-tight">
              HostelHub
            </span>
          </Link>
          <h1 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface">
            Create your HostelHub account
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1.5">
            Join your hostel's academic resource community.
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl">
          {globalError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-start gap-3 text-red-700 dark:text-red-300 text-sm animate-fade-in">
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-red-600">
                error
              </span>
              <span className="font-medium text-xs leading-relaxed">{globalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1.5" htmlFor="reg-name">
                  Full Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  name="full_name"
                  autoComplete="name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Kartik Sharma"
                  className={`w-full px-3.5 py-2.5 bg-surface border rounded-xl text-sm text-on-surface focus:outline-none transition-all ${
                    errors.full_name ? 'border-red-500 ring-1 ring-red-500' : 'border-surface-border focus:border-primary'
                  }`}
                />
                {errors.full_name && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.full_name}</p>}
              </div>

              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1.5" htmlFor="reg-email">
                  College Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@college.edu"
                  className={`w-full px-3.5 py-2.5 bg-surface border rounded-xl text-sm text-on-surface focus:outline-none transition-all ${
                    errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-surface-border focus:border-primary'
                  }`}
                />
                {errors.email ? (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.email}</p>
                ) : (
                  <p className="text-[11px] text-on-surface-variant mt-1 font-medium">Use your college email.</p>
                )}
              </div>
            </div>

            {/* Password & Confirm Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1.5" htmlFor="reg-password">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 8 characters"
                    className={`w-full px-3.5 pr-10 py-2.5 bg-surface border rounded-xl text-sm text-on-surface focus:outline-none transition-all ${
                      errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-surface-border focus:border-primary'
                    }`}
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
                {errors.password && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.password}</p>}
              </div>

              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1.5" htmlFor="reg-confirm-password">
                  Confirm Password
                </label>
                <input
                  id="reg-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  name="confirm_password"
                  autoComplete="new-password"
                  required
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`w-full px-3.5 py-2.5 bg-surface border rounded-xl text-sm text-on-surface focus:outline-none transition-all ${
                    errors.confirm_password ? 'border-red-500 ring-1 ring-red-500' : 'border-surface-border focus:border-primary'
                  }`}
                />
                {errors.confirm_password && (
                  <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.confirm_password}</p>
                )}
              </div>
            </div>

            {/* Branch & Year Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1.5">
                  Branch / Department
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-surface border border-surface-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="Computer Science">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                </select>
              </div>

              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1.5">
                  Academic Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-surface border border-surface-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>
            </div>

            {/* Hostel & Room Number Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1.5">
                  Hostel
                </label>
                <select
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-surface border border-surface-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="Hostel 1">Boys Hostel 1</option>
                  <option value="Hostel 2">Boys Hostel 2</option>
                  <option value="Hostel 3">Boys Hostel 3</option>
                  <option value="Hostel 4">Boys Hostel 4</option>
                  <option value="Girls Hostel 1">Girls Hostel 1</option>
                  <option value="Girls Hostel 2">Girls Hostel 2</option>
                </select>
              </div>

              <div>
                <label className="block font-label-md text-xs font-semibold text-on-surface mb-1.5" htmlFor="reg-room">
                  Room Number
                </label>
                <input
                  id="reg-room"
                  type="text"
                  name="room_number"
                  required
                  value={formData.room_number}
                  onChange={handleChange}
                  placeholder="e.g. B-204"
                  className={`w-full px-3.5 py-2.5 bg-surface border rounded-xl text-sm text-on-surface focus:outline-none transition-all ${
                    errors.room_number ? 'border-red-500 ring-1 ring-red-500' : 'border-surface-border focus:border-primary'
                  }`}
                />
                {errors.room_number && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.room_number}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-primary text-on-primary font-label-lg font-bold py-3 px-4 rounded-xl hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">
                    progress_activity
                  </span>
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Bottom Link to Sign In */}
          <div className="mt-6 pt-5 border-t border-surface-border text-center">
            <p className="text-xs text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
