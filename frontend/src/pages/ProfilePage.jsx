import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { ResourceItem } from '../components/common/ResourceItem';
import { ProfileCard3D } from '../components/3d/ProfileCard3D';

export const ProfilePage = () => {
  const { user, resources } = useApp();

  const userName = user?.fullName || user?.full_name || user?.name || 'Kartik Sharma';
  const userRole = user?.role || 'CSE • 4th Semester (Section A)';
  const userHostel = user?.hostel ? `${user.hostel}${user.room_number ? ` • ${user.room_number}` : ''}` : 'Hostel 4 • B-204';
  const avatarUrl = user?.avatarUrl || user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';

  const stats = {
    notesShared: user?.stats?.notesShared ?? 14,
    downloads: user?.stats?.downloads ?? 186,
    studyHours: user?.stats?.studyHours ?? 42
  };

  const myUploads = resources.filter(res =>
    res.author?.toLowerCase().includes(userName.toLowerCase().split(' ')[0]) ||
    res.author?.includes("Kartik")
  );

  return (
    <main className="flex-1 max-w-container-max mx-auto w-full px-4 md:px-margin-page py-4 md:py-stack-lg flex flex-col gap-6">
      {/* Profile Header with Interactive 3D Scholar ID Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-surface-container-lowest border border-surface-border rounded-2xl p-6 md:p-8 shadow-card flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden"
      >
        <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20 p-1 bg-surface-container shrink-0 shadow-sm">
            <img
              src={avatarUrl}
              alt={userName}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex-1 text-center sm:text-left w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
                  {userName}
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  {userRole}
                </p>
                <p className="text-xs text-primary font-medium mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                  <span className="material-symbols-outlined text-[14px]">apartment</span>
                  <span>{userHostel}</span>
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary font-label-sm text-label-sm font-semibold rounded-full self-center sm:self-start">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Contributor</span>
              </span>
            </div>

            {/* Profile Academic Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-surface-border">
              <div className="text-center sm:text-left">
                <span className="block font-headline-md text-headline-md font-bold text-primary">
                  {stats.notesShared}
                </span>
                <span className="font-label-sm text-[12px] text-on-surface-variant">
                  Notes Uploaded
                </span>
              </div>
              <div className="text-center sm:text-left">
                <span className="block font-headline-md text-headline-md font-bold text-primary">
                  {stats.downloads}
                </span>
                <span className="font-label-sm text-[12px] text-on-surface-variant">
                  Total Downloads
                </span>
              </div>
              <div className="text-center sm:text-left">
                <span className="block font-headline-md text-headline-md font-bold text-primary">
                  {stats.studyHours}h
                </span>
                <span className="font-label-sm text-[12px] text-on-surface-variant">
                  Study Time
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Student ID Badge Scene */}
        <div className="w-full sm:w-64 h-52 shrink-0 flex flex-col items-center justify-center relative bg-gradient-to-b from-surface-container-low/40 to-surface-container-high/20 rounded-2xl border border-surface-border p-2">
          <ProfileCard3D user={user} className="w-full h-full" />
          <span className="text-[10px] text-on-surface-variant/70 font-medium -mt-2">
            Interactive 3D Scholar ID
          </span>
        </div>
      </motion.div>

      {/* Shared Materials Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            My Shared Materials ({myUploads.length})
          </h2>
          <span className="text-xs text-on-surface-variant font-medium">
            Community Verified Resources
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {myUploads.length > 0 ? (
            myUploads.map(res => (
              <ResourceItem key={res.id} resource={res} />
            ))
          ) : (
            <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-8 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 text-outline">upload_file</span>
              <p className="font-label-md text-label-md">You haven't uploaded any resources yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

