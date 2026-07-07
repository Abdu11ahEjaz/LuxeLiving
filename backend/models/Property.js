import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    // BASIC INFO
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      required: true,
    },

    // SALE / RENT
    purpose: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },

    // CATEGORY
    mainCategory: {
      type: String,
      enum: ["residential", "plot", "commercial"],
      required: true,
    },

    subCategory: {
      type: String,
      enum: [
        "house",
        "flat",
        "lower Portion",
        "upper Portion",
        "room",
        "farm house",
        "guest house",
        "pent house",
        "annexe",
        "hostel",
        "hostel suites",
      ],
      required: true,
    },

    // PRICE & SIZE
    price: {
      type: Number,
      required: true,
    },

    areaSize: {
      type: Number,
    },

    areaUnit: {
      type: String,
      enum: ["sqft", "marla", "kanal"],
    },

    // LOCATION
    city: {
      type: String,
      required: true,
    },

    area: {
      type: String,
    },

    address: {
      type: String,
    },

    // Map Embed URL (generated from address/coordinates)
    mapEmbedUrl: {
      type: String,
    },

    // ROOMS (optional)
    bedrooms: {
      type: Number,
    },

    bathrooms: {
      type: Number,
    },
    features: [String],

    phone: {
      type: String,
    },

    availability: {
      type: Boolean,
    },

    availableDays: [String],

    // MEDIA
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],

    // OWNER
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ADMIN CONTROL
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// ============================
// PERFORMANCE INDEXES
// ============================
// Covers getApprovedProperties and base filter in getFilteredProperties
propertySchema.index({ approvalStatus: 1, isActive: 1, createdAt: -1 });

// Covers getFilteredProperties with city/area filters
propertySchema.index({ approvalStatus: 1, isActive: 1, city: 1, createdAt: -1 });
propertySchema.index({ approvalStatus: 1, isActive: 1, area: 1, createdAt: -1 });

// Covers category-based queries
propertySchema.index({ approvalStatus: 1, isActive: 1, mainCategory: 1, createdAt: -1 });

// Covers getMyProperties
propertySchema.index({ owner: 1, createdAt: -1 });

// Covers price range queries
propertySchema.index({ approvalStatus: 1, isActive: 1, price: 1 });

export default mongoose.model("Property", propertySchema);
