import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Area name is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    // Description & Content
    description: {
      type: String,
      required: [true, "Description is required"],
    },

    shortDescription: {
      type: String,
    },

    // Images
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

    // Location
    latitude: {
      type: Number,
      min: -90,
      max: 90,
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180,
    },

    // Google Maps Embed URL
    mapEmbedUrl: {
      type: String,
    },

    // Statistics (auto-calculated or admin input)
    rentPriceRange: {
      min: Number,
      max: Number,
    },

    salePriceRange: {
      min: Number,
      max: Number,
    },

    rentIncreasePercentage: {
      type: Number,
      default: 0,
      min: 0,
    },

    saleIncreasePercentage: {
      type: Number,
      default: 0,
      min: 0,
    },

    averageRentPerSqft: {
      type: Number,
      default: 0,
      min: 0,
    },

    newListingsForSale: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Highlights
    highlights: [
      {
        icon: String,
        label: String,
        count: Number,
      },
    ],

    // Facilities (nearby)
    facilities: {
      schools: [String],
      hospitals: [String],
      restaurants: [String],
    },

    // Admin Control
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Create compound unique index for name + city
areaSchema.index({ name: 1, city: 1 }, { unique: true, sparse: true });

export default mongoose.model("Area", areaSchema);
