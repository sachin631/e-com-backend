const colors = require("colors");
const asyncHandler = require("../utils/asyncHandlers");
const apiError = require("../utils/api.error");
const userModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const cloudinaryUploaderr = require("../middleWares/cloudnary");
const apiResponse = require("../utils/api.response");
const productModel = require("../models/product.model");
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

    if (!checkUser) {
      throw new apiError(404, "user not store,please try again");
    }
    //generate jwt token and store it in header //during deployement store it in cookie
    const token = await checkUser?.generateToken();
    console.log(token);
    res.cookie("ecom", token, {
      httpOnly: false,
      expiresIn: "2d",
    }); //issue while storing cookie

    if (checkUser) {
      return res
        .status(200)
        .json(new apiResponse(200, checkUser, "user store successfuly"));
    }
  }),
  //******************************************************************************************************
  login: asyncHandler(async (req, res) => {
    // get user email and passWord
    const { email, passWord } = req.body;
    if (!email || !passWord) {
      throw new apiError(404, "email and pasWord is required");
    }
    // check user exist with email or not
    const user = await userModel.findOne({ email: email }); //when we use select and hide passWord then we can not apply any logic in passWord

    if (!user) {
      throw new apiError(
        404,
        "user not exist with this email please enter valid email address"
      );
    }
    // if exist verify pasWord
    const verifyPass = await user.comparePassWord(passWord);
    console.log(verifyPass, "verifyPass");
    if (!verifyPass) {
      throw new apiError(401, "passWord inCorrect");
    }
    //if valid passWord then generate token and cookie
    const token = await user.generateToken();
    console.log(token, "loginToken");
    if (!token) {
      throw new apiError(
        404,
        "issue while generating cookie please try to login again"
      );
    }
    //store token in cookie
    res.cookie("ecom", token, {
      expiresIn: "2d",
    });
    //send user detials after login without passWord

    return res
      .status(200)
      .json(new apiResponse(200, user, `${user.name} login successFully`));
  }),
  // ***********************************************************************************************************
  logout: asyncHandler(async (req, res) => {
    res.clearCookie("ecom");
    return res
      .status(200)
      .json(new apiResponse(200, "user logout successFully"));
  }),
  // **********************************************************************************************************
  getAllUsers: asyncHandler(async (req, res) => {
    const users = await userModel.find({}).select("-passWord");
    if (!users) {
      throw new apiError(404, "user not found something went wrong");
    }
    res.status(200).json(new apiResponse(201, users, "success"));
  }),
  // ************************************************************************************************************
  getParticularUser: asyncHandler(async (req, res) => {
    const { _id } = req.params;
    console.log(_id);
    if (!_id) {
      throw new apiError(404, "params not found !");
    }
    const user = await userModel.findOne({ _id: _id });
    if (!user) {
      throw new apiError(
        404,
        "user not found with this id, please enter valid id"
      );
    }
    return res.status(200).json(new apiResponse(200, user, "success"));
  }),
  // *************************************************************************************************************
  deleteAllUser: asyncHandler(async (req, res) => {
    const user = await userModel.deleteMany({});
    if (user.acknowledged != true) {
      throw new apiError("user not found");
    }

    return res
      .status(200)
      .json(new apiResponse(200, "", "user deleted successfully"));
  }),
  //**********************************************************************************************************
  deleteSingleUser: asyncHandler(async (req, res) => {
    const { _id } = req.params;
    if (!_id) {
      throw new apiError(404, "please enter id in params");
    }
    const user = await userModel.findByIdAndDelete({ _id: _id });
    return res.status(200).json(new apiResponse(200, " please provide user "));
  }),
  // **********************************************************************************************************
  updateUSerProfile: asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const { name, email, passWord } = req.body;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const isvalidPass = passRegex.test(passWord);
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
    const isValidEmail = emailRegex.test(email);

    if (!_id) {
      throw new apiError(404, "please enter _id");
    }

    if (!name || !email || !passWord) {
      throw new apiError(404, "please enter email passWord and name properly");
    }
    if (!isvalidPass) {
      throw new apiError(404, "passWord format did not match!");
    }
    if (!isValidEmail) {
      throw new apiError(404, "email format is not valid ");
    }
    console.log(_id, name, email, passWord, isValidEmail, isvalidPass);
    //we can not use findByIdAndUpdate mehtod because it does not trigger the "save" middleware
    const user = await userModel.findOne({ _id: _id });
    if (user == "" || user == undefined || user == null) {
      throw new apiError(404, "user not exist please enter valid id params");
    }

    user.email = email;
    user.passWord = passWord;
    user.name = name;

    user.save();

    return res
      .status(200)
      .json(new apiResponse(200, user, "user updated successfully"));
  }),

  // ************************************************************************************************************
  updateAvatar: asyncHandler(async (req, res) => {
    const { _id } = req.params;
    //access avatar
    const avatarPath = req.file?.path;
    //provide new pathName to cloundanary
    const rescloud = await cloudinaryUploaderr(avatarPath);
    const cloud_id = await rescloud?.public_id;
    const cloud_url = await rescloud?.url;
    console.log(rescloud);
    //findUSerByIDAndUpdate
    const updateUser = await userModel
      .findByIdAndUpdate(
        { _id: _id },
        {
          avatar: {
            public_id: cloud_id,
            url: cloud_url,
          },
        },
        {
          new: true,
        }
      )
      .select("-passWord");
    res
      .status(200)
      .json(
        new apiResponse(200, updateUser, "user avatar updated successfully ")
      );
  }),
  // *****************************************************************************************************
  makeAdmin: asyncHandler(async (req, res) => {
    const { _id } = req.params;

    //find user by id and update
    const updateAdmin = await userModel
      .findByIdAndUpdate({ _id: _id }, { isAdmin: true }, { new: true })
      .select("-passWord");
    if (!updateAdmin) {
      throw new apiError(404, "user as admin not processed please try again");
    }
    res
      .status(200)
      .json(new apiResponse(200, updateAdmin, "now this user is admin"));
  }),

  // *******************************************************************************************************
  makeUser:asyncHandler(async(req,res)=>{
    const {_id}=req.params;
    if(!_id){
      throw new apiError(404,"please enter params id ");
    }
    const findUser=await userModel.findOne({_id:_id});
    if(!findUser){
      throw new apiError(404,"user not found on provided params or creenditial")
    }
    //check  user already not admin
    if(findUser?.isAdmin==false){
      throw new apiError("user is already an simple user");
    }
    findUser.isAdmin=false
    
    findUser.save()
    return res.status(200).json(new apiResponse(200,findUser,"this user is now simple user"));

  }),
  // **********************************************************************************************************
  addToCart:asyncHandler(async(req,res)=>{
    //get product from id of params
    const _id=req.params._id;
    const product=await productModel.find({_id:_id});
   
    if(!product){
      throw new apiError(404,"product not found");
    }
    const loginUser=req.loginUser;
    //find loginUser
    const user=await userModel.find({_id:loginUser});
    console.log(user)
    if(!user){
      throw new apiError("user not found to add product in cart");
    }
    //push data of product in loginUser array 
    await user?.cart?.push(product);
    let cart =user?.cart;
    console.log(cart,"cart");
    res.status(200).json(new apiResponse(200,cart,"product is added to cart successFully"));
    
  })
  // **********************************************************************************************************
};
module.exports = { ...userController };

//empty//email joi
