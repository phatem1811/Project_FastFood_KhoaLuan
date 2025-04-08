import express from 'express';
import { reviewController } from '../../controller/reviewController';
const Router = express.Router();


Router.route("/create")    
    .post(reviewController.createNew)

Router.get("/product/:productId", reviewController.getReviewsByProduct);
export const reviewRoute = Router;