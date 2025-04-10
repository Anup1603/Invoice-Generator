const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        trim: true
    },
    logo: {
        type: String,
        default: 'https://cdn.prod.website-files.com/666b4fa7001989d530a5e4b6/666b8ff0771d918bbf8ebcf7_Transparent-p-500.png'
    },
    address: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    bankDetails: {
        accountNumber: String,
        bankName: String,
        branch: String,
        ifscCode: String
    },
    gstNumber: {
        type: String,
        trim: true,
        uppercase: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['incomplete', 'complete'],
        default: 'incomplete'
    },
}, { timestamps: true });

// Update the updatedAt field on save
CompanySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Company', CompanySchema);