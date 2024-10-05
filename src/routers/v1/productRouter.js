import express from 'express';

import { productController } from '../../controller/productController';
const Router = express.Router();


Router.route("/list")
    .get( productController.getList)

Router.route("/create")    
    .post(productController.createNew)

Router.route("/:id")
    .put(productController.updateNew);

Router.route("/category/:categoryId") 
    .get(productController.getProductsByCategory); 

export const productRoute = Router;