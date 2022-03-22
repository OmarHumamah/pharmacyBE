"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT;

app.use(express.json());

//................... connect Mongo DB to the API ..................
const mongoose = require("mongoose");
let productsModal;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_DB);
  const productSchema = new mongoose.Schema({
    name: String,
    packageSize: String,
    price: String,
    localMade: Boolean,
  });

  productsModal = mongoose.model("products", productSchema);
}


//................... the routes and the handlers ..................

//................... API test route ..................
app.get("/", (request, response) => {
  response.send("test request received");
});

//................... send all products ..................
app.get("/getall", getAll);

function getAll(req, res) {
  productsModal.find({ __v: 0 }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}

//................... Add product ..................
app.post("/addproduct", addProduct);

async function addProduct(req, res) {
  const { name, packageSize, price, localMade } = req.body;

  await productsModal.create({
    name,
    packageSize,
    price,
    localMade,
  });

  productsModal.find({ __v: 0 }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
}

//................... delete product ..................
app.delete("/deleteproduct/:id", deleteProduct);

function deleteProduct(req, res) {
  let productId = req.params.id;
  productsModal.deleteOne({ _id: productId }, (err, result) => {
    productsModal.find({ __v: 0 }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });
}


//................... start the API server ..................
app.listen(PORT, () => console.log(`listening on ${PORT}`));
