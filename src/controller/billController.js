import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { billService } from "../services/billService";

const getList = async (req, res, next) => {
  try {
      const bills = await billService.getList();
      res.status(StatusCodes.OK).json({ message: "get list sucessful", bills });
  }
  catch (error) {
      next(error);
  }
}

const createNew = async (req, res, next) => {
  try {
    const billData = req.body;
    const createNew = await billService.createNew(billData);
    res.status(StatusCodes.CREATED).json({ createNew });
  } catch (error) {
    next(error);
  }
};

const updateNew = async (req, res, next) => {
const billData = req.body;
  try {
    const updateNew = await billService.updateNew(id, billData);
    res
      .status(StatusCodes.OK)
      .json({ message: "Cập nhật tthành công", updateNew });
  } catch (error) {
    next(error);
  }
};

export const billController = {
  createNew,
  updateNew,
  getList

};
