import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError";

import { productService } from "../services/productService";
const  createNew = async (req, res, next) => {

    try {
        const createNew = await productService.createNew(req.body);
        res.status(StatusCodes.CREATED).json({createNew});
    }
    catch (error) { next(error); }
}

const getList = async (req, res, next) => {
    try {
        const products = await productService.getList();
        res.status(StatusCodes.OK).json({ message: "Get list successfull", products });
    }
    catch (error) {
        next(error);
    }
}

const getProductsByCategory = async (req, res, next) => {
    try {
      const categoryId = req.params.categoryId; // truyen param len url
      const products = await productService.getProductsByCategory(categoryId);
      res.status(200).json(products); 
    } catch (error) {
      next(error); 
    }
};

const updateNew = async (req, res, next) => {
    const { id } = req.params;
    ;
  
    try {
      const updateNew = await productService.updateNew(id, req.body);
      res.status(StatusCodes.OK).json({ message: "Cập nhật tthành công", updateNew });
    } catch (error) {
      next(error);
    }
  };


  
const unblockProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const unblock = await productService.unblockProduct(id, req.body);
    res.status(StatusCodes.OK).json({ message: "Mở khóa sản phẩm thành công", unblock });
  } catch (error) {
    next(error);
  }
};


const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await productService.deleteProduct(id, req.body);
    res.status(StatusCodes.OK).json({ message: "Khóa sản phẩm thành công", deleted });
  } catch (error) {
    next(error);
  }
};

export const productController = {
    createNew,  getList, updateNew, getProductsByCategory, unblockProduct, deleteProduct
}


