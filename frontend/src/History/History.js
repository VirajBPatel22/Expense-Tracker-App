import React from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../context/globalContext';

function History() {
    const {transactionHistory} = useGlobalContext()

    const [...history] = transactionHistory()

    return (
        <HistoryStyled>
            <h2>Recent History</h2>
            {history.length === 0 ? (
                <p className="empty-text">No recent transactions yet.</p>
            ) : (
                history.map((item) => {
                    const { _id, title, amount, type } = item;
                    return (
                        <div key={_id} className="history-item">
                            <p style={{
                                color: type === 'expense' ? 'var(--color-delete)' : 'var(--color-green)',
                                fontWeight: 600
                            }}>
                                {title}
                            </p>

                            <p style={{
                                color: type === 'expense' ? 'var(--color-delete)' : 'var(--color-green)',
                                fontWeight: 700
                            }}>
                                {type === 'expense' ? `-₹${(amount <= 0 ? 0 : amount).toLocaleString('en-IN')}` : `+₹${(amount <= 0 ? 0 : amount).toLocaleString('en-IN')}`}
                            </p>
                        </div>
                    );
                })
            )}
        </HistoryStyled>
    )
}

const HistoryStyled = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .history-item{
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        padding: 1rem;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .empty-text {
        font-size: 0.9rem;
        color: rgba(34, 34, 96, 0.5);
        text-align: center;
        padding: 0.5rem;
    }
`;

export default History