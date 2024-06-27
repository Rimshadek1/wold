import { Link, useNavigate } from 'react-router-dom';
import './home.css';
import { getTrades } from '../../Service/Apis';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext/userContext';
import LoadingSpinner from '../Loadingpagr/LoadingSpinner';
function Home() {
    const [trades, setTrades] = useState([]);
    const [countries, setCountries] = useState([]);
    const { userData } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        fetchTrades();
        fetchCountries();
    }, []);

    const fetchTrades = async () => {
        try {
            setLoading(true);
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
        setLoading(false)

    };
    const fetchCountries = async () => {
        try {
            const response = await fetch('https://restcountries.com/v2/all');
            if (!response.ok) {
                throw new Error(`Failed to fetch countries: ${response.status}`);
            }
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            console.error('Error fetching countries:', error);
            setCountries([]);
        }
    };


    let progressText, progressSubText, progressValue;
    if (userData.role === 'unverified') {
        progressText = "You’re halfway there!";
        progressSubText = "Verify your account to start investing";
        progressValue = "2/4";
    } else if (userData.role === 'verifying') {
        progressText = "You are almost there!";
        progressSubText = "It may take 2 working days for verification.";
        progressValue = "3/4";
    }
    const handleCardClick = (trade, event) => {
        event.preventDefault(); // Prevent the default behavior of the link click
        if (userData.role === 'unverified') {
            alert('You are not verified. Please verify your account.');
        } else if (userData.role === 'verifying') {
            alert('You are under verification process. Please wait until its completion.');
        } else if (userData.role === 'verified') {
            navigate(`/tradedetails/${trade._id}`);
        }
    };
    if (loading) {
        return <LoadingSpinner />;
    }
    if (userData.role !== "verified" && userData.role !== "verifying" && userData.role !== "unverified") {
        return (<>Please login</>);
    }
    return (
        <div className="home">
            <div className="rectangle-parent">
                <div className="frame-child" />
                <h2 className="exports">Exports</h2>
                <nav className="onboarding">
                    <Link to="/home" className="onboarding-content">
                        <div className="available-wrapper">
                            <div className="available">Available</div>
                        </div>
                        <div className="onboarding-content-child" />
                    </Link>
                    <Link to="/funded" className="onboarding-content">
                        <div className="funded-wrapper">
                            <div className="funded">Funded</div>
                        </div>
                    </Link>
                    <Link to="/exited" className="onboarding-content">
                        <div className="funded-wrapper">
                            <div className="exited">Exited</div>
                        </div>
                    </Link>
                </nav>
            </div>
            <main className="progress">
                <section className="frame-parent">

                    {userData.role === 'unverified' && (
                        <Link to='/mobileverification' className="rectangle-group">
                            <div className="frame-item" />
                            <div className="frame-inner" />
                            <div className="progress-circle">
                                <div className="progress-circle-child" />
                                <div className="div">{progressValue}</div>
                            </div>
                            <div className="progress-caption">
                                <div className="youre-halfway-there-parent">
                                    <div className="youre-halfway-there">{progressText}</div>
                                    <div className="verify-your-account">{progressSubText}</div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {userData.role === 'verifying' && (
                        <div className="rectangle-group">
                            <div className="frame-item" />
                            <div className="frame-inner" />
                            <div className="progress-circle">
                                <div className="progress-circle-child" />
                                <div className="div">{progressValue}</div>
                            </div>
                            <div className="progress-caption">
                                <div className="youre-halfway-there-parent">
                                    <div className="youre-halfway-there">{progressText}</div>
                                    <div className="verify-your-account">{progressSubText}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* {userData.role !== 'verified' && (
                        <Link to='/mobileverification' className="rectangle-group">
                            <div className="frame-item" />
                            <div className="frame-inner" />
                            <div className="progress-circle">
                                <div className="progress-circle-child" />
                                <div className="div">{progressValue}</div>
                            </div>
                            <div className="progress-caption">
                                <div className="youre-halfway-there-parent">
                                    <div className="youre-halfway-there">{progressText}</div>
                                    <div className="verify-your-account">{progressSubText}</div>
                                </div>
                            </div>
                        </Link>
                    )} */}
                    <div className="india-banner">
                        {trades.map(trade => {
                            const fundedPercentage = ((trade.totalShares - trade.sharesAvailable) / trade.totalShares) * 100;
                            if (!trade.profit && fundedPercentage < 100) {
                                return (
                                    <Link to={`/tradedetails/${trade._id}`} onClick={(event) => handleCardClick(trade, event)} key={trade._id} className="rectangle-container">                                        <div className="rectangle-div" />
                                        <img
                                            className="rectangle-icon"
                                            loading="lazy"
                                            alt=""
                                            src={trade.productImage ? trade.productImage : ""}
                                        />
                                        <div className="india-content">
                                            <div className="india-card">
                                                <div className="india-card-content">
                                                    <div className="india-card-top">
                                                        {countries.map(country => {
                                                            if (country.alpha2Code === trade.departurePortCountry) {
                                                                return (
                                                                    <img
                                                                        key={`${trade._id}-departure-logo`}
                                                                        className="departure-logo"
                                                                        loading="lazy"
                                                                        alt=""
                                                                        src={country.flags.svg}
                                                                        style={{ width: "20px" }}
                                                                    />
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </div>
                                                    <div className="india-label">
                                                        <div className="india">{trade.departurePortCountry}</div>
                                                    </div>
                                                    <div className="vector-wrapper">
                                                        <img
                                                            className="vector-icon"
                                                            loading="lazy"
                                                            alt=""
                                                            src="/home/vector.svg"
                                                        />
                                                    </div>
                                                    <div className="india">{trade.arrivalPortCountry}</div>
                                                    <div className="india-card-content-inner">
                                                        {countries.map(country => {
                                                            if (country.alpha2Code === trade.arrivalPortCountry) {
                                                                return (
                                                                    <img
                                                                        key={`${trade._id}-arrival-logo`}
                                                                        className="arrival-logo"
                                                                        loading="lazy"
                                                                        alt=""
                                                                        src={country.flags.svg}
                                                                        style={{ width: "20px", marginLeft: "5px" }}
                                                                    />
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </div>
                                                    <div className="india-card-content-child">
                                                        <div className="line-div" />
                                                    </div>
                                                    <div className="vector-container">
                                                        <img
                                                            className="vector-icon1"
                                                            loading="lazy"
                                                            alt=""
                                                            src="/home/vector-1.svg"
                                                        />
                                                    </div>
                                                    <div className="wrapper">
                                                        <div className="div1">#{trade.orderNumber}</div>
                                                    </div>
                                                    <div className="frame-div">
                                                        <div className="frame-child1" />
                                                    </div>
                                                    <div className="foot-label">
                                                        <img
                                                            className="vector-icon2"
                                                            loading="lazy"
                                                            alt=""
                                                            src="/home/vector-2.svg"
                                                        />
                                                    </div>
                                                    <div className="foot">{trade.containerFoot} ft</div>
                                                </div>
                                                <div className="product-name">
                                                    <div className="cotton-tufted-bathmat">
                                                        {trade.nameOfTrade}
                                                    </div>
                                                </div>
                                                <div className="investment-details">
                                                    <div className="investment-top">
                                                        <div className="investment-top-left">
                                                            <div className="investment-values">
                                                                <div className="investment-value">
                                                                    <div className="inr">INR</div>
                                                                </div>
                                                                <div className="div2">{trade.totalCIFPrice}</div>
                                                            </div>
                                                            <div className="investment-funded">
                                                                <div className="funded1">{fundedPercentage.toFixed(2)} % funded</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="investment-progress">
                                                        <div className="investment-progress-child" />
                                                        <div className="investment-progress-item" style={{ width: `${fundedPercentage}%` }} />
                                                    </div>
                                                </div>
                                                <div className="investment-caption">
                                                    <div className="investment-caption-content">
                                                        <div className="investment-caption-content-child" />
                                                        <div className="expected-date-of-container">
                                                            <p className="expected-date-of">
                                                                Expected date of income
                                                            </p>
                                                            <p className="return-on-investment">
                                                                Return on investment
                                                            </p>
                                                        </div>
                                                        <div className="investment-caption-subheader-container">
                                                            <p className="p">{trade.expectedDateOfIncome}</p>
                                                            <p className="p1">{trade.returnOnInvestment} %</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            }
                            return null;
                        })}
                    </div>
                </section>
            </main>
            <footer className="bottom-bar-content">
                <div className="bottom-bar-content-child" />
                <div className="exports-content-wrapper">
                    <Link to='/home' className="exports-content">
                        <div className="exports-icon-wrapper">
                            <img
                                className="exports-icon"
                                loading="lazy"
                                alt=""
                                src="/home/vector-6.svg"
                            />
                        </div>
                        <div className="exports1">Exports</div>
                    </Link>
                </div>
                <Link to='/wallet' className="wallet-content-parent">
                    <div className="wallet-content">
                        <img
                            className="wallet-icon"
                            loading="lazy"
                            alt=""
                            src="/home/vector-7.svg"
                        />
                    </div>
                    <div className="walletss">Wallet</div>
                </Link>
                <Link to='/portfolio' className="portfolio-profile">
                    <div className="portfolio-profile-icon-wrapper">
                        <img
                            className="portfolio-profile-icon"
                            loading="lazy"
                            alt=""
                            src="/home/vector-8.svg"
                        />
                    </div>
                    <div className="portfolioss">Portfolio</div>
                </Link>
                <Link to='/profile' className="portfolio-profile1">
                    <div className="group-wrapper">
                        <img
                            className="group-icon1"
                            loading="lazy"
                            alt=""
                            src="/home/group.svg"
                        />
                    </div>
                    <div className="profile">Profile</div>
                </Link>
            </footer >
        </div >
    );
}

export default Home;
