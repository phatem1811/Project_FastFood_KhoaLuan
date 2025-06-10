import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { accountService } from "../services/accountService";
import { authenticator } from "otplib";
import QRCode from "qrcode";

const SERVICE_NAME = "FastFoodOnline - admin";

import FA_SecretKey from "../models/2fa_secretKey";
import Account from "../models/account";
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
    res.status(StatusCodes.OK).json({ message: "Gửi OTP thành công" });
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  const { phonenumber, email } = req.body;
  try {
    await accountService.resetPassword(phonenumber, email);
    res.status(StatusCodes.OK).json({ message: "Gửi OTP thành công" });
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
const get_2FA_QRcode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await accountService.getById(id);

    if (!account) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy người dùng" });
    }

    if (account.role === 3) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User không cần đăng nhập 2FA" });
    }

    let faSecretKey;

    const twoFASecretKey = await FA_SecretKey.findOne({ account: id });

    if (!twoFASecretKey) {
      const new2FASecret = await FA_SecretKey.create({
        account: id,
        key: authenticator.generateSecret(),
      });
      faSecretKey = new2FASecret.key;
    } else {
      faSecretKey = twoFASecretKey.key;
    }

    const otpToken = authenticator.keyuri(
      account.email,
      SERVICE_NAME,
      faSecretKey
    );

    const qrcodeImageURL = await QRCode.toDataURL(otpToken);

    return res.status(StatusCodes.OK).json({ qrcode: qrcodeImageURL });
  } catch (error) {
    next(error);
  }
};
const verify_2fa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await accountService.getById(id);

    if (!account) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy người dùng" });
    }

    if (account.role === 3) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User không cần đăng nhập 2FA" });
    }

    const twoFASecretKey = await FA_SecretKey.findOne({ account: id });

    if (!twoFASecretKey) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy 2FA secret key" });
    }

    const clientOTPToken = req.body.otpToken;
    const isValid = authenticator.verify({
      token: clientOTPToken,
      secret: twoFASecretKey.key,
    });

    if (!isValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "OTP không đúng" });
    }

    await Account.findByIdAndUpdate(id, { showQrCode: false });

    return res
      .status(StatusCodes.OK)
      .json({ message: "Xác thực 2FA thành công." });
  } catch (error) {
    next(error);
  }
};

const reset_2fa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await accountService.getById(id);

    if (!account) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy người dùng" });
    }

    if (account.role === 3) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User không cần đăng nhập 2FA" });
    }

    const twoFASecretKey = await FA_SecretKey.findOne({ account: id });

    const newkey_2fa_Secret = authenticator.generateSecret();
    await FA_SecretKey.findByIdAndUpdate(twoFASecretKey._id, {
      key: newkey_2fa_Secret,
    });
    await Account.findByIdAndUpdate(id, { showQrCode: true });

    return res
      .status(StatusCodes.OK)
      .json({ message: "Reset 2FA thành công." });
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
  verifyOTPAndChangePassword,
  get_2FA_QRcode,
  verify_2fa,
  reset_2fa
};
