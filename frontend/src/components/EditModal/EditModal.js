import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Button from '../Button/Button';
import { FaTimes, FaCheck } from 'react-icons/fa';

function EditModal({ isOpen, onClose, item, type, onSave }) {
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: new Date(),
        category: '',
        tdis: ''
    });
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (item) {
            setInputState({
                title: item.title || '',
                amount: item.amount || '',
                date: item.date ? new Date(item.date) : new Date(),
                category: item.category || '',
                tdis: item.tdis || ''
            });
            setErrorMsg('');
        }
    }, [item]);

    if (!isOpen || !item) return null;

    const { title, amount, date, category, tdis } = inputState;

    const handleInput = (name) => (e) => {
        setInputState((prev) => ({
            ...prev,
            [name]: e.target.value
        }));
    };

    const handleDateChange = (date) => {
        setInputState((prev) => ({
            ...prev,
            date
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !category || !date) {
            setErrorMsg('Please fill in all required fields');
            return;
        }
        if (isNaN(amount) || Number(amount) <= 0) {
            setErrorMsg('Amount must be a positive number');
            return;
        }

        const formattedData = {
            ...inputState,
            amount: Number(amount),
            date: date.toISOString().split('T')[0]
        };

        const success = await onSave(item._id, formattedData);
        if (success !== false) {
            onClose();
        }
    };

    const isExpense = type === 'expense';

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit {isExpense ? 'Expense' : 'Income'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                {errorMsg && <p className="error-text">{errorMsg}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            name="title"
                            placeholder="e.g. Salary, Grocery shopping"
                            onChange={handleInput('title')}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Amount (₹)</label>
                        <input
                            type="number"
                            value={amount}
                            name="amount"
                            placeholder="e.g. 5000"
                            onChange={handleInput('amount')}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Date</label>
                        <DatePicker
                            selected={date}
                            dateFormat="dd-MM-yyyy"
                            onChange={handleDateChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Category</label>
                        <select
                            value={category}
                            name="category"
                            onChange={handleInput('category')}
                            required
                        >
                            <option value="" disabled>Select Category</option>
                            {isExpense ? (
                                <>
                                    <option value="education">Education</option>
                                    <option value="groceries">Groceries</option>
                                    <option value="health">Health</option>
                                    <option value="subscriptions">Subscriptions</option>
                                    <option value="takeaways">Takeaways</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="travelling">Travelling</option>
                                    <option value="other">Other</option>
                                </>
                            ) : (
                                <>
                                    <option value="salary">Salary</option>
                                    <option value="freelancing">Freelancing</option>
                                    <option value="investments">Investments</option>
                                    <option value="stocks">Stocks</option>
                                    <option value="bitcoin">Bitcoin</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="youtube">YouTube</option>
                                    <option value="other">Other</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Reference / Note</label>
                        <textarea
                            value={tdis}
                            name="tdis"
                            rows="3"
                            placeholder="Add reference notes..."
                            onChange={handleInput('tdis')}
                        ></textarea>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <Button
                            name="Save Changes"
                            icon={<FaCheck />}
                            bPad=".7rem 1.4rem"
                            bRad="20px"
                            bg="var(--color-green)"
                            color="#fff"
                        />
                    </div>
                </form>
            </ModalContainer>
        </ModalOverlay>
    );
}

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease-in-out;

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const ModalContainer = styled.div`
    background: #FCF6F9;
    border: 3px solid #FFFFFF;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.15);
    border-radius: 24px;
    padding: 2rem;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.25s ease-out;

    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        h2 {
            font-size: 1.5rem;
            color: #222260;
        }

        .close-btn {
            background: #fff;
            border: 2px solid #eee;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #222260;
            transition: all 0.2s ease;

            &:hover {
                background: #f0f0f0;
                transform: scale(1.05);
            }
        }
    }

    .error-text {
        color: #e53935;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        background: #ffebee;
        padding: 0.5rem 1rem;
        border-radius: 8px;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;

            label {
                font-size: 0.9rem;
                font-weight: 600;
                color: #222260;
            }

            input, select, textarea {
                font-family: inherit;
                font-size: 1rem;
                outline: none;
                border: 2px solid #FFFFFF;
                border-radius: 10px;
                padding: 0.6rem 1rem;
                background: #fff;
                box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.04);
                color: #222260;
                width: 100%;

                &:focus {
                    border-color: #222260;
                }
            }

            textarea {
                resize: vertical;
            }
        }

        .modal-actions {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;

            .cancel-btn {
                background: transparent;
                border: 2px solid #ccc;
                padding: 0.7rem 1.4rem;
                border-radius: 20px;
                font-weight: 600;
                cursor: pointer;
                color: #666;
                transition: all 0.2s ease;

                &:hover {
                    background: #eee;
                }
            }
        }
    }
`;

export default EditModal;
