import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";
import { voucherService } from "../services/voucherService";

const createNew = async (req, res, next) => {
  console.log("check body" )
    try {
      
        const createNew = await voucherService.createNew(req.body);
        res.status(StatusCodes.CREATED).json({createNew});
    }
    catch (error) { next(error); }
}

const getList = async (req, res, next) => {
    try {
        const voucher = await voucherService.getList();
        res.status(StatusCodes.OK).json({ message: "Get list successfull", voucher });
    }
    catch (error) {
        next(error);
    }
}

const updateNew = async (req, res, next) => {
    const { id } = req.params;
    try {
      const updateNew = await voucherService.updateNew(id, req.body);
      res.status(StatusCodes.OK).json({ message: "Cập nhật tthành công", updateNew });
    } catch (error) {
      next(error);
    }
  };

//   const deleteVoucher = async (req, res, next) => {
//     const { id } = req.params;
//     try {
//       const deletecate = await voucherService.deleteVoucher(id, req.body);
//       res.status(StatusCodes.OK).json({ message: "Khóa danh mục thành công", deletecate });
//     } catch (error) {
//       next(error);
//     }
//   };


//   const unblockVoucher = async (req, res, next) => {
//     const { id } = req.params;
//     try {
//       const unblockcate = await voucherService.unblockVoucher(id, req.body);
//       res.status(StatusCodes.OK).json({ message: "Mở khóa danh mục thành công", unblockcate });
//     } catch (error) {
//       next(error);
//     }
//   };
 
  
  const getById = async (req, res, next) => {
    try {
      const { id } = req.params; 
      const voucher = await voucherService.getById(id);
      return res.status(200).json({
        success: true,
        data: voucher,
      });
    } catch (error) {
      next(error); 
    }
  };

  const getCode = async (req, res, next) => {
    try {
      const { code } = req.body; 
      const voucher = await voucherService.getCode(code);
      return res.status(200).json({
        success: true,
        data: voucher,
      });
    } catch (error) {
      next(error); 
    }
  };
  

export const voucherController = {
    createNew,  getList, updateNew, getById, getCode
}


