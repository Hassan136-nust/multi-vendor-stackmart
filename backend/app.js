const express = require("express");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use("/", express.static("uploads"));
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "backend/config/.env",
  });
}
app.use(
  cors({
    origin: ["https://multi-vendor-shippo-1.onrender.com", "http://localhost:3000"],
    credentials: true,
  })
);
const user = require("./controller/user");

app.use("/api/v2/user", user);

app.use(errorMiddleware);
module.exports = app;
