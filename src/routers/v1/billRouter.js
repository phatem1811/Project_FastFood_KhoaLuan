import express from "express";

import { billController } from "../../controller/billController";
const Router = express.Router();

Router.route("/list").get(billController.getList);

Router.route("/create").post(billController.createNew);

Router.route("/:id").put(billController.updateBill);

Router.route("/get/:id").get(billController.getById);
Router.route("/get-product-sale").get(billController.getListByDate);
Router.route("/getrevenue").get(billController.getMonthlyRevenue);

// Router.post("/",  accountController.createAccount );

export const billRoute = Router;
