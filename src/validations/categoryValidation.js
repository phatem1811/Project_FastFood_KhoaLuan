import express from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import Category from "../models/category"
import ApiError from '../utils/ApiError'

const CreateCategory = async (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().required().trim().max(100)
        .messages({
          "string.empty": "Tên danh mục không được để trống",
          "any.required": "Tên danh mục là bắt buộc",
        }),
      isActive: Joi.boolean().optional(),
    });
  
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
  
      const { name } = req.body;
      const existingCategory = await Category.findOne({ name });
  
      if (existingCategory) {
        return next(new ApiError(StatusCodes.BAD_REQUEST, "Tên danh mục đã tồn tại",  "CATEGORY_NAME_EXISTS"));
      }
  
      next();
    } catch (error) {
      next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
}
export const categoryValidation = {
    CreateCategory, 
}


