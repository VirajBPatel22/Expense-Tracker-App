import React, { useContext, useState, useEffect, useCallback } from "react";
import axios from 'axios';

const rawUrl = process.env.REACT_APP_API_URL || "http://localhost:5001/api/v1/";
const BASE_URL = rawUrl.endsWith('/') ? rawUrl : `${rawUrl}/`;
const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    // Auth State from localStorage
    const [token, setToken] = useState(() => localStorage.getItem('expense_tracker_token') || null);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('expense_tracker_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    // Data State
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Helper for auth headers
    const getAuthHeader = useCallback(() => {
        if (!token) return {};
        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    }, [token]);

    // Data Fetchers
    const getIncomes = useCallback(async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`, getAuthHeader());
            setIncomes(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
            } else {
                setError(err.response?.data?.message || 'Failed to fetch incomes');
            }
        }
    }, [token, getAuthHeader]);

    const getExpenses = useCallback(async () => {
        if (!token) return;
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`, getAuthHeader());
            setExpenses(response.data);
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
            } else {
                setError(err.response?.data?.message || 'Failed to fetch expenses');
            }
        }
    }, [token, getAuthHeader]);

    // Fetch user data on token mount
    useEffect(() => {
        if (token) {
            getIncomes();
            getExpenses();
        } else {
            setIncomes([]);
            setExpenses([]);
        }
    }, [token, getIncomes, getExpenses]);

    // Auth Actions
    const login = async (email, password) => {
        setAuthLoading(true);
        setAuthError(null);
        try {
            const res = await axios.post(`${BASE_URL}login`, { email, password });
            const { token: receivedToken, user: receivedUser } = res.data;

            setToken(receivedToken);
            setUser(receivedUser);
            localStorage.setItem('expense_tracker_token', receivedToken);
            localStorage.setItem('expense_tracker_user', JSON.stringify(receivedUser));
            setAuthLoading(false);
            return true;
        } catch (err) {
            setAuthLoading(false);
            const msg = err.response?.data?.message || 'Invalid email or password';
            setAuthError(msg);
            return false;
        }
    };

    const register = async (name, email, password) => {
        setAuthLoading(true);
        setAuthError(null);
        try {
            const res = await axios.post(`${BASE_URL}register`, { name, email, password });
            const { token: receivedToken, user: receivedUser } = res.data;

            setToken(receivedToken);
            setUser(receivedUser);
            localStorage.setItem('expense_tracker_token', receivedToken);
            localStorage.setItem('expense_tracker_user', JSON.stringify(receivedUser));
            setAuthLoading(false);
            return true;
        } catch (err) {
            setAuthLoading(false);
            const msg = err.response?.data?.message || 'Registration failed';
            setAuthError(msg);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('expense_tracker_token');
        localStorage.removeItem('expense_tracker_user');
        setIncomes([]);
        setExpenses([]);
    };

    // Income Actions
    const addIncome = async (income) => {
        setError(null);
        try {
            await axios.post(`${BASE_URL}add-income`, income, getAuthHeader());
            getIncomes();
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add income');
            return false;
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-income/${id}`, getAuthHeader());
            getIncomes();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete income');
        }
    };

    const updateIncome = async (id, updatedData) => {
        setError(null);
        try {
            await axios.put(`${BASE_URL}update-income/${id}`, updatedData, getAuthHeader());
            getIncomes();
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update income');
            return false;
        }
    };

    // Expense Actions
    const addExpense = async (expense) => {
        setError(null);
        try {
            await axios.post(`${BASE_URL}add-expense`, expense, getAuthHeader());
            getExpenses();
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expense');
            return false;
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${BASE_URL}delete-expense/${id}`, getAuthHeader());
            getExpenses();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete expense');
        }
    };

    const updateExpense = async (id, updatedData) => {
        setError(null);
        try {
            await axios.put(`${BASE_URL}update-expense/${id}`, updatedData, getAuthHeader());
            getExpenses();
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update expense');
            return false;
        }
    };

    // Calculations
    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token && !!user,
            authLoading,
            authError,
            setAuthError,
            login,
            register,
            logout,
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            updateIncome,
            totalIncome,
            addExpense,
            getExpenses,
            expenses,
            deleteExpense,
            updateExpense,
            totalExpenses,
            totalBalance,
            transactionHistory,
            error,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};