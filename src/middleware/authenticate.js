const { getUserIdFromToken } = require("../config/jwtProvider");
import { accountService } from "../services/accountService";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No Token Provided" });
    }

    const userId = getUserIdFromToken(token);
    const user = await accountService.findUserById(userId);

    req.user = user;
  } catch (error) {
    console.log("error",error)
    return res.send({ error: error.message });
  }
  next();
};

// module.exports = authenticate;
