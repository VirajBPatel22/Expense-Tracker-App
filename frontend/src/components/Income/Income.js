import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import { useGlobalContext } from '../../context/globalContext';
import Form from '../Form/Form';
import IncomeItem from '../IncomeItem/IncomeItem';
import EditModal from '../EditModal/EditModal';

function Income() {
    const { incomes, getIncomes, deleteIncome, updateIncome, totalIncome } = useGlobalContext();
    const [editingItem, setEditingItem] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    useEffect(() => {
        getIncomes();
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
        <IncomeStyled>
            <InnerLayout>
                <h1>Incomes</h1>
                <h2 className='total-income'>Total Income: <span>₹{totalIncome().toLocaleString('en-IN')}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <Form />
                    </div>
                    <div className="incomes">
                        {incomes.length === 0 ? (
                            <p className="no-data">No incomes added yet. Start by adding one!</p>
                        ) : (
                            incomes.map((income) => {
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
                                        type={type}
                                        indicatorColor="var(--color-green)"
                                        deleteItem={deleteIncome}
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
                    type="income"
                    onSave={updateIncome}
                />
            </InnerLayout>
        </IncomeStyled>
    );
}

const IncomeStyled = styled.div`
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

export default Income;