import { useContext, useEffect, useState } from 'react';
import './wallet.css'
import { Link } from 'react-router-dom';
// import { useWallet } from '../../UserContext/WalletContext';
import { UserContext } from '../../UserContext/userContext';
import { toast, ToastContainer } from 'react-toastify';
import { portfolioValue, userTransaction } from '../../Service/Apis';
import { useWallet } from '../../UserContext/WalletContext';

function Wallet() {
    const [transaction, setTransaction] = useState(false);
    const { balance } = useWallet();
    const { userData } = useContext(UserContext);
    const [totalIncome, setTotalIncome] = useState(0);
    useEffect(() => {
        fetchData();
        fetchPortfolioData();
    }, []);
    const fetchData = async () => {
        try {
            if (!userData || !userData.id) {
                toast.error('User data is missing.');
                return;
            }

            const response = await userTransaction(userData.id);
            if (response.status === 200) {
                setTransaction(response.data.transactions);
            }
        } catch (error) {
            toast.error('An error occurred while fetching requests');
        }
    }
    const fetchPortfolioData = async () => {
        try {

            const response = await portfolioValue(userData.id);
            if (response.status === 200) {
                calculateIncome(response.data);
            }
        } catch (error) {
            console.error("Error fetching portfolio data:", error);
        }
    };
    const calculateIncome = (portfolioData) => {

        let totalIncome = 0;

        portfolioData.forEach(item => {
            if (item.profit) {
                const profitAmount = (item.profit.tradeProfit / item.trade.totalShares) * item.purchasedQuanity;

                totalIncome += profitAmount;
            }
        });
        setTotalIncome(totalIncome);
    };

    const getAmountColor = (trans) => {
        switch (trans.status || trans.request) {
            case 'placed':
                return 'green';
            case 'pending':
                return 'yellow';
            case 'rejected':
                return 'red';
            case 'accepted':
                return 'blue';
            case "done":
                return 'orangered';
            case "profit":
                return 'lightgreen';
            default:
                return 'black';
        }
    };
    const getFontSize = (trans) => {
        switch (trans.status || trans.request) {
            case 'done':
                return '1.2em'; // Example font size for 'done' status
            case 'profit':
                return '1.2em'; // Example font size for 'done' status
            default:
                return '1em'; // Default font size
        }
    };


    const getDecor = (trans) => {
        switch (trans.status || trans.request) {
            case 'placed':
            case 'pending':
            case 'accepted':
                return 'none';
            case 'rejected':
                return 'line-through';
            default:
                return 'none';
        }
    }
    const images = (trans) => {
        switch (trans.type) {

            case 'Deposit':
                return "/wallet/Import.svg";
            case 'Withdrawn Request':
                return "/wallet/desktop.svg";
            case 'purchased':
                return "/wallet/purchases.png";
            case 'profit':
                return "/wallet/profits.png";
            case 'Withdrawn':
                return "/wallet/withdraws.png";
            default:
                return "/wallet/desktop.svg";
        }
    }




    return (
        <div className="wallet">
            <header className="rectangle-parent">
                <h2 className="my-wallet">My wallet</h2>
                <div className="frame-child" />
            </header>
            <section className="android-large-11-inner">
                <div className="balance-parent">
                    <div className="balance">
                        <div className="frame-parent">
                            <div className="frame-wrapper">
                                <div className="total-balance-parent">
                                    <div className="total-balance">Total Balance</div>
                                    <div className="inr-25000">
                                        <span className="inr">{`INR  `}</span>
                                        <span className="span">{balance.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <img
                                className="frame-item"
                                loading="lazy"
                                alt=""
                                src="/wallet/group-8777.svg"
                            />
                        </div>
                        <div className="frame-group">
                            <div className="ellipse-wrapper">
                                <div className="frame-inner" />
                            </div>
                            <div className="frame-container">
                                <div className="my-portfolio-wrapper">
                                    <div className="my-portfolio">My portfolio</div>
                                </div>
                                <Link to='/portfolio' className="arrow-right-wrapper">
                                    <img
                                        className="arrow-right-icon"
                                        loading="lazy"
                                        alt=""
                                        src="/wallet/arrow-right.svg"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="stat">
                        <div className="frame-div">
                            <div className="frame-parent1">
                                <div className="arrow-left-wrapper">
                                    <img
                                        className="arrow-left-icon"
                                        loading="lazy"
                                        alt=""
                                        src="/wallet/arrow-left@2x.svg"
                                    />
                                </div>
                                <div className="income-parent">
                                    <div className="income">Income</div>
                                    <div className="inr-20000">
                                        <span>INR</span>
                                        <span className="span1"> {totalIncome.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="line-div" />
                            <div className="frame-parent2">
                                <div className="arrow-left-container">
                                    <img
                                        className="arrow-left-icon1"
                                        loading="lazy"
                                        alt=""
                                        src="/wallet/desktop.svg"
                                    />
                                </div>
                                <div className="no-of-trades-parent">
                                    <div className="no-of-trades">No of transaction</div>
                                    <div className="div">{transaction.length}</div>
                                </div>
                            </div>
                            <img className="group-iconss" alt="side1" src="/wallet/Vector.svg" />
                            <img className="group-icons" alt="side1" src="/wallet/Ellipse-176.svg" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="android-large-11-child">
                <div className="frame-parent3">
                    <div className="frame-parent4">
                        <Link to='/addcashwallet' className="frame-wrapper1">
                            <div className="ellipse-parent">
                                <div className="ellipse-div" />
                                <div className="vector-parent">
                                    <img className="vector-icon" alt="" src="/vector.svg" />
                                    <div className="ellipse-group">
                                        <div className="frame-child1" />
                                        <img
                                            className="vector-icon1"
                                            loading="lazy"
                                            alt="side2"
                                            src="/wallet/gg.svg"
                                        />
                                        <img
                                            className="frame-child2"
                                            alt=""
                                            src="/wallet/Group-8818.svg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className="frame-wrapper2">
                            <div className="deposit-parent">
                                <div className="deposit">Deposit</div>
                                <div className="deposit-group">
                                    <div className="deposit1">Deposit</div>
                                    <div className="deposit2">Deposit</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="frame-parent5">
                        <Link to='/withdrawcashwallet' className="arrow-right-parent">
                            <img
                                className="arrow-right-icon1"
                                alt=""
                                src="....svg"
                            />
                            <div className="ellipse-container">
                                <div className="frame-child3" />
                                <div className="frame-child4" />
                            </div>
                            <img className="frame-child5" alt="" src="/wallet/ellipse-186.svg" />
                            <img
                                className="arrow-right-icon2"
                                loading="lazy"
                                alt=""
                                src="/wallet/withdraw.svg"
                            />
                        </Link>
                        <div className="frame-wrapper3">
                            <div className="withdraw-parent">
                                <div className="withdraw">Withdraw</div>
                                <div className="withdraw-group">
                                    <div className="withdraw1">Withdraw</div>
                                    <div className="withdraw2">
                                        Withdraw
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="android-large-11-inner1">
                <div className="transactions-parent">
                    <h2 className="transactions">Transactions</h2>
                    <div className="filter-wrapper">
                        <img
                            className="filter-icon"
                            loading="lazy"
                            alt=""
                            src="/wallet/Filter.svg"
                        />
                    </div>
                </div>
            </div>


            <section className="frame-section">


                <div className="frame-parent6">
                    {transaction.length > 0 ? (
                        transaction
                            .reverse()
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((trans, index) => (
                                <div key={index}>
                                    <div className="frame-parent7">
                                        <img
                                            className="frame-icon"
                                            loading="lazy"
                                            alt=""
                                            src={
                                                images(trans)
                                            }
                                        />
                                        <div className="purchased-parent">
                                            <div className="purchased">{trans.type}</div>
                                            <div className="wrapper">
                                                <div className="div1" style={{
                                                    color: getAmountColor(trans),
                                                    textDecoration: getDecor(trans),
                                                    fontSize: getFontSize(trans),
                                                    fontWeight: trans.status === 'done' ? 'bold' : 'normal',
                                                }}>{trans.totalPrice ? trans.totalPrice.toFixed(2) : trans.amount}</div>
                                            </div>
                                            <div className="pm">{new Date(trans.date).toLocaleDateString()} -
                                                {new Date(trans.date).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div >
                            <div className="text-center">
                                <i className="fa-regular fa-clock"></i>
                                <h6>No transactions yet</h6>
                            </div>
                        </div>
                    )
                    }
                </div>
            </section >
            {/* <div className="frame-parent8">
                        <img
                            className="frame-child6"
                            loading="lazy"
                            alt=""
                            src="/wallet/desktop.svg"
                        />
                        <div className="purchased-group">
                            <div className="purchased1">Purchased</div>
                            <div className="container">
                                <div className="div2">-1800.00</div>
                            </div>
                            <div className="pm1">05/04/2024 - 01:30 PM</div>
                        </div>
                    </div> */}
            {/* <div className="frame-parent9">
                        <div className="frame-wrapper4">
                            <div className="import-wrapper">
                                <img
                                    className="import-icon"
                                    loading="lazy"
                                    alt=""
                                    src="/wallet/Import.svg"
                                />
                            </div>
                        </div>
                        <div className="deposit-container">
                            <div className="deposit3">Deposit</div>
                            <div className="pm2">05/04/2024 - 01:30 PM</div>
                        </div>
                        <div className="frame">
                            <div className="div3">+3600.00</div>
                        </div>
                    </div> */}
            <div className="frame-parent10">
                <div className="rectangle-group">
                    <div className="rectangle-div" />
                    <Link to='/home' className="frame-parent11">
                        <div className="vector-wrapper">
                            <img
                                className="vector-icon2"
                                loading="lazy"
                                alt=""
                                src="/wallet/exports.svg"
                            />
                        </div>
                        <div className="exports">
                            Exports
                        </div>
                    </Link>
                    <Link to='/wallet' className="frame-parent12">
                        <div className="vector-container">
                            <img
                                className="vector-icon3"
                                loading="lazy"
                                alt=""
                                src="/wallet/wallet.svg"
                            />
                        </div>
                        <div className="wallets">Wallet</div>
                    </Link>
                    <Link to='/portfolio' className="frame-parent13">
                        <div className="vector-frame">
                            <img
                                className="vector-icon4"
                                loading="lazy"
                                alt=""
                                src="/home/vector-8.svg"
                            />
                        </div>
                        <div className="portfolioss">Portfolio</div>
                    </Link>
                    <Link to='/profile' className="frame-parent14">
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
                </div>
            </div>
            <ToastContainer />
        </div >
    );
};

export default Wallet