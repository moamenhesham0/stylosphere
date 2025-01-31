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
    const [customers, setCustomers] = useState(0);
    const [income, setIncome] = useState(0);
    const [customersGrowth, setCustomersGrowth] = useState(0);
    const [incomeGrowth, setIncomeGrowth] = useState(0);
    const [selectedOption, setSelectedOption] = useState("All Time");
    const [bestSellers, setBestSellers] = useState([]);
    const overViewTime = ["All Time", "This Year", "This Month"];

    useEffect(() => {
        const fetchIncomeData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/purchase/income-data?timeRange=${selectedOption}`);
                const result = await response.json();
                console.log(result.datasets+ "  dddssdf");
                const styledDatasets = result.datasets.map(dataset => ({
                    ...dataset,
                    backgroundColor: '#c3ad71', // Gold color
                    borderColor: '#8b7355', // Darker gold for border
                    borderWidth: 1,
                    hoverBackgroundColor: '#d4c391' // Lighter gold for hover
                }));
                setData({
                    labels: result.labels,
                    datasets: styledDatasets
                });
            } catch (error) {
                console.error('Error fetching income data:', error);
            }
        };

        fetchIncomeData();
    }, [selectedOption]);


    useEffect(() => {
        fetch("http://localhost:8080/api/customers/sumUsers")  // Update the URL if needed
          .then((response) => response.json())   // Convert response to JSON
          .then((data) => setCustomers(data))    // Store in state
          .catch((error) => console.error("Error fetching user count:", error));
      }, []);

 

    // useEffect(() => {
    //     const fetchBestSellers = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:8080/api/purchase/best-sellers?period=${selectedOption}`);
    //             const result = await response.json();
    //             setBestSellers(result);
    //         } catch (error) {
    //             console.error('Error fetching best sellers:', error);
    //         }
    //     };

    //     fetchBestSellers();
    // }, [selectedOption]);

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
                    <div className="over-view-title">
                        <h1>Over View</h1>
                    </div>
                   
                </div>
                <div className="over-view-card-container">
                    <div className="overview-card overview-customers">
                        <h2>Customers</h2>
                        <p className="count">{customers}</p>
                        <span className="growth">{customersGrowth}%</span>
                    </div>
                    <div className="overview-card overview-income">
                        <h2>Income</h2>
                        <p className="count">{income}</p>
                        <span className="growth">{incomeGrowth}%</span>
                    </div>
                </div>
            </div>
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
            <div className="dash-board">
                <Bar data={data} options={options} />
            </div>

        </div>
    );
}

export default Dash;

  