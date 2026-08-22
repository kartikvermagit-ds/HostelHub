import React from 'react';
import { useApp } from '../context/AppContext';
import { ResourceItem } from '../components/common/ResourceItem';

export const GenericLibraryPage = ({ type, title, subtitle, icon }) => {
  const { resources, user } = useApp();

  let filtered = resources;
  if (type === 'pyqs') {
    filtered = resources.filter(r => r.title.toLowerCase().includes('pyq') || r.type === 'PYQ');
  } else if (type === 'videos') {
    filtered = resources.filter(r => r.type === 'VID' || r.type?.toLowerCase().includes('video'));
  } else if (type === 'my-uploads') {
    filtered = resources.filter(r => r.author.includes(user.name) || r.author.includes('Kartik'));
  }

  return (
    <main className="flex-1 max-w-container-max mx-auto w-full px-4 md:px-margin-page py-4 md:py-stack-lg flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-[24px]">{icon || 'folder'}</span>
        </div>
        <div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            {title}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {subtitle}
          </p>
        </div>
      </div>

      {type === 'discussions' ? (
        <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-6 md:p-8 space-y-4 shadow-card">
          <div className="flex justify-between items-center pb-4 border-b border-surface-border">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Active Hostel Discussions</h2>
            <button className="bg-primary text-on-primary font-label-sm text-label-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
              + New Discussion
            </button>
          </div>
          <div className="space-y-3">
            {[
              { title: "Best YouTube channels for Computer Networks Unit 3?", author: "Aryan M.", replies: 12, time: "30 mins ago" },
              { title: "Doubts in COA Booth's Algorithm step 4", author: "Sneha R.", replies: 8, time: "2 hours ago" },
              { title: "Who has previous semester DSA lab test solutions?", author: "Kartik S.", replies: 15, time: "5 hours ago" },
            ].map((disc, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-surface-border hover:bg-surface-container-low transition-colors flex justify-between items-center cursor-pointer">
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface font-semibold hover:text-primary transition-colors">{disc.title}</h3>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Started by {disc.author} • {disc.time}</p>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm bg-surface-container px-3 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>{disc.replies}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : type === 'announcements' ? (
        <div className="space-y-4">
          {[
            { title: "CT 1 Datesheet Announced for Semester 4", date: "Aug 22, 2026", body: "Class tests will commence from next Monday at 10:00 AM. Check the CT Zone for individual subject schedules." },
            { title: "Hostel 4 Study Room High-Speed WiFi Upgraded", date: "Aug 20, 2026", body: "The 2nd floor library study hub now has 500Mbps dual-band access. Please keep study spaces tidy." }
          ].map((ann, idx) => (
            <div key={idx} className="bg-surface-container-lowest border border-surface-border rounded-2xl p-6 shadow-card">
              <div className="flex justify-between items-center mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-[11px] font-semibold">Official Notice</span>
                <span className="font-body-sm text-[12px] text-on-surface-variant">{ann.date}</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-bold">{ann.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">{ann.body}</p>
            </div>
          ))}
        </div>
      ) : type === 'settings' ? (
        <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-6 md:p-8 space-y-6 shadow-card max-w-2xl">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Preferences & Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-surface-border">
              <div>
                <p className="font-label-md text-label-md font-semibold text-on-surface">Upcoming CT Countdown Reminders</p>
                <p className="font-body-sm text-[12px] text-on-surface-variant">Receive notifications 3 days and 1 day before class tests.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-surface-border">
              <div>
                <p className="font-label-md text-label-md font-semibold text-on-surface">New Upload Alerts in My Subjects</p>
                <p className="font-body-sm text-[12px] text-on-surface-variant">Get notified when batchmates upload notes for your registered courses.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-label-md text-label-md font-semibold text-on-surface">Auto-Download Over Wi-Fi</p>
                <p className="font-body-sm text-[12px] text-on-surface-variant">Automatically pre-cache saved lecture PDFs on hostel network.</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-primary cursor-pointer" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.length > 0 ? (
            filtered.map(res => (
              <ResourceItem key={res.id} resource={res} />
            ))
          ) : (
            <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-2 text-outline">{icon || 'folder'}</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">No items available</h3>
              <p className="font-body-sm text-body-sm text-secondary">
                Items added under this category will show up here.
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
};
