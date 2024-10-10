import express from 'express';

import { eventController } from '../../controller/eventController';
const Router = express.Router();


Router.route("/list")
    .get( eventController.getList)

Router.route("/create")    
    .post(eventController.createNew)

Router.route("/:id")
    .put(eventController.updateNew);

Router.route("/delete/:id")
    .put(eventController.deleteEvent);

// Router.route("/unblock/:id")
//     .put(eventController.unblockCategory);


Router.route("/get/:id")
    .get(eventController.getById);
    


// Router.post("/",  accountController.createAccount );

export const eventRoute = Router;