import express from 'express';

import { categoryController } from '../../controller/categoryController';
const Router = express.Router();


Router.route("/list")
    .get( categoryController.getList)

Router.route("/create")    
    .post(categoryController.createNew)

Router.route("/:id")
    .put(categoryController.updateNew);
    


// Router.post("/",  accountController.createAccount );

export const categoryRoute = Router;