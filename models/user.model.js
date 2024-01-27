const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      unique: true,
      trim: true,
    },
    passWord: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetPassWordToken: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

//hash passWord only if it is modified before save
userSchema.pre("save", async function (next) {
  if (this.isModified("passWord")) {
    this.passWord = await bcryptjs.hash(this.passWord, 10);
  }
  next();
});

//create a method to comapre passWord
userSchema.methods.comparePassWord = async function (passWord) {
  const passCompare = await bcryptjs.compare(passWord, this.passWord);
  return passCompare;
};

//create a mehtod to generate token
userSchema.methods.generateToken = async function () {
  const token = await jsonwebtoken.sign(
    { _id: this._id, email: this.email },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "2d" }
  );
  return token;
};

const userModel = new mongoose.model("userModel", userSchema);
module.exports = userModel;
