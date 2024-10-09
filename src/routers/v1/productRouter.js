import express from 'express';

import { productController } from '../../controller/productController';

const multer = require('multer');
const path = require('path');
const Router = express.Router();
const fs = require('fs');


const storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads/');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    }
  });
const upload = multer({ storage : storage}).single('file');

Router.post('/file-upload', function (req, res) {
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        const imagePath = `${process.env.UPLOAD_DIR}${path.basename(req.file.path)}`;
        console.log("check file", imagePath)
        res.end("File is uploaded");
    });
  });
  

Router.post('/upload', (req, res) => {
    console.log('File:', req.file); 
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json(req.file);
});
Router.route("/list")
    .get( productController.getList)

Router.route("/create")    
    .post(productController.createNew)

Router.route("/:id")
    .put(productController.updateNew);

Router.route("/category/:categoryId") 
    .get(productController.getProductsByCategory); 
    

    Router.get('/images', (req, res) => {
        const uploadDir = process.env.UPLOAD_DIR || './uploads'; 
      
 
        fs.readdir(uploadDir, (err, files) => {
          if (err) {
            return res.status(500).json({ message: 'Error reading directory' });
          }
      
          const imageFiles = files.filter(file => {
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase());
          });
      
          res.json(imageFiles.map(file => `${uploadDir}${file}`));
        });
      });   

export const productRoute = Router;