import React from 'react';
// import styled from 'styled-components';
import styled, { keyframes } from 'styled-components';
import { useWindowSize } from '../../utils/useWindowSize';

// // Define keyframes
// const moveOrb = keyframes`
//     0% {
//         transform: translate(0, 0);
//     }
//     50% {
//         transform: translate(400px, 500px);
//     }
//     100% {
//         transform: translate(0, 0);
//     }
// `;

// Styled component


function Orb() {
    const { width, height } = useWindowSize();
    console.log(width, height);

    const moveOrb = keyframes`
    0% {
        transform: translate(0, 0);
    }
    50% {
        transform: translate(400px, 500px);
    }
    100% {
        transform: translate(0, 0);
    }
`;


    const OrbStyled = styled.div`
    width: 70vh;
    height: 70vh;
    position: absolute;
    border-radius: 50%;
    margin-left: -35vh; /* Adjusted margin for centering */
    margin-top: -35vh; /* Adjusted margin for centering */
    background: linear-gradient(180deg, #F56692 0%, #F2994A 100%);
    filter: blur(300px);
    animation: ${moveOrb} 10s alternate linear infinite;

`;
return(
    <OrbStyled></OrbStyled>
)
    
}

export default Orb;



// // import React from 'react'
// // import styled from 'styled-components'

// // function Orb() {


// //     const orbStyled = styled.div `
// //         width: 70vh;
// //         height: 70vh;
// //         position: absolute;
// //         border-radius: 50;
// //         margin-left: -37vh;
// //         margin-top: -37vh;
// //         background: linear-gradient(180deg,#F56692 0%,#F2994A 100%);
// //         filter: blur(400px);
// //     `;
// //   return (
// //     <OrbStyled> Orb</OrbStyled>
    
// //   )
// // }

// // export default Orb
// import React from 'react'
// import styled, { keyframes } from 'styled-components'
// import { useWindowSize } from '../../utils/useWindowSize';

// function Orb() {

//     const {width, height} = useWindowSize()

//     console.log(width, height)

//     const moveOrb = keyframes`
//         0%{
//             transform: translate(0, 0);
//         }
//         50%{
//             transform: translate(${width}px, ${height/2}px);
//         }
//         100%{
//             transform: translate(0, 0);
//         }
//     `

//     const OrbStyled = styled.div`
//         width: 70vh;
//         height: 70vh;
//         position: absolute;
//         border-radius: 50%;
//         margin-left: -37vh;
//         margin-top: -37vh;
//         background: linear-gradient(180deg, #F56692 0%, #F2994A 100%);
//         filter: blur(400px);
//         animation: ${moveOrb} 15s alternate linear infinite;
//     `;

//     return (
//         <OrbStyled></OrbStyled>
//     )
// }

// export default Orb