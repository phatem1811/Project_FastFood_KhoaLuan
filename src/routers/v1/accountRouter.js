import express from "express";
import { StatusCodes } from "http-status-codes";
// import accountController from '../../controller/accountController';

import { accountValidation } from "../../validations/accountValidation";
import { accountController } from "../../controller/accountController";
import { authenticate } from "../../middleware/authenticate";

const Router = express.Router();

Router.route("/list").get(accountController.getList);

Router.route("/create").post(accountController.createNew);

Router.route("/:id").put(accountController.updateAccount);

Router.route("/delete/:id").put(accountController.deleteAccount);

Router.route("/unblock/:id").put(accountController.unblockAccount);

Router.get("/profile", authenticate, accountController.getUserProfileHandler);

Router.route("/profile/change-password").put(accountController.changePassword);

Router.route("/get/:id").get(accountController.getById);

Router.route("/login").post(accountController.login);
Router.route("/send-otp").post(accountController.requestOTP);
Router.route("/verify-otp").post(accountController.verifyOTP);
// Router.post("/",  accountController.createAccount );

export const accountRoute = Router;
