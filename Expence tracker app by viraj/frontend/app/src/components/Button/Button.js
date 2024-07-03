import React from 'react';
import styled from 'styled-components';

function Button({ name, icon, onClick, bg, bPad, color, bRad }) {
    return (
        <ButtonStyled 
            style={{
                background: bg,
                padding: bPad,
                borderRadius: bRad,
                color: color,
            }} 
            onClick={onClick}
        >
            {icon}
            {name}
        </ButtonStyled>
    );
}

const ButtonStyled = styled.button`
    outline: none;
    border: none;
    font-family: inherit;
    font-size: 1rem; /* Adjust the font size as needed */
    display: flex;
    align-items: center;
    justify-content: center; /* Center the content */
    gap: .5rem;
    cursor: pointer;
    transition: all .4s ease-in-out;
    padding: 0.8rem 1.6rem; /* Default padding */
    border-radius: 60px; /* Default border-radius */
`;

export default Button;
