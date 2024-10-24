import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";

import { ingredientService } from "../services/ingredientService"
const  createNew = async (req, res, next) => {
    try {
        const createNew = await ingredientService.createNew(req.body);
        res.status(StatusCodes.CREATED).json({createNew});
    }
    catch (error) { next(error); }
}

const getList = async (req, res, next) => {
    try {
        const ingredients = await ingredientService.getList();
        res.status(StatusCodes.OK).json({ message: "Get list successfull", ingredients });
    }
    catch (error) {
        next(error);
    }
}

const updateNew = async (req, res, next) => {
    const { id } = req.params;
    try {
      const updateNew = await ingredientService.updateNew(id, req.body);
      res.status(StatusCodes.OK).json({ message: "Cập nhật tthành công", updateNew });
    } catch (error) {
      next(error);
    }
  };


  const deleteById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const deletedIngredient = await ingredientService.deleteById(id);
      res.status(StatusCodes.OK).json({ message: "Xóa thành công", deletedIngredient });
    } catch (error) {
      next(error);
    }
  };


  
  const getById = async (req, res, next) => {
    try {
      const { id } = req.params; 
      const ingredient = await ingredientService.getById(id);
      return res.status(200).json({
        message: "Successfull", ingredient
      });
    } catch (error) {
      next(error); 
    }
  };
  const getMonthlyExpenses = async (req, res, next) => {
    try {
      const { year } = req.query; 
      if (!year) {
        year = 2024
      }
  
      const data = await ingredientService.getMonthlyExpenses(year);
      return res.status(StatusCodes.OK).json({
        data
      });
    } catch (error) {
      next(error);
    }
  };

export const ingredientController = {
    createNew,  getList, updateNew, getById, deleteById, getMonthlyExpenses
}


