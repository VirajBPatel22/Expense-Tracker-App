import React from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
// import { useGlobalContext } from "../../context/globalContext";
// import { dateFormat } from "../../utils/dateFormat";

function Chart() {
  //   const { incomes, expenses } = useGlobalContext();
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const productASales = [120, 135, 125, 145, 160, 150, 170];

  const productBSales = [80, 75, 95, 100, 110, 105, 120, 115];

  const data = {
    labels,
    datasets: [
      {
        label: "Product A Sales",
        data: productASales,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132)",
      },
      {
        label: "Product B Sales",
        data: productBSales,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235)",
      },
    ],
  };

  return (
    <ChartStyled>
      <Line data={data} />
    </ChartStyled>
  );
}

const ChartStyled = styled.div`
  background: #fcf6f9;
  border: 2px solid #ffffff;
  box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  border-radius: 20px;
  height: 100%;
`;
export default Chart;
