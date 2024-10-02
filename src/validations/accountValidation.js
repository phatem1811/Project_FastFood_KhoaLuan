import express from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import Account from "../models/account"
import ApiError from '../utils/ApiError'

const createAccount = async (req, res, next) => {
    const checkEmpty = Joi.object({
        phonenumber: Joi.string().required().min(3).max(50).trim().strict()
            .pattern(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/)
            .messages({
                'string.empty': 'Số điện thoại không được để trống',
                'string.pattern.base': 'Số điện thoại không hợp lệ',
                'any.required': 'Số điện thoại là bắt buộc',
            }),
        password: Joi.string().required().min(6).max(50).trim().strict()
            .messages({
                'string.empty': 'Mật khẩu không được để trống',
                'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
                'any.required': 'Mật khẩu là bắt buộc',
            }),
        address: Joi.string().required().min(3).max(50).trim().strict()
            .messages({
                'string.empty': 'Địa chỉ không được để trống',
                'string.min': 'Địa chỉ phải có ít nhất 3 ký tự',
                'any.required': 'Địa chỉ là bắt buộc',
            }),
    })

    try {
        await checkEmpty.validateAsync(req.body, { abortEarly: false })

        const { phonenumber } = req.body
        const existingAccount = await Account.findOne({ phonenumber })
        
        if (existingAccount) {

            next(new ApiError(StatusCodes.BAD_REQUEST, "Số điện thoại đã tồn tại" ));

        }
        next();

        // res.status(StatusCodes.CREATED).json({ message: "Post: created successfully" })
    } catch (error) {

        next(new ApiError(StatusCodes.BAD_REQUEST,  new Error(error).message ) );

    }
}

export const accountValidation = {
    createAccount
}
