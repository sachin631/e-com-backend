const express = require("express");
const loginMiddleWare = require("../middleWares/login.MiddleWare");
const isAdmin = require("../middleWares/Admin.middleware");
const {
  storeProduct,
  getAllProducts,
  getSingleProduct,
  updateProducts,
  deleteProducts,
  createProductReview,
  getReview,
} = require("../contollers/productController");
const upload = require("../middleWares/multer");
const productRouter = express.Router();

//store prodcut
productRouter.post(
  "/storeProduct",
  loginMiddleWare,
  isAdmin,
  upload.array("files", 4),
  storeProduct
);
//get All product
productRouter.get("/getAllProducts", getAllProducts);
//get single product
productRouter.get("/getSingleProduct/:_id", getSingleProduct);
//update product --admin
productRouter.put(
  "/updateProducts/:_id",
  loginMiddleWare,
  isAdmin,
  updateProducts
);
productRouter.delete("/deleteProducts/:_id",loginMiddleWare,isAdmin,deleteProducts);
//createProductReview
productRouter.put("/createProductReview/:_id",loginMiddleWare,createProductReview);
//getReview
productRouter.get("/getReview/:_id",getReview);

module.exports = productRouter;
