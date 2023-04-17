const express = require("express");
const connectDatabase = require("./connectDatabase");
const PORT = 5000;
const app = express();
const user = require("./routes/userRoutes");
const product  = require("./routes/productRoutes")
const errorMiddleware = require("./middleware/error");
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
app.use(express.json())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload({
  useTempFiles:true
}))
const dotenv = require("dotenv");
dotenv.config();
var cors = require('cors')

app.use(cors())
connectDatabase();


app.use("/api", user);

app.use("/api", product);
app.use(errorMiddleware)
app.listen(PORT, () => {
  console.log("server is listen on 5000");
});
