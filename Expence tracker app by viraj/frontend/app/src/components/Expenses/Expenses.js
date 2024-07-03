//old code   

// code by chatGPT



import React, { useEffect } from 'react';
// import React from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../context/globalContext';
// import Form from '../Form/Form';
import IncomeItem from '../IncomeItem/IncomeItem';
import ExpenseForm from './ExpenseForm';

function Expenses() {
    const { addIncome,expenses,getExpenses,deleteExpense,totalExpenses} = useGlobalContext();

    useEffect(() => {
        getExpenses();
    }, []);

    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className='total-income'>Total Expense: <span>₹{totalExpenses()}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <ExpenseForm></ExpenseForm>
                    </div>
                    <div className="incomes">
                    {expenses.map((income) => {
                            const { _id, title, amount, date, category, tdis, type } = income;
                            console.log(income)
                            return (
                                <IncomeItem
                                    key={_id}
                                    id={_id}
                                    title={title}
                                    description={tdis}
                                    amount={amount}
                                    category={category}
                                    date={date}
                                    type={type}
                                    indicatorColor="var(--color-green)"
                                    deleteItem={deleteExpense} // Implement deleteItem function if necessary
                                />
                            );
                        })}
                    </div>
                </div>
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



// import React from 'react';
// import styled from 'styled-components';
// import { InnerLayout } from '../../styles/Layouts';

// function Expenses() {
//     return (
//         <ExpenseStyled>
//             <InnerLayout>
//             Expenses
//             </InnerLayout>
//         </ExpenseStyled>
//     );
// }

// const ExpenseStyled = styled.div`
//     /* Add your styling here */
// `;

// export default Expenses;
