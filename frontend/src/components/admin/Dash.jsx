import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import '../../style/mainPageStyle/adminPageStyle/DashBoardStyle.css';
  
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
function Dash() {
   
  const [data, setData] = useState({
        labels: [],
        datasets: []
    });
    const[customers, setCustomers] = useState(0);
    const[income, setIncome] = useState(0);
    const[customersGrowth, setCustomersGrowth] = useState(0);
    const[incomeGrowth, setIncomeGrowth] = useState(0);
    const [selectedOption, setSelectedOption] = useState("All Time");
    const [bestSellers, setBestSellers] = useState([]);
    const overViewTime = [
        "All Time",
        "This Year",
        "Last 30 Days",
        "This Month",
      ];
      useEffect(() => {
        const fetchIncomeData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/admin/income-data?timeRange=${selectedOption}`);
                const data = await response.json();
                setIncomeData(data);
            } catch (error) {
                console.error('Error fetching income data:', error);
            }
        };

        fetchIncomeData();
    }, [selectedOption]);

  useEffect(() => {
      const fetchBestSellers = async () => {
          try {
              const response = await fetch(`http://localhost:8080/api/admin/best-sellers?period=${selectedOption}`);
              const result = await response.json();
              setBestSellers(result);
          } catch (error) {
              console.error('Error fetching best sellers:', error);
          }
      };

      fetchBestSellers();
  }, [selectedOption]);
      
    const options = {
      responsive: true,
      maintainAspectRatio: false,
    };
    

    
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
                <div className="best-sellers">
                <h1>Best Sellers</h1>
                <div className="best-sellers-list">
                <ul>
                    {bestSellers.map((seller, index) => (
                        <li key={index}>Product ID: {seller.productId} - Sales: {seller.totalSales}</li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
    );
}
  
export default Dash;
  