import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { choiceService } from "../services/choiceService";

const createNew = async (req, res, next) => {
  try {
    const createNew = await choiceService.createNew(req.body);
    res.status(StatusCodes.CREATED).json({ createNew });
  } catch (error) {
    next(error);
  }
};

const getList = async (req, res, next) => {
  try {
    const data = await choiceService.getList();
    res.status(StatusCodes.OK).json({ message: "Lấy danh sách thành công", data });
  } catch (error) {
    next(error);
  }
};

const updateNew = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updateNew = await choiceService.updateNew(id, req.body);
    res.status(StatusCodes.OK).json({ message: "Cập nhật thành công", updateNew });
  } catch (error) {
    next(error);
  }
};

const deleteChoice = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await choiceService.deleteChoice(id);
    res.status(StatusCodes.OK).json({ message: "Xóa tùy chọn thành công", deleted });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const optional = await choiceService.getById(id);
    return res.status(StatusCodes.OK).json({
      success: true,
      data: optional,
    });
  } catch (error) {
    next(error);
  }
};
const getChoicesByOptionalId = async (req, res, next) => {
    const { optionalId } = req.query; 
    console.log("check", optionalId);
    try {
      const choices = await choiceService.getChoicesByOptionalId(optionalId);
      
      res.status(StatusCodes.OK).json({ message: "Lấy danh sách lựa chọn thành công", choices });
    } catch (error) {
      next(error);
    }
  };

export const choiceController = {
  createNew,
  getList,
  updateNew,
  deleteChoice,
  getById,
  getChoicesByOptionalId,
};
