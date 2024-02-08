const express=require("express");
const app=express();
require("dotenv").config();
const PORT=process.env.PORT;
const cors=require("cors");
require("./connection/dbConnect");
const cookieParser=require("cookie-parser");
const userRouter = require("./routers/user.router");
// const colors=require("colors");
const productRouter = require("./routers/product.router");
// const { syncIndexes } = require("mongoose");
const orderRouter = require("./routers/order.router");



//some middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({credentials:true}));


//routers
//user router
app.use(userRouter);
//product router
app.use(productRouter);
//orderRouter
app.use(orderRouter);


app.listen(PORT,()=>{
    console.log(`codeproject start at `);
});

module.exports = app

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

// const name=[
//     {
//         name:"s",
//         lname:"sa",
//         _id:"asd",
//         url:"asd"
//     },
//     {
//         name:"m",
//         lname:"m",
//         _id:"m",
//         url:"m"
//     }
// ];

// const data=name.map(({_id,url})=>{
//     console.log({_id,url});
// })


// const toatalreview=[
//     {
//         toatalreview2:1,
//         name:"sachin"
//     },
//     {
//         toatalreview2:2,
//         name:"sachin"
//     },
//     {
//         toatalreview2:3,
//         name:"sachin"
//     },
//     {
//         toatalreview2:3,
//         name:"sachin"
//     }
// ];

//acc tab tak chnage nhi hga jb tk culelem i value change na ho
// const data=toatalreview?.reduce((acc,curelem,index)=>{
//     curelem.toatalreview2=acc+curelem.toatalreview2
//     // console.log(curelem);
//     return curelem.toatalreview2
// },0)
// console.log(data)

//new
// const arr=[1,2,3,4];
// const data=arr.includes(10);
// console.log(data);

//make order section for user

// const { add } = require("./math");

