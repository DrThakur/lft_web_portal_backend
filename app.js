const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./Routes/userRoutes");
const authRouter = require("./Routes/authRoutes");
const projectRouter = require("./Routes/projectRoutes");
const CustomError = require("./Utils/CustomError");
const globalErrorHandler = require("./Controllers/errorController");

let app = express();

// Middleware
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

//mongodb+srv://drankitkumarthakur:AUQznVx6j6ZOrWj0@lftbackend.ouuqvr6.mongodb.net/

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello My  World....!!");
});

app.use("/api/v1/auth", authRouter);
app.use("/users", userRouter);
app.use("/project", projectRouter);


app.all("*", (req, res, next) => {
  // res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on the server!`
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
