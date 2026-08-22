import React, { createContext, useContext, useState } from 'react';
import { initialResources, upcomingCTs as defaultCTs, subjectDeepDives as defaultDeepDives } from '../data/mockData';
import { useAuth } from './AuthContext';

const AppContext = createContext();

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
    role: 'STUDENT',
  };

  const [resources, setResources] = useState(initialResources);
  const [savedResourceIds, setSavedResourceIds] = useState(new Set(["res-1", "res-2"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [upcomingTests, setUpcomingTests] = useState(defaultCTs);
  const [subjectData, setSubjectData] = useState(defaultDeepDives);
  const [selectedSubjectKey, setSelectedSubjectKey] = useState("DSA");
  const [activeCategoryTab, setActiveCategoryTab] = useState("All");

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
    const resourceWithMeta = {
      id: `res-${Date.now()}`,
      author: user.full_name || user.fullName || "Kartik S.",
      timeAgo: "Just now",
      downloads: 0,
      views: 1,
      ...newResource
    };
    setResources(prev => [resourceWithMeta, ...prev]);
    return resourceWithMeta;
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
