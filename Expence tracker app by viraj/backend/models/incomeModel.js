const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        default: "income"
    },
    category: {
        type: String,
        required: true
    },
    tdis: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Income', IncomeSchema);
