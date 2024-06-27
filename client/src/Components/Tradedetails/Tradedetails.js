import { useNavigate, useParams } from 'react-router';
import './tradedetails.css'
import { Link } from 'react-router-dom';
import { getTrade } from '../../Service/Apis';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../Loadingpagr/LoadingSpinner';
import { UserContext } from '../../UserContext/userContext';
function Tradedetails() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [trade, setTrade] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userData } = useContext(UserContext);

    useEffect(() => {
        details();
        fetchCountries();
    }, []);
    const goBack = (e) => {
        e.preventDefault();
        setLoading(true);
        navigate(-1);
        setLoading(false);
    };
    const details = async () => {
        setLoading(true);
        const response = await getTrade(id);
        if (response.status === 200) {
            setTrade(response.data.trade);
        }
        setLoading(false);
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
        }
    };
    if (loading) {
        return <LoadingSpinner />;
    }
    if (userData.role !== "verified" && userData.role !== "verifying" && userData.role !== "unverified") {
        return (<>Please login</>);
    }
    return (
        <div className="tradedetails">
            <div className="open-child" />
            <main className="frame-parent">
                <div className="skilaa-1-wrapper">
                    <img
                        className="skilaa-1-icon"
                        loading="lazy"
                        alt=""
                        src={`${axios.defaults.baseURL}/${trade.logochange}`}
                    />
                </div>
                <section className="frame-group">
                    <div className="rectangle-parent">
                        <div className="frame-child" />
                        <div className="frame-container">
                            <div className="frame-div">
                                <div className="ellipse-wrapper">
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
                                    })}
                                </div>
                                <div className="india-wrapper">
                                    <div className="india">{trade.departurePortCountry}</div>
                                </div>
                                <div className="vector-wrapper">
                                    <img className="vector-icon"
                                        alt=""
                                        src="/tradedetails/vector.svg" />
                                </div>
                                <div className="uk">{trade.arrivalPortCountry}</div>
                                <div className="ellipse-container">
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
                                    })}
                                </div>
                                <div className="line-wrapper">
                                    <div className="line-div" />
                                </div>
                                <div className="vector-container">
                                    <img className="vector-icon1" alt="" src="/tradedetails/vector-1.svg" />
                                </div>
                                <div className="div">#{trade.orderNumber}</div>
                            </div>
                            <div className="line-container">
                                <div className="frame-child1" />
                            </div>
                            <div className="product-details-wrapper">
                                <img
                                    className="product-details-icon"
                                    loading="lazy"
                                    alt=""
                                    src="/tradedetails/vector-2.svg"
                                />
                            </div>
                            <div className="foot">{trade.containerFoot} foot</div>
                        </div>
                        <div className="frame-wrapper">
                            <div className="cotton-tufted-bathmat-60x90-wh-parent">
                                <div className="cotton-tufted-bathmat">
                                    {trade.nameOfTrade}
                                </div>
                                <div className="frame-wrapper1">
                                    <div className="frame-parent1">
                                        <div className="frame-parent2">
                                            <div className="inr-wrapper">
                                                <div className="inr">INR</div>
                                            </div>
                                            <div className="div1">{trade.totalCIFPrice}</div>
                                        </div>
                                        <div className="funded-wrapper">
                                            <div className="funded">{(((trade.totalShares - trade.sharesAvailable) / trade.totalShares) * 100).toFixed(2)} % funded</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="frame-wrapper2">
                                    <div className="rectangle-group">
                                        <div className="rectangle-div" />
                                        <div className="frame-child2" style={{ width: `${((trade.totalShares - trade.sharesAvailable) / trade.totalShares) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="investment-button">
                            <div className="rectangle-container">
                                <div className="frame-child3" />
                                <div className="expected-date-of-container">
                                    <p className="expected-date-of">Expected date of income</p>
                                    <p className="return-on-investment">Return on investment</p>
                                    <p className="last-funding-date">Last funding date</p>
                                    <p className="expected-freight-departure">
                                        Expected freight departure
                                    </p>
                                    <p className="expected-arrival">Expected Arrival</p>
                                    <p className="deposit-of-profit">Deposit of profit</p>
                                </div>
                                <div className="expected-date">
                                    <p className="p">{trade.expectedDateOfIncome}</p>
                                    <p className="p1">{trade.returnOnInvestment}%</p>
                                    <p className="p2">{trade.lastFundingDate}</p>
                                    <p className="p3">{trade.expectedFreightDeparture}</p>
                                    <p className="p4">{trade.expectedArrival}</p>
                                    <p className="p5">{trade.depositOfProfit}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="investment-return">
                        <img
                            className="investment-info-icon"
                            alt=""
                            src={trade.productImage ? trade.productImage : ""}
                        />
                        <div onClick={goBack} className="ellipse-parent">
                            <div className="ellipse-div" />
                            <img
                                className="vector-icon2"
                                loading="lazy"
                                alt=""
                                src="/tradedetails/vector-3.svg"
                            />
                        </div>
                    </div>
                </section>
            </main>
            <div className="inner-container-wrapper">
                <div className="inner-container">
                    <div className="skilaa-port-exim">
                        <div className="skilaa-container">
                            <div className="skilaa-container-child" />
                            <div className="port-exim-container">
                                <img
                                    className="skilaa-2-icon"
                                    loading="lazy"
                                    alt=""
                                    src={trade.logochange ? trade.logochange : ""}
                                />
                                <div className="infoportex-wrapper">
                                    <div className="infoportex">
                                        <div className="port-exim-ventures">
                                            {trade.nameOfCompany ? trade.nameOfCompany : ""}
                                        </div>
                                        <div className="infoporteximin-wrapper">
                                            <div className="infoporteximin">  {trade.companyemail ? trade.companyemail : ""}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="skilaa-container-inner">
                                {trade.companytrust === "trusted" ?
                                    <div className="trusted-wrapper">
                                        <div className="trusted">Trusted</div>
                                    </div>
                                    : ""
                                }
                            </div>
                        </div>
                        <a className="group-div" href={trade.investorMemoPort ? trade.investorMemoPort : ""} target="_blank" width="50" rel="noopener noreferrer">
                            <div className="frame-child4" />
                            <div className="frame-wrapper3">
                                <img
                                    className="group-icon"
                                    loading="lazy"
                                    alt=""
                                    src="/tradedetails/group-8801.svg"
                                />
                            </div>
                            <div className="investor-memo-port-charcoal-wrapper">
                                <div className="investor-memo-port">
                                    Investor Memo Port - {trade && trade.nameOfTrade ? trade.nameOfTrade.substring(0, 7) : ''} ...
                                </div>
                            </div>
                            <div className="pdf-wrapper">
                                <div className="pdf" style={{ marginLeft: "20px" }}>PDF</div>
                            </div>
                            <img
                                className="i-n-r"
                                loading="lazy"
                                alt=""
                                src="/tradedetails/vector-4.svg"
                            />
                        </a>
                    </div>
                    <footer className="group-footer">
                        <div className="frame-child5" />
                        <div className="inr-2500-wrapper">
                            <div className="inr-2500">INR {(trade.totalCIFPrice / trade.totalShares).toFixed(2)}</div>
                        </div>
                        {trade && !trade.profit && ((trade) => {
                            const fundedPercentage = ((trade.totalShares - trade.sharesAvailable) / trade.totalShares) * 100;
                            if (fundedPercentage < 100) {
                                return (
                                    <Link to={`/invest/${id}`} className="invest-wrapper">
                                        <div className="invest">Invest</div>
                                    </Link>
                                );
                            }
                            return null;
                        })(trade)}

                    </footer>
                </div>
            </div >
        </div >
    )
}

export default Tradedetails