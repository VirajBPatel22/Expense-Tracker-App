const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
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
        default: "expense"
    },
    category: {
        type: String,
        required: true
    },
    tdis: {
        type: String,
        trim: true,
        default: ''
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);