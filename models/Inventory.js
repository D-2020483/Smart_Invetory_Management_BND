import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required:true,
            trim:true,
        },
        description: {
            type: String,
            trim: true,
            default: '',
          },

          sku: {
            type: String,
            required: true,
            unique: true,
            trim: true,
          },
          category: {
            type: String,
            required: true,
            enum: ['Electronics', 'Accessories', 'Cables', 'Tools', 'Other'], 
          },
          price: {
            type: Number,
            required: true,
            min: 0,
          },
          quantity: {
            type: Number,
            required: true,
            min: 0,
          },
          minStock: {
            type: Number,
            required: true,
            min: 0,
          },
          supplier: {
            type: String,
            trim: true,
            default: '',
          },
          status: {
            type: String,
            enum: ['in-stock', 'low-stock', 'out-of-stock'],
            default: 'in-stock',
          },
          image: {
            type: String, 
            default: null,
          }
        },
        {
            timestamps: true,
        }
);

InventorySchema.index({ sku: 1 }, { unique: true });

const Inventory = mongoose.model("Inventory", InventorySchema);
export default Inventory;