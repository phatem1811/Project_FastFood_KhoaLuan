import { PROCESSING } from "http-status-codes";
import Account from "../models/account";
import jwt from "jsonwebtoken";
require("dotenv").config();
const createNew = async (reqBody) => {
  try {
    const newAccount = new Account(reqBody);
    const saveAccount = await newAccount.save();
    return saveAccount;
  } catch (error) {
    throw error;
  }
};

const login = async (phonenumber, password) => {
  try {
    const account = await Account.findOne({ phonenumber });

    if (!account) {
      throw new Error("Số điện thoại hoặc Mật khẩu không đúng.");
    }

    if (account.password !== password) {
        throw new Error("Số điện thoại hoặc Mật khẩu không đúng");
    }

    const access_token = jwt.sign(
        { id: account._id, phonenumber: account.phonenumber }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRE } 
    );
  


    return { account, access_token };
  } catch (error) {
    throw error;
  }
};

export const accountService = {
  createNew, login,
};
