import express from "express";

import { categoryValidation } from "../../validations/categoryValidation";
import { categoryController } from "../../controller/categoryController";
const Router = express.Router();

Router.route("/list").get(categoryController.getList);

Router.route("/create").post(
  categoryValidation.CreateCategory,
  categoryController.createNew
);

Router.route("/:id").put(categoryController.updateNew);

Router.route("/delete/:id").put(categoryController.deleteCategory);

Router.route("/harddelete/:id").delete(categoryController.hardDeleteCategory);

Router.route("/unblock/:id").put(categoryController.unblockCategory);

Router.route("/get/:id").get(categoryController.getById);

// Router.post("/",  accountController.createAccount );

export const categoryRoute = Router;
