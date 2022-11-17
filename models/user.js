const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const mongoosePaginate = require('mongoose-paginate');
const {userSchemaValidation} = require('./validation/userValidation');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4,
    maxlength: 256,
  },
  img: {
    type: String,
    trim: true,
    default:null
  },
  phoneNumber:{
    type: String,
    trim: true,
    default:null
  },
  cities: [{ type: mongoose.Schema.Types.ObjectId, ref: "City", required: true }],
  permisson: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  favoritePost:[{type:mongoose.Schema.Types.ObjectId,ref:"Post"}]

},{timestamps:true});

userSchema.pre("save", async function (next) {
  let user = this;
  if (!user.isModified("password")) {
    return next();
  } else {
    user.password = await bcrypt.hash(user.password, 10);
    return next();
  }
});

userSchema.plugin(mongoosePaginate);

userSchema.statics.userValidation = function(body){
    return userSchemaValidation.validate(body,{abortEarly:false})
}


const User = mongoose.model("User", userSchema);

module.exports = User;
