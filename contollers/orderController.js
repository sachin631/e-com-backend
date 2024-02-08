const orderModel = require("../models/order.model");
const apiError = require("../utils/api.error");
const apiResponse = require("../utils/api.response");
const asyncHandler = require("../utils/asyncHandlers");

const orderController = {
  // *******************************************************************************************************************
  storeOrder: asyncHandler(async (req, res) => {
    const {
      shippingInformation,
      orderItems,
      paymentInforMation,
      itemsTotalPrice,
      taxPrice,
      shippingPrice,
      orderStatus,
    } = req.body;
    const user = req.loginUser;
    if (
      [
        shippingInformation,
        orderItems,
        paymentInforMation,
        itemsTotalPrice,
        taxPrice,
        shippingPrice,
        orderStatus,
        user,
      ].some((curelem) => {
        if (curelem == undefined || "") {
          throw new apiError(404, "please enter all credentials properly");
        }
      })
    );

    //store shipping address and order details of the users
    const order = await orderModel.create({
      shippingInformation: shippingInformation,
      orderItems: orderItems,
      paymentInforMation: paymentInforMation,
      itemsTotalPrice: itemsTotalPrice,
      taxPrice: taxPrice,
      shippingPrice: shippingPrice,
      orderStatus: orderStatus,
      user: user,
    });
    if (!order) {
      throw new apiError(404, "order not store, please try again");
    }
    res
      .status(200)
      .json(new apiResponse(200, order, "order created successFully"));
  }),
  // *******************************************************************************************************************
  getAllOrder: asyncHandler(async (req, res) => {
    // const {_id}=req.params ;
    const order = await orderModel.find({}).populate("");
    if (!order) {
      throw new apiError(404, "order not found");
    }
    res.status(200).json(new apiResponse(200, order, "success"));
  }),
  // ****************************************************************************************************************
  orderAggregate: asyncHandler(async (req, res) => {
    const order = await orderModel.aggregate([
      // {
      //   $unwind:"$orderItems"
      // },
      {
        $lookup: {
          from: "usermodels",
          localField: "user",
          foreignField: "_id",
          as: "userKaPuraData",
          pipline:[
            {}
          ]
        },

        $lookup: {
          from: "productmodels",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productkaPuraData",
        },
      },
    ]);
    console.log(order);
    res.status(200).json({ order: order });
  }),
};

module.exports = { ...orderController };
