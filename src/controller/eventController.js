import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";

import { eventService } from "../services/eventService"
const  createNew = async (req, res, next) => {
    try {
        const createNew = await eventService.createNew(req.body);
        res.status(StatusCodes.CREATED).json({createNew});
    }
    catch (error) { next(error); }
}

const getList = async (req, res, next) => {
    try {
        const events = await eventService.getList();
        res.status(StatusCodes.OK).json({ message: "Get list successfull", events });
    }
    catch (error) {
        next(error);
    }
}

const updateNew = async (req, res, next) => {
    const { id } = req.params;
    const { products } = req.body;
    try {
      const updateNew = await eventService.updateNew(id, req.body);
      res.status(StatusCodes.OK).json({ message: "Cập nhật tthành công", updateNew });
    } catch (error) {
      next(error);
    }
  };

const deleteEvent = async (req, res, next) => {
    const { id } = req.params;
    try {
      const deleted = await eventService.deleteEvent(id, req.body);
      res.status(StatusCodes.OK).json({ message: "Khóa sự kiện thành công", deleted });
    } catch (error) {
      next(error);
    }
  };


//   const unblockCategory = async (req, res, next) => {
//     const { id } = req.params;
//     try {
//       const unblockcate = await eventService.unblockCategory(id, req.body);
//       res.status(StatusCodes.OK).json({ message: "Mở khóa danh mục thành công", unblockcate });
//     } catch (error) {
//       next(error);
//     }
//   };
 
  
  const getById = async (req, res, next) => {
    try {
      const { id } = req.params; 
      const evnent = await eventService.getById(id);
      return res.status(200).json({
        success: true,
        data: evnent,
      });
    } catch (error) {
      next(error); 
    }
  };
  

export const eventController = {
    createNew,  getList, updateNew, deleteEvent, getById
}


