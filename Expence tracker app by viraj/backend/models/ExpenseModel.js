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
        required: true
    },
    date: {
        type: Date,
        required: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);



// const mongoose = require('mongoose');


// const ExpenseSchema = new mongoose.Schema({
//     title:{
//         type:String,
//         required:true
//     },
//     amount:{
//         type:Number,
//         required:true
//     },
//     type:{
//         type:String,
//         default:"expense"
//     },
//     category:{
//         type:String,
//         required:true
//     },
//     tdis:{
//         type:String,
//         required:true
//     },
//     Date:{
//         type:Date,
//         required:true,
//         trim :true
//     },
// },{timestamp:true})
// module.exports = mongoose.model('Expense',ExpenseSchema)
