import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../context/globalContext';
import IncomeItem from '../IncomeItem/IncomeItem';
import ExpenseForm from './ExpenseForm';
import EditModal from '../EditModal/EditModal';

function Expenses() {
    const { expenses, getExpenses, deleteExpense, updateExpense, totalExpenses } = useGlobalContext();
    const [editingItem, setEditingItem] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        getExpenses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEditClick = (item) => {
        setEditingItem(item);
        setIsEditOpen(true);
    };

    const handleCloseEdit = () => {
        setEditingItem(null);
        setIsEditOpen(false);
    };

    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className='total-income'>Total Expense: <span>₹{totalExpenses().toLocaleString('en-IN')}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <ExpenseForm />
                    </div>
                    <div className="incomes">
                        {expenses.length === 0 ? (
                            <p className="no-data">No expenses added yet. Start by adding one!</p>
                        ) : (
                            expenses.map((income) => {
                                const { _id, title, amount, date, category, tdis, type } = income;
                                return (
                                    <IncomeItem
                                        key={_id}
                                        id={_id}
                                        title={title}
                                        description={tdis}
                                        amount={amount}
                                        category={category}
                                        date={date}
                                        type={type || 'expense'}
                                        indicatorColor="var(--color-delete)"
                                        deleteItem={deleteExpense}
                                        onEdit={() => handleEditClick(income)}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>

                <EditModal
                    isOpen={isEditOpen}
                    onClose={handleCloseEdit}
                    item={editingItem}
                    type="expense"
                    onSave={updateExpense}
                />
            </InnerLayout>
        </ExpenseStyled>
    );
}

const ExpenseStyled = styled.div`
    display: flex;
    overflow: auto;
    .total-income{
    display:flex;
    justify-content: center;
    align-items:center;
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
     box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        span{
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-green);
        }
    }
    .income-content{
    display: flex;
    gap:2rem;
    .incomes{
    flex:1;
    }

    }
`;

export default Expenses;