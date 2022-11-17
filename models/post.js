const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const { postSchemaValidation } = require("./validation/postValidation");

const Schema = mongoose.Schema;
const postSchema = Schema(
  {
    title: { type: String, trim: true, required: true },

    province: { type: Schema.Types.ObjectId, ref: "Province", required: true },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
    address: { type: String, trim: true, required: true },

    status: {
      type: String,
      enum: ["unseen", "seen", "accept", "rejection"],
      default: "unseen",
    },
    body: { type: String, trim: true, required: true },
    images: [{ type: String, trim: true }],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    condition: {
      type: String,
      enum: ["sale", "agreement", "exchange"],
      default: "sale",
    },
    price: { type: String, trim: true, required: true },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.plugin(mongoosePaginate);

postSchema.statics.postValidation = function (body) {
  return postSchemaValidation.validate(body, { abortEarly: false });
};

postSchema.methods.statusForTable = function () {
  const post = this;
  let info = {};

  switch (post.status) {
    case "unseen":
      info.color = "badge-warning";
      info.message = "دیده نشده";

      break;
    case "seen":
      info.color = "badge-primary";
      info.message = "دیده شده";
      break;

    case "accept":
      info.color = "badge-success";
      info.message = "تایید شده";
      break;

    case "rejection":
      info.color = "badge-danger";
      info.message = "رد شده";
      break;

    default:
      break;
  }

  return info;
};

postSchema.methods.conditionForCheck = function () {
  const post = this;
  let msg = "";
  switch (post.condition) {
    case "sale":
      msg = "فروشی";
      break;
    case "exchange":
      msg = "معاوضه";
      break;
    case "agreement":
      msg = "توافقی";
      break;
    default:
      break;
  }
  return msg;
};

module.exports = mongoose.model("Post", postSchema);
