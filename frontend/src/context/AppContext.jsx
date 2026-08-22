import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialResources, upcomingCTs as defaultCTs, subjectDeepDives as defaultDeepDives } from '../data/mockData';
import { useAuth } from './AuthContext';

const AppContext = createContext();

const INITIAL_STUDENTS = [
  {
    id: 'stud-1',
    name: 'Rahul Kumar',
    email: 'rahul.kumar@hostel.edu',
    hostel: 'Hostel 4',
    room: 'B-204',
    branch: 'Computer Science',
    year: 2,
    status: 'ACTIVE', // 'ACTIVE' | 'BLOCKED'
    uploadsCount: 3,
    joinedAt: '12 Aug 2026',
  },
  {
    id: 'stud-2',
    name: 'Priya Sharma',
    email: 'priya.s@hostel.edu',
    hostel: 'Girls Hostel 1',
    room: 'A-102',
    branch: 'Computer Science',
    year: 2,
    status: 'ACTIVE',
    uploadsCount: 5,
    joinedAt: '15 Aug 2026',
  },
  {
    id: 'stud-3',
    name: 'Aman Verma',
    email: 'aman.v@hostel.edu',
    hostel: 'Hostel 2',
    room: 'C-310',
    branch: 'Mathematics',
    year: 3,
    status: 'ACTIVE',
    uploadsCount: 1,
    joinedAt: '18 Aug 2026',
  },
  {
    id: 'stud-4',
    name: 'Spam User',
    email: 'spammer99@fake.edu',
    hostel: 'Hostel 1',
    room: 'X-999',
    branch: 'Other',
    year: 1,
    status: 'BLOCKED',
    uploadsCount: 0,
    joinedAt: '20 Aug 2026',
  },
];

const INITIAL_DISCUSSIONS = [
  {
    id: 'comm-1',
    author: 'Priya S.',
    authorEmail: 'priya.s@hostel.edu',
    resourceTitle: 'COA Unit 2 Complete Notes',
    text: 'This was super helpful for Unit 2 prep! Thanks for sharing.',
    timestamp: '22 Aug 2026, 2:15 PM',
    isFlagged: false,
  },
  {
    id: 'comm-2',
    author: 'Aman V.',
    authorEmail: 'aman.v@hostel.edu',
    resourceTitle: 'Data Structures PYQ 2023 Solved',
    text: 'Are the tree traversal solutions verified with the teacher?',
    timestamp: '22 Aug 2026, 1:40 PM',
    isFlagged: false,
  },
  {
    id: 'comm-3',
    author: 'Spam User',
    authorEmail: 'spammer99@fake.edu',
    resourceTitle: 'Operating Systems: Deadlock Lecture',
    text: 'Join this unverified external telegram link for leaked exam papers: http://bad-link.xyz',
    timestamp: '21 Aug 2026, 11:20 PM',
    isFlagged: true,
  },
];

export const AppProvider = ({ children }) => {
  const { user: authUser } = useAuth();

  const user = authUser || {
    fullName: 'Kartik Sharma',
    name: 'Kartik',
    full_name: 'Kartik Sharma',
    hostel: 'Hostel 4',
    room_number: 'B-204',
    room: 'B-204',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    role: 'ADMIN', // Default role with Admin capabilities
  };

  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('hostelhub_resources');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return initialResources;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('hostelhub_students');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_STUDENTS;
  });

  const [discussions, setDiscussions] = useState(() => {
    const saved = localStorage.getItem('hostelhub_discussions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_DISCUSSIONS;
  });

  const [savedResourceIds, setSavedResourceIds] = useState(new Set(["res-1", "res-2"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [upcomingTests, setUpcomingTests] = useState(defaultCTs);
  const [subjectData, setSubjectData] = useState(defaultDeepDives);
  const [selectedSubjectKey, setSelectedSubjectKey] = useState("DSA");
  const [activeCategoryTab, setActiveCategoryTab] = useState("All");

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('hostelhub_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('hostelhub_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('hostelhub_discussions', JSON.stringify(discussions));
  }, [discussions]);

  const toggleSaveResource = (id) => {
    setSavedResourceIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const addResource = (newResource) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const resourceWithMeta = {
      id: `res-${Date.now()}`,
      author: user.full_name || user.fullName || "Kartik Sharma",
      timeAgo: "Just now",
      uploadedAt: `${formattedDate}, ${formattedTime}`,
      uploadDate: formattedDate,
      uploadTime: formattedTime,
      downloads: 0,
      views: 1,
      isDemo: false,
      ...newResource
    };
    setResources(prev => [resourceWithMeta, ...prev]);
    return resourceWithMeta;
  };

  // Admin Action: Delete a single resource
  const deleteResource = (id) => {
    setResources(prev => prev.filter(r => r.id !== id));
    setSavedResourceIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Admin Action: Clear all demo / sample placeholder data
  const clearDemoResources = () => {
    setResources(prev => prev.filter(r => r.isDemo === false));
  };

  // Admin Action: Restore default resources
  const restoreDefaultResources = () => {
    setResources(initialResources.map(r => ({ ...r, isDemo: true })));
  };

  // Admin Action: Toggle student block status
  const toggleBlockStudent = (studentId) => {
    setStudents(prev =>
      prev.map(stud => {
        if (stud.id === studentId) {
          const nextStatus = stud.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
          return { ...stud, status: nextStatus };
        }
        return stud;
      })
    );
  };

  // Admin Action: Delete student
  const deleteStudent = (studentId) => {
    setStudents(prev => prev.filter(stud => stud.id !== studentId));
  };

  // Admin Action: Delete uneven chat / spam comment
  const deleteDiscussion = (discussionId) => {
    setDiscussions(prev => prev.filter(d => d.id !== discussionId));
  };

  const toggleChecklistItem = (subjectKey, itemId) => {
    setSubjectData(prev => {
      const subject = prev[subjectKey];
      if (!subject) return prev;

      const updatedList = subject.checklist.map(item => {
        if (item.id === itemId) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });

      const completedCount = updatedList.filter(item => item.completed).length;
      const newPercent = Math.round((completedCount / updatedList.length) * 100);

      return {
        ...prev,
        [subjectKey]: {
          ...subject,
          progressPercent: newPercent,
          checklist: updatedList
        }
      };
    });
  };

  return (
    <AppContext.Provider value={{
      user,
      resources,
      savedResourceIds,
      toggleSaveResource,
      addResource,
      deleteResource,
      clearDemoResources,
      restoreDefaultResources,
      students,
      toggleBlockStudent,
      deleteStudent,
      discussions,
      deleteDiscussion,
      searchQuery,
      setSearchQuery,
      upcomingTests,
      subjectData,
      selectedSubjectKey,
      setSelectedSubjectKey,
      toggleChecklistItem,
      activeCategoryTab,
      setActiveCategoryTab
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
