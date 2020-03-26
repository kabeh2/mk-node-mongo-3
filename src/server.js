require("./db/mongoose");
const helmet = require("helmet");
const debug = require("debug")("app:dev");
const userRouter = require("./routers/userRouter");
const taskRouter = require("./routers/taskRouter");
const devLogger = require("./middleware/loggers/devLogger");
const express = require("express");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static("../public"));
server.use(helmet());

// Development Logger
if (server.get("env") === "development") {
  debug(`Morgan is enabled...`);
  server.use(devLogger);
}

// Routers
server.use("/api/users", userRouter);
server.use("/api/tasks", taskRouter);

module.exports = server;
