import { Router } from "express";
import { User } from "../mongoose/schemas/user.js";
import { comparePass, hashPassword } from "../util/hashPassword.js";
const router = Router();

// GET ALL USERS IN DATABASE
router.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
});

// GET SPECIFIC USERS IN DATABASE USING ID
router.get("/api/users/:id", async (req, res) => {
  const userID = req.params.id;
  const user = await User.findById(userID);

  if (!user) {
    return res.status(400).send({ Message: "User Not Found" });
  }

  res.status(200).json(user);
});

// POST USERS TO DATABASE
router.post("/api/users", async (req, res) => {
  const { username, password, email, displayName } = req.body;

  if (!username || !password || !email || !displayName) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const hashpass = await hashPassword(password);

    // Create a new user instance
    const newUser = new User({ username, password: hashpass, email, displayName });
    const saveUser = await newUser.save();
    return res.status(201).json(saveUser);
  } catch (error) {
    console.error(`ERROR: ${error}`);

    if (error.code === 11000) {
      return res.status(409).json({ message: "Username or email already exists." });
    }

    return res.status(500).json({ message: "Internal server error." });
  }
});

// DELETE USERS IN DATABASE
router.delete("/api/users/:id", async (req, res) => {
  const userID = req.params.id;
  const user = await User.findByIdAndDelete(userID);
  res.status(200).json({ Message: "Delete Sucessfully" });
});

// UPDATE USERS IN DATABASE
router.patch("/api/users/:id", async (req, res) => {
  const { body } = req;
  const userID = req.params.id;

  try {
    const user = await User.findByIdAndUpdate(userID, body, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Update Successfully", user: user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Failed to update user", error: error.message });
  }
});

router.patch("/api/users/:id/password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = comparePass(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

export default router;
