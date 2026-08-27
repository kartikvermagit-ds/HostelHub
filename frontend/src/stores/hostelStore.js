import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialHostels = [
  {
    id: "hostel-4",
    name: "Aryabhata Hostel",
    displayName: "Boys Hostel 4 (Aryabhata Block)",
    tagline: "Engineering Scholars & Tech Innovation",
    description: "Home to 2nd, 3rd, and 4th year Computer Science & Engineering students with open central courtyard.",
    hostelType: "boys",
    accentColor: "#00685f",
    layoutConfig: {
      layoutType: "Courtyard",
      buildingWidth: 8.0,
      buildingDepth: 5.0,
      floorHeight: 1.05,
      corridorWidth: 0.8,
      centralSpace: {
        enabled: true,
        type: "Courtyard",
        width: 4.6,
        depth: 2.8,
        features: ["trees", "benches", "study_table", "lighting", "planter", "notice_board"]
      },
      architecture: {
        entrancePosition: "center",
        staircasePosition: "right",
        liftPosition: "right"
      }
    },
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
          },
          {
            id: "104",
            hostelId: "hostel-4",
            floorId: "h4-f1",
            floorNumber: 1,
            roomNumber: "104",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "CSE • 4th Sem",
            year: "2nd Year",
            facilities: ["Study Table", "Chair", "Bed", "Wi-Fi"],
            description: "Ground floor garden view room.",
            sharedNotesCount: 12,
            activeStudyGroup: "Core Java & OOPs",
            resources: []
          },
          {
            id: "105",
            hostelId: "hostel-4",
            floorId: "h4-f1",
            floorNumber: 1,
            roomNumber: "105",
            status: "reserved",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Robotics Society",
            year: "3rd Sem",
            facilities: ["Workstation", "Bed", "Wi-Fi"],
            description: "Reserved for visiting research scholar.",
            sharedNotesCount: 8,
            activeStudyGroup: "Robotics Club",
            resources: []
          },
          {
            id: "106",
            hostelId: "hostel-4",
            floorId: "h4-f1",
            floorNumber: 1,
            roomNumber: "106",
            status: "available",
            roomType: "Double",
            capacity: 2,
            occupants: [],
            branch: "General Wing",
            year: "2nd Year",
            facilities: ["2 Study Tables", "2 Beds", "Wi-Fi"],
            description: "Spacious corner room on ground floor.",
            sharedNotesCount: 20,
            activeStudyGroup: "Discrete Mathematics",
            resources: []
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
          },
          {
            id: "204",
            hostelId: "hostel-4",
            floorId: "h4-f2",
            floorNumber: 2,
            roomNumber: "204",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "CSE AI/ML",
            year: "2nd Year",
            facilities: ["Study Table", "Chair", "Bed", "Bookshelf", "Wi-Fi"],
            description: "Overlooks the courtyard fountain area.",
            sharedNotesCount: 22,
            activeStudyGroup: "Deep Learning Study Group",
            resources: []
          },
          {
            id: "205",
            hostelId: "hostel-4",
            floorId: "h4-f2",
            floorNumber: 2,
            roomNumber: "205",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Information Technology",
            year: "2nd Year",
            facilities: ["Study Table", "Chair", "Bed", "Wi-Fi"],
            description: "Quiet first-floor wing room.",
            sharedNotesCount: 14,
            activeStudyGroup: "Web Engineering",
            resources: []
          },
          {
            id: "206",
            hostelId: "hostel-4",
            floorId: "h4-f2",
            floorNumber: 2,
            roomNumber: "206",
            status: "occupied",
            roomType: "Double",
            capacity: 2,
            occupants: [
              { name: "Ankit Singh", roll: "22BCSE206", branch: "CSE" }
            ],
            branch: "CSE • 4th Sem",
            year: "2nd Year",
            facilities: ["2 Study Tables", "2 Beds", "Wi-Fi"],
            description: "Spacious double occupancy room.",
            sharedNotesCount: 30,
            activeStudyGroup: "Computer Graphics",
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
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Data Engineering",
            year: "3rd Year",
            facilities: ["Study Table", "Chair", "Bed", "Wi-Fi"],
            description: "Spacious study room with mountain view.",
            sharedNotesCount: 24,
            activeStudyGroup: "Big Data Processing",
            resources: []
          },
          {
            id: "306",
            hostelId: "hostel-4",
            floorId: "h4-f3",
            floorNumber: 3,
            roomNumber: "306",
            status: "reserved",
            roomType: "Double",
            capacity: 2,
            occupants: [],
            branch: "Honor Scholars",
            year: "4th Year",
            facilities: ["2 Study Tables", "2 Beds", "Balcony"],
            description: "Top floor honors wing suite.",
            sharedNotesCount: 40,
            activeStudyGroup: "Senior Capstone Projects",
            resources: []
          }
        ]
      },
      {
        id: "h4-f4",
        hostelId: "hostel-4",
        floorNumber: 4,
        name: "Third Floor (Sky Wing)",
        rooms: [
          {
            id: "401",
            hostelId: "hostel-4",
            floorId: "h4-f4",
            floorNumber: 4,
            roomNumber: "401",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "AI Research Pod",
            year: "4th Year",
            facilities: ["Study Table", "Chair", "Bed", "Wi-Fi", "Balcony"],
            description: "Sky-wing single room with top ventilation and high-speed network.",
            sharedNotesCount: 35,
            activeStudyGroup: "LLMs & Agentic Systems",
            resources: []
          },
          {
            id: "402",
            hostelId: "hostel-4",
            floorId: "h4-f4",
            floorNumber: 4,
            roomNumber: "402",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Cloud Computing Lab",
            year: "4th Year",
            facilities: ["Study Table", "Chair", "Bed", "Wi-Fi"],
            description: "Dedicated to cloud computing and distributed systems.",
            sharedNotesCount: 29,
            activeStudyGroup: "Kubernetes & Microservices",
            resources: []
          },
          {
            id: "403",
            hostelId: "hostel-4",
            floorId: "h4-f4",
            floorNumber: 4,
            roomNumber: "403",
            status: "occupied",
            roomType: "Single",
            capacity: 1,
            occupants: [
              { name: "Tanmay Deshmukh", roll: "21BCSE403", branch: "CSE Cloud" }
            ],
            branch: "CSE Cloud Systems",
            year: "4th Year",
            facilities: ["Study Table", "Chair", "Bed", "Wi-Fi"],
            description: "Occupied by final year cloud researcher.",
            sharedNotesCount: 45,
            activeStudyGroup: "Final Year Capstone",
            resources: []
          },
          {
            id: "404",
            hostelId: "hostel-4",
            floorId: "h4-f4",
            floorNumber: 4,
            roomNumber: "404",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Cybersecurity Wing",
            year: "4th Year",
            facilities: ["Study Table", "Chair", "Bed", "Wi-Fi"],
            description: "Top floor room facing the open courtyard.",
            sharedNotesCount: 33,
            activeStudyGroup: "Network Security & Cryptography",
            resources: []
          },
          {
            id: "405",
            hostelId: "hostel-4",
            floorId: "h4-f4",
            floorNumber: 4,
            roomNumber: "405",
            status: "maintenance",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Sky Pod 5",
            year: "4th Year",
            facilities: ["Study Table", "Bed", "Wi-Fi"],
            description: "Routine AC servicing and ventilation filter replacement.",
            sharedNotesCount: 6,
            activeStudyGroup: "Scheduled Maintenance",
            resources: []
          },
          {
            id: "406",
            hostelId: "hostel-4",
            floorId: "h4-f4",
            floorNumber: 4,
            roomNumber: "406",
            status: "available",
            roomType: "Double",
            capacity: 2,
            occupants: [],
            branch: "Senior Capstone Suite",
            year: "4th Year",
            facilities: ["2 Study Tables", "2 Beds", "Double Balcony"],
            description: "Spacious corner double room on the Sky Wing.",
            sharedNotesCount: 50,
            activeStudyGroup: "Startup & Innovation Incubation",
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: "hostel-2",
    name: "Sarabhai Hostel",
    displayName: "Boys Hostel 2 (Sarabhai Block)",
    tagline: "Robotics & Space Systems Research Hub",
    description: "Dedicated to aerospace, electronics, and mechanical engineering scholars.",
    hostelType: "boys",
    accentColor: "#0284c7",
    layoutConfig: {
      layoutType: "U",
      buildingWidth: 7.4,
      buildingDepth: 4.6,
      floorHeight: 1.05,
      corridorWidth: 0.8,
      centralSpace: {
        enabled: true,
        type: "Garden",
        width: 4.2,
        depth: 2.6,
        features: ["trees", "benches", "lighting", "planter"]
      },
      architecture: {
        entrancePosition: "center",
        staircasePosition: "left",
        liftPosition: "left"
      }
    },
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
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Aerospace Lab",
            facilities: ["Study Table", "Bed", "Wi-Fi"],
            description: "Ground floor quiet room.",
            sharedNotesCount: 20,
            resources: []
          },
          {
            id: "h2-102",
            hostelId: "hostel-2",
            floorId: "h2-f1",
            floorNumber: 1,
            roomNumber: "102",
            status: "occupied",
            roomType: "Single",
            capacity: 1,
            occupants: [{ name: "Rajesh Kumar", roll: "22BAERO102", branch: "Aerospace" }],
            branch: "Aerospace",
            facilities: ["Study Table", "Bed", "Wi-Fi"],
            description: "Occupied room.",
            sharedNotesCount: 15,
            resources: []
          },
          {
            id: "h2-103",
            hostelId: "hostel-2",
            floorId: "h2-f1",
            floorNumber: 1,
            roomNumber: "103",
            status: "available",
            roomType: "Double",
            capacity: 2,
            occupants: [],
            branch: "Robotics Pod",
            facilities: ["2 Study Tables", "2 Beds", "Wi-Fi"],
            description: "Spacious double room.",
            sharedNotesCount: 25,
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
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Avionics Pod",
            facilities: ["Study Table", "Bed", "Wi-Fi"],
            description: "First floor view room.",
            sharedNotesCount: 18,
            resources: []
          },
          {
            id: "h2-202",
            hostelId: "hostel-2",
            floorId: "h2-f2",
            floorNumber: 2,
            roomNumber: "202",
            status: "occupied",
            roomType: "Single",
            capacity: 1,
            occupants: [{ name: "Suresh Raina", roll: "22BECE202", branch: "ECE" }],
            branch: "ECE",
            facilities: ["Study Table", "Bed", "Wi-Fi"],
            description: "Occupied by senior ECE scholar.",
            sharedNotesCount: 22,
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: "hostel-1",
    name: "Gargi Hostel",
    displayName: "Girls Hostel 1 (Gargi Block)",
    tagline: "Women in Technology & AI Leadership",
    description: "Modern campus residence with dedicated high-speed study areas and innovation lounge.",
    hostelType: "girls",
    accentColor: "#9333ea",
    layoutConfig: {
      layoutType: "Straight",
      buildingWidth: 6.2,
      buildingDepth: 2.6,
      floorHeight: 1.05,
      corridorWidth: 0.8,
      centralSpace: {
        enabled: false,
        type: "Study Area",
        width: 3.5,
        depth: 2.0,
        features: ["trees", "benches", "lighting"]
      },
      architecture: {
        entrancePosition: "center",
        staircasePosition: "right",
        liftPosition: "right"
      }
    },
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
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "AI/ML Track",
            facilities: ["Study Desk", "Bed", "Wi-Fi"],
            description: "Ground floor quiet study pod.",
            sharedNotesCount: 30,
            resources: []
          },
          {
            id: "h1-102",
            hostelId: "hostel-1",
            floorId: "h1-f1",
            floorNumber: 1,
            roomNumber: "102",
            status: "occupied",
            roomType: "Single",
            capacity: 1,
            occupants: [{ name: "Pooja Sharma", roll: "22BCSE102", branch: "CSE" }],
            branch: "CSE",
            facilities: ["Study Desk", "Bed", "Wi-Fi"],
            description: "Occupied room.",
            sharedNotesCount: 28,
            resources: []
          },
          {
            id: "h1-103",
            hostelId: "hostel-1",
            floorId: "h1-f1",
            floorNumber: 1,
            roomNumber: "103",
            status: "available",
            roomType: "Double",
            capacity: 2,
            occupants: [],
            branch: "Data Analytics",
            facilities: ["2 Study Desks", "2 Beds", "Wi-Fi"],
            description: "Double occupancy room.",
            sharedNotesCount: 19,
            resources: []
          }
        ]
      },
      {
        id: "h1-f2",
        hostelId: "hostel-1",
        floorNumber: 2,
        name: "First Floor",
        rooms: [
          {
            id: "h1-201",
            hostelId: "hostel-1",
            floorId: "h1-f2",
            floorNumber: 2,
            roomNumber: "201",
            status: "available",
            roomType: "Single",
            capacity: 1,
            occupants: [],
            branch: "Cloud Track",
            facilities: ["Study Desk", "Bed", "Wi-Fi"],
            description: "First floor balcony room.",
            sharedNotesCount: 24,
            resources: []
          },
          {
            id: "h1-202",
            hostelId: "hostel-1",
            floorId: "h1-f2",
            floorNumber: 2,
            roomNumber: "202",
            status: "occupied",
            roomType: "Single",
            capacity: 1,
            occupants: [{ name: "Neha Verma", roll: "22BIT202", branch: "IT" }],
            branch: "IT",
            facilities: ["Study Desk", "Bed", "Wi-Fi"],
            description: "Occupied room.",
            sharedNotesCount: 35,
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
      // Active View State
      hostels: initialHostels,
      selectedHostelId: "hostel-4",
      selectedFloorNumber: null,
      selectedRoomId: "303",
      cameraMode: "overview", // 'overview' | 'floor' | 'room'
      activeInteriorTab: "interior", // 'room-view' | 'interior' | 'study-area' | 'bed-area'
      searchQuery: "",
      isExplodedView: false,
      lightingMode: "day", // 'day' | 'night'
      qualityMode: "high", // 'high' | 'balanced' | 'performance'
      favoriteRoomIds: ["303", "101"],
      comparedRoomIds: [],
      activeInteractiveModal: null, // null | 'laptop-workspace' | 'bookshelf-resources' | 'stats' | 'share-qr' | 'compare'
      activeBookSubject: "COA",

      // Setters
      setSelectedHostelId: (id) =>
        set((state) => {
          const hostel = state.hostels.find((h) => h.id === id) || state.hostels[0];
          const firstRoom = hostel?.floors?.[0]?.rooms?.[0]?.id || null;
          return {
            selectedHostelId: id,
            selectedFloorNumber: null,
            selectedRoomId: firstRoom,
            cameraMode: "overview",
            isExplodedView: false
          };
        }),

      setSelectedFloorNumber: (floorNum) =>
        set((state) => ({
          selectedFloorNumber: floorNum,
          cameraMode: floorNum !== null ? "floor" : "overview"
        })),

      setSelectedRoomId: (roomId) =>
        set({
          selectedRoomId: roomId,
          cameraMode: roomId ? "room" : "overview"
        }),

      setCameraMode: (mode) => set({ cameraMode: mode }),
      setActiveInteriorTab: (tab) => set({ activeInteriorTab: tab }),
      setSearchQuery: (query) => set({ searchQuery: query }),

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
            return state;
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

      // ===================================================
      // Admin CRUD & Architectural Layout Operations
      // ===================================================

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

      updateHostelLayout: (hostelId, layoutUpdates) => {
        set((state) => ({
          hostels: state.hostels.map((h) => {
            if (h.id !== hostelId) return h;
            return {
              ...h,
              layoutConfig: {
                ...(h.layoutConfig || {}),
                ...layoutUpdates
              },
              updated_at: new Date().toISOString()
            };
          })
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

      updateFloor: (hostelId, floorId, updates) => {
        set((state) => ({
          hostels: state.hostels.map((h) => {
            if (h.id !== hostelId) return h;
            return {
              ...h,
              floors: h.floors.map((f) => (f.id === floorId ? { ...f, ...updates } : f))
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

      duplicateFloor: (hostelId, floorId) => {
        set((state) => {
          const hostel = state.hostels.find((h) => h.id === hostelId);
          if (!hostel) return state;

          const sourceFloor = hostel.floors.find((f) => f.id === floorId);
          if (!sourceFloor) return state;

          const nextFloorNumber = hostel.floors.length + 1;
          const newFloorId = `${hostelId}-f${nextFloorNumber}-${Date.now().toString().slice(-4)}`;

          const clonedRooms = (sourceFloor.rooms || []).map((r, idx) => {
            const newRoomNumber = `${nextFloorNumber}0${idx + 1}`;
            return {
              ...r,
              id: `${hostelId}-${newRoomNumber}-${Date.now().toString().slice(-4)}`,
              floorId: newFloorId,
              floorNumber: nextFloorNumber,
              roomNumber: newRoomNumber,
              status: "available",
              occupants: []
            };
          });

          const newFloor = {
            id: newFloorId,
            hostelId,
            floorNumber: nextFloorNumber,
            name: `Floor ${nextFloorNumber}`,
            rooms: clonedRooms
          };

          return {
            hostels: state.hostels.map((h) => {
              if (h.id !== hostelId) return h;
              return {
                ...h,
                floors: [...h.floors, newFloor]
              };
            })
          };
        });
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

      duplicateRoom: (hostelId, floorId, roomId) => {
        set((state) => {
          const hostel = state.hostels.find((h) => h.id === hostelId);
          if (!hostel) return state;
          const floor = hostel.floors.find((f) => f.id === floorId);
          if (!floor) return state;
          const sourceRoom = floor.rooms.find((r) => r.id === roomId);
          if (!sourceRoom) return state;

          const roomCount = floor.rooms.length + 1;
          const newRoomNum = `${floor.floorNumber}0${roomCount}`;
          const newRoom = {
            ...sourceRoom,
            id: `${hostelId}-${newRoomNum}-${Date.now().toString().slice(-4)}`,
            roomNumber: newRoomNum,
            status: "available",
            occupants: []
          };

          return {
            hostels: state.hostels.map((h) => {
              if (h.id !== hostelId) return h;
              return {
                ...h,
                floors: h.floors.map((f) => {
                  if (f.id !== floorId) return f;
                  return {
                    ...f,
                    rooms: [...f.rooms, newRoom]
                  };
                })
              };
            })
          };
        });
      },

      smartGenerateRoomsForFloor: (hostelId, floorId, count = 6, startNum = 1, roomType = "Single") => {
        set((state) => {
          const hostel = state.hostels.find((h) => h.id === hostelId);
          if (!hostel) return state;
          const floor = hostel.floors.find((f) => f.id === floorId);
          if (!floor) return state;

          const floorNum = floor.floorNumber;
          const generatedRooms = Array.from({ length: count }, (_, idx) => {
            const roomSeq = startNum + idx;
            const roomNumber = `${floorNum}${roomSeq < 10 ? '0' : ''}${roomSeq}`;
            return {
              id: `${hostelId}-${roomNumber}`,
              hostelId,
              floorId,
              floorNumber: floorNum,
              roomNumber,
              status: idx % 2 === 0 ? "available" : "occupied",
              roomType,
              capacity: roomType === "Double" ? 2 : 1,
              occupants: idx % 2 !== 0 ? [{ name: `Student ${roomNumber}`, branch: "Engineering" }] : [],
              branch: "Academic Pod",
              facilities: ["Study Table", "Chair", "Bed", "Bookshelf", "Wi-Fi"],
              description: `Room ${roomNumber} on Floor ${floorNum}`,
              sharedNotesCount: 15,
              activeStudyGroup: "Hostel Study Group",
              resources: []
            };
          });

          return {
            hostels: state.hostels.map((h) => {
              if (h.id !== hostelId) return h;
              return {
                ...h,
                floors: h.floors.map((f) => {
                  if (f.id !== floorId) return f;
                  return {
                    ...f,
                    rooms: generatedRooms
                  };
                })
              };
            })
          };
        });
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
      version: 3
    }
  )
);
