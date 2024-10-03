import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { accountService } from "../services/accountService";
const  createNew = async (req, res, next) => {
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

export const accountController = {
    createNew, login,
}


