const { addExpense, getExpense, deleteExpense, updateExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome, updateIncome } = require('../controllers/income');
const { protect } = require('../middleware/auth');
const router = require('express').Router();

router.post('/add-income', protect, addIncome)
    .get('/get-incomes', protect, getIncomes)
    .delete('/delete-income/:id', protect, deleteIncome)
    .put('/update-income/:id', protect, updateIncome)
    .post('/add-expense', protect, addExpense)
    .get('/get-expenses', protect, getExpense)
    .delete('/delete-expense/:id', protect, deleteExpense)
    .put('/update-expense/:id', protect, updateExpense);

module.exports = router;