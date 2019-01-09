const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/route"); // post related API request--create, edit, delete post

const userRoutes = require("./routes/user"); // user related API request--login signup

const app = express();

mongoose
  .connect(
    "mongodb+srv://dev007:DOZbYKwOgSzdjXq3@cluster0-93fyy.mongodb.net/udemy-posts?retryWrites=true"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// if path contain /images in it, tell app to forward it to 'server/images' dirtory
// the line below basically grant access to images folder on our server
app.use("/images", express.static(path.join("server/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);

app.use("/api/users", userRoutes); // api url prefix

module.exports = app;
