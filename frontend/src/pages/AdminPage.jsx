import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AdminPage = () => {
  const {
    students,
    toggleBlockStudent,
    deleteStudent,
    discussions,
    deleteDiscussion,
    resources,
    deleteResource,
    clearDemoResources,
    restoreDefaultResources,
  } = useApp();

  const [activeTab, setActiveTab] = useState('discussions'); // 'discussions' | 'students' | 'resources'
  const [chatSearch, setChatSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [resourceSearch, setResourceSearch] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const showToast = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const filteredDiscussions = (discussions || []).filter(
    (d) =>
      d.text?.toLowerCase().includes(chatSearch.toLowerCase()) ||
      d.author?.toLowerCase().includes(chatSearch.toLowerCase()) ||
      d.resourceTitle?.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const filteredStudents = (students || []).filter(
    (s) =>
      s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.hostel?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredResources = (resources || []).filter(
    (r) =>
      r.title?.toLowerCase().includes(resourceSearch.toLowerCase()) ||
      r.subject?.toLowerCase().includes(resourceSearch.toLowerCase()) ||
      r.author?.toLowerCase().includes(resourceSearch.toLowerCase())
  );

  const blockedCount = (students || []).filter((s) => s.status === 'BLOCKED').length;
  const flaggedChatsCount = (discussions || []).filter((d) => d.isFlagged).length;

  return (
    <main className="flex-1 max-w-container-max mx-auto w-full px-4 md:px-margin-page py-6 md:py-stack-lg flex flex-col gap-6">
      {/* Header Banner */}
      <section className="bg-surface-container-lowest border border-surface-border rounded-2xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
            </span>
            <h1 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface">
              Admin & Moderation Control Center
            </h1>
          </div>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
            Manage community discussions, block abusive users, and purge demo materials or spam.
          </p>
        </div>

        {/* Global Action: Clear Demo Data */}
        <button
          onClick={() => {
            clearDemoResources();
            showToast('All placeholder demo resources purged successfully!');
          }}
          className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800/60 rounded-xl font-label-md text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
          <span>Clear All Demo Data</span>
        </button>
      </section>

      {/* Toast Feedback Alert */}
      {feedbackMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* High-Level Overview Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-4 academic-shadow">
          <span className="text-xs font-semibold text-on-surface-variant block mb-1">Total Students</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface">{students.length}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">{students.length - blockedCount} Active</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-4 academic-shadow">
          <span className="text-xs font-semibold text-on-surface-variant block mb-1">Blocked Accounts</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-600">{blockedCount}</span>
            <span className="text-[11px] text-on-surface-variant">Restricted</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-4 academic-shadow">
          <span className="text-xs font-semibold text-on-surface-variant block mb-1">Total Resources</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">{resources.length}</span>
            <span className="text-[11px] text-on-surface-variant">Notes & PDFs</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-surface-border rounded-xl p-4 academic-shadow">
          <span className="text-xs font-semibold text-on-surface-variant block mb-1">Community Chats</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface">{discussions.length}</span>
            {flaggedChatsCount > 0 && (
              <span className="text-[11px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                {flaggedChatsCount} Flagged
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('discussions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-xs sm:text-sm transition-all font-semibold ${
            activeTab === 'discussions'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">forum</span>
          <span>Moderate Chats & Discussions ({discussions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-xs sm:text-sm transition-all font-semibold ${
            activeTab === 'students'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">group</span>
          <span>Students & Blocking ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-label-md text-xs sm:text-sm transition-all font-semibold ${
            activeTab === 'resources'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">folder</span>
          <span>Manage Materials ({resources.length})</span>
        </button>
      </div>

      {/* TAB 1: Chat & Discussion Moderation */}
      {activeTab === 'discussions' && (
        <section className="bg-surface-container-lowest border border-surface-border rounded-2xl p-4 md:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                Hostel Chat & Comments Moderation
              </h2>
              <p className="text-xs text-on-surface-variant">
                Remove spam links, inappropriate language, or uneven messages across study resources.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                placeholder="Search comments..."
                className="w-full pl-9 pr-3 py-1.5 bg-surface border border-surface-border rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {filteredDiscussions.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2 block">
                chat_bubble_outline
              </span>
              No comments or discussion threads found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDiscussions.map((comm) => (
                <div
                  key={comm.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors ${
                    comm.isFlagged
                      ? 'bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-800/40'
                      : 'bg-surface border-surface-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-on-surface">{comm.author}</span>
                      <span className="text-[11px] text-on-surface-variant">({comm.authorEmail})</span>
                      <span className="text-surface-border">•</span>
                      <span className="text-[11px] text-primary font-semibold truncate max-w-[200px]">
                        On: {comm.resourceTitle}
                      </span>
                      {comm.isFlagged && (
                        <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                          Flagged
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface leading-relaxed">{comm.text}</p>
                    <span className="text-[10px] text-on-surface-variant block mt-1">🕒 {comm.timestamp}</span>
                  </div>

                  {/* Delete Action Button */}
                  <button
                    onClick={() => {
                      deleteDiscussion(comm.id);
                      showToast('Comment message deleted permanently.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 hover:bg-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Delete Chat</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: Student Management & Blocking */}
      {activeTab === 'students' && (
        <section className="bg-surface-container-lowest border border-surface-border rounded-2xl p-4 md:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                Registered Students Directory
              </h2>
              <p className="text-xs text-on-surface-variant">
                Block or unblock students violating hostel guidelines or spamming fake notes.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-9 pr-3 py-1.5 bg-surface border border-surface-border rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-border text-on-surface-variant bg-surface-container-low">
                  <th className="p-3 font-semibold rounded-l-lg">Student</th>
                  <th className="p-3 font-semibold">Hostel & Room</th>
                  <th className="p-3 font-semibold">Branch & Year</th>
                  <th className="p-3 font-semibold">Uploads</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredStudents.map((stud) => (
                  <tr key={stud.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-3">
                      <p className="font-bold text-on-surface">{stud.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{stud.email}</p>
                    </td>
                    <td className="p-3 text-on-surface">
                      {stud.hostel} • {stud.room}
                    </td>
                    <td className="p-3 text-on-surface">
                      {stud.branch} (Year {stud.year})
                    </td>
                    <td className="p-3 text-primary font-bold">{stud.uploadsCount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                          stud.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            stud.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-red-600'
                          }`}
                        ></span>
                        {stud.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Block / Unblock Button */}
                        <button
                          onClick={() => {
                            toggleBlockStudent(stud.id);
                            showToast(
                              stud.status === 'ACTIVE'
                                ? `Student ${stud.name} has been BLOCKED.`
                                : `Student ${stud.name} has been unblocked.`
                            );
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            stud.status === 'ACTIVE'
                              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-950/50 dark:text-amber-300'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {stud.status === 'ACTIVE' ? 'Block Access' : 'Unblock'}
                        </button>

                        {/* Remove Student Button */}
                        <button
                          onClick={() => {
                            deleteStudent(stud.id);
                            showToast(`Student record ${stud.name} removed.`);
                          }}
                          title="Remove user account"
                          className="p-1.5 text-on-surface-variant hover:text-red-600 rounded-lg hover:bg-surface-container"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: Study Materials & Demo Data Management */}
      {activeTab === 'resources' && (
        <section className="bg-surface-container-lowest border border-surface-border rounded-2xl p-4 md:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                Academic Resources & Data Management
              </h2>
              <p className="text-xs text-on-surface-variant">
                Purge all placeholder demo materials or remove unwanted PDFs uploaded to HostelHub.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  restoreDefaultResources();
                  showToast('Default sample resources restored.');
                }}
                className="px-3 py-1.5 border border-surface-border hover:bg-surface-container text-on-surface rounded-lg text-xs font-bold transition-colors"
              >
                Restore Samples
              </button>

              <button
                onClick={() => {
                  clearDemoResources();
                  showToast('All demo placeholder data purged!');
                }}
                className="px-3.5 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
                <span>Purge Demo Data</span>
              </button>
            </div>
          </div>

          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={resourceSearch}
              onChange={(e) => setResourceSearch(e.target.value)}
              placeholder="Search uploaded files, subjects, authors..."
              className="w-full pl-9 pr-3 py-2 bg-surface border border-surface-border rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          {filteredResources.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2 block">
                folder_off
              </span>
              No study materials found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-surface-border text-on-surface-variant bg-surface-container-low">
                    <th className="p-3 font-semibold rounded-l-lg">Material Title</th>
                    <th className="p-3 font-semibold">Subject</th>
                    <th className="p-3 font-semibold">Type</th>
                    <th className="p-3 font-semibold">Uploader</th>
                    <th className="p-3 font-semibold">Upload Date</th>
                    <th className="p-3 font-semibold">File Size</th>
                    <th className="p-3 font-semibold text-right rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filteredResources.map((res) => (
                    <tr key={res.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3 font-bold text-on-surface">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px]">
                            {res.icon || 'description'}
                          </span>
                          <span className="truncate max-w-[220px]">{res.title}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-surface-container text-on-surface rounded text-[10px] font-bold">
                          {res.subject}
                        </span>
                      </td>
                      <td className="p-3 text-on-surface-variant uppercase text-[11px] font-semibold">
                        {res.type}
                      </td>
                      <td className="p-3 text-on-surface font-medium">{res.author}</td>
                      <td className="p-3 text-on-surface-variant">
                        {res.uploadedAt || res.timeAgo || 'Just now'}
                      </td>
                      <td className="p-3 text-on-surface font-medium">{res.size || '2.4 MB'}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            deleteResource(res.id);
                            showToast(`"${res.title}" deleted from HostelHub.`);
                          }}
                          className="px-3 py-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          <span>Delete PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
};
