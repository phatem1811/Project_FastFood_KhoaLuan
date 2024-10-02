import express from "express";
//import configViewEngine from "./config/viewEngine";
//import initWebRoutes from "./routes/web";
require("dotenv").config();
import bodyParser from "body-parser";
import connection from "./config/connectDB.js";
import mongoose from 'mongoose';
import { APIs} from './routers/v1/index.js'
import { errorHandlingMiddleware } from "./middleware/errorHandlingMiddleware.js";
const app = express();

const hostname = 'localhost'
const port = 8080
// Connect to DB
connection();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/v1",APIs );

console.log(`chảng file to resolve conflick`)
app.use(errorHandlingMiddleware);

app.listen(port, hostname, () => {

    console.log(`I am running at ${ hostname }:${ port }`)
  })
  