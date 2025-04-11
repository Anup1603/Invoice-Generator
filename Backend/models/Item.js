const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
        type: Number,
        required: [true, 'Unit price is required'],
        min: [0, 'Unit price cannot be negative']
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: [true, 'Company reference is required']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

// Add index for better query performance
itemSchema.index({ company: 1, isActive: 1 });

module.exports = mongoose.model("Item", itemSchema);