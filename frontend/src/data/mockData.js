export const currentUser = {
  name: "Kartik",
  fullName: "Kartik Sharma",
  role: "Hostel 4 • Computer Science 2nd Year",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFjnYEejNU3zOZ8BYJ92mtUXGLwF2m62twD_awXsTmWWt29TDrcJQEPV0pR_JXQsOyMdjT7B-OZn0oFjmpaGMk1hMHoebslD4ntfxnq4TeugLHXP-U6OAJFPyXiITXSpR-eoLNj-KlnWMX_9Qgu15iZPc7upmr-EZmnzLDF89s_unyqT-XYLCiCHC3kuJFvU91NSOtnVX8J5QZI5b8rExD5YciaVCdTy9-t7znGNfNk2FS1NnZDgVrLA",
  stats: {
    notesShared: 14,
    downloads: 382,
    studyHours: 42
  }
};

export const upcomingCTs = [
  {
    id: "ct-1",
    code: "COA",
    title: "COA CT 1",
    subject: "Computer Organization & Architecture",
    dateTime: "Monday, 10:00 AM",
    timeLeft: "3 Days Left",
    timeLeftShort: "3 days left",
    daysLeftNum: 3,
    statusType: "urgent", // red badge
    progress: 72,
    topicsCovered: "8/11",
    semester: "Semester 4",
    icon: "memory"
  },
  {
    id: "ct-2",
    code: "DSA",
    title: "Linear Algebra & DSA Test",
    subject: "Data Structures & Algorithms",
    dateTime: "Wednesday, 2:00 PM",
    timeLeft: "5 Days Left",
    timeLeftShort: "5 days left",
    daysLeftNum: 5,
    statusType: "normal",
    progress: 45,
    topicsCovered: "5/12",
    semester: "Semester 4",
    icon: "account_tree",
    isTomorrow: true
  },
  {
    id: "ct-3",
    code: "DBMS",
    title: "DBMS Mid-term CT",
    subject: "Database Management Systems",
    dateTime: "Friday, 9:00 AM",
    timeLeft: "1 Week Left",
    timeLeftShort: "7 days left",
    daysLeftNum: 7,
    statusType: "normal",
    progress: 90,
    topicsCovered: "9/10",
    semester: "Semester 4",
    icon: "database"
  },
  {
    id: "ct-4",
    code: "Physics",
    title: "Quantum Mechanics Test",
    subject: "Applied Physics II",
    dateTime: "Next Tuesday, 11:00 AM",
    timeLeft: "10 Days Left",
    timeLeftShort: "10 days left",
    daysLeftNum: 10,
    statusType: "normal",
    progress: 30,
    topicsCovered: "3/10",
    semester: "Semester 4",
    icon: "science"
  }
];

export const initialResources = [
  {
    id: "res-1",
    title: "COA Unit 2 Complete Notes",
    subject: "COA",
    type: "PDF",
    author: "Rahul K.",
    timeAgo: "2 hours ago",
    size: "2.4 MB",
    downloads: 124,
    views: 290,
    icon: "picture_as_pdf",
    iconColor: "text-error",
    bgColor: "bg-error-container/40",
    description: "Detailed unit 2 notes covering Instruction Cycle, Addressing Modes, and ALU design with solved numericals."
  },
  {
    id: "res-2",
    title: "Data Structures PYQ 2023 Solved",
    subject: "DSA",
    type: "PDF",
    author: "Priya S.",
    timeAgo: "5 hours ago",
    size: "1.8 MB",
    downloads: 89,
    views: 180,
    icon: "description",
    iconColor: "text-primary",
    bgColor: "bg-surface-variant",
    description: "Previous year question solutions with step-by-step tree traversal diagrams and time complexity analysis."
  },
  {
    id: "res-3",
    title: "Operating Systems: Deadlock Lecture",
    subject: "OS",
    type: "VID",
    author: "Prof. Sharma",
    timeAgo: "1 day ago",
    size: "Link",
    duration: "45 mins",
    downloads: 0,
    views: 342,
    icon: "play_circle",
    iconColor: "text-on-secondary-container",
    bgColor: "bg-secondary-container",
    description: "Complete class recording on Banker's algorithm, Resource Allocation Graph, and deadlock prevention."
  },
  {
    id: "res-4",
    title: "Mathematics IV Formula Sheet & Cheatsheet",
    subject: "Maths",
    type: "PDF",
    author: "Aman V.",
    timeAgo: "2 days ago",
    size: "850 KB",
    downloads: 245,
    views: 410,
    icon: "picture_as_pdf",
    iconColor: "text-error",
    bgColor: "bg-error-container/40",
    description: "Concise 4-page cheat sheet for Fourier transforms, Laplace theorems, and probability distributions."
  },
  {
    id: "res-5",
    title: "DBMS ER-Diagram & Normalization Practice Set",
    subject: "DBMS",
    type: "PDF",
    author: "Neha T.",
    timeAgo: "3 days ago",
    size: "3.1 MB",
    downloads: 162,
    views: 315,
    icon: "description",
    iconColor: "text-primary",
    bgColor: "bg-surface-variant",
    description: "Practice questions for 1NF, 2NF, 3NF, BCNF with full solutions and relational algebra queries."
  }
];

export const subjectDeepDives = {
  "DSA": {
    name: "Data Structures & Algorithms",
    code: "DSA",
    unit: "Unit 1 & 2",
    progressPercent: 45,
    daysLeft: 2,
    topicsRemaining: 7,
    focusAreas: "Trees and Graphs",
    checklist: [
      {
        id: "check-1",
        title: "Important Topics & Concepts",
        desc: "Review basic definitions, time complexities, and core algorithms (Sorting, Searching).",
        icon: "description",
        completed: true
      },
      {
        id: "check-2",
        title: "Teacher's Class Notes",
        desc: "Read through Prof. Sharma's unit 1 PDF slides.",
        icon: "menu_book",
        completed: true
      },
      {
        id: "check-3",
        title: "Topper's Handwritten Notes",
        desc: "Download and review Rahul's notes for Tree traversals.",
        icon: "edit_note",
        completed: false
      },
      {
        id: "check-4",
        title: "Previous Year Questions (PYQs)",
        desc: "Solve 2022 and 2023 CT papers. Focus on dynamic programming questions.",
        icon: "history_edu",
        badge: "Crucial",
        completed: false
      },
      {
        id: "check-5",
        title: "Video Lectures",
        desc: "Watch NPTEL playlist on Graph Algorithms (Videos 14-18).",
        icon: "play_circle",
        completed: false
      }
    ]
  },
  "COA": {
    name: "Computer Organization & Architecture",
    code: "COA",
    unit: "Unit 2 & 3",
    progressPercent: 72,
    daysLeft: 3,
    topicsRemaining: 3,
    focusAreas: "Pipelining & Cache Mapping",
    checklist: [
      {
        id: "coa-1",
        title: "Pipelining Hazards & Branch Prediction",
        desc: "Structural, Data, and Control hazards with stall cycle calculations.",
        icon: "memory",
        completed: true
      },
      {
        id: "coa-2",
        title: "Cache Memory Mapping Techniques",
        desc: "Direct, Associative, and Set-Associative mapping problems.",
        icon: "description",
        completed: true
      },
      {
        id: "coa-3",
        title: "Amdahl's Law Calculations",
        desc: "Speedup and enhancement formula practice numericals.",
        icon: "menu_book",
        completed: false
      },
      {
        id: "coa-4",
        title: "Previous 5 Years Midterm Papers",
        desc: "2018-2023 unit 2 papers with solution keys.",
        icon: "history_edu",
        badge: "Crucial",
        completed: true
      }
    ]
  },
  "DBMS": {
    name: "Database Management Systems",
    code: "DBMS",
    unit: "Unit 1, 2 & 3",
    progressPercent: 90,
    daysLeft: 7,
    topicsRemaining: 1,
    focusAreas: "Transaction Concurrency & ACID",
    checklist: [
      {
        id: "dbms-1",
        title: "Relational Algebra Operations",
        desc: "Select, Project, Cartesian Product, Join, and Division queries.",
        icon: "database",
        completed: true
      },
      {
        id: "dbms-2",
        title: "Normalization & Functional Dependencies",
        desc: "1NF to BCNF decompositions with lossless join checks.",
        icon: "description",
        completed: true
      },
      {
        id: "dbms-3",
        title: "ACID Properties & Serializability",
        desc: "Conflict serializability precedence graphs.",
        icon: "menu_book",
        completed: true
      },
      {
        id: "dbms-4",
        title: "SQL Practice Queries",
        desc: "Nested subqueries, group by, having clauses.",
        icon: "history_edu",
        completed: false
      }
    ]
  }
};
