import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../context/globalContext';
import IncomeItem from '../IncomeItem/IncomeItem';
import EditModal from '../EditModal/EditModal';
import Button from '../Button/Button';
import { FaSearch, FaFileDownload, FaFilter, FaSortAmountDown } from 'react-icons/fa';

function ViewTransactions() {
    const {
        incomes,
        expenses,
        deleteIncome,
        deleteExpense,
        updateIncome,
        updateExpense
    } = useGlobalContext();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');
    const [editingItem, setEditingItem] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Merge and normalize transactions
    const allTransactions = useMemo(() => {
        const inc = incomes.map(item => ({ ...item, type: 'income' }));
        const exp = expenses.map(item => ({ ...item, type: 'expense' }));
        return [...inc, ...exp];
    }, [incomes, expenses]);

    // Categories list based on selected type
    const availableCategories = useMemo(() => {
        const set = new Set();
        allTransactions.forEach(t => {
            if (t.category) set.add(t.category);
        });
        return Array.from(set);
    }, [allTransactions]);

    // Filter and Sort
    const filteredTransactions = useMemo(() => {
        let list = [...allTransactions];

        // Type filter
        if (selectedType !== 'all') {
            list = list.filter(t => t.type === selectedType);
        }

        // Category filter
        if (selectedCategory !== 'all') {
            list = list.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase());
        }

        // Search term filter
        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            list = list.filter(t =>
                t.title.toLowerCase().includes(query) ||
                (t.tdis && t.tdis.toLowerCase().includes(query))
            );
        }

        // Sorting
        list.sort((a, b) => {
            if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
            if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
            if (sortBy === 'amount-desc') return b.amount - a.amount;
            if (sortBy === 'amount-asc') return a.amount - b.amount;
            if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
            return 0;
        });

        return list;
    }, [allTransactions, selectedType, selectedCategory, searchTerm, sortBy]);

    // Stats for current filtered view
    const filteredTotalIncome = useMemo(() => {
        return filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [filteredTransactions]);

    const filteredTotalExpense = useMemo(() => {
        return filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    }, [filteredTransactions]);

    // Export to CSV
    const exportToCSV = () => {
        if (filteredTransactions.length === 0) {
            alert('No transactions to export!');
            return;
        }

        const headers = ['Type', 'Title', 'Amount (INR)', 'Category', 'Date', 'Notes'];
        const rows = filteredTransactions.map(t => [
            t.type.toUpperCase(),
            `"${t.title.replace(/"/g, '""')}"`,
            t.amount,
            `"${t.category}"`,
            new Date(t.date).toLocaleDateString(),
            `"${(t.tdis || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `ExpenseTracker_Export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleEditClick = (item) => {
        setEditingItem(item);
        setIsEditOpen(true);
    };

    const handleCloseEdit = () => {
        setEditingItem(null);
        setIsEditOpen(false);
    };

    const handleSave = (id, data) => {
        if (editingItem.type === 'expense') {
            return updateExpense(id, data);
        }
        return updateIncome(id, data);
    };

    return (
        <ViewTransactionsStyled>
            <InnerLayout>
                <div className="header-con">
                    <div>
                        <h1>All Transactions</h1>
                        <p className="subtitle">Search, filter, edit, and export your complete financial history</p>
                    </div>
                    <Button
                        name="Export CSV"
                        icon={<FaFileDownload />}
                        bPad=".7rem 1.4rem"
                        bRad="20px"
                        bg="var(--primary-color)"
                        color="#fff"
                        onClick={exportToCSV}
                    />
                </div>

                {/* Summary bar for filtered view */}
                <div className="summary-bar">
                    <div className="summary-card total">
                        <span>Transactions</span>
                        <h3>{filteredTransactions.length}</h3>
                    </div>
                    <div className="summary-card income">
                        <span>Total Inflow</span>
                        <h3>+₹{filteredTotalIncome.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="summary-card expense">
                        <span>Total Outflow</span>
                        <h3>-₹{filteredTotalExpense.toLocaleString('en-IN')}</h3>
                    </div>
                    <div className="summary-card net">
                        <span>Net Flow</span>
                        <h3 className={filteredTotalIncome - filteredTotalExpense >= 0 ? 'pos' : 'neg'}>
                            ₹{(filteredTotalIncome - filteredTotalExpense).toLocaleString('en-IN')}
                        </h3>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="controls-con">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by title or notes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filters-row">
                        <div className="select-box">
                            <FaFilter className="icon" />
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option value="all">All Types</option>
                                <option value="income">Income Only</option>
                                <option value="expense">Expense Only</option>
                            </select>
                        </div>

                        <div className="select-box">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {availableCategories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="select-box">
                            <FaSortAmountDown className="icon" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date-desc">Newest First</option>
                                <option value="date-asc">Oldest First</option>
                                <option value="amount-desc">Highest Amount</option>
                                <option value="amount-asc">Lowest Amount</option>
                                <option value="title-asc">Title (A-Z)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="transactions-list">
                    {filteredTransactions.length === 0 ? (
                        <div className="no-data-card">
                            <p>No transactions match your current filters.</p>
                        </div>
                    ) : (
                        filteredTransactions.map((item) => (
                            <IncomeItem
                                key={item._id}
                                id={item._id}
                                title={item.title}
                                description={item.tdis}
                                amount={item.amount}
                                category={item.category}
                                date={item.date}
                                type={item.type}
                                indicatorColor={item.type === 'expense' ? 'var(--color-delete)' : 'var(--color-green)'}
                                deleteItem={item.type === 'expense' ? deleteExpense : deleteIncome}
                                onEdit={() => handleEditClick(item)}
                            />
                        ))
                    )}
                </div>

                <EditModal
                    isOpen={isEditOpen}
                    onClose={handleCloseEdit}
                    item={editingItem}
                    type={editingItem?.type || 'income'}
                    onSave={handleSave}
                />
            </InnerLayout>
        </ViewTransactionsStyled>
    );
}

const ViewTransactionsStyled = styled.div`
    display: flex;
    flex-direction: column;
    overflow: auto;

    .header-con {
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
    }

    .summary-bar {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1.2rem;
        margin-bottom: 2rem;

        .summary-card {
            background: #FCF6F9;
            border: 2px solid #FFFFFF;
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            border-radius: 18px;
            padding: 1rem 1.4rem;
            display: flex;
            flex-direction: column;
            gap: 0.3rem;

            span {
                font-size: 0.85rem;
                font-weight: 600;
                color: rgba(34, 34, 96, 0.6);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            h3 {
                font-size: 1.5rem;
                color: #222260;

                &.pos { color: var(--color-green); }
                &.neg { color: var(--color-delete); }
            }

            &.income h3 { color: var(--color-green); }
            &.expense h3 { color: var(--color-delete); }
        }
    }

    .controls-con {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;

        .search-box {
            position: relative;
            width: 100%;

            .search-icon {
                position: absolute;
                left: 1.2rem;
                top: 50%;
                transform: translateY(-50%);
                color: rgba(34, 34, 96, 0.4);
            }

            input {
                width: 100%;
                padding: 0.8rem 1rem 0.8rem 3rem;
                font-family: inherit;
                font-size: 1rem;
                border: 2px solid #FFFFFF;
                border-radius: 16px;
                background: #FCF6F9;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.04);
                color: #222260;
                outline: none;

                &:focus {
                    border-color: #222260;
                }

                &::placeholder {
                    color: rgba(34, 34, 96, 0.4);
                }
            }
        }

        .filters-row {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;

            .select-box {
                position: relative;
                display: flex;
                align-items: center;
                flex: 1;
                min-width: 150px;

                .icon {
                    position: absolute;
                    left: 1rem;
                    color: rgba(34, 34, 96, 0.5);
                    pointer-events: none;
                }

                select {
                    width: 100%;
                    padding: 0.7rem 1rem 0.7rem 2.2rem;
                    font-family: inherit;
                    font-size: 0.95rem;
                    border: 2px solid #FFFFFF;
                    border-radius: 14px;
                    background: #FCF6F9;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.04);
                    color: #222260;
                    outline: none;
                    cursor: pointer;

                    &:focus {
                        border-color: #222260;
                    }
                }
            }
        }
    }

    .transactions-list {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;

        .no-data-card {
            background: #FCF6F9;
            border: 2px dashed #ccc;
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            color: rgba(34, 34, 96, 0.6);
            font-size: 1.1rem;
        }
    }
`;

export default ViewTransactions;
