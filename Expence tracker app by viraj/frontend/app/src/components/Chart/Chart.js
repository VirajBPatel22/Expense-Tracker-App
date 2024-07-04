import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { dateFormat } from '../../utils/dateFormat';

function Chart() {
    const { incomes, expenses, error } = useGlobalContext();
    const [sortedIncomes, setSortedIncomes] = useState([]);
    const [sortedExpenses, setSortedExpenses] = useState([]);

    useEffect(() => {
        if (!error) {
            setSortedIncomes([...incomes]);
            setSortedExpenses([...expenses]);
        }
    }, [incomes, expenses, error]);

    return (
        <ChartStyled>
            {error && <p className="error">Error loading data: {error}</p>}
            <div className="column">
                <h2>Incomes</h2>
                {sortedIncomes.length > 0 ? (
                    <ul>
                        {sortedIncomes.map((income, index) => (
                            <li key={index}>
                                <span className="date"><b>{dateFormat(income.date)}</b></span>
                                <span className="amount">₹{income.amount}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No incomes available.</p>
                )}
            </div>
            <div className="column">
                <h2>Expenses</h2>
                {sortedExpenses.length > 0 ? (
                    <ul>
                        {sortedExpenses.map((expense, index) => (
                            <li key={index}>
                                <span className="date"><b>{dateFormat(expense.date)}</b></span>
                                <span className="amount">₹{expense.amount}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No expenses available.</p>
                )}
            </div>
        </ChartStyled>
    );
}

const ChartStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 2rem;
    border-radius: 20px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    gap: 2rem;

    .column {
        flex: 1;
        border-radius: 10px;
        padding: 1rem;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        overflow: hidden;

        h2 {
            text-align: center;
            margin-bottom: 1rem;
            font-size: 1.5rem;
            color: var(--color-accent);
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 0;
            flex-grow: 1;
            overflow-y: auto;
            max-height: 400px;
            &::-webkit-scrollbar {
                display: none;
            }
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 1rem;
            margin-bottom: 0.5rem;
            background: #f9f9f9;
            border-radius: 5px;
            transition: background 0.3s ease;

            &:hover {
                background: #f1f1f1;
            }

            .date {
                color: var(--primary-color);
                font-size: 0.9rem;
            }

            .amount {
                font-weight: bold;
                color: var(--color-green);
            }
        }

        p {
            text-align: center;
            color: var(--primary-color3);
        }
    }

    .error {
        color: var(--color-delete);
        font-size: 1.2rem;
        text-align: center;
        margin-top: 1rem;
        animation: shake 0.5s ease-in-out;
    }

    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(10px); }
        50% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
        100% { transform: translateX(0); }
    }
`;

export default Chart;