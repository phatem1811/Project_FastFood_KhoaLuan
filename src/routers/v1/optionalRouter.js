import express from "express";

import { optionalController } from "../../controller/optionalCotroller";
const Router = express.Router();

Router.route("/list").get(optionalController.getList);

Router.route("/create").post(optionalController.createNew);

Router.route("/:id").put(optionalController.updateNew);

Router.route("/get/:id").get(optionalController.getById);

Router.route("/delete/:id").delete(optionalController.deleteOptional);



// Router.post("/",  accountController.createAccount );

export const optionalRoute = Router;
