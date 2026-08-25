/**
 * Configurable multi-hostel datasets for the 3D HostelHub Experience
 * Formatted for clean future REST API consumption:
 * GET /api/v1/hostels/:id/rooms
 */

export const hostelsData = {
  "hostel-4": {
    id: "hostel-4",
    name: "Hostel 4",
    tagline: "Aryabhatta Block • Engineering Scholars",
    totalFloors: 3,
    wings: ["A-Wing", "B-Wing"],
    accentColor: "#00685f",
    rooms: [
      // Ground Floor (Floor 1)
      {
        id: "101",
        floor: 1,
        wing: "A-Wing",
        hostel: "Hostel 4",
        status: "occupied",
        occupants: ["Rahul Sharma", "Kartik Verma"],
        branch: "CSE • 4th Sem",
        sharedNotesCount: 18,
        activeStudyGroup: "DSA & Algorithmic Design",
        position: [-1.4, 0.45, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "102",
        floor: 1,
        wing: "A-Wing",
        hostel: "Hostel 4",
        status: "available",
        occupants: [],
        branch: "Open Study Lounge",
        sharedNotesCount: 24,
        activeStudyGroup: "COA Mid-Term Prep Hub",
        position: [0, 0.45, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "103",
        floor: 1,
        wing: "B-Wing",
        hostel: "Hostel 4",
        status: "occupied",
        occupants: ["Aman Gupta"],
        branch: "ECE • 4th Sem",
        sharedNotesCount: 12,
        activeStudyGroup: "Digital Signals & Systems",
        position: [1.4, 0.45, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },

      // First Floor (Floor 2)
      {
        id: "201",
        floor: 2,
        wing: "A-Wing",
        hostel: "Hostel 4",
        status: "occupied",
        occupants: ["Vikram Patel", "Rohan Mehta"],
        branch: "CSE • 4th Sem",
        sharedNotesCount: 31,
        activeStudyGroup: "Operating Systems & Concurrency",
        position: [-1.4, 1.25, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "202",
        floor: 2,
        wing: "A-Wing",
        hostel: "Hostel 4",
        status: "occupied",
        occupants: ["Devansh Joshi"],
        branch: "IT • 4th Sem",
        sharedNotesCount: 15,
        activeStudyGroup: "DBMS SQL Solved Papers",
        position: [0, 1.25, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "203",
        floor: 2,
        wing: "B-Wing",
        hostel: "Hostel 4",
        status: "maintenance",
        occupants: [],
        branch: "Quiet Reading Room",
        sharedNotesCount: 8,
        activeStudyGroup: "Network Upgrades in progress",
        position: [1.4, 1.25, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },

      // Second Floor (Floor 3)
      {
        id: "301",
        floor: 3,
        wing: "A-Wing",
        hostel: "Hostel 4",
        status: "available",
        occupants: [],
        branch: "Hostel Library Annex",
        sharedNotesCount: 45,
        activeStudyGroup: "PYQ Archive & Formula Sheets",
        position: [-1.4, 2.05, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "302",
        floor: 3,
        wing: "A-Wing",
        hostel: "Hostel 4",
        status: "occupied",
        occupants: ["Siddharth Rao", "Priya K."],
        branch: "AI & ML • 4th Sem",
        sharedNotesCount: 29,
        activeStudyGroup: "Neural Networks & Math Prep",
        position: [0, 2.05, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "303",
        floor: 3,
        wing: "B-Wing",
        hostel: "Hostel 4",
        status: "occupied",
        occupants: ["Arjun Nair"],
        branch: "CSE • 4th Sem",
        sharedNotesCount: 19,
        activeStudyGroup: "Microprocessor Lab Cheatsheets",
        position: [1.4, 2.05, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      }
    ]
  },

  "hostel-2": {
    id: "hostel-2",
    name: "Hostel 2",
    tagline: "Bhaskara Block • Applied Sciences",
    totalFloors: 3,
    wings: ["East Wing", "West Wing"],
    accentColor: "#008378",
    rooms: [
      {
        id: "101",
        floor: 1,
        wing: "East Wing",
        hostel: "Hostel 2",
        status: "occupied",
        occupants: ["Karan Singh"],
        branch: "Mechanical • 4th Sem",
        sharedNotesCount: 14,
        activeStudyGroup: "Thermodynamics Solved Questions",
        position: [-1.4, 0.45, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "102",
        floor: 1,
        wing: "East Wing",
        hostel: "Hostel 2",
        status: "available",
        occupants: [],
        branch: "Common Study Room",
        sharedNotesCount: 22,
        activeStudyGroup: "Physics Mechanics Cheatsheets",
        position: [0, 0.45, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "103",
        floor: 1,
        wing: "West Wing",
        hostel: "Hostel 2",
        status: "occupied",
        occupants: ["Tanmay Roy"],
        branch: "Civil • 4th Sem",
        sharedNotesCount: 11,
        activeStudyGroup: "Structural Analysis Discussions",
        position: [1.4, 0.45, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "201",
        floor: 2,
        wing: "East Wing",
        hostel: "Hostel 2",
        status: "occupied",
        occupants: ["Aniket Sen"],
        branch: "Mathematics • 4th Sem",
        sharedNotesCount: 34,
        activeStudyGroup: "Linear Algebra & Calculus Notes",
        position: [-1.4, 1.25, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "202",
        floor: 2,
        wing: "East Wing",
        hostel: "Hostel 2",
        status: "occupied",
        occupants: ["Deepak V."],
        branch: "Electrical • 4th Sem",
        sharedNotesCount: 19,
        activeStudyGroup: "Circuit Analysis Lab Prep",
        position: [0, 1.25, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "203",
        floor: 2,
        wing: "West Wing",
        hostel: "Hostel 2",
        status: "available",
        occupants: [],
        branch: "Open Study Lounge",
        sharedNotesCount: 16,
        activeStudyGroup: "Exam Countdown Discussions",
        position: [1.4, 1.25, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      }
    ]
  },

  "hostel-1": {
    id: "hostel-1",
    name: "Hostel 1",
    tagline: "Ramanujan Block • Senior Academics",
    totalFloors: 2,
    wings: ["North Wing", "South Wing"],
    accentColor: "#384357",
    rooms: [
      {
        id: "101",
        floor: 1,
        wing: "North Wing",
        hostel: "Hostel 1",
        status: "occupied",
        occupants: ["Samarth P."],
        branch: "CSE • Final Year",
        sharedNotesCount: 52,
        activeStudyGroup: "Placement & System Design Archive",
        position: [-1.4, 0.45, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "102",
        floor: 1,
        wing: "North Wing",
        hostel: "Hostel 1",
        status: "occupied",
        occupants: ["Aditya N."],
        branch: "CSE • Final Year",
        sharedNotesCount: 40,
        activeStudyGroup: "Distributed Systems Project Room",
        position: [0, 0.45, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "103",
        floor: 1,
        wing: "South Wing",
        hostel: "Hostel 1",
        status: "available",
        occupants: [],
        branch: "Discussion Cell",
        sharedNotesCount: 28,
        activeStudyGroup: "Peer Review Hub",
        position: [1.4, 0.45, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      }
    ]
  },

  "hostel-3": {
    id: "hostel-3",
    name: "Hostel 3",
    tagline: "Kalam Block • Junior Cohort",
    totalFloors: 2,
    wings: ["A-Block", "B-Block"],
    accentColor: "#00685f",
    rooms: [
      {
        id: "101",
        floor: 1,
        wing: "A-Block",
        hostel: "Hostel 3",
        status: "occupied",
        occupants: ["Nikhil Sharma"],
        branch: "CSE • 2nd Sem",
        sharedNotesCount: 16,
        activeStudyGroup: "C Programming & Engineering Physics",
        position: [-1.4, 0.45, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "102",
        floor: 1,
        wing: "A-Block",
        hostel: "Hostel 3",
        status: "occupied",
        occupants: ["Yash Vardhan"],
        branch: "ECE • 2nd Sem",
        sharedNotesCount: 20,
        activeStudyGroup: "Engineering Drawing & Basic Electrical",
        position: [0, 0.45, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      },
      {
        id: "103",
        floor: 1,
        wing: "B-Block",
        hostel: "Hostel 3",
        status: "available",
        occupants: [],
        branch: "Freshers Collaboration Pod",
        sharedNotesCount: 25,
        activeStudyGroup: "1st Year PYQ Question Bank",
        position: [1.4, 0.45, 0.45],
        dimensions: [1.2, 0.7, 0.9]
      }
    ]
  }
};
