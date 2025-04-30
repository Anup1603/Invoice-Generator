const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    customer: {
        companyName: {
            type: String,
            required: true
        },
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String
        },
        gstNumber: String,
        phoneNumber: String,
        contactPerson: String,
        domainName: String
    },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        itemDiscount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        priceAtTime: {
            type: Number,
            required: true
        }
    }],
    overAllDiscount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    subtotal: {
        type: Number,
        required: true
    },
    totalDiscount: {
        type: Number,
        required: true
    },
    amountAfterItemDiscounts: {
        type: Number,
        required: true
    },
    amountAfterAllDiscounts: {
        type: Number,
        required: true
    },
    gstRate: {
        type: Number,
        default: 18
    },
    gstAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
        default: 'draft'
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);