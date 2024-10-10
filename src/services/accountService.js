import { StatusCodes } from "http-status-codes";
import Account from "../models/account";
import jwt from "jsonwebtoken";
import { getUserIdFromToken } from "../config/jwtProvider";
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
const getList = async () => {
  try {
    const accounts = await Account.find({});
    return accounts;
  } catch (error) {
    throw error;
  }
};
const updateAccount = async (id, reqBody) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(id, reqBody, {
      new: true,
    });
    if (!updatedAccount) {
      throw new Error("Không tìm thấy tài khoản.");
    }
    return updatedAccount;
  } catch (error) {
    throw error;
  }
};
const unblockAccount = async (id) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { state: true }, 
      { new: true }
    );

    if (!updatedAccount) {
      throw new Error("Không tìm thấy tài khoản.");
    }

    return updatedAccount;
  } catch (error) {
    throw error;
  }
};

const deleteAccount = async (id) => {
  try {
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { state: false }, 
      { new: true }
    );

    if (!updatedAccount) {
      throw new Error("Không tìm thấy tài khoản.");
    }

    return updatedAccount;
  } catch (error) {
    throw error;
  }
};

const findUserById = async (id) => {
  try {
    const acc = await Account.findById(id);
    if (!acc) {
      throw new Error("Không tìm thấy tài khoản.");
    }
    return acc;
  } catch (error) {
    throw error;
  }
};

const findUserProfileByJwt = async (jwt) => {
  try {
    const userId = getUserIdFromToken(jwt);

    const user = await Account.findById(userId);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};
const changePassword = async (id, currentPassword, newPassword) => {
  try {
    const acc = await Account.findById(id);
    if (!acc) {
      throw new Error("Người dùng không tồn tại.");
    }

    if (acc.password !== currentPassword) {
      throw new Error("Mật khẩu hiện tại không chính xác.");
    }

    acc.password = newPassword;
    await acc.save();

    return { message: "Mật khẩu đã được thay đổi thành công." };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getById = async (id) => {
  try {
    const account = await Account.findById(id);
    if (!account) {
      throw new Error("Không tìm thấy tài khoản");
    }
    return account;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const accountService = {
  createNew,
  login,
  getList,
  updateAccount,
  findUserById,
  findUserProfileByJwt,
  changePassword,
  getById,
  deleteAccount,
  unblockAccount,
};
