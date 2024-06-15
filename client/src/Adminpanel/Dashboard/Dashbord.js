import React, { useEffect, useState } from 'react';
import './Dashboard.css'; // Import your CSS file for styling (optional)
import { Link, useParams } from 'react-router-dom';
import { getTrades } from '../../Service/Apis'; // Import your API function to get trades
import axios from 'axios';

function Dashboard() {
    const [trades, setTrades] = useState([]);

    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = async () => {
        try {
            const response = await getTrades();
            if (response.status === 200) {
                const tradesData = response.data.trades;
                if (Array.isArray(tradesData)) {
                    setTrades(tradesData);
                } else if (typeof tradesData === 'object' && tradesData !== null) {
                    setTrades([tradesData]);
                } else {
                    console.error('Trades data is not in expected format:', tradesData);
                    setTrades([]);
                }
            } else {
                console.error('Failed to fetch trades:', response.status);
                setTrades([]);
            }
        } catch (error) {
            console.error('Error fetching trades:', error);
            setTrades([]);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="button-container">
                <Link to='/addtrade' className="add-trade-button">Add Trade</Link>
                <Link to='/verifyadhaar' className="veri-adhar-button">Verify Adhaar</Link>
                <Link to="/editinvestprice" className="view-trade-button">Edit 10% price of owners </Link>
                <Link to='/investcodes' className="veri-adhar-button">Generate code</Link>
                <Link to='/withdrawrequest' className="add-trade-button">Withdraw request</Link>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name of Trade</th>
                        <th>Departure Port Country</th>
                        <th>Arrival Port Country</th>
                        <th>Order Number</th>
                        <th>Container Foot</th>
                        <th>Expected Date of Income</th>
                        <th>Return on Investment</th>
                        <th>Last Funding Date</th>
                        <th>Expected Freight Departure</th>
                        <th>Expected Arrival</th>
                        <th>Deposit of Profit</th>
                        <th>Total CIF Price</th>
                        <th>Total Shares</th>
                        <th>Shares Available</th>
                        <th>Product Image</th>
                        <th>Investor Memo Port</th>
                        <th>COMPANY LOGO</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {trades.map(trade => (
                        <tr key={trade._id}>
                            <td>{trade.nameOfTrade}</td>
                            <td>{trade.departurePortCountry}</td>
                            <td>{trade.arrivalPortCountry}</td>
                            <td>{trade.orderNumber}</td>
                            <td>{trade.containerFoot}</td>
                            <td>{trade.expectedDateOfIncome}</td>
                            <td>{trade.returnOnInvestment}</td>
                            <td>{trade.lastFundingDate}</td>
                            <td>{trade.expectedFreightDeparture}</td>
                            <td>{trade.expectedArrival}</td>
                            <td>{trade.depositOfProfit}</td>
                            <td>{trade.totalCIFPrice}</td>
                            <td>{trade.totalShares}</td>
                            <td>{trade.sharesAvailable}</td>
                            <td><img src={`${axios.defaults.baseURL}/${trade.productImage}`} alt="Product" width="50" /></td>
                            <td><a href={`${axios.defaults.baseURL}/${trade.investorMemoPort}`} target="_blank" width="50" rel="noopener noreferrer">View Memo</a></td>
                            <td><img src={`${axios.defaults.baseURL}/${trade.logochange}`} alt="logo" width="50" /></td>
                            <td>
                                <button className="action-button">Edit</button>
                                <button className="action-button">Delete</button>
                                <Link
                                    to={`/addprofit/${trade._id}`}
                                    className="action-button"
                                >
                                    Add profit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
}

export default Dashboard;
