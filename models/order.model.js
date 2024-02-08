const { default: mongoose } = require("mongoose");

//orderModels
//shipping information schema
const shippingInformation = new mongoose.Schema({
  address: {
    type: String,
    required: [true, "please enter your address"],
  },
  state: {
    type: String,
    required: [true, "please enter your state name"],
  },
  city: {
    type: String,
    required: [true, "please enter your city name"],
  },
  country: {
    type: String,
    required: [true, "please enter your country name"],
  },
  pincode: {
    type: Number,
    required: [true, "please enter your pincode"],
  },
  phoneNumber: {
    type: String,
    required: [true, "please enter your mobile Number"],
  },
});
const orderSchema = new mongoose.Schema({
  shippingInformation: {
    type: shippingInformation,
    required: [true, "please enter your shipping information"],
  },
  orderItems: [
    {
      name: {
        type: String,
        required: [true, "please enter order items name"],
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: [true, "please enter quantity of this order"],
      },
      images: {
        type: String,
        required: [true, "please enter product images url"],
      },
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"productModel "
      }
     
    },
  ],
   // jisnae order kiya h vo vala user
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  paymentInforMation: {
    _id: String,
    status: {
      type: String,
      enum: ["pending", "received"],
      default: "pending",
    },
  },
  itemsTotalPrice: {
    type: Number,
    required: [true, "items total price is required"],
  },
  taxPrice: {
    type: Number,
    required: [true, "please enter taxPrice"],
  },
  shippingPrice: {
    type: Number,
    required: [true, "please enter shipping price"],
  },
  orderStatus: {
    type: String,
    emum: ["pending", "process", "delivered"],
  },
  paidAt: {
    type: Date,
    // required: true,
  },
  deliveredAt: Date,
});

const orderModel = new mongoose.model("orderModel", orderSchema);
module.exports = orderModel;
