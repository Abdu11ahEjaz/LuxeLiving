import mongoose from "mongoose";

const wantedSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["buy", "rent"],
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: ["house", "apartment", "plot", "commercial"],
    },
    city: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: "",
    },
    agreed: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "resolved"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Wanted", wantedSchema);
