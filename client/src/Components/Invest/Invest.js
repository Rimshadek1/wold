import React, { useContext, useEffect, useState } from 'react'
import './invest.css'
import { useNavigate, useParams } from 'react-router';
import { getTrade, purchase } from '../../Service/Apis';
import { UserContext } from '../../UserContext/userContext';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
function Invest() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [trade, setTrade] = useState([]);
    const [shares, setShares] = useState(1);
    const { userData } = useContext(UserContext);

    useEffect(() => {
        details();
    }, []);

    const goBack = (e) => {
        e.preventDefault();
        navigate(-1)
    }
    const details = async () => {
        const response = await getTrade(id);
        if (response.status === 200) {
            setTrade(response.data.trade);
        }
    };
    const incrementShares = () => {
        if (shares < trade.sharesAvailable) { // Ensure shares don't exceed available shares
            setShares(prevShares => prevShares + 1);
        }
    };

    const decrementShares = () => {
        if (shares > 1) { // Ensure shares don't go below 1
            setShares(prevShares => prevShares - 1);
        }
    };
    const handleInvest = async (e) => {
        e.preventDefault();
        const data = {
            totalPrice: trade.totalCIFPrice / trade.totalShares * shares,
            items: trade._id,
            id: userData.id,
            purchasedQuanity: shares
        }
        const response = await purchase(data);
        if (response.status === 200) {
            toast.success('item added to your portfolio');
            navigate('/portfolio')
        } else {
            toast.error(response.error)
        }
    }
    console.log(trade);
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
                                src={`${axios.defaults.baseURL}/${trade.productImage}`}
                            />
                            <img
                                className="skilaa-2-icon"
                                loading="lazy"
                                alt=""
                                src={`${axios.defaults.baseURL}/${trade.logochange}`}
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