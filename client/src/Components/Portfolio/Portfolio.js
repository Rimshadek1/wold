import { Link } from 'react-router-dom'
import './portfolio.css'
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext/userContext';
import { portfolioValue } from '../../Service/Apis';
import dayjs from 'dayjs';
import LoadingSpinner from '../Loadingpagr/LoadingSpinner';
function Portfolio() {
    const { userData } = useContext(UserContext);
    const [portFolio, setPortfolio] = useState([]);
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPortfolioData();
    }, []);
    const fetchPortfolioData = async () => {
        try {
            setLoading(true);
            const response = await portfolioValue(userData.id);
            if (response.status === 200) {
                setPortfolio(response.data);
                calculateIncome(response.data);
            }
        } catch (error) {
            console.error("Error fetching portfolio data:", error);
        }
        setLoading(false);
    };
    // const calculateTotalValue = () => {
    //     return portFolio.reduce((total, item) => {
    //         if (item.profit !== null) {
    //             const returns = (item.profit.tradeProfit / item.trade.totalShares * item.purchasedQuanity) + item.totalPrice;
    //             return total + returns;
    //         } else {
    //             // Handle case where profit is null
    //             return total + item.totalPrice;
    //         }
    //     }, 0).toFixed(2);
    // };
    const calculateTotalValue = () => {
        return portFolio.reduce((total, item) => {
            if (item.profit === null) {
                return total + parseFloat(item.totalPrice);
            }
            return total;
        }, 0).toFixed(2);
    };



    const calculateIncome = (portfolioData) => {
        const currentMonth = dayjs().month();
        const currentYear = dayjs().year();
        setLoading(true);
        let monthlyIncome = 0;
        let totalIncome = 0;

        portfolioData.forEach(item => {
            if (item.profit) {
                const profitDate = dayjs(item.profit.createdAt);
                const profitAmount = (item.profit.tradeProfit / item.trade.totalShares) * item.purchasedQuanity;

                totalIncome += profitAmount;

                if (profitDate.month() === currentMonth && profitDate.year() === currentYear) {
                    monthlyIncome += profitAmount;
                }
            }
        });
        setMonthlyIncome(monthlyIncome);
        setTotalIncome(totalIncome);
        setLoading(false);
    };

    if (loading) {
        return <LoadingSpinner />;
    }
    if (userData.role !== "verified" && userData.role !== "verifying" && userData.role !== "unverified") {
        return (<>Please login</>);
    }
    return (
        <div className="portfolio">
            <header className="content-rect-parent">
                <div className="content-rect" />
                <h1 className="portfolios">Portfolio</h1>
            </header>
            <section className="balance-wrapper">
                <div className="balance">
                    <div className="balance-elements">
                        <div className="balance-details">
                            <h3 className="portfolio-balance">Portfolio Balance</h3>
                            <div className="inr-26000">
                                <span className="inr">{`INR  `}</span>
                                <span className="span">
                                    {calculateTotalValue()}
                                </span>
                            </div>
                        </div>
                        <div className="balance-chart" />
                    </div>
                    <img
                        className="balance-child"
                        loading="lazy"
                        alt=""
                        src="/portfolio/group-8777.svg"
                    />
                </div>
            </section>
            <div className="portfolio-value">Portfolio value</div>
            <div className="inr-38000">
                <span>{`INR `}</span>
                <span className="span1">38000</span>
            </div>






            <section className="android-large-12-inner">
                <div className="frame-parent">
                    <div className="monthly-income-details-parent">
                        <div className="monthly-income-details">
                            <div className="monthly-income">Total income</div>
                            <div className="monthly-income-values">
                                <div className="income-placeholder">{totalIncome.toFixed(2)}</div>
                            </div>
                        </div>
                        <div className="total-income-parent">
                            <div className="total-income">Number of trades</div>
                            <div className="total-income-values">
                                <div className="total-income-placeholder">{portFolio.length}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <div className="trades-label">
                <h1 className="trades">Trades</h1>
            </div>
            <section className="trades-content">
                {portFolio.map((item) => (
                    <div className="rectangle-parent" key={item._id}>
                        <div className="frame-child" />
                        <div className="trades-elements">
                            <div className="trades-shapes">
                                <img
                                    className="trades-shapes-child"
                                    alt=""
                                    src={item.trade.productImage ? item.trade.productImage : ""}
                                />
                                <img
                                    className="skilaa-2-icon"
                                    loading="lazy"
                                    alt=""
                                    src={item.trade.logochange ? item.trade.logochange : ""}
                                />
                            </div>
                        </div>
                        <div className="cotton-tufted-bathmat-60x90-wh-parent">
                            <div className="cotton-tufted-bathmat">
                                {item.trade.nameOfTrade}
                            </div>
                            <div className="frame-wrapper">
                                <div className="investment-details-parent">
                                    <div className="investment-details">
                                        <div className="invested">Invested</div>
                                        <div className="returns">Returns</div>
                                    </div>
                                    <div className="returns-details">
                                        <div className="returns-elements">
                                            <div className="returns-values">
                                                <div className="returns-values-inner">
                                                    <img
                                                        className="frame-item"
                                                        loading="lazy"
                                                        alt=""
                                                        src="/portfolio/Currency-Inr.svg"
                                                    />
                                                </div>
                                                <div className="div4">
                                                    {/* <span className="span2">{`  `}</span> */}
                                                    <span className="span3">{item.totalPrice.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className="returns-elements-inner">
                                                <img
                                                    className="frame-inner"
                                                    loading="lazy"
                                                    alt=""
                                                    src="/portfolio/Currency-Inr-(1).svg"
                                                />
                                            </div>
                                            <div className="wrapper1">
                                                <div className="div5">
                                                    {item.profit !== null ?
                                                        (item.profit.tradeProfit / item.trade.totalShares * item.purchasedQuanity + item.totalPrice).toFixed(2) :
                                                        '-'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
            <section className="frame-section">
                <div className="rectangle-group">
                    <div className="rectangle-div" />
                    <Link to='/home' className="frame-parent1">
                        <div className="vector-wrapper">
                            <img
                                className="vector-icon"
                                loading="lazy"
                                alt=""
                                src="/wallet/exports.svg"
                            />
                        </div>
                        <div className="exports" >
                            Exports
                        </div>
                    </Link>
                    <Link to='/wallet' className="frame-parent2">
                        <div className="vector-container">
                            <img
                                className="vector-icon1"
                                loading="lazy"
                                alt=""
                                src="/home/vector-7.svg"
                            />
                        </div>
                        <div className="wallets">Wallet</div>
                    </Link>
                    <Link to='/portfolio' className="frame-parent3">
                        <div className="vector-frame">
                            <img
                                className="vector-icon2"
                                loading="lazy"
                                alt=""
                                src="/wallet/portfolio.svg"
                            />
                        </div>
                        <div className="portfolio1">Portfolio</div>
                    </Link>
                    <Link to='/profile' className="frame-parent4">
                        <div className="group-wrapper">
                            <img
                                className="group-icon"
                                loading="lazy"
                                alt=""
                                src="/home/group.svg"
                            />
                        </div>
                        <div className="profiles">
                            Profile
                        </div>
                    </Link>
                </div>
            </section >

        </div >
    )
}

export default Portfolio