import express from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import Product from "../models/product"
import ApiError from '../utils/ApiError'

const CreateProduct = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required().max(100).trim()
            .messages({
                'string.empty': 'Tên sản phẩm không được để trống',
                'any.required': 'Tên sản phẩm là bắt buộc',
            }),
        picture: Joi.string().required().trim()
            .messages({
                'string.empty': 'Ảnh sản phẩm không được để trống',
                'any.required': 'Ảnh sản phẩm là bắt buộc',
            }),
        description: Joi.string().required().trim()
            .messages({
                'string.empty': 'Mô tả sản phẩm không được để trống',
                'any.required': 'Mô tả sản phẩm là bắt buộc',
            }),
        price: Joi.number().required().min(0)
            .messages({
                'number.base': 'Giá sản phẩm phải là số',
                'any.required': 'Giá sản phẩm là bắt buộc',
            }),

        category: Joi.string().optional().trim(),

        event: Joi.string().optional().trim(),

    });

    try {
        await schema.validateAsync(req.body, { abortEarly: false });

        const { name } = req.body;
        const existingProduct = await Product.findOne({ name });

        if (existingProduct) {
            return next(new ApiError(StatusCodes.BAD_REQUEST, "Tên sản phẩm đã tồn tại", "PRODUCT_NAME_EXISTS"));
        }

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error.message));
    }
};
export const productValidation = {
    CreateProduct, 
}


