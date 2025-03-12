import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.KEY_PASS;
const node_mode = process.env.NODE_ENV;

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, secret, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000, //ms
    httpOnly: true, //xss attacks
    sameSite: "strict", //csrf attacks
    secure: node_mode !=="development",
  });

  
  console.log("token generated ans cookie tools");
};
