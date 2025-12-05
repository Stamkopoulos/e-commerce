import User from "../models/User.js";

// Create a user
export const createUser = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { name, email, role } = req.body;

    //const existing = await User.findOne({ email }); // Later check clerkId as well
    const existing = await User.findOne({ clerkId });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const newUser = await User.create({
      clerkId,
      name,
      email,
      role,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Admin
export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found " });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin only. Would be secured with authentication
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Admin and user themselves
export const updateUser = async (req, res) => {
  try {
    //const clerkId = req.auth.userId; // Uncomment when integrating with Clerk
    const id = req.params.id;
    const { name, /*email,*/ role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, /*email,*/ role },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Admin and user themselves
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
