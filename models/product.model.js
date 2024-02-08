const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter product name"],
      trim: true,
    },
    discription: {
      type: String,
      required: [true, "discription is required"],
    },
    price: {
      type: Number,
      required: [true, "please enter price"],
    },
    images: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "please enter category"],
    },
    stock: {
      type: Number,
      required: [true, "please enter stock "],
    },

    userWhoStoreThisProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "userModel",
        },
        name: {
          type: String,
        },
        rating: {
          type: Number,
        },
        cmnt: {
          type: String,
        },
      },
    ],
    totalPeopleWhogaveReview:[],
    totalReviewOnThis: {
      type: Number,
      default: 0,
    },
    AverageRating:{
      type:Number,
      default:0
    }
  },
  { timestamps: true }
);

const productModel = new mongoose.model("productModel", productSchema);
module.exports = productModel;
