const userModel = require("../models/user.model");
const apiError = require("../utils/api.error");
const asyncHandler = require("../utils/asyncHandlers");

const isAdmin=asyncHandler(async(req,res,next)=>{
    const user=await userModel.findOne({_id:req.loginUser});
    if(!user){
        throw new apiError(404,"admin user not found");
    }
    if(user?.isAdmin==false){
        throw new apiError(404,"only admin can access this,please login as admin to access this page ");
    }
    next();

});


module.exports=isAdmin;