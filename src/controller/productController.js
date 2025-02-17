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

const getTop10ProductSales = async (req, res, next) => {
    try {
        const products = await productService.getTop10ProductSales();
        res.status(StatusCodes.OK).json({ message: "Get list successfull", products });
    }
    catch (error) {
        next(error);
    }
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
const hardDeleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleted = await productService.hardDeleteProduct(id);
    res.status(StatusCodes.OK).json({ message: "Xóa sản phẩm thành công", deleted });
  } catch (error) {
    next(error);
  }
};
const getById = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const product = await productService.getById(id);
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error); 
  }
};

const searchProduct = async (req, res) => {
  try {
    const { name } = req.query; 

    const products = await productService.searchProductByName(name);

    return res.status(200).json(products);
  } catch (error) {
    next(error); 
  }
};


export const getProductListPage = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.size) || 5;
    const searchTerm = req.query.search || ""; 
    const cateId = req.query.cateId || null;
    const isSelling = req.query.isSelling || null;

    const result = await productService.getListPage(page, limit, searchTerm, cateId, isSelling);

    res.status(200).json(result);
  } catch (error) {
    next(error); 
  }
};


export const productController = {
  getTop10ProductSales, createNew,  getList, updateNew, getProductsByCategory, unblockProduct, deleteProduct, getById, searchProduct, getProductListPage, hardDeleteProduct
}


