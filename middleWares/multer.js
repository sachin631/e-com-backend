const multer=require("multer");

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads");
    },

    filename:(req,file,cb)=>{
        cb(null,`e-com.${file.originalname}`);
    }
});

const fileFilter=(req,file,cb)=>{
    if(file.mimetype!=="image/jpg" && file.mimetype!=="image/jpeg" && file.mimetype!=="image/png"){
        cb(new Error("only jpeg png and jpeg is aloowed"),false);
    }else{
        cb(null,true);
    }
}

const upload=multer({
    storage:storage,
    fileFilter:fileFilter
});

module.exports=upload;