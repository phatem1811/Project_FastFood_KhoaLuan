const express = require("express");
const app = express();
const port = 3000;
import connection from "./config/connectDB";

connection()

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
