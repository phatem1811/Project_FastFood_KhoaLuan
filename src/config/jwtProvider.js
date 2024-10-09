require("dotenv").config();

import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const generateToken = (userId) => {
  const token = jwt.sign({ userId: userId }, SECRET_KEY, {
    expiresIn: "48h",
  });
  return token;
};

export const getUserIdFromToken = (token) => {
  const decodedToken = jwt.verify(token, SECRET_KEY);
  return  decodedToken.id;
};

// module.exports = {
//   generateToken,
//   getUserIdFromToken,
// };
