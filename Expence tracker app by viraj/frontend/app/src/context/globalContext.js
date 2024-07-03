//old code 

import React, { useContext, useState, useEffect } from "react";
import axios from 'axios';
// import Income from "../components/Income/Income";

const BASE_URL = "http://localhost:5000/api/v1/";
const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const[expenses,setExpenses]=useState([]);
    const [error, setError] = useState(null);

    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${BASE_URL}add-income`, income);
            // Handle the response if needed
        } catch (err) {
            setError(err.response.data.message);
        }
        getIncomes()
    };  

    
    const getIncomes = async () => {
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`);
            setIncomes(response.data);
            console.log(response.data);
        } catch (err) {
            setError(err.response.data.message);
        }
    };
    const deleteIncome = async (id) => {
        const res = await axios.delete(`${BASE_URL}delete-income/${id}`)
        getIncomes()
    }
    const totalIncome = ()=>{
        let totalIncome = 0;
        incomes.forEach((income)=>{
            totalIncome =totalIncome + income.amount
        })
        return totalIncome;
    }
    // console.log(totalIncome());
    const addExpense = async (income) => {
        const response = await axios.post(`${BASE_URL}add-expense`, income)
            .catch((err) =>{
                setError(err.response.data.message)
            })
        getExpenses()
    }

    const getExpenses = async () => {
        const response = await axios.get(`${BASE_URL}get-expenses`)
        setExpenses(response.data)
        console.log(response.data)
    }

    const deleteExpense = async (id) => {
        const res  = await axios.delete(`${BASE_URL}delete-expense/${id}`)
        getExpenses()
    }

    const totalExpenses = () => {
        let totalIncome = 0;
        expenses.forEach((income) =>{
            totalIncome = totalIncome + income.amount
        })

        return totalIncome;
    }
    return (
        
        <GlobalContext.Provider value={{
            addIncome,
            getIncomes,
            incomes,
            deleteIncome,
            totalIncome,
            addExpense,
            getExpenses,
            expenses,
            deleteExpense,
            totalExpenses
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};



// import React, { useContext, useState } from "react";
// import axios from 'axios';

// const BASE_URL = "http://localhost:5000/api/v1/";

// const GlobalContext = React.createContext();

// export const GlobalProvider = ({ children }) => {
//     const [incomes, setIncomes] = useState([]);
//     const [expenses, setExpenses] = useState([]);
//     const [error, setError] = useState(null);
    
//     const addIncome = async (income) => {
//         try {
//             const response = await axios.post(`${BASE_URL}add-income`, income);
//             // Handle the response if needed
//         } catch (err) {
//             setError(err.response.data.message);
//         }
//     };   

//     return (
//         <GlobalContext.Provider value={{
//             addIncome
//         }}>
//             {children}
//         </GlobalContext.Provider>
//     )
// }

// export const useGlobalContext = () => {
//     return useContext(GlobalContext);
// };



// import React, { Children, useContext, useState,useEffect } from "react";
// import axios from 'axios';

// const BASE_URL = "http://localhost:5000/api/v1/";

// const GlobalContext=React.createContext()

// export const GlobalProvider = ({Children})=>{
//     const [incomes, setIncomes] = useState([]);
//     const [expenses, setExpenses] = useState([]);
//     const [error, setError] = useState(null);
    
//     const addIncome = async (income) => {
//         try {
//             const response = await axios.post(`${BASE_URL}add-income`, income);
//             // Handle the response if needed
//         } catch (err) {
//             setError(err.response.data.message);
//         }
//     };   

//     return (
//         <GlobalContext.Provider value={'hello'}>
//             {Children}
//         </GlobalContext.Provider>
//     )
// }

// export const useGlobalContext = () => {
//     return useContext(GlobalContext);
// };