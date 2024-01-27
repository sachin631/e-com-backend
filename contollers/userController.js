const colors = require("colors");
const asyncHandler = require("../utils/asyncHandlers");
const apiError = require("../utils/api.error");
const userModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const cloudinaryUploaderr = require("../middleWares/cloudnary");
const apiResponse = require("../utils/api.response");
const userController = {
  //*******************************************************************************************************
  registerUser: asyncHandler(async (req, res, next) => {
    //take user data
    const { name, email, passWord } = req.body;
    const avatar = req.file?.filename;
    const filePath = req.file?.path;
    //check all field enter or not
    if (
      [name, email, passWord, avatar].some((elem) => {
        if (elem == undefined || "") {
          throw new apiError(404, "all field are required");
        }
      })
    );

    //apply regex on passWord and email
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    let isValidEmail = emailRegex.test(email);
    console.log(isValidEmail);
    let isValidPassWord = passRegex.test(passWord);
    if (!isValidEmail) {
      throw new apiError(404, "please enter valid email address");
    }
    if (!isValidPassWord) {
      throw new apiError(
        404,
        "passWord should be At least 8 characters long ,Contains at least one lowercase letter, Contains at least one uppercase letter, Contains at least one digit"
      );
    }
    //check already exist or not
    let userExists = await userModel.findOne({ email: email });
    if (userExists) {
      throw new apiError(204, "user already exists");
    }

    //store avatar in cloudnary

    const rescloud = await cloudinaryUploaderr(filePath);

    const cloudinary_public_id = rescloud?.public_id;
    const cloudinary_url = rescloud?.url;
    //store user in database
    const storeUser = await userModel.create({
      name: name,
      email: email,
      passWord: passWord,
      avatar: {
        public_id: cloudinary_public_id,
        url: cloudinary_url,
      },
    });
    await storeUser.save();
    //check user store successfully or not //show user in res without passWord
    const checkUser = await userModel
      .findOne({ email: email })
      .select("-passWord");

      if(!checkUser){
        throw new apiError(404,"user not store,please try again");
      }
    //generate jwt token and store it in header //during deployement store it in cookie
    const token = await checkUser?.generateToken();
    console.log(token);
    res
    .cookie("ecom",token, {
      httpOnly: false,
      expiresIn: "1d",
    })//issue whilw storing cookie
    
    // if (checkUser) {
    //   return res
    //     .status(200)
    //     .json(new apiResponse(200, checkUser, "user store successfuly"));
    // }
    // const token=await userExists.generateToken();
    // console.log(token,"token");
  }),

  // **************************************************************************************************
};

module.exports = { ...userController };
