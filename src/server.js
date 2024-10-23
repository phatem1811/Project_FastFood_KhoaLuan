import express from "express";
//import configViewEngine from "./config/viewEngine";
//import initWebRoutes from "./routes/web";
require("dotenv").config();
import bodyParser from "body-parser";
import connection from "./config/connectDB.js";
import { APIs} from './routers/v1/index.js'
var cors = require('cors')
import { errorHandlingMiddleware } from "./middleware/errorHandlingMiddleware.js";

const cloudinary = require("./config/config.cloundinary");
const app = express();

const hostname = 'localhost'
const port = 8080
// Connect to DB
connection();

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// const accountSid = 'AC6bf7fc1378d2495e95e52ae61b32d397';
// const authToken = '22bc7dff11cad29aaa55f2c39a73bd24';

// const client = require('twilio')(accountSid, authToken);

// client.messages
//   .create({
//     body: 'Hello from twilio-node',
//     to: '+15625536533', // Text your number
//     from: '+15177265041', // From a valid Twilio number
//   })
//   .then((message) => console.log(message.sid));

app.use("/v1",APIs );



app.use(errorHandlingMiddleware);

app.listen(port, hostname, () => {

    console.log(`I am running at ${ hostname }:${ port }`)
  })
  