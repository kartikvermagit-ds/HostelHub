/**
 * Hostel & Room Controller for 3D Digital Twin Explorer
 */

// In-memory persistent demo data fallback
let hostelsData = [
  {
    id: "hostel-4",
    name: "Hostel 4",
    displayName: "Boys Hostel 4 (Aryabhata Block)",
    description: "CSE & IT resident student hostel.",
    hostelType: "boys",
    accentColor: "#00685f",
    floors: 3,
    created_at: new Date().toISOString()
  }
];

let roomsData = [
  {
    id: "101",
    hostelId: "hostel-4",
    floorNumber: 1,
    roomNumber: "101",
    status: "available",
    roomType: "Single",
    capacity: 1,
    facilities: ["Study Table", "Chair", "Bed", "Wi-Fi"]
  },
  {
    id: "303",
    hostelId: "hostel-4",
    floorNumber: 3,
    roomNumber: "303",
    status: "available",
    roomType: "Single",
    capacity: 1,
    facilities: ["Study Table", "Ergonomic Chair", "Bed", "Bookshelf", "Wi-Fi", "Fan", "Curtains"]
  }
];

export const getHostels = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: hostelsData
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getHostelById = async (req, res) => {
  try {
    const { id } = req.params;
    const hostel = hostelsData.find((h) => h.id === id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: "Hostel not found" });
    }
    return res.status(200).json({ success: true, data: hostel });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createHostel = async (req, res) => {
  try {
    const { name, displayName, description, hostelType, floors } = req.body;
    const newHostel = {
      id: `hostel-${Date.now()}`,
      name: name || "New Hostel",
      displayName: displayName || name,
      description: description || "",
      hostelType: hostelType || "boys",
      accentColor: "#00685f",
      floors: parseInt(floors || "3", 10),
      created_at: new Date().toISOString()
    };
    hostelsData.push(newHostel);
    return res.status(201).json({ success: true, data: newHostel });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const index = hostelsData.findIndex((h) => h.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Hostel not found" });
    }
    hostelsData[index] = { ...hostelsData[index], ...req.body, updated_at: new Date().toISOString() };
    return res.status(200).json({ success: true, data: hostelsData[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHostel = async (req, res) => {
  try {
    const { id } = req.params;
    hostelsData = hostelsData.filter((h) => h.id !== id);
    roomsData = roomsData.filter((r) => r.hostelId !== id);
    return res.status(200).json({ success: true, message: "Hostel deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getHostelRooms = async (req, res) => {
  try {
    const { id } = req.params;
    const rooms = roomsData.filter((r) => r.hostelId === id);
    return res.status(200).json({ success: true, data: rooms });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
