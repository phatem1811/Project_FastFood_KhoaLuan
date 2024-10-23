import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { billService } from "../services/billService";

const getList = async (req, res, next) => {
  try {
    // console.log("check")
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
const getListByDate = async (req, res, next) => {
  const { startDate, endDate } = req.body; 

  try {
    const data = await billService.getListByDate(startDate, endDate);
    res.status(200).json({ data });
  } catch (error) {
    // Xử lý lỗi và trả về phản hồi
    next(error);
  }
};

const createNew = async (req, res, next) => {
  try {
    const billData = req.body;
    const createNew = await billService.createNew(billData);
    res.status(StatusCodes.CREATED).json({ createNew });
  } catch (error) {
    next(error);
  }
};

const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;     
    const updatedBill = await billService.updateBill(id, state);

    return res.status(200).json(updatedBill);
  } catch (error) {
    next(error);
  }
};
const getById = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const bill = await billService.getById(id);
    return res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    next(error); 
  }
};


export const billController = {
  createNew,
  getById,
  getList,
  updateBill,
  getListByDate

};
