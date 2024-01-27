const express=require("express");
const { registerUser } = require("../contollers/userController");
const upload = require("../middleWares/multer");

const userRouter=express.Router();

//registerUser
userRouter.post("/registerUser",upload.single("avatar"),registerUser);

module.exports=userRouter;