import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialHostels = [
  {
    id: "hostel-4",
    name: "Hostel 4",
    displayName: "Boys Hostel 4 (Aryabhata Block)",
    tagline: "Engineering Scholars & Tech Innovation",
    description: "Home to 2nd, 3rd, and 4th year Computer Science & Engineering students.",
    hostelType: "boys",
    accentColor: "#00685f",
    floors: [
      {
        id: "h4-f1",
        hostelId: "hostel-4",
        floorNumber: 1,
        name: "Ground Floor",
        rooms: [
          {
            id: "101",
            hostelId: "hostel-4",
            floorId: "h4-f1",
            floorNumber: 1,
            roomNumber: "101",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Open Study Lounge",
            year: "4th Sem",
            facilities: ["Study Table", "Ergonomic Chair", "Bed", "Bookshelf", "High-speed Wi-Fi", "Fan"],
            description: "Quiet ground floor room overlooking the hostel green courtyard. Ideal for focused exam preparation.",
            sharedNotesCount: 28,
            activeStudyGroup: "DSA & Algorithm Design",
            resources: [
              { id: "res-1", title: "DSA Unit 1 Graph Algorithms", type: "PDF", size: "2.4 MB" },
              { id: "res-2", title: "COA Instruction Pipelining Cheatsheet", type: "PDF", size: "1.8 MB" }
            ]
          },
          {
            id: "102",
            hostelId: "hostel-4",
            floorId: "h4-f1",
            floorNumber: 1,
            roomNumber: "102",
            status: "available",
            roomType: "Double",
            capacity: 2,
            occupants: [],
            branch: "Collaboration Pod",
            year: "4th Sem",
            facilities: ["2 Study Tables", "2 Chairs", "2 Beds", "Wardrobe", "Wi-Fi", "Balcony"],
            description: "Spacious double room equipped with dual study stations and balcony access.",
            sharedNotesCount: 34,
            activeStudyGroup: "COA Mid-Term Prep Hub",
            resources: [
              { id: "res-3", title: "DBMS SQL Solved Papers", type: "PDF", size: "3.1 MB" }
            ]
          },
          {
            id: "103",
            hostelId: "hostel-4",
            floorId: "h4-f1",
            floorNumber: 1,
            roomNumber: "103",
            status: "occupied",
            roomType: "Single",
            capacity: 1,
            occupants: [
              { name: "Aman Gupta", roll: "22BCSE103", branch: "ECE • 4th Sem", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" }
            ],
            branch: "ECE • 4th Sem",
            year: "2nd Year",
            facilities: ["Study Table", "Chair", "Bed", "Bookshelf", "Wi-Fi", "Fan"],
            description: "Occupied by senior ECE scholar active in robotics and embedded systems.",
            sharedNotesCount: 16,
            activeStudyGroup: "Digital Signals & Microprocessors",
            resources: [
              { id: "res-4", title: "Digital Electronics Unit 2 Notes", type: "PDF", size: "4.2 MB" }
            ]
          }
        ]
      },
      {
        id: "h4-f2",
        hostelId: "hostel-4",
        floorNumber: 2,
        name: "First Floor",
        rooms: [
          {
            id: "201",
            hostelId: "hostel-4",
            floorId: "h4-f2",
            floorNumber: 2,
            roomNumber: "201",
            status: "occupied",
            roomType: "Double",
            capacity: 2,
            occupants: [
              { name: "Vikram Patel", roll: "22BCSE201", branch: "CSE Data Science", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150" },
              { name: "Rohan Mehta", roll: "22BCSE202", branch: "CSE AI/ML", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" }
            ],
            branch: "CSE • 4th Sem",
            year: "2nd Year",
            facilities: ["2 Study Tables", "2 Ergonomic Chairs", "2 Beds", "Bookshelf", "Wi-Fi"],
            description: "Active discussion hub for machine learning and competitive programming.",
            sharedNotesCount: 42,
            activeStudyGroup: "Operating Systems & Concurrency",
            resources: [
              { id: "res-5", title: "OS Semaphore & Deadlock Cheatsheet", type: "PDF", size: "2.1 MB" },
              { id: "res-6", title: "ML Regression Solved Examples", type: "PDF", size: "3.5 MB" }
            ]
          },
          {
            id: "202",
            hostelId: "hostel-4",
            floorId: "h4-f2",
            floorNumber: 2,
            roomNumber: "202",
            status: "occupied",
            roomType: "Single",
            capacity: 1,
            occupants: [
              { name: "Devansh Joshi", roll: "22BCSE204", branch: "Information Technology", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" }
            ],
            branch: "IT • 4th Sem",
            year: "2nd Year",
            facilities: ["Study Table", "Chair", "Bed", "Bookshelf", "Wi-Fi", "Fan"],
            description: "Dedicated to database architecture and backend development.",
            sharedNotesCount: 19,
            activeStudyGroup: "DBMS SQL Normalization",
            resources: [
              { id: "res-7", title: "DBMS BCNF & 3NF Quick Guide", type: "PDF", size: "1.5 MB" }
            ]
          },
          {
            id: "203",
            hostelId: "hostel-4",
            floorId: "h4-f2",
            floorNumber: 2,
            roomNumber: "203",
            status: "maintenance",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Maintenance",
            year: "N/A",
            facilities: ["Study Table", "Bed", "Wi-Fi"],
            description: "Undergoing routine electrical wiring inspection and high-speed LAN port setup.",
            sharedNotesCount: 5,
            activeStudyGroup: "Network Upgrades Scheduled",
            resources: []
          }
        ]
      },
      {
        id: "h4-f3",
        hostelId: "hostel-4",
        floorNumber: 3,
        name: "Second Floor",
        rooms: [
          {
            id: "301",
            hostelId: "hostel-4",
            floorId: "h4-f3",
            floorNumber: 3,
            roomNumber: "301",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Hostel Library Annex",
            year: "All Semesters",
            facilities: ["Study Desk", "Ergonomic Chair", "Bed", "Double Bookshelf", "High-speed Wi-Fi"],
            description: "Top floor quiet corner room with abundant natural light, perfect for semester exam revision.",
            sharedNotesCount: 55,
            activeStudyGroup: "PYQ Archive & Formula Sheets",
            resources: [
              { id: "res-8", title: "Applied Mathematics Fourier Series", type: "PDF", size: "4.8 MB" },
              { id: "res-9", title: "Theory of Computation Automata Notes", type: "PDF", size: "3.2 MB" }
            ]
          },
          {
            id: "302",
            hostelId: "hostel-4",
            floorId: "h4-f3",
            floorNumber: 3,
            roomNumber: "302",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "AI & ML Study Wing",
            year: "4th Sem",
            facilities: ["Study Table", "Chair", "Bed", "Bookshelf", "Wi-Fi", "Balcony"],
            description: "Equipped with dedicated workstation and high-speed fiber connection for deep learning tasks.",
            sharedNotesCount: 31,
            activeStudyGroup: "Neural Networks & Linear Algebra",
            resources: [
              { id: "res-10", title: "Neural Networks Backpropagation Notes", type: "PDF", size: "2.9 MB" }
            ]
          },
          {
            id: "303",
            hostelId: "hostel-4",
            floorId: "h4-f3",
            floorNumber: 3,
            roomNumber: "303",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "CSE • 4th Sem",
            year: "2nd Year",
            facilities: ["Study Table", "Ergonomic Chair", "Bed", "Bookshelf", "Wi-Fi", "Fan", "Curtains", "Wardrobe"],
            description: "Premium single room featuring a complete stylized study station, ergonomic chair, laptop desk, and bookshelf.",
            sharedNotesCount: 48,
            activeStudyGroup: "Class Test 1 Conquering Group",
            resources: [
              { id: "res-11", title: "COA Midterm Solved Papers 2025", type: "PDF", size: "3.4 MB" },
              { id: "res-12", title: "DSA Trees & Graphs Full Summary", type: "PDF", size: "5.1 MB" }
            ]
          },
          {
            id: "304",
            hostelId: "hostel-4",
            floorId: "h4-f3",
            floorNumber: 3,
            roomNumber: "304",
            status: "occupied",
            roomType: "Single",
            capacity: 1,
            occupants: [
              { name: "Siddharth Rao", roll: "22BCSE304", branch: "CSE AI/ML", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150" }
            ],
            branch: "CSE AI/ML",
            year: "2nd Year",
            facilities: ["Study Table", "Chair", "Bed", "Bookshelf", "Wi-Fi"],
            description: "Room curated by top contributor Siddharth with exhaustive lecture summaries.",
            sharedNotesCount: 38,
            activeStudyGroup: "Computer Networks & Sockets",
            resources: []
          },
          {
            id: "305",
            hostelId: "hostel-4",
            floorId: "h4-f3",
            floorNumber: 3,
            roomNumber: "305",
            status: "occupied",
            roomType: "Single",
            capacity: 1,
            occupants: [
              { name: "Kartik Verma", roll: "22BCSE305", branch: "CSE Data Science", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" }
            ],
            branch: "CSE Data Science",
            year: "2nd Year",
            facilities: ["Study Table", "Chair", "Bed", "Bookshelf", "Wi-Fi", "Lamp"],
            description: "Admin & Lead Contributor room for HostelHub community materials.",
            sharedNotesCount: 64,
            activeStudyGroup: "HostelHub Core Development",
            resources: []
          },
          {
            id: "306",
            hostelId: "hostel-4",
            floorId: "h4-f3",
            floorNumber: 3,
            roomNumber: "306",
            status: "maintenance",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Maintenance",
            year: "N/A",
            facilities: ["Study Table", "Bed"],
            description: "Scheduled for wall painting and smart LED installation.",
            sharedNotesCount: 2,
            activeStudyGroup: "Scheduled Maintenance",
            resources: []
          }
        ]
      }
    ]
  },

  {
    id: "hostel-2",
    name: "Hostel 2",
    displayName: "Bhaskara Block (Hostel 2)",
    tagline: "Applied Sciences & Mechanics",
    description: "Home to Mechanical, Civil, and Electrical Engineering cohorts.",
    hostelType: "boys",
    accentColor: "#008378",
    floors: [
      {
        id: "h2-f1",
        hostelId: "hostel-2",
        floorNumber: 1,
        name: "Ground Floor",
        rooms: [
          {
            id: "h2-101",
            hostelId: "hostel-2",
            floorId: "h2-f1",
            floorNumber: 1,
            roomNumber: "101",
            status: "occupied",
            roomType: "Double",
            capacity: 2,
            occupants: [{ name: "Karan Singh", roll: "22BME101", branch: "Mechanical", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" }],
            branch: "Mechanical • 4th Sem",
            year: "2nd Year",
            facilities: ["2 Study Tables", "2 Beds", "Wi-Fi"],
            description: "Thermodynamics and CAD modeling focus room.",
            sharedNotesCount: 24,
            activeStudyGroup: "Thermodynamics Solved Questions",
            resources: []
          },
          {
            id: "h2-102",
            hostelId: "hostel-2",
            floorId: "h2-f1",
            floorNumber: 1,
            roomNumber: "102",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Common Study Room",
            year: "All",
            facilities: ["Study Table", "Chair", "Bed", "Bookshelf", "Wi-Fi"],
            description: "Physics mechanics and calculus discussion room.",
            sharedNotesCount: 19,
            activeStudyGroup: "Fluid Mechanics Review",
            resources: []
          }
        ]
      },
      {
        id: "h2-f2",
        hostelId: "hostel-2",
        floorNumber: 2,
        name: "First Floor",
        rooms: [
          {
            id: "h2-201",
            hostelId: "hostel-2",
            floorId: "h2-f2",
            floorNumber: 2,
            roomNumber: "201",
            status: "occupied",
            roomType: "Single",
            capacity: 1,
            occupants: [{ name: "Aniket Sen", roll: "22BEE201", branch: "Electrical", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150" }],
            branch: "Electrical Engineering",
            year: "2nd Year",
            facilities: ["Study Table", "Chair", "Bed", "Wi-Fi"],
            description: "Circuit analysis and electromagnetics study cell.",
            sharedNotesCount: 31,
            activeStudyGroup: "Network Theorems Lab Prep",
            resources: []
          },
          {
            id: "h2-202",
            hostelId: "hostel-2",
            floorId: "h2-f2",
            floorNumber: 2,
            roomNumber: "202",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Civil Engineering",
            year: "2nd Year",
            facilities: ["Study Table", "Chair", "Bed", "Bookshelf", "Wi-Fi"],
            description: "Strength of materials and surveying library.",
            sharedNotesCount: 22,
            activeStudyGroup: "Structural Analysis Discussions",
            resources: []
          }
        ]
      }
    ]
  },

  {
    id: "hostel-1",
    name: "Hostel 1",
    displayName: "Ramanujan Block (Hostel 1)",
    tagline: "Senior Academics & Placement Cell",
    description: "Final year students, research scholars, and placement preparation groups.",
    hostelType: "boys",
    accentColor: "#384357",
    floors: [
      {
        id: "h1-f1",
        hostelId: "hostel-1",
        floorNumber: 1,
        name: "Ground Floor",
        rooms: [
          {
            id: "h1-101",
            hostelId: "hostel-1",
            floorId: "h1-f1",
            floorNumber: 1,
            roomNumber: "101",
            status: "occupied",
            roomType: "Single",
            capacity: 1,
            occupants: [{ name: "Samarth P.", roll: "21BCSE101", branch: "CSE Final Year", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" }],
            branch: "CSE • Final Year",
            year: "4th Year",
            facilities: ["Study Table", "Ergonomic Chair", "Bed", "Bookshelf", "Wi-Fi"],
            description: "Placement prep archive with over 50 mock interview questions.",
            sharedNotesCount: 52,
            activeStudyGroup: "System Design & LLD Masterclass",
            resources: []
          },
          {
            id: "h1-102",
            hostelId: "hostel-1",
            floorId: "h1-f1",
            floorNumber: 1,
            roomNumber: "102",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Research Pod",
            year: "Final Year",
            facilities: ["Study Table", "Chair", "Bed", "Bookshelf", "Wi-Fi"],
            description: "Senior project room for distributed systems and cloud research.",
            sharedNotesCount: 40,
            activeStudyGroup: "Distributed Systems Project",
            resources: []
          }
        ]
      }
    ]
  },

  {
    id: "hostel-3",
    name: "Hostel 3",
    displayName: "Kalam Block (Hostel 3)",
    tagline: "Junior Cohort & Freshers Hub",
    description: "First & second year foundational science and engineering student block.",
    hostelType: "boys",
    accentColor: "#00685f",
    floors: [
      {
        id: "h3-f1",
        hostelId: "hostel-3",
        floorNumber: 1,
        name: "Ground Floor",
        rooms: [
          {
            id: "h3-101",
            hostelId: "hostel-3",
            floorId: "h3-f1",
            floorNumber: 1,
            roomNumber: "101",
            status: "occupied",
            roomType: "Double",
            capacity: 2,
            occupants: [{ name: "Nikhil Sharma", roll: "23BCSE101", branch: "CSE 1st Year", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" }],
            branch: "CSE • 2nd Sem",
            year: "1st Year",
            facilities: ["2 Study Tables", "2 Beds", "Wi-Fi"],
            description: "C programming and basic electrical engineering study room.",
            sharedNotesCount: 18,
            activeStudyGroup: "Engineering Physics & Math 1",
            resources: []
          },
          {
            id: "h3-102",
            hostelId: "hostel-3",
            floorId: "h3-f1",
            floorNumber: 1,
            roomNumber: "102",
            status: "available",
            roomType: "Double",
            capacity: 2,
            occupants: [],
            branch: "Freshers Collaboration Pod",
            year: "1st Year",
            facilities: ["2 Study Tables", "2 Beds", "Wi-Fi"],
            description: "Open discussion space with all 1st year semester notes.",
            sharedNotesCount: 25,
            activeStudyGroup: "1st Year PYQ Question Bank",
            resources: []
          }
        ]
      }
    ]
  }
];

export const useHostelStore = create(
  persist(
    (set, get) => ({
      hostels: initialHostels,
      selectedHostelId: "hostel-4",
      selectedFloorNumber: null, // null for All Floors, or number (1, 2, 3)
      selectedRoomId: "303", // default focus room
      activeInteriorTab: "interior", // 'room-view' | 'interior' | 'study-area' | 'bed-area' | 'resources' | 'details'
      searchQuery: "",
      cameraMode: "overview", // 'overview' | 'room' | 'floor'
      isStoryPlaying: false,

      // New Architectural & Feature Flags
      isExplodedView: false,
      lightingMode: "day", // 'day' | 'night' | 'auto'
      qualityMode: "high", // 'high' | 'balanced' | 'performance'
      favoriteRoomIds: ["303"],
      comparedRoomIds: [],
      activeInteractiveModal: null, // 'laptop-workspace' | 'bookshelf-resources' | 'study-area-stats' | 'share-qr' | 'compare' | null
      activeBookSubject: "COA", // for bookshelf modal

      // Selectors & Navigation
      setSelectedHostelId: (id) => {
        const hostel = get().hostels.find((h) => h.id === id);
        if (hostel) {
          const firstRoom = hostel.floors[0]?.rooms[0]?.id || null;
          set({
            selectedHostelId: id,
            selectedFloorNumber: null,
            selectedRoomId: firstRoom,
            cameraMode: "overview"
          });
        }
      },

      setSelectedFloorNumber: (floorNum) => set({ selectedFloorNumber: floorNum }),

      setSelectedRoomId: (roomId) => {
        set({
          selectedRoomId: roomId,
          cameraMode: roomId ? "room" : "overview"
        });
      },

      setActiveInteriorTab: (tab) => set({ activeInteriorTab: tab }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCameraMode: (mode) => set({ cameraMode: mode }),
      setIsStoryPlaying: (isPlaying) => set({ isStoryPlaying: isPlaying }),

      // Interactive Features Actions
      setIsExplodedView: (isExploded) => set({ isExplodedView: isExploded }),
      toggleExplodedView: () => set((state) => ({ isExplodedView: !state.isExplodedView })),
      setLightingMode: (mode) => set({ lightingMode: mode }),
      toggleLightingMode: () =>
        set((state) => ({ lightingMode: state.lightingMode === "day" ? "night" : "day" })),
      setQualityMode: (mode) => set({ qualityMode: mode }),
      setActiveInteractiveModal: (modal, subject = "COA") =>
        set({ activeInteractiveModal: modal, activeBookSubject: subject }),

      toggleFavoriteRoom: (roomId) => {
        set((state) => {
          const exists = state.favoriteRoomIds.includes(roomId);
          return {
            favoriteRoomIds: exists
              ? state.favoriteRoomIds.filter((id) => id !== roomId)
              : [...state.favoriteRoomIds, roomId]
          };
        });
      },

      toggleCompareRoom: (roomId) => {
        set((state) => {
          const exists = state.comparedRoomIds.includes(roomId);
          if (exists) {
            return { comparedRoomIds: state.comparedRoomIds.filter((id) => id !== roomId) };
          }
          if (state.comparedRoomIds.length >= 3) {
            return state; // maximum 3 rooms
          }
          return { comparedRoomIds: [...state.comparedRoomIds, roomId] };
        });
      },

      clearComparedRooms: () => set({ comparedRoomIds: [] }),

      resetView: () => {
        set({
          selectedRoomId: null,
          selectedFloorNumber: null,
          cameraMode: "overview",
          isExplodedView: false
        });
      },

      // Helper getters
      getCurrentHostel: () => {
        const state = get();
        return state.hostels.find((h) => h.id === state.selectedHostelId) || state.hostels[0];
      },

      getCurrentRoom: () => {
        const state = get();
        const hostel = state.getCurrentHostel();
        if (!hostel) return null;
        for (const floor of hostel.floors) {
          const room = floor.rooms.find((r) => r.id === state.selectedRoomId);
          if (room) return room;
        }
        return hostel.floors[0]?.rooms[0] || null;
      },

      getAllRoomsForCurrentHostel: () => {
        const hostel = get().getCurrentHostel();
        if (!hostel) return [];
        const rooms = [];
        for (const floor of hostel.floors) {
          rooms.push(...floor.rooms);
        }
        return rooms;
      },

      // Admin CRUD Operations
      addHostel: (newHostel) => {
        set((state) => ({
          hostels: [...state.hostels, newHostel]
        }));
      },

      updateHostel: (hostelId, updates) => {
        set((state) => ({
          hostels: state.hostels.map((h) =>
            h.id === hostelId ? { ...h, ...updates, updated_at: new Date().toISOString() } : h
          )
        }));
      },

      deleteHostel: (hostelId) => {
        set((state) => {
          const remaining = state.hostels.filter((h) => h.id !== hostelId);
          return {
            hostels: remaining,
            selectedHostelId: remaining[0]?.id || "hostel-4",
            selectedRoomId: null
          };
        });
      },

      addFloor: (hostelId, floorData) => {
        set((state) => ({
          hostels: state.hostels.map((h) => {
            if (h.id !== hostelId) return h;
            return {
              ...h,
              floors: [...h.floors, floorData]
            };
          })
        }));
      },

      deleteFloor: (hostelId, floorId) => {
        set((state) => ({
          hostels: state.hostels.map((h) => {
            if (h.id !== hostelId) return h;
            return {
              ...h,
              floors: h.floors.filter((f) => f.id !== floorId)
            };
          })
        }));
      },

      addRoom: (hostelId, floorId, roomData) => {
        set((state) => ({
          hostels: state.hostels.map((h) => {
            if (h.id !== hostelId) return h;
            return {
              ...h,
              floors: h.floors.map((f) => {
                if (f.id !== floorId) return f;
                return {
                  ...f,
                  rooms: [...f.rooms, roomData]
                };
              })
            };
          })
        }));
      },

      updateRoom: (roomId, updates) => {
        set((state) => ({
          hostels: state.hostels.map((h) => ({
            ...h,
            floors: h.floors.map((f) => ({
              ...f,
              rooms: f.rooms.map((r) =>
                r.id === roomId ? { ...r, ...updates, updated_at: new Date().toISOString() } : r
              )
            }))
          }))
        }));
      },

      deleteRoom: (roomId) => {
        set((state) => ({
          hostels: state.hostels.map((h) => ({
            ...h,
            floors: h.floors.map((f) => ({
              ...f,
              rooms: f.rooms.filter((r) => r.id !== roomId)
            }))
          })),
          selectedRoomId: state.selectedRoomId === roomId ? null : state.selectedRoomId
        }));
      },

      resetToDefaultHostels: () => {
        set({
          hostels: initialHostels,
          selectedHostelId: "hostel-4",
          selectedRoomId: "303",
          selectedFloorNumber: null,
          cameraMode: "overview",
          isExplodedView: false,
          lightingMode: "day"
        });
      }
    }),
    {
      name: "hostelhub_dynamic_3d_store",
      version: 2
    }
  )
);

