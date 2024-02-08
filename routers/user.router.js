const express=require("express");
const { registerUser, login, logout, getAllUsers, getParticularUser, deleteAllUser, deleteSingleUser,
     updateUSerProfile, updateAvatar, makeAdmin, makeUser,addToCart } = require("../contollers/userController");
const upload = require("../middleWares/multer");
const loginMiddleWare = require("../middleWares/login.MiddleWare");
const isAdmin = require("../middleWares/Admin.middleware");


const userRouter=express.Router();

//registerUser
userRouter.post("/registerUser",upload.single("avatar"),registerUser);
//login Router
userRouter.post("/login",login);
//logout
userRouter.get("/logOut",logout);
//getAllUsers --admin
userRouter.get("/getAllUsers",loginMiddleWare,getAllUsers);//loginMiddleWare //isAdmin is pending
//getParticularUser 
userRouter.get("/getParticularUser/:_id",loginMiddleWare,getParticularUser);
//deleteAllUser --admin
userRouter.delete("/deleteAllUser",loginMiddleWare,isAdmin,deleteAllUser);
//delete particular user --admin
userRouter.delete("/deleteSingleUser/:_id",loginMiddleWare,isAdmin,deleteSingleUser);
//updateUSerProfile 
userRouter.put("/updateUSerProfile/:_id",loginMiddleWare,updateUSerProfile);
//updateAvatar
userRouter.put("/updateAvatar/:_id",loginMiddleWare,upload.single("avatar"),updateAvatar);
//make any user admin --admin
userRouter.put("/makeAdmin/:_id",loginMiddleWare,isAdmin,makeAdmin);
//make any admin to user
userRouter.put("/makeUser/:_id",loginMiddleWare,isAdmin,makeUser);
//add to cart api
userRouter.post("/addToCart/:_id",loginMiddleWare,addToCart);


module.exports=userRouter;