import express from "express";

import { productController } from "../../controller/productController";
import { productValidation } from "../../validations/productValidation";

const multer = require("multer");
const path = require("path");
const Router = express.Router();
const cloudinary = require("../../config/config.cloundinary");

const storage = multer.diskStorage({
  // destination: function (req, file, callback) {
  //   callback(null, './uploads/');
  // },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

Router.post("/file-upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  cloudinary.uploader.upload(req.file.path, function (error, result) {
    if (error) {
      console.log(error);
      return res.status(500).send("Error uploading file to Cloudinary.");
    }
    res.status(200).json({
      message: "File uploaded successfully to Cloudinary.",
      url: result.url,
    });
  });
});

Router.route("/list").get(productController.getList);

Router.route("/create").post(
  productValidation.CreateProduct,
  productController.createNew
);

Router.route("/:id").put(productController.updateNew);

Router.route("/category/:categoryId").get(
  productController.getProductsByCategory
);

Router.route("/delete/:id").put(productController.deleteProduct);

Router.route("/harddelete/:id").delete(productController.hardDeleteProduct);

Router.route("/unblock/:id").put(productController.unblockProduct);

Router.route("/get/:id").get(productController.getById);
Router.route("/getTop10").get(productController.getTop10ProductSales);

Router.route("/search").get(productController.searchProduct);
Router.route("/get-searchHistory").get(productController.getSearchHistory);

Router.route("/listpage").get(productController.getProductListPage);

export const productRoute = Router;
