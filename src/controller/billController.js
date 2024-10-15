import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { billService } from "../services/billService";

const getList = async (req, res, next) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.size) || 10;
      const phone_shipment = req.query.phone || ""; 
      const accountId = req.query.accountId || null;
      const data = await billService.getList(page,limit,phone_shipment, accountId);
      res.status(StatusCodes.OK).json({ message: "get list sucessful", data });
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
