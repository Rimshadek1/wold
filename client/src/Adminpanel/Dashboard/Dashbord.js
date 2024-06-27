import React, { useContext, useEffect, useState } from 'react';
import './Dashboard.css';
import { Link, } from 'react-router-dom';
import { getTrades, deleteTrade } from '../../Service/Apis';
import { toast, ToastContainer } from 'react-toastify';
import { UserContext } from '../../UserContext/userContext';

function Dashboard() {
    const [trades, setTrades] = useState([]);
    const { userData } = useContext(UserContext);
    useEffect(() => {
        fetchTrades();
    }, []);

    const fetchTrades = async () => {
        if (userData.role === "admin") {
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

        }
    };
    const handleDeleteTrade = async (tradeId) => {
        try {
            const response = await deleteTrade(tradeId);
            if (response.status === 200) {
                toast.success("Trade successfully deleted");
                fetchTrades(); // Refresh the list of trades
            } else {
                toast.error("Failed to delete trade");
            }
        } catch (error) {
            console.error('Error deleting trade:', error);
            toast.error("An error occurred while deleting the trade");
        }
    };

    if (userData.role !== "admin") { return (<>You are not admin </>) }
    return (
        <div className="dashboard-container">
            <ToastContainer />
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
                            <td><img src={trade.productImage ? trade.productImage : ""} alt="Product" width="50" /></td>
                            <td><a href={trade.investorMemoPort ? trade.investorMemoPort : ""} target="_blank" rel="noopener noreferrer">View Memo</a></td>
                            <td><img src={trade.logochange ? trade.logochange : ""} alt="logo" width="50" /></td>
                            <td>
                                <Link to={`/edittrade/${trade._id}`} className="action-button" > Edit</Link>

                                <button className="action-button" onClick={() => handleDeleteTrade(trade._id)}>Delete</button>

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
