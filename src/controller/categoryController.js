import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { categoryService } from "../services/categoryService";
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

  const deleteCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
      const deletecate = await categoryService.deleteCategory(id, req.body);
      res.status(StatusCodes.OK).json({ message: "Khóa danh mục thành công", deletecate });
    } catch (error) {
      next(error);
    }
  };

  const hardDeleteCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
      const deletecate = await categoryService.harddeleteCategory(id);
      res.status(StatusCodes.OK).json({ message: "Xóa danh mục thành công", deletecate });
    } catch (error) {
      next(error);
    }
  };


  const unblockCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
      const unblockcate = await categoryService.unblockCategory(id, req.body);
      res.status(StatusCodes.OK).json({ message: "Mở khóa danh mục thành công", unblockcate });
    } catch (error) {
      next(error);
    }
  };
 
  
  const getById = async (req, res, next) => {
    try {
      const { id } = req.params; 
      const category = await categoryService.getById(id);
      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error); 
    }
  };
  

export const categoryController = {
    createNew,  getList, updateNew, deleteCategory, unblockCategory, getById,hardDeleteCategory
}


