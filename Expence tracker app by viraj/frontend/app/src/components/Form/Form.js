import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from "../Button/Button";
import { FaPlus } from 'react-icons/fa';

function Form() {
    const { addIncome, getIncomes, error } = useGlobalContext();
    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: new Date(),
        category: '',
        tdis: '',
    });
    const { title, amount, date, category, tdis } = inputState;

    const handleInput = (name) => (e) => {
        setInputState((prevState) => ({
            ...prevState,
            [name]: e.target.value,
        }));
    };

    const handleDateChange = (date) => {
        setInputState((prevState) => ({
            ...prevState,
            date,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedData = {
            ...inputState,
            date: date.toISOString().split('T')[0],
        };
        await addIncome(formattedData);
        getIncomes();
        setInputState({
            title: '',
            amount: '',
            date: new Date(),
            category: '',
            tdis: '',
        });
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <div className="input-control">
                <input
                    type="text"
                    value={title}
                    name="title"
                    placeholder="Salary Title"
                    onChange={handleInput('title')}
                />
            </div>
            <div className="input-control">
                <input
                    type="text"
                    value={amount}
                    name="amount"
                    placeholder="Salary Amount"
                    onChange={handleInput('amount')}
                />
            </div>
            <div className="input-control">
                <DatePicker
                    id="date"
                    placeholderText="Enter A Date"
                    selected={date}
                    dateFormat="dd-MM-YYYY"
                    onChange={handleDateChange}
                />
            </div>
            <div className="selects input-control">
                <select
                    required
                    value={category}
                    name="category"
                    id="category"
                    onChange={handleInput('category')}
                >
                    <option value="" disabled>Select Option</option>
                    <option value="salary">Salary</option>
                    <option value="freelancing">Freelancing</option>
                    <option value="investments">Investments</option>
                    <option value="stocks">Stocks</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="youtube">YouTube</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="input-control">
                <textarea
                    name="tdis"
                    value={tdis}
                    placeholder="Add A reference"
                    id="tdis"
                    cols="30"
                    rows="4"
                    onChange={handleInput('tdis')}
                ></textarea>
            </div>
            <div className="submit-btn">
                <Button
                    name="Add Salary"
                    icon={<FaPlus />}
                    bPad=".8rem 1.6rem"
                    bRad="30px"
                    bg="var(--color-accent)"
                    color="#fff"
                />
            </div>
        </FormStyled>
    );
}

const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    input, textarea, select {
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .5rem 1rem;
        border-radius: 5px;
        border: 2px solid #fff;
        background: transparent;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);
        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }
    }
    .input-control {
        input {
            width: 100%;
        }
    }
    .selects {
        display: flex;
        justify-content: flex-end;
        select {
            color: rgba(34, 34, 96, 0.4);
            &:focus, &:active {
                color: rgba(34, 34, 96, 1);
            }
        }
    }
    .submit-btn {
        button {
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            &:hover {
                background: var(--color-green) !important;
            }
        }
    }
    .error {
        color: red;
        font-size: 0.9rem;
    }
`;

export default Form;