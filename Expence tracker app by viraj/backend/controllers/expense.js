const ExpenseSchema = require("../models/expenseModel");
exports.addExpense = async (req, res) => {
    console.log(req.body);
    const { title, amount, category ,tdis,date} = req.body;

    const income = new ExpenseSchema({
        title,
        amount,
        category,
        tdis,
        date,
    });

    try {
        if(!title ||!category || !date ||!tdis ){
            return res.status(400).json({ message: 'fields are required' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }
        await income.save();
        res.status(200).json({ message: 'Expense Added' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to add Expense', error: error.message });
    }
    console.log(income)
}

exports.getExpense = async (req, res) => {
    try {
        const incomes = await ExpenseSchema.find().sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteExpense = async(req,res)=>{
    const{id} = req.params; // it return id 
    // console.log(id);--->it return id 
    ExpenseSchema.findByIdAndDelete(id)
        .then((income)=>{
            res.status(200).json({message: 'Expense Deleted'})
        })
        .catch((error)=>{
            res.status(500).json({message: 'Server Error'})
        })
}

