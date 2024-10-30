import express from "express";

import { eventController } from "../../controller/eventController";
const Router = express.Router();

Router.route("/list").get(eventController.getList);

Router.route("/create").post(eventController.createNew);

Router.route("/:id").put(eventController.updateNew);
Router.route("/:id").put(eventController.updateNew);

Router.route("/harddelete/:id").delete(eventController.hardDeleteEvent);

Router.route("/get/:id").get(eventController.getById);

// Router.post("/",  accountController.createAccount );

export const eventRoute = Router;
