const ExpenseSchema = require("../models/ExpenseModel");

exports.addExpense = async (req, res) => {
    const { title, amount, category, tdis, date } = req.body;
    const userId = req.user ? req.user._id : null;

    const expense = new ExpenseSchema({
        title,
        amount,
        category,
        tdis,
        date,
        userId
    });

    try {
        if (!title || !category || !date) {
            return res.status(400).json({ message: 'Title, category, and date are required' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }
        await expense.save();
        res.status(200).json({ message: 'Expense Added', data: expense });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to add Expense', error: error.message });
    }
};

exports.getExpense = async (req, res) => {
    try {
        const query = req.user ? { userId: req.user._id } : {};
        const expenses = await ExpenseSchema.find(query).sort({ createdAt: -1 });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    try {
        const query = req.user ? { _id: id, userId: req.user._id } : { _id: id };
        const deleted = await ExpenseSchema.findOneAndDelete(query);
        if (!deleted) {
            return res.status(404).json({ message: 'Expense record not found or unauthorized' });
        }
        res.status(200).json({ message: 'Expense Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateExpense = async (req, res) => {
    const { id } = req.params;
    const { title, amount, category, tdis, date } = req.body;

    try {
        if (!title || !category || !date) {
            return res.status(400).json({ message: 'Title, category, and date are required' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        const query = req.user ? { _id: id, userId: req.user._id } : { _id: id };
        const updated = await ExpenseSchema.findOneAndUpdate(
            query,
            { title, amount, category, tdis, date },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Expense record not found or unauthorized' });
        }

        res.status(200).json({ message: 'Expense Updated', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update expense', error: error.message });
    }
};
