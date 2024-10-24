import express from "express";

import { ingredientController } from "../../controller/ingredientController";
const Router = express.Router();

Router.route("/list").get(ingredientController.getList);

Router.route("/create").post(ingredientController.createNew);

Router.route("/:id").put(ingredientController.updateNew);

Router.route("/get/:id").get(ingredientController.getById);

Router.route("/delete/:id").delete(ingredientController.deleteById);

Router.route("/getexpenses").get(ingredientController.getMonthlyExpenses);

// Router.post("/",  accountController.createAccount );

export const ingredientRoute = Router;
