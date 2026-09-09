const IncomeSchema = require("../models/incomeModel");

exports.addIncome = async (req, res) => {
    const { title, amount, category, tdis, date } = req.body;
    const userId = req.user ? req.user._id : null;

    const income = new IncomeSchema({
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
        await income.save();
        res.status(200).json({ message: 'Income Added', data: income });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to add income', error: error.message });
    }
};

exports.getIncomes = async (req, res) => {
    try {
        const query = req.user ? { userId: req.user._id } : {};
        const incomes = await IncomeSchema.find(query).sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    try {
        const query = req.user ? { _id: id, userId: req.user._id } : { _id: id };
        const deleted = await IncomeSchema.findOneAndDelete(query);
        if (!deleted) {
            return res.status(404).json({ message: 'Income record not found or unauthorized' });
        }
        res.status(200).json({ message: 'Income Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateIncome = async (req, res) => {
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
        const updated = await IncomeSchema.findOneAndUpdate(
            query,
            { title, amount, category, tdis, date },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Income record not found or unauthorized' });
        }

        res.status(200).json({ message: 'Income Updated', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update income', error: error.message });
    }
};
