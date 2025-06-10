require("dotenv").config();

import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE;

export const generateToken = (userId) => {
  const token = jwt.sign({ userId: userId }, SECRET_KEY, {
    expiresIn: JWT_EXPIRE,
  });
  return token;
};

export const getUserIdFromToken = (token) => {
  const decodedToken = jwt.verify(token, SECRET_KEY);
  return decodedToken.id;
};

// module.exports = {
//   generateToken,
//   getUserIdFromToken,
// };
