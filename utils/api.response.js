// req.status(401).json({success:false,message:"not working"})
class apiResponse{
    constructor(stausCode,data,message,success){
        this.stausCode=stausCode;
        this.data=data;
        this.message=message;
        this.success=stausCode<400;
    }
}

module.exports=apiResponse;