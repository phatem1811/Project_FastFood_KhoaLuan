import { StatusCodes } from "http-status-codes";
import Account from "../models/account";
import jwt from "jsonwebtoken";
import { getUserIdFromToken } from "../config/jwtProvider";
import { addOTP, verifyOTP, removeOTP, checkotp } from "../utils/otpStore";
import { generateOTP, sendOTP } from "../utils/mailler";
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
    if (account.state === false) {
      throw new Error("Tài khoản đã bị khóa.");
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
const getList = async (
  page = 1,
  limit = 10,
  phonenumber = null,
  state = null,
  role = null
) => {
  const skip = (page - 1) * limit;
  let searchQuery = {};
  if (phonenumber) {
    searchQuery = { phonenumber: { $regex: phonenumber, $options: "i" } };
  }
  if (state !== null) {
    searchQuery.state = state;
  }
  if (role !== null) {
    searchQuery.role = role;
  }
  const accounts = await Account.find(searchQuery).skip(skip).limit(limit);
  const totalAccount = await Account.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalAccount / limit);
  return {
    accounts,
    pagination: {
      currentPage: page,
      totalPages,
      totalAccount,
    },
  };
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
const requestOTP = async (req, res, next) => {
  const { email } = req.body;
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000;
  try {
    await sendOTP(email, otp);
    addOTP(email, otp, expiresAt);
  } catch (error) {
    throw new Error(error.message);
  }
};
const verifyOTPAndCreate = async (req, res, next) => {
  const { email, otp } = req.body;
 

  if (verifyOTP(email, otp)) {

    const createAccount = await createNew(req.body);
    return createAccount;
  } else {
    console.log("check screen",otp );
    throw new Error("OTP không hợp lệ hoặc đã hết hạn!");
  }
};

const resetPassword = async (phonenumber, email) => {
  const acc = await Account.findOne({ phonenumber, email });
  if (!acc) throw new Error("Tài khoản không tồn tại");

  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  await sendOTP(email, otp);
  addOTP(email, otp, expiresAt);
};

const verifyOTPAndChangePassword = async (req, res, next) => {
  const { phonenumber, email, otp, newPassword } = req.body;
  if (!verifyOTP(email, otp)) {
    throw new Error("OTP không hợp lệ hoặc đã hết hạn!");
  }

  const acc = await Account.findOneAndUpdate(
    { phonenumber, email }, 
    { password: newPassword }, 
    { new: true } 
  );

  if (!acc) {
    throw new Error("Người dùng không tồn tại!");
  }

  return acc;
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
  requestOTP,
  verifyOTPAndCreate,
  resetPassword,
  verifyOTPAndChangePassword
};
