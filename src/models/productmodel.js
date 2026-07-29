const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      unique: true,
      trim: true,
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
    },
    size: {
      type: String,
      enum: ["s", "m", "l", "xl", "xxl", "free"],
      required: [true, "Size is required"],
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      required: [true, "Needed"],
      trim: true,
    },
    image: {
      url: {
        type: String,
        default: ""
      },
      public_id: {
        type: String,
        default: ""
      },
    },
  },
  {
    timestamps: true,
  },
);

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
