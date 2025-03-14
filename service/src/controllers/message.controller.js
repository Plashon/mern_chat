import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filterUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    res.status(200).json(filterUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while getting user info" });
  }
};

export const setMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is require" });
    }
    const senderId = req.user._id;
    const { text, image } = req.body;
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage =  new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    //real time chat
    //sender
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json(newMessage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while sending message" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error while getting message" });
  }
};
