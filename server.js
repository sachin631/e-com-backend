const express=require("express");
const app=express();
require("dotenv").config();
const PORT=process.env.PORT;
const cors=require("cors");
require("./connection/dbConnect");
const cookieParser=require("cookie-parser");
const userRouter = require("./routers/user.router");
const colors=require("colors")



//some middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors());


//routers
app.use(userRouter);



app.listen(PORT,()=>{
    console.log(`codeproject start at `);
});



//trying
// class apiResponse{
//     constructor(status,data) {
//         this.status=status,
//         this.data=data,
//         this.success=status<400
        
        
//     }
// }
// let res=new apiResponse(200,"sangwan");
// console.log((res));  //when we call it return an object

//use in case of else error handling
// class apiError extends Error{
//     constructor(statusCode,message="something went wrong",errors=[],stack=""){
//         super();
//         this.statusCode=statusCode;
//         this.message=message;
//         this.errors=errors;
//         this.data=null;
//         if(stack){
//             this.stack=stack;
//         }else{
//             Error.captureStackTrace(this,this.constructor);
//         }

//     }
// }

// module.exports=apiError



// const res=new apiError(400,"something work");
// console.log(res); 


