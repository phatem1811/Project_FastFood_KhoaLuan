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
        fullname: Joi.string().required().max(50).trim().strict()
            .messages({
                'string.empty': 'Tên không được để trống',
                'any.required': 'Tên là bắt buộc',
            }),
        email: Joi.string().email().required().trim().strict()
            .messages({
                'string.empty': 'Email không được để trống',
                'string.email': 'Định dạng email không hợp lệ',
                'any.required': 'Email là bắt buộc',
            }),
    });

    try {
        await checkEmpty.validateAsync(req.body, { abortEarly: false });

        const { phonenumber, email } = req.body;
        
        const existingAccount = await Account.findOne({ phonenumber });
        if (existingAccount) {
            return next(new ApiError(StatusCodes.BAD_REQUEST, "Số điện thoại đã tồn tại",  "PHONE_EXISTS"));
        }
        const existingEmail = await Account.findOne({ email });
        if (existingEmail) {
            return next(new ApiError(StatusCodes.BAD_REQUEST, "Email đã tồn tại", "EMAIL_EXISTS"));
        }

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
    }
};

const updateAccount = async (req, res, next) => {
    const checkUpdate = Joi.object({
        phonenumber: Joi.string().required().min(3).max(50).trim().strict()
            .pattern(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/)
            .messages({
                'string.empty': 'Số điện thoại không được để trống',
                'string.pattern.base': 'Số điện thoại không hợp lệ',
                'any.required': 'Số điện thoại là bắt buộc',
            }),
        fullname: Joi.string().required().max(50).trim().strict()
            .messages({
                'string.empty': 'Tên không được để trống',
                'any.required': 'Tên là bắt buộc',
            }),
        password: Joi.string().optional().min(6).max(50).trim().strict()
            .messages({
                'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
            }),
        email: Joi.string().optional().email().messages({
            'string.email': 'Email không hợp lệ',
            }),
        address: Joi.string().optional().max(100).messages({
                'string.max': 'Địa chỉ không được vượt quá 100 ký tự',
            }),
        birthdate: Joi.date().optional().max('now').messages({
            'date.max': 'Ngày sinh không thể ở tương lai',
            }),
    });

    try {
        await checkUpdate.validateAsync(req.body, { abortEarly: false });

        const { id } = req.params;
        const { phonenumber } = req.body;

        const existingAccount = await Account.findOne({ phonenumber, _id: { $ne: id } });

        if (existingAccount) {
            return next(new ApiError(StatusCodes.BAD_REQUEST, "Số điện thoại đã tồn tại trên tài khoản khác"));
        }

        next();
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message));
    }
};

export const accountValidation = {
    createAccount, updateAccount, 
}
