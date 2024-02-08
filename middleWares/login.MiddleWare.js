const apiError = require("../utils/api.error");
const asyncHandler = require("../utils/asyncHandlers");
const jwt=require("jsonwebtoken");

const loginMiddleWare=asyncHandler(async(req,res,next)=>{
    //get Token
    const token=req.cookies?.ecom;
    if(!token){
        throw new apiError(404,"token not found please login again");
    }
    //verifyToken
    const verifyToken=await jwt.verify(token,process.env.REFRESH_TOKEN_SECRET_KEY);
    if(!verifyToken){
        throw new apiError(404,"token is not verified please login again");
    }
    req.loginUser=verifyToken._id;
   
    next();
});

module.exports=loginMiddleWare;