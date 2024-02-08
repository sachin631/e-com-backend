const express=require("express");
const { storeOrder, getAllOrder, orderAggregate } = require("../contollers/orderController");
const loginMiddleWare = require("../middleWares/login.MiddleWare");
const isAdmin = require("../middleWares/Admin.middleware");
const orderRouter=express.Router();
orderRouter.post("/storeOrder",loginMiddleWare,storeOrder);
orderRouter.get("/getAllOrder",loginMiddleWare,isAdmin,getAllOrder);
orderRouter.get("/orderAggregate",orderAggregate);
module.exports=orderRouter;