import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { accountService } from "../services/accountService";
const createNew = async (req, res, next) => {
  try {
    const createAccount = await accountService.createNew(req.body);
    res.status(StatusCodes.CREATED).json({ createAccount });
  } catch (error) {
    next(error);
  }
};

const requestOTP = async (req, res, next) => {
  try {
    await accountService.requestOTP(req);
    res
    .status(StatusCodes.OK)
    .json({ message: "Gửi OTP thành công" });
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  const { phonenumber, email } = req.body;
  try {
    await accountService.resetPassword(phonenumber, email);
    res
    .status(StatusCodes.OK)
    .json({ message: "Gửi OTP thành công" });
  } catch (error) {
    next(error);
  }
};
const verifyOTP = async (req, res, next) => {
  try {
    const createAccount = await accountService.verifyOTPAndCreate(req);
    res.status(StatusCodes.CREATED).json({ createAccount });
  } catch (error) {
    next(error);
  }
};
const verifyOTPAndChangePassword = async (req, res, next) => {
  try {
    const updateAcc = await accountService.verifyOTPAndChangePassword(req);
    res.status(StatusCodes.OK).json({ updateAcc });
  } catch (error) {
    next(error);
  }
};



const login = async (req, res, next) => {
  const { phonenumber, password } = req.body;
  try {
    const accountLogin = await accountService.login(phonenumber, password);
    res
      .status(StatusCodes.OK)
      .json({ message: "Đăng nhập thành công", accountLogin });
  } catch (error) {
    next(error);
  }
};
const getList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.size) || 10;
    const phonenumber = req.query.search || "";
    const state = req.query.state || null;
    const role = req.query.role || null;

    const data = await accountService.getList(
      page,
      limit,
      phonenumber,
      state,
      role
    );
    res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    next(error);
  }
};

const updateAccount = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updatedAccount = await accountService.updateAccount(id, req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: "Cập nhật tài khoản thành công", updatedAccount });
  } catch (error) {
    next(error);
  }
};

const unblockAccount = async (req, res, next) => {
  const { id } = req.params;
  try {
    const unblockAccount = await accountService.unblockAccount(id, req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: "Mở khóa tài khoản thành công", unblockAccount });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleteAccount = await accountService.deleteAccount(id, req.body);
    res
      .status(StatusCodes.OK)
      .json({ message: "Khóa tài khoản thành công", deleteAccount });
  } catch (error) {
    next(error);
  }
};

const getUserProfileHandler = async (req, res) => {
  try {
    const jwt = req.headers.authorization?.split(" ")[1];

    const user = await accountService.findUserProfileByJwt(jwt);
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await accountService.getById(id);
    return res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};
const changePassword = async (req, res, next) => {
  const { id, currentPassword, newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Mật khẩu xác nhận không khớp." });
    }

    const result = await accountService.changePassword(
      id,
      currentPassword,
      newPassword
    );
    res.status(StatusCodes.OK).json({ message: result.message });
  } catch (error) {
    next(error);
  }
};

export const accountController = {
  createNew,
  login,
  getList,
  updateAccount,
  getUserProfileHandler,
  changePassword,
  getById,
  deleteAccount,
  unblockAccount,
  requestOTP,
  verifyOTP,
  resetPassword,
  verifyOTPAndChangePassword
};
