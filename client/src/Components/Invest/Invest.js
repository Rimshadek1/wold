import React, { useContext, useEffect, useState } from 'react'
import './invest.css'
import { useNavigate, useParams } from 'react-router';
import { getTrade, purchase, userTransaction } from '../../Service/Apis';
import { UserContext } from '../../UserContext/userContext';
import { ToastContainer, toast } from 'react-toastify';
import LoadingSpinner from '../Loadingpagr/LoadingSpinner';
function Invest() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [trade, setTrade] = useState(null); // Initialize trade state with null or appropriate initial value
    const [shares, setShares] = useState(1); // Initialize shares state with 1 or appropriate initial value
    const { userData } = useContext(UserContext);
    const [balances, setBalances] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // Fetch trade details when component mounts
        if (id) {
            details();
        }
    }, [id]); // Add id to dependency array to re-fetch trade details when id changes

    const goBack = (e) => {
        e.preventDefault();
        setLoading(true);
        navigate(-1);
        setLoading(false);
    };
    const fetchData = async () => {
        try {
            setLoading(true);
            if (!userData || !userData.id) {
                toast.error('User data is missing.');
                return;
            }

            const response = await userTransaction(userData.id);
            if (response.status === 200) {
                setBalances(response.data.balance)
            }
        } catch (error) {
            toast.error('An error occurred while fetching requests');
        }
        setLoading(false)
    }
    const details = async () => {
        try {
            setLoading(true);
            const response = await getTrade(id);
            if (response.status === 200) {
                setTrade(response.data.trade);
            }
        } catch (error) {
            console.error('Error fetching trade details:', error);
            // Handle error (e.g., toast.error)
        }
        setLoading(false);
    };

    const incrementShares = () => {
        if (trade && shares < trade.sharesAvailable) {
            setShares(prevShares => prevShares + 1);
        }
    };

    const decrementShares = () => {
        if (shares > 1) {
            setShares(prevShares => prevShares - 1);
        }
    };

    const handleInvest = async (e) => {
        e.preventDefault();
        if (!trade) return; // Ensure trade data is available

        const totalPrice = (trade.totalCIFPrice / trade.totalShares) * shares;
        if (totalPrice > balances) {
            toast.error("Insufficient funds, please add to your wallet");
            return;
        }

        const data = {
            totalPrice: totalPrice,
            items: trade._id,
            id: userData.id,
            purchasedQuanity: shares
        };
        try {
            setLoading(true);
            const response = await purchase(data);
            if (response.status === 200) {
                toast.success('Item added to your portfolio');
                navigate('/portfolio');
            } else {
                toast.error(response.error);
            }
        } catch (error) {
            console.error('Error purchasing item:', error);
            toast.error('Error purchasing item. Please try again.', error.response.data.error); // Handle error
        }
        setLoading(false);
    };
    if (loading) {
        return <LoadingSpinner />;
    }
    if (userData.role !== "verified" && userData.role !== "verifying" && userData.role !== "unverified") {
        return (<>Please login</>);
    }
    if (!trade) return null;
    return (
        <div className="cart">
            <img className="cart-child" alt="" src="/invest/group-8779.svg" />
            <section className="frame-parent">
                <header className="rectangle-parent">
                    <div className="frame-child" />
                    <div className="frame-wrapper">
                        <div onClick={goBack} className="ellipse-parent">
                            <div className="frame-item" />
                            <img
                                className="vector-icon"
                                loading="lazy"
                                alt=""
                                src="/invest/vector.svg"
                            />
                        </div>
                    </div>
                    <h3 className="invests">Invest</h3>
                </header>
                <div className="frame-container">
                    <div className="frame-group">
                        <div className="frame-div">
                            <div className="cotton-tufted-bathmat-60x90-wh-wrapper">
                                <div className="cotton-tufted-bathmat">
                                    {trade.nameOfTrade}
                                </div>
                            </div>
                            <div className="frame-parent1">
                                <div className="available-shares-wrapper">
                                    <div className="available-shares">Available Shares</div>
                                </div>
                                <div className="div">{trade.sharesAvailable}/{trade.totalShares}</div>
                            </div>
                        </div>
                        <div className="frame-wrapper1">
                            <div className="frame-parent2">
                                <div className="rectangle-group" onClick={decrementShares}>
                                    <div className="frame-inner" />
                                    <div className="symbol-content">-</div>
                                </div>
                                <div className="rectangle-container">
                                    <div className="rectangle-div" />
                                    <div className="shares-wrapper">
                                        <div className="shares">Shares</div>
                                    </div>
                                    <div className="empty-value">{shares}</div>
                                </div>
                                <div className="rectangle-parent1" onClick={incrementShares} >
                                    <div className="frame-child1" />
                                    <div className="div1">+</div>
                                </div>
                            </div>
                        </div>
                        <div className="rectangle-parent2">
                            <div className="frame-child2" />
                            <img
                                className="rectangle-icon"
                                alt=""
                                src={trade.productImage ? trade.productImage : ""}
                            />
                            <img
                                className="skilaa-2-icon"
                                loading="lazy"
                                alt=""
                                src={trade.logochange ? trade.logochange : ""}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <footer className="cart-inner">
                <div className="group-div">
                    <div className="frame-child3" />
                    <div className="inr-28350-wrapper">
                        <div className="inr-28350">INR {(trade.totalCIFPrice / trade.totalShares * shares).toFixed(2)}</div>
                    </div>
                    <button className="invest-wrapper" onClick={handleInvest}>
                        <div className="invest1">Invest</div>
                    </button>
                </div>
            </footer>
            <ToastContainer />
        </div>
    )
}

export default Invest