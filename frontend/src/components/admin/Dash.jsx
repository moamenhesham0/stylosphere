import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
import { useState } from "react";
import { Bar } from "react-chartjs-2";
import '../../style/mainPageStyle/adminPageStyle/DashBoardStyle.css';
  
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
function Dash() {
    const data = {
      labels: ["Jan", "Jul", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Total Income",
          data: [300, 400, 350, 200, 150, 100, 250, 300, 350, 400, 380, 420],
          backgroundColor: "#c3ad71",
        },
      ],
    };
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
    };
    
    const[customers, setCustomers] = useState(0);
    const[income, setIncome] = useState(0);
    const[customersGrowth, setCustomersGrowth] = useState(0);
    const[incomeGrowth, setIncomeGrowth] = useState(0);
    const [selectedOption, setSelectedOption] = useState("All Time");
    const overViewTime = [
        "All Time",
        "This Year",
        "Last 30 Days",
        "This Month",
      ];
    
    const handleSelect = (option) => {
      setSelectedOption(option);
    };

    return (
        <div className="page-admin">
                <div className="overview">
                    <div className="over-view-head">
                        
                        <div className="over-view-title"><h1>Over View</h1></div>
                        
                        <div className="over-view-time">
                            <button className="over-view-time-button">
                                {selectedOption} <span className="arrow">▼</span>
                            </button>
                            <ul className="over-view-time-list">
                                {overViewTime.map((option, index) => (
                                <li key={index} onClick={() => handleSelect(option)}>
                                    {option}
                                </li>
                                ))}
                            </ul>
                        
                        </div>             
                    </div>
                    <div className="over-view-card-containr">
                        <div className="overview-card  overview-customers">
                            <h2>customers</h2>
                            <p className="count">{customers}</p>
                            <span className="growth">{customersGrowth}%</span>
                        </div>
                        <div className="overview-card  overview-income">
                            <h2>Income</h2>
                            <p className="count">{income}</p>
                            <span className="growth">{incomeGrowth}%</span>
                        </div>
                    </div>
                </div>
                <div className="dash-board">
                    <Bar data={data} options={options} />
                </div>
        </div>
    );
}
  
export default Dash;
  