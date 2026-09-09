import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import Chart from '../Chart/Chart';
import { useGlobalContext } from '../../context/globalContext';
import { rupee } from '../../utils/icons';
import History from '../../History/History';
import QuickAddModal from '../QuickAddModal/QuickAddModal';
import {
    FaPlus,
    FaRegLightbulb,
    FaBullseye,
    FaEdit,
    FaCheck,
    FaCalendarAlt,
    FaChartPie
} from 'react-icons/fa';

function Dashboard() {
    const {
        getIncomes,
        getExpenses,
        incomes,
        expenses,
        addIncome,
        addExpense
    } = useGlobalContext();

    useEffect(() => {
        getIncomes();
        getExpenses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Time filter: 'all', 'month', '30days', 'year'
    const [timeframe, setTimeframe] = useState('all');

    // Quick Add Modal state
    const [quickModal, setQuickModal] = useState({ isOpen: false, type: 'income' });

    // Monthly Budget limit in localStorage
    const [budgetLimit, setBudgetLimit] = useState(() => {
        const saved = localStorage.getItem('user_monthly_budget');
        return saved ? Number(saved) : 30000;
    });
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [tempBudgetInput, setTempBudgetInput] = useState(budgetLimit);

    const saveBudget = () => {
        if (!isNaN(tempBudgetInput) && tempBudgetInput > 0) {
            setBudgetLimit(Number(tempBudgetInput));
            localStorage.setItem('user_monthly_budget', String(tempBudgetInput));
        }
        setIsEditingBudget(false);
    };

    // Filter transactions based on timeframe
    const isWithinTimeframe = React.useCallback((dateStr) => {
        if (timeframe === 'all') return true;
        const d = new Date(dateStr);
        const now = new Date();

        if (timeframe === 'month') {
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }
        if (timeframe === '30days') {
            const diffDays = (now - d) / (1000 * 60 * 60 * 24);
            return diffDays >= 0 && diffDays <= 30;
        }
        if (timeframe === 'year') {
            return d.getFullYear() === now.getFullYear();
        }
        return true;
    }, [timeframe]);

    const filteredIncomes = useMemo(() => {
        return incomes.filter(i => isWithinTimeframe(i.date));
    }, [incomes, isWithinTimeframe]);

    const filteredExpenses = useMemo(() => {
        return expenses.filter(e => isWithinTimeframe(e.date));
    }, [expenses, isWithinTimeframe]);

    const incomeVal = useMemo(() => {
        return filteredIncomes.reduce((sum, item) => sum + item.amount, 0);
    }, [filteredIncomes]);

    const expenseVal = useMemo(() => {
        return filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
    }, [filteredExpenses]);

    const balanceVal = incomeVal - expenseVal;

    const minIncome = filteredIncomes.length ? Math.min(...filteredIncomes.map(i => i.amount)) : 0;
    const maxIncome = filteredIncomes.length ? Math.max(...filteredIncomes.map(i => i.amount)) : 0;
    const minExpense = filteredExpenses.length ? Math.min(...filteredExpenses.map(i => i.amount)) : 0;
    const maxExpense = filteredExpenses.length ? Math.max(...filteredExpenses.map(i => i.amount)) : 0;

    const savingsRate = incomeVal > 0 ? Math.max(0, Math.min(100, Math.round(((incomeVal - expenseVal) / incomeVal) * 100))) : 0;

    // Budget utilization (calculated from current month expenses)
    const thisMonthExpenses = useMemo(() => {
        const now = new Date();
        return expenses
            .filter(e => {
                const d = new Date(e.date);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            })
            .reduce((sum, e) => sum + e.amount, 0);
    }, [expenses]);

    const budgetPercent = budgetLimit > 0 ? Math.min(100, Math.round((thisMonthExpenses / budgetLimit) * 100)) : 0;

    // Top Expense Categories
    const topCategories = useMemo(() => {
        const catMap = {};
        filteredExpenses.forEach(e => {
            const cat = e.category || 'other';
            catMap[cat] = (catMap[cat] || 0) + e.amount;
        });

        const sorted = Object.entries(catMap)
            .map(([category, amount]) => ({
                category: category.charAt(0).toUpperCase() + category.slice(1),
                amount,
                percent: expenseVal > 0 ? Math.round((amount / expenseVal) * 100) : 0
            }))
            .sort((a, b) => b.amount - a.amount);

        return sorted.slice(0, 3);
    }, [filteredExpenses, expenseVal]);

    // Smart Financial Advice / AI Insights
    const smartInsight = useMemo(() => {
        if (incomeVal === 0 && expenseVal === 0) {
            return {
                title: "Welcome to Your Financial Command Center",
                desc: "Start by logging your initial salary, freelance income, or daily expenses using the '+ Quick Add' buttons above.",
                status: 'info'
            };
        }
        if (expenseVal > incomeVal) {
            return {
                title: "⚠️ Expense Alert: Spending Exceeds Inflow",
                desc: `Your expenses exceed income by ₹${(expenseVal - incomeVal).toLocaleString('en-IN')}. Consider auditing discretionary categories.`,
                status: 'warning'
            };
        }
        if (budgetPercent >= 90) {
            return {
                title: "🚨 Budget Warning",
                desc: `You have utilized ${budgetPercent}% of your monthly budget (₹${thisMonthExpenses.toLocaleString('en-IN')} / ₹${budgetLimit.toLocaleString('en-IN')}).`,
                status: 'warning'
            };
        }
        if (savingsRate >= 50) {
            return {
                title: "🌟 Super Saver Status!",
                desc: `Fantastic! You have retained ${savingsRate}% of your income. You are in an ideal position to invest or grow your emergency buffer.`,
                status: 'success'
            };
        }
        if (topCategories.length > 0) {
            return {
                title: `💡 Spending Insight: ${topCategories[0].category}`,
                desc: `${topCategories[0].category} accounts for ${topCategories[0].percent}% of total spend (₹${topCategories[0].amount.toLocaleString('en-IN')}).`,
                status: 'info'
            };
        }
        return {
            title: "Cash Flow is Healthy",
            desc: `Current net balance is positive at ₹${balanceVal.toLocaleString('en-IN')}. Maintain consistent budget tracking.`,
            status: 'success'
        };
    }, [incomeVal, expenseVal, budgetPercent, thisMonthExpenses, budgetLimit, savingsRate, topCategories, balanceVal]);

    return (
        <DashboardStyled>
            <InnerLayout>
                {/* Top Action Bar */}
                <div className="top-action-bar">
                    <div>
                        <h1>Financial Command Center</h1>
                        <p className="subtitle">Real-time financial analytics & smart cash flow management</p>
                    </div>

                    <div className="actions-cluster">
                        {/* Timeframe Dropdown */}
                        <div className="timeframe-select">
                            <FaCalendarAlt className="icon" />
                            <select
                                value={timeframe}
                                onChange={(e) => setTimeframe(e.target.value)}
                            >
                                <option value="all">All Time</option>
                                <option value="month">This Month</option>
                                <option value="30days">Last 30 Days</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>

                        {/* Quick Add Buttons */}
                        <button
                            className="quick-btn income-btn"
                            onClick={() => setQuickModal({ isOpen: true, type: 'income' })}
                        >
                            <FaPlus /> Quick Income
                        </button>
                        <button
                            className="quick-btn expense-btn"
                            onClick={() => setQuickModal({ isOpen: true, type: 'expense' })}
                        >
                            <FaPlus /> Quick Expense
                        </button>
                    </div>
                </div>

                {/* Pro Summary Cards Grid */}
                <div className="pro-cards-grid">
                    {/* Income Card */}
                    <div className="metric-card income-card">
                        <div className="card-top">
                            <span>Total Income</span>
                            <span className="badge green-badge">+{filteredIncomes.length} records</span>
                        </div>
                        <h3>{rupee} {incomeVal.toLocaleString('en-IN')}</h3>
                        <p className="subtext">{timeframe === 'all' ? 'Lifetime inflow' : 'Selected period'}</p>
                    </div>

                    {/* Expense Card */}
                    <div className="metric-card expense-card">
                        <div className="card-top">
                            <span>Total Expense</span>
                            <span className="badge red-badge">-{filteredExpenses.length} records</span>
                        </div>
                        <h3>{rupee} {expenseVal.toLocaleString('en-IN')}</h3>
                        <p className="subtext">{timeframe === 'all' ? 'Lifetime outflow' : 'Selected period'}</p>
                    </div>

                    {/* Net Balance Card */}
                    <div className="metric-card balance-card">
                        <div className="card-top">
                            <span>Net Balance</span>
                            <span className={`badge ${balanceVal >= 0 ? 'green-badge' : 'red-badge'}`}>
                                {balanceVal >= 0 ? 'Surplus' : 'Deficit'}
                            </span>
                        </div>
                        <h3 className={balanceVal >= 0 ? 'green-text' : 'red-text'}>
                            {rupee} {balanceVal.toLocaleString('en-IN')}
                        </h3>
                        <p className="subtext">
                            Savings Rate: <strong>{savingsRate}%</strong>
                        </p>
                    </div>

                    {/* Monthly Budget Target Card */}
                    <div className="metric-card budget-card">
                        <div className="card-top">
                            <span className="budget-title"><FaBullseye /> Monthly Budget</span>
                            {isEditingBudget ? (
                                <button className="icon-action-btn" onClick={saveBudget} title="Save budget">
                                    <FaCheck />
                                </button>
                            ) : (
                                <button className="icon-action-btn" onClick={() => { setTempBudgetInput(budgetLimit); setIsEditingBudget(true); }} title="Edit budget target">
                                    <FaEdit />
                                </button>
                            )}
                        </div>

                        {isEditingBudget ? (
                            <div className="budget-edit-input">
                                <span>₹</span>
                                <input
                                    type="number"
                                    value={tempBudgetInput}
                                    onChange={(e) => setTempBudgetInput(e.target.value)}
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <h3>₹{thisMonthExpenses.toLocaleString('en-IN')} <span className="budget-limit">/ ₹{budgetLimit.toLocaleString('en-IN')}</span></h3>
                        )}

                        <div className="budget-bar">
                            <div
                                className={`budget-fill ${budgetPercent > 90 ? 'danger' : budgetPercent > 70 ? 'warning' : 'safe'}`}
                                style={{ width: `${budgetPercent}%` }}
                            ></div>
                        </div>
                        <p className="subtext">
                            {budgetPercent >= 100 ? '⚠️ Exceeded monthly budget limit!' : `${100 - budgetPercent}% budget remaining this month`}
                        </p>
                    </div>
                </div>

                {/* Smart Financial Insights Banner */}
                <div className={`insight-banner ${smartInsight.status}`}>
                    <div className="insight-icon">
                        <FaRegLightbulb />
                    </div>
                    <div className="insight-content">
                        <h4>{smartInsight.title}</h4>
                        <p>{smartInsight.desc}</p>
                    </div>
                </div>

                {/* Main Content Layout (Chart + Right Analytics Column) */}
                <div className="dashboard-main-grid">
                    {/* Left: Interactive Visual Chart */}
                    <div className="chart-column">
                        <Chart
                            incomesData={filteredIncomes}
                            expensesData={filteredExpenses}
                        />
                    </div>

                    {/* Right: Top Categories Breakdown & History */}
                    <div className="side-column">
                        {/* Top Spending Categories Card */}
                        <div className="analytics-card">
                            <div className="card-header">
                                <h4><FaChartPie /> Top Spending Categories</h4>
                            </div>
                            {topCategories.length === 0 ? (
                                <p className="empty-sub">No expense category data in selected period.</p>
                            ) : (
                                <div className="categories-list">
                                    {topCategories.map((cat, idx) => (
                                        <div key={idx} className="category-item">
                                            <div className="cat-info">
                                                <span className="cat-name">{cat.category}</span>
                                                <span className="cat-val">₹{cat.amount.toLocaleString('en-IN')} ({cat.percent}%)</span>
                                            </div>
                                            <div className="cat-bar-bg">
                                                <div
                                                    className="cat-bar-fill"
                                                    style={{ width: `${cat.percent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent History */}
                        <div className="analytics-card history-wrapper">
                            <History />
                        </div>

                        {/* Salary & Expense Ranges */}
                        <div className="analytics-card range-card">
                            <div className="range-block">
                                <div className="range-header">
                                    <span>Min Salary</span>
                                    <strong>Income Range</strong>
                                    <span>Max Salary</span>
                                </div>
                                <div className="range-values">
                                    <p>₹{minIncome.toLocaleString('en-IN')}</p>
                                    <p>₹{maxIncome.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            <div className="range-block" style={{ marginTop: '1rem' }}>
                                <div className="range-header">
                                    <span>Min Expense</span>
                                    <strong style={{ color: 'var(--color-delete)' }}>Expense Range</strong>
                                    <span>Max Expense</span>
                                </div>
                                <div className="range-values">
                                    <p>₹{minExpense.toLocaleString('en-IN')}</p>
                                    <p>₹{maxExpense.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Add Modal */}
                <QuickAddModal
                    isOpen={quickModal.isOpen}
                    onClose={() => setQuickModal({ isOpen: false, type: 'income' })}
                    type={quickModal.type}
                    onAdd={quickModal.type === 'expense' ? addExpense : addIncome}
                />
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;

    .top-action-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        gap: 1rem;

        .subtitle {
            color: rgba(34, 34, 96, 0.6);
            font-size: 0.95rem;
            margin-top: 0.2rem;
        }

        .actions-cluster {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            flex-wrap: wrap;

            .timeframe-select {
                position: relative;
                display: flex;
                align-items: center;

                .icon {
                    position: absolute;
                    left: 0.8rem;
                    color: rgba(34, 34, 96, 0.5);
                    pointer-events: none;
                    font-size: 0.85rem;
                }

                select {
                    padding: 0.6rem 1rem 0.6rem 2.2rem;
                    font-family: inherit;
                    font-size: 0.9rem;
                    font-weight: 600;
                    border: 2px solid #FFFFFF;
                    border-radius: 16px;
                    background: #FCF6F9;
                    box-shadow: 0px 1px 12px rgba(0, 0, 0, 0.04);
                    color: #222260;
                    outline: none;
                    cursor: pointer;
                }
            }

            .quick-btn {
                border: none;
                padding: 0.65rem 1.2rem;
                border-radius: 16px;
                font-family: inherit;
                font-size: 0.9rem;
                font-weight: 600;
                color: #fff;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.4rem;
                box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
                transition: all 0.2s ease;

                &:hover {
                    transform: translateY(-2px);
                    box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.12);
                }

                &.income-btn {
                    background: var(--color-green);
                }

                &.expense-btn {
                    background: var(--color-delete);
                }
            }
        }
    }

    .pro-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.2rem;
        margin-bottom: 1.5rem;

        .metric-card {
            background: #FCF6F9;
            border: 2px solid #FFFFFF;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            border-radius: 20px;
            padding: 1.2rem 1.4rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .card-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;

                span {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: rgba(34, 34, 96, 0.6);
                    text-transform: uppercase;
                }

                .badge {
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 0.2rem 0.6rem;
                    border-radius: 12px;
                    text-transform: none;

                    &.green-badge {
                        background: rgba(66, 173, 98, 0.15);
                        color: var(--color-green);
                    }

                    &.red-badge {
                        background: rgba(255, 0, 0, 0.12);
                        color: var(--color-delete);
                    }
                }

                .budget-title {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .icon-action-btn {
                    background: transparent;
                    border: none;
                    color: rgba(34, 34, 96, 0.6);
                    cursor: pointer;
                    font-size: 0.9rem;
                    padding: 0.2rem;

                    &:hover {
                        color: #222260;
                    }
                }
            }

            h3 {
                font-size: 1.8rem;
                color: #222260;
                margin: 0.2rem 0;

                &.green-text { color: var(--color-green); }
                &.red-text { color: var(--color-delete); }

                .budget-limit {
                    font-size: 1rem;
                    color: rgba(34, 34, 96, 0.5);
                    font-weight: 500;
                }
            }

            .budget-edit-input {
                display: flex;
                align-items: center;
                gap: 0.4rem;
                margin: 0.3rem 0;

                input {
                    width: 120px;
                    padding: 0.3rem 0.5rem;
                    font-family: inherit;
                    font-size: 1.2rem;
                    font-weight: 700;
                    border: 2px solid #222260;
                    border-radius: 8px;
                    outline: none;
                }
            }

            .budget-bar {
                height: 8px;
                background: #e9ecef;
                border-radius: 10px;
                margin: 0.5rem 0;
                overflow: hidden;

                .budget-fill {
                    height: 100%;
                    border-radius: 10px;
                    transition: width 0.4s ease;

                    &.safe { background: var(--color-green); }
                    &.warning { background: #f39c12; }
                    &.danger { background: var(--color-delete); }
                }
            }

            .subtext {
                font-size: 0.8rem;
                color: rgba(34, 34, 96, 0.5);
                margin: 0;

                strong {
                    color: var(--color-green);
                }
            }
        }
    }

    .insight-banner {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        padding: 1rem 1.4rem;
        border-radius: 18px;
        margin-bottom: 1.5rem;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.04);

        .insight-icon {
            font-size: 1.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .insight-content {
            h4 {
                font-size: 1rem;
                margin-bottom: 0.2rem;
                color: #222260;
            }
            p {
                font-size: 0.88rem;
                color: rgba(34, 34, 96, 0.7);
                margin: 0;
            }
        }

        &.success {
            background: rgba(66, 173, 98, 0.1);
            .insight-icon { color: var(--color-green); }
        }

        &.warning {
            background: rgba(255, 152, 0, 0.12);
            .insight-icon { color: #f39c12; }
        }

        &.info {
            background: rgba(34, 34, 96, 0.06);
            .insight-icon { color: #222260; }
        }
    }

    .dashboard-main-grid {
        display: grid;
        grid-template-columns: 3fr 2fr;
        gap: 1.5rem;

        .chart-column {
            display: flex;
            flex-direction: column;
            min-height: 480px;
        }

        .side-column {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;

            .analytics-card {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                border-radius: 20px;
                padding: 1.2rem 1.4rem;

                .card-header {
                    margin-bottom: 0.8rem;
                    h4 {
                        font-size: 1.05rem;
                        color: #222260;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }
                }

                .empty-sub {
                    font-size: 0.85rem;
                    color: rgba(34, 34, 96, 0.5);
                }

                .categories-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.7rem;

                    .category-item {
                        .cat-info {
                            display: flex;
                            justify-content: space-between;
                            font-size: 0.85rem;
                            font-weight: 600;
                            color: #222260;
                            margin-bottom: 0.2rem;
                        }

                        .cat-bar-bg {
                            height: 6px;
                            background: #e0e0e0;
                            border-radius: 10px;
                            overflow: hidden;

                            .cat-bar-fill {
                                height: 100%;
                                background: var(--color-accent);
                                border-radius: 10px;
                                transition: width 0.3s ease;
                            }
                        }
                    }
                }
            }

            .range-card {
                .range-block {
                    .range-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 0.85rem;
                        color: rgba(34, 34, 96, 0.6);
                        margin-bottom: 0.3rem;

                        strong {
                            color: #222260;
                            font-size: 0.95rem;
                        }
                    }

                    .range-values {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background: #fff;
                        border: 1px solid #eee;
                        padding: 0.6rem 1rem;
                        border-radius: 12px;

                        p {
                            font-size: 1.1rem;
                            font-weight: 700;
                            color: #222260;
                            margin: 0;
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 1100px) {
        .dashboard-main-grid {
            grid-template-columns: 1fr;
        }
    }
`;

export default Dashboard;