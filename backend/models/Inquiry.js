import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    propertyTitle: String,
    propertyPrice: Number,
    propertyCity: String,
    propertyArea: String,
    status: {
      type: String,
      enum: ["new", "contacted", "resolved"],
      default: "new",
    },
    notes: String,
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", InquirySchema);

export default Inquiry;
