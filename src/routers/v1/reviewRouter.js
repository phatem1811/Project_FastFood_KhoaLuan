import express from "express";
import { reviewController } from "../../controller/reviewController";
const Router = express.Router();

Router.route("/create").post(reviewController.createNew);

Router.route("/list").get(reviewController.getList);

Router.patch("/mark-all-read", reviewController.markAllAsRead); 

Router.patch("/fix-is-read", reviewController.fixIsReadField);
Router.get("/product/:productId", reviewController.getReviewsByProduct);
export const reviewRoute = Router;
