"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT;

app.use(express.json());

const mongoose = require("mongoose");
let productsModal;

async function main() {
  await mongoose.connect(process.env.MONGO_DB);
  const productSchema = new mongoose.Schema({
    name: String,
    packageSize: String,
    price: String,
    localMade: Boolean,
  });

  productsModal = mongoose.model("products", productSchema);
  //   seedData()
}

main().catch((err) => console.log(err));

// async function seedData() {

//     const codeComplete = new productsModal({
//         name: 'panda',
//         packageSize: '10ml',
//         price: '10',
//         localMade: true,
//     });

//     await codeComplete.save();
//   }

app.get("/", (request, response) => {
  response.send("test request received");
});

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

app.post("/addproduct", addProduct);

async function addProduct(req, res) {
  console.log(req.body);
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



app.listen(PORT, () => console.log(`listening on ${PORT}`));
