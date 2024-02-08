const { default: mongoose } = require("mongoose");
const cloudinaryUploaderr = require("../middleWares/cloudnary");
const productModel = require("../models/product.model");
const apiError = require("../utils/api.error");
const apiResponse = require("../utils/api.response");
const asyncHandler = require("../utils/asyncHandlers");
const userModel = require("../models/user.model");

const storeProductContoller = {
  // **********************************************************************************************************
  storeProduct: asyncHandler(async (req, res) => {
    //get storing data //images//userWhoStoreThisProduct//totalReviewOnThis//reviews
    const { name, discription, price, category, stock } = req.body;
    if (
      [name, discription, price, category, stock].some((elem) => {
        if (elem == undefined || elem == "") {
          throw new apiError(404, `please provide detials of all fields `);
        }
      })
    );
    const userWhoStoreThisProduct = req.loginUser;

    //set multer for multiple images
    const images = req.files;
    // console.log(images);
    const imagedata = await Promise.all(
      images.map(async (curelem, i) => {
        const cloudRes = await cloudinaryUploaderr(curelem?.path);
        return await cloudRes;
      })
    );
    // console.log(imagedata, "image data");
    const fetchImageDataUrlAnd_id = imagedata?.map(({ public_id, url }) => {
      return { public_id, url };
    });
    // console.log(fetchImageDataUrlAnd_id, "sadf");
    //store data
    const storeProduct = await productModel.create({
      name: name,
      discription: discription,
      price: price,
      stock: stock,
      category: category,
      images: fetchImageDataUrlAnd_id,
      userWhoStoreThisProduct: userWhoStoreThisProduct,
    });

    if (!storeProduct) {
      throw new apiError(404, "product not store in db");
    }

    res
      .status(200)
      .json(new apiResponse(200, storeProduct, "product store successfully"));
  }),

  // **********************************************************************************************************
  getAllProducts: asyncHandler(async (req, res) => {
    //filtration on this controoler of find all products is pending
    const products = await productModel.find({}).select("-passWord");
    if (!products) {
      throw new apiError(404, "product not found");
    }
    res.status(200).json(new apiResponse(200, products));
  }),
  //   ***************************************************************************************************************
  getSingleProduct: asyncHandler(async (req, res) => {
    const { _id } = req.params;
    if (!_id) {
      throw new apiError(404, "_id of params is not found");
    }
    const products = await productModel
      .findOne({ _id: _id })
      .select("-passWord");
    if (!products) {
      throw new apiError(404, "product not found");
    }
    res.status(200).json(new apiResponse(200, products));
  }),
  // ************************************************************************************************
  updateProducts: asyncHandler(async (req, res) => {
    const _id = req.params;
    if (!_id) {
      throw new apiError(200, "product id not found from params");
    }
    const product = await productModel.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!product) {
      throw new apiError("product not updated please try again");
    }
    return res
      .status(200)
      .json(new apiResponse(200, product, "product updated successfully"));
  }),
  //  ************************************************************************************************************
  deleteProducts: asyncHandler(async (req, res) => {
    const _id = req.params;
    if (!_id) {
      throw new apiError(200, "product id not found from params");
    }
    if (!mongoose.isValidObjectId(_id)) {
      throw new apiError(404, "invalid product id");
    }
    const product = await productModel.findByIdAndDelete(_id);

    return res
      .status(200)
      .json(new apiResponse(200, "", "product deleted successfully"));
  }),
  //  ************************************************************************************************************
  createProductReview: asyncHandler(async (req, res) => {
    //totalReviewOnThis//user//name//rating//cmnt//totalPeopleWhogaveReview//AverageRating

    //find product by passing id in params
    const { _id } = req.params; //product_id;

    if (!_id) {
      throw new apiError(404, "_id of product params not found");
    }
    if (!mongoose.isValidObjectId(_id)) {
      throw new apiError(404, "invalid product id in params");
    }
    //findUSer who cmnt login//find user name from login_id//
    const loginUser = req.loginUser; //user who gave rating
    //take rating//cmnt from body
    const { rating, cmnt } = req.body;
    //push review in array of reviews product //first find product then push
    const product = await productModel.findOne({ _id: _id });
    if (!product) {
      throw new apiError(
        404,
        "product not found in db please change product id or try again"
      );
    }
    //check this login user already gave rating or not 
    console.log("hello world",product.totalPeopleWhogaveReview)
    const userAlreadyReview=product.totalPeopleWhogaveReview.includes(loginUser);
    if(userAlreadyReview){
      throw new apiError(404,"you already gave review ");
    }
    //find user from login User and store name of user in reviews
    const user = await userModel.findOne({ _id: loginUser });
    if (!user) {
      throw new apiError(404, "login User not found");
    }
    let userName = user.name;
    if (!userName) {
      throw new apiError(404, "invalid user Name");
    }

    const newReview = {
      rating: rating,
      cmnt: cmnt,
      user: loginUser,
      name: userName,
    };

    await product.reviews.push(newReview);

    //calculate product total number of review//500-600//achieve 0+newUserReview
    const totalReviewOnThis = product.reviews.reduce((acc, curelem, index) => {
      return acc + curelem.rating;
    }, 0);
    console.log("totalReviewOnThis", totalReviewOnThis);
    product.totalReviewOnThis = totalReviewOnThis;
    //  await product.totalReviewOnThis.push(totalReviewOnThis)
    //totalPeople whoagve rating// push user id in it then calculate lenght of array,
    const totalPeople = await product.totalPeopleWhogaveReview.push(loginUser);
    console.log("totalPeople", totalPeople);
    let totalUSer = product.totalPeopleWhogaveReview.length;
    console.log("totalUSer", totalUSer);
    //calculating avergae rating totalRating-500-600 /totalUser
    product.AverageRating = totalReviewOnThis / totalUSer;

    console.log(product.AverageRating, "product.AverageRating");
    await product.save();
    return res.status(200).json(new apiResponse(200,product,"review store successfully"));

  }),
  //**************************************************************************************************************

  getReview:asyncHandler(async(req,res)=>{
    //findParticular product and then get review by filtring 
    const {_id}=req.params;
    if(!_id){
      throw new apiError(404,"params id is not found");
    }
    if(!mongoose.isValidObjectId(_id)){
      throw new apiError(404,"invalid object id in prams please enter valid object id of the products");
    }
    const product=await productModel.findOne({_id:_id});
    if(!product){
      throw new apiError(404,"product not found");
    }
    console.log(product.reviews,"product review");
    return res.status(200).json(new apiResponse(200,product.reviews,"success"));

  })
  // ****************************************************************************************************************
  
};
  module.exports = storeProductContoller;
