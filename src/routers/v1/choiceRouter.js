import express from "express";

import { choiceController } from "../../controller/choiceController";
const Router = express.Router();

Router.route("/list").get(choiceController.getList);

Router.route("/create").post(choiceController.createNew);

Router.route("/:id").put(choiceController.updateNew);

Router.route("/get/:id").get(choiceController.getById);
Router.route("/get-choice").get(choiceController.getChoicesByOptionalId);

Router.route("/delete/:id").delete(choiceController.deleteChoice);



// Router.post("/",  accountController.createAccount );

export const choiceRoute = Router;
