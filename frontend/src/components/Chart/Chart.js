import React, { useState } from 'react';
import styled from 'styled-components';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useGlobalContext } from '../../context/globalContext';
import { dateFormat } from '../../utils/dateFormat';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

function Chart({ incomesData, expensesData }) {
    const context = useGlobalContext();
    const incomes = incomesData || context.incomes;
    const expenses = expensesData || context.expenses;
    const [chartMode, setChartMode] = useState('line'); // 'line' or 'doughnut'

    // Build chronological date map
    const sortedTransactions = [...incomes, ...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
    const labels = Array.from(new Set(sortedTransactions.map(item => dateFormat(item.date))));

    // Line Chart Data
    const lineData = {
        labels: labels.length ? labels : ['No Data'],
        datasets: [
            {
                label: 'Income',
                data: labels.map(dateLabel => {
                    const matched = incomes.filter(i => dateFormat(i.date) === dateLabel);
                    return matched.reduce((sum, item) => sum + item.amount, 0);
                }),
                backgroundColor: 'rgba(66, 173, 98, 0.2)',
                borderColor: '#42AD62',
                pointBackgroundColor: '#42AD62',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                tension: 0.35,
                fill: true
            },
            {
                label: 'Expenses',
                data: labels.map(dateLabel => {
                    const matched = expenses.filter(e => dateFormat(e.date) === dateLabel);
                    return matched.reduce((sum, item) => sum + item.amount, 0);
                }),
                backgroundColor: 'rgba(255, 0, 0, 0.15)',
                borderColor: '#FF0000',
                pointBackgroundColor: '#FF0000',
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                tension: 0.35,
                fill: true
            }
        ]
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { family: 'inherit', size: 13, weight: 'bold' },
                    color: '#222260',
                    usePointStyle: true,
                    boxWidth: 8
                }
            },
            tooltip: {
                backgroundColor: 'rgba(34, 34, 96, 0.9)',
                padding: 12,
                titleFont: { size: 14 },
                bodyFont: { size: 13 },
                callbacks: {
                    label: (context) => ` ${context.dataset.label}: ₹${context.raw.toLocaleString('en-IN')}`
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: (value) => '₹' + value.toLocaleString('en-IN'),
                    color: 'rgba(34, 34, 96, 0.6)'
                },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            },
            x: {
                ticks: { color: 'rgba(34, 34, 96, 0.6)' },
                grid: { display: false }
            }
        }
    };

    // Doughnut Data (Expense breakdown)
    const expenseCategories = {};
    expenses.forEach(e => {
        const cat = e.category || 'other';
        expenseCategories[cat] = (expenseCategories[cat] || 0) + e.amount;
    });

    const categoryLabels = Object.keys(expenseCategories).map(
        c => c.charAt(0).toUpperCase() + c.slice(1)
    );
    const categoryValues = Object.values(expenseCategories);

    const doughnutColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#42AD62', '#E7E9ED'
    ];

    const doughnutData = {
        labels: categoryLabels.length ? categoryLabels : ['No Expenses'],
        datasets: [
            {
                data: categoryValues.length ? categoryValues : [1],
                backgroundColor: categoryValues.length ? doughnutColors.slice(0, categoryValues.length) : ['#e0e0e0'],
                borderColor: '#ffffff',
                borderWidth: 3
            }
        ]
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    font: { family: 'inherit', size: 12, weight: '600' },
                    color: '#222260',
                    usePointStyle: true
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        if (!categoryValues.length) return ' No expense data';
                        return ` ${context.label}: ₹${context.raw.toLocaleString('en-IN')}`;
                    }
                }
            }
        }
    };

    const hasData = incomes.length > 0 || expenses.length > 0;

    return (
        <ChartStyled>
            <div className="chart-header">
                <h3>Financial Overview</h3>
                <div className="toggle-btns">
                    <button
                        className={chartMode === 'line' ? 'active' : ''}
                        onClick={() => setChartMode('line')}
                    >
                        Trend
                    </button>
                    <button
                        className={chartMode === 'doughnut' ? 'active' : ''}
                        onClick={() => setChartMode('doughnut')}
                    >
                        Expenses by Category
                    </button>
                </div>
            </div>

            <div className="chart-body">
                {!hasData ? (
                    <div className="empty-chart">
                        <p>No transaction data available to plot chart.</p>
                        <span>Add an income or expense to see interactive analytics!</span>
                    </div>
                ) : chartMode === 'line' ? (
                    <Line data={lineData} options={lineOptions} />
                ) : (
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                )}
            </div>
        </ChartStyled>
    );
}

const ChartStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1.5rem;
    border-radius: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;

        h3 {
            font-size: 1.25rem;
            color: #222260;
        }

        .toggle-btns {
            display: flex;
            background: #fff;
            border-radius: 12px;
            padding: 3px;
            border: 1px solid #eee;

            button {
                border: none;
                background: transparent;
                padding: 0.4rem 0.9rem;
                font-family: inherit;
                font-size: 0.85rem;
                font-weight: 600;
                color: rgba(34, 34, 96, 0.6);
                border-radius: 9px;
                cursor: pointer;
                transition: all 0.2s ease;

                &.active {
                    background: #222260;
                    color: #fff;
                }

                &:hover:not(.active) {
                    color: #222260;
                }
            }
        }
    }

    .chart-body {
        flex: 1;
        min-height: 280px;
        position: relative;

        .empty-chart {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: rgba(34, 34, 96, 0.6);
            gap: 0.5rem;
            text-align: center;
            padding: 2rem;

            span {
                font-size: 0.85rem;
                color: rgba(34, 34, 96, 0.4);
            }
        }
    }
`;

export default Chart;