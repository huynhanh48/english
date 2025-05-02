import express from "express";
import router from "./app/Router.js";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const app = express();
const url = process.env.MOOGODB_API;
const client = new MongoClient(url);
mongoose.connect(url).then(() => {
  console.log("connection  success");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/metadata", router);
app.get("/", (req, res) => {
  res.send("con cai nit");
});
app.listen(3000, () => {
  console.log(`Example app listening at http://localhost:${3000}`);
});
