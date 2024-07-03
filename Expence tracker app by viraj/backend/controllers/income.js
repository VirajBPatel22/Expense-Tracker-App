const IncomeSchema = require("../models/incomeModel");

exports.addIncome = async (req, res) => {
    console.log(req.body);
    const { title, amount, category, tdis, date } = req.body;
    const income = new IncomeSchema({
        title,
        amount,
        category,
        tdis,
        date,
    });

    try {
        if (!title || !category || !date || !tdis) {
            return res.status(400).json({ message: 'Fields are required' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }
        await income.save();
        res.status(200).json({ message: 'Income Added' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to add income', error: error.message });
    }
    console.log(income);
};

exports.getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeSchema.find().sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        await IncomeSchema.findByIdAndDelete(id);
        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

