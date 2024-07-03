//chatGPT

import React from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import Chart from '../Chart/Chart';

function Dashboard() {
    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="stats-con">
                    <div className="chart-con">
                        {/* <Chart/> */}
                        {/* console.log(incomes);
                        console.log(expenses); */}
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    .stats-con {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    .chart-con {
        width: 100%;
    }
`;

export default Dashboard;



// import React from 'react';
// import styled from 'styled-components';
// import { InnerLayout } from '../../styles/Layouts';
// import Chart from '../Chart/Chart';

// function Dashboard() {
//     return (
//         <DashboardStyled>
//             <InnerLayout>

//             <h1>All Transaction</h1>
//             <div className="stats-con">
//                     <div className="chart-con">
//                         <Chart />
//                     </div>
//             </div>
//             </InnerLayout>
//         </DashboardStyled>
//     );
// }

// const DashboardStyled = styled.div`
//     /* Add your styling here */
// `;

// export default Dashboard;
