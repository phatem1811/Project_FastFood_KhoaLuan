import express from "express";
//import configViewEngine from "./config/viewEngine";
//import initWebRoutes from "./routes/web";
require("dotenv").config();
import bodyParser from "body-parser";
import connection from "./config/connectDB.js";
import { APIs} from './routers/v1/index.js'
const nodemailer = require('nodemailer');
var cors = require('cors')
import { errorHandlingMiddleware } from "./middleware/errorHandlingMiddleware.js";
import { generateOTP , sendOTP} from "./utils/mailler.js";

const cloudinary = require("./config/config.cloundinary");
const app = express();

const hostname = 'localhost'
const port = 8080
connection();
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




// const email= "21110739@student.hcmute.edu.vn";
// const otp = generateOTP();
// sendOTP(email, otp)
app.use("/v1",APIs );



app.use(errorHandlingMiddleware);

app.listen(port, hostname, () => {

    console.log(`I am running at ${ hostname }:${ port }`)
  })
  