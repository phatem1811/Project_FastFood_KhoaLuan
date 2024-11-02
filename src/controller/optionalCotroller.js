import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { optionalService } from "../services/optionalService";

const createNew = async (req, res, next) => {
  try {
    const createNew = await optionalService.createNew(req.body);
    res.status(StatusCodes.CREATED).json({ createNew });
  } catch (error) {
    next(error);
  }
};

const getList = async (req, res, next) => {
  try {
    const optionals = await optionalService.getList();
    res.status(StatusCodes.OK).json({ message: "Lấy danh sách thành công", optionals });
  } catch (error) {
    next(error);
  }
};

const updateNew = async (req, res, next) => {
  const { id } = req.params;
  try {
    const updateNew = await optionalService.updateNew(id, req.body);
    res.status(StatusCodes.OK).json({ message: "Cập nhật thành công", updateNew });
  } catch (error) {
    next(error);
  }
};

const deleteOptional = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await optionalService.deleteOptional(id);
    res.status(StatusCodes.OK).json({ message: "Xóa tùy chọn thành công", deleted });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const optional = await optionalService.getById(id);
    return res.status(StatusCodes.OK).json({
      success: true,
      data: optional,
    });
  } catch (error) {
    next(error);
  }
};

export const optionalController = {
  createNew,
  getList,
  updateNew,
  deleteOptional,
  getById,
};
