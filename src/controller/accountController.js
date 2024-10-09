import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { accountService } from "../services/accountService";
const createNew = async (req, res, next) => {
    try {
        const createAccount = await accountService.createNew(req.body);
        res.status(StatusCodes.CREATED).json({createAccount});
    }
    catch (error) { next(error); }
}

const login = async (req, res, next) => {
    const { phonenumber, password } = req.body;
    try {
        const accountLogin = await accountService.login(phonenumber, password);
        res.status(StatusCodes.OK).json({ message: "Đăng nhập thành công", accountLogin });
    }
    catch (error) { next(error); }
}
const getList = async (req, res, next) => {
    try {
        const accounts = await accountService.getList();
        res.status(StatusCodes.OK).json({ message: "Get list successfull", accounts });
    }
    catch (error) {
        next(error);
    }
}

const updateAccount = async (req, res, next) => {
    const { id } = req.params;
    try {
      const updatedAccount = await accountService.updateAccount(id, req.body);
      res.status(StatusCodes.OK).json({ message: "Cập nhật tài khoản thành công", updatedAccount });
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
    const {id, currentPassword, newPassword, confirmPassword } = req.body;
    
  
    try {
      if (newPassword !== confirmPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Mật khẩu xác nhận không khớp." });
      }
 
      const result = await accountService.changePassword(id, currentPassword, newPassword);
      res.status(StatusCodes.OK).json({ message: result.message });
    } catch (error) {
      next(error); 
    }
  };


export const accountController = {
    createNew, login, getList, updateAccount, getUserProfileHandler, changePassword, getById
}


