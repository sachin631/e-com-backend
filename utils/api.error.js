class apiError extends Error{
    constructor(statusCode,message="something went wrong",success=false){
        super();
        this.statusCode=statusCode;
        this.message=message;
        this.success=success;
    }
}


module.exports=apiError;