import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { categoryService } from "../services/categoryService";
import { accountService } from "../services/accountService";
const  createNew = async (req, res, next) => {
    try {
        const createNew = await categoryService.createNew(req.body);
        res.status(StatusCodes.CREATED).json({createNew});
    }
    catch (error) { next(error); }
}

const getList = async (req, res, next) => {
    try {
        const categories = await categoryService.getList();
        res.status(StatusCodes.OK).json({ message: "Get list successfull", categories });
    }
    catch (error) {
        next(error);
    }
}

const updateNew = async (req, res, next) => {
    const { id } = req.params;
    try {
      const updateNew = await categoryService.updateNew(id, req.body);
      res.status(StatusCodes.OK).json({ message: "Cập nhật tthành công", updateNew });
    } catch (error) {
      next(error);
    }
  };

export const categoryController = {
    createNew,  getList, updateNew
}

