import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are require" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email is already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while registering a new user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are require" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid credentials!" });
    }
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error while logged in" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error while logged out" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile Picture is require" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    if (!uploadResponse) {
      res
        .status(500)
        .json({ message: "Error while  updating profile picture" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res
        .status(500)
        .json({ message: "Error while  updating profile picture" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while  updating profile" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error while checking Auth" });
  }
};
