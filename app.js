const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");

const connectDB = require("./server/database/dbConnection");
const logger = require("./server/logger");
const authRoutes = require("./server/routes/authRoutes");

//Express App Init
const app = express();

/************************************************************
 * -------------------Database Connection---------------------
 ************************************************************/
connectDB();

/***********************************************************
 * --------------------Global Middlewares-------------------
 ***********************************************************/
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("morgan")("tiny", { stream: logger.stream }));

/***********************************************************
 * -----------------API Routes------------------------------
 ************************************************************/
//Index Routes
app.get("/", (req, res) => {
  res.status(200).json({
    type: "success",
    message: "server is up and running",
    data: null,
  });
});

//Route Middlewares
app.use("/api/auth", authRoutes);

/**********************************************************
 * ------page not found error handling  middleware---------
 **********************************************************/
//
app.use("*", (req, res, next) => {
  const error = {
    status: 404,
    message: "Requested resource not found in this server.",
  };
  next(error);
});

/************************************************************
 * ------------global error handling middleware-------------
 ***********************************************************/
app.use((err, req, res, next) => {
  logger.log({
    level: "error",
    message: err.message || "Something went wrong",
  });

  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
});

/**************************************************************
 * ----------------------Server Start--------------------------
 *************************************************************/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.log({
    level: "info",
    message: `Server running on port ${PORT} successfully..`,
  });
});
