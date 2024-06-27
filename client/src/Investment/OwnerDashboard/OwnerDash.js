import React, { useContext, useEffect, useState } from 'react';
import './Ownerdash.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext/userContext';
import { ownerDashData, viewpupdate10 } from '../../Service/Apis';
import LoadingSpinner from '../../Components/Loadingpagr/LoadingSpinner';

function OwnerDash() {
    const { userData } = useContext(UserContext);
    const [totalInvestAmount, setTotalInvestAmount] = useState(0);
    const [existing10, setExisting10] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const email = userData.email;
    useEffect(() => {
        fetchInvestments();
        fetchData();
    }, []);

    const fetchInvestments = async () => {
        try {
            setLoading(true);
            const response = await ownerDashData(email);
            if (response.status === 200) {
                const investments = response.data.myInvest;
                const totalAmount = investments.reduce((acc, cur) => acc + cur.investAmount, 0);
                setTotalInvestAmount(totalAmount);
            }
        } catch (error) {
            console.error("Error fetching investments:", error);
        }
        setLoading(false);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await viewpupdate10();
            if (response.status === 200 && response.data.tenpercentage.length > 0) {
                const updated10percentage = response.data.tenpercentage[0].updated10percentage;
                setExisting10(updated10percentage);
            } else {
                setExisting10('');
                alert('Failed to fetch trade profit or no data available');
            }
        } catch (error) {
            console.error('Error fetching user role or trade profit:', error);
            alert('Failed to fetch trade profit');
        }
        setLoading(false);
    };

    let progressText, progressSubText, progressValue;
    if (userData.role === 'unverified') {
        progressText = "Verify to be an owner";
        progressSubText = "Verify your account to invest";
        progressValue = "2/4";
    } else if (userData.role === 'verifying') {
        progressText = "You are almost there!";
        progressSubText = "It may take 2 working days for verification.";
        progressValue = "3/4";
    }

    const handleCardClick = (event) => {
        event.preventDefault();
        if (userData.role === 'unverified') {
            alert('You are not verified. Please verify your account.');
        } else if (userData.role === 'verifying') {
            alert('You are under verification process. Please wait until its completion.');
        } else if (userData.role === 'verified') {
            navigate(`/investcode`);
        }
    };
    if (loading) {
        return <LoadingSpinner />;
    }
    if (userData.role !== "verified" && userData.role !== "verifying" && userData.role !== "unverified") {
        return (<>Please login</>);
    }
    return (
        <div className="ownerdash">
            <div className="android-large-26-child" />
            <main className="frame-parent">
                <div className="frame-wrapper">
                    <div className="frame-group">
                        <div className="frame-container">
                            <div className="verify-left-icon-parent">
                                <img
                                    className="verify-left-icon"
                                    alt=""
                                    src="/ownerdash/verify-left-icon.svg"
                                />
                                <img
                                    className="verify-mid-icon"
                                    loading="lazy"
                                    alt=""
                                    src="/ownerdash/vector-1.svg"
                                />
                                <img
                                    className="verify-second-mid-icon"
                                    loading="lazy"
                                    alt=""
                                    src="/ownerdash/vector-2.svg"
                                />
                                <img
                                    className="verify-right-icon"
                                    loading="lazy"
                                    alt=""
                                    src="/ownerdash/vector-3.svg"
                                />
                                <img
                                    className="owner-left-icon"
                                    loading="lazy"
                                    alt=""
                                    src="/ownerdash/vector-4.svg"
                                />
                                <img
                                    className="owner-right-icon"
                                    loading="lazy"
                                    alt=""
                                    src="/ownerdash/vector-5.svg"
                                />
                            </div>
                        </div>
                        <div className="owners">Owners</div>
                    </div>
                </div>
                {userData.role === 'unverified' && (
                    <Link to='/mobileverification' className="rectangle-parent">
                        <div className="frame-child" />
                        <div className="invest-image-parent">
                            <div className="invest-image" />
                            <b className="invest-title">{progressValue}</b>
                        </div>
                        <div className="verify-content-wrapper">
                            <div className="verify-content">
                                <div className="verify-to-be">{progressText}</div>
                                <div className="verify-your-account">
                                    {progressSubText}
                                </div>
                            </div>
                        </div>

                    </Link>
                )}
                {userData.role === 'verifying' && (
                    <div className="rectangle-parent">
                        <div className="frame-child" />
                        <div className="invest-image-parent">
                            <div className="invest-image" />
                            <b className="invest-title">{progressValue}</b>
                        </div>
                        <div className="verify-content-wrapper">
                            <div className="verify-content">
                                <div className="verify-to-be">{progressText}</div>
                                <div className="verify-your-account">
                                    {progressSubText}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <section className="frame-section">
                    <div className="frame-div">
                        <div className="frame-wrapper1">
                            <div className="rectangle-group">
                                <div className="frame-item" />
                                <div className="platform-left">
                                    <div className="frame-parent1">
                                        <div className="wold-content-wrapper">
                                            <div className="wold-content">
                                                <img
                                                    className="wold-content-child"
                                                    loading="lazy"
                                                    alt=""
                                                    src="/ownerdash/group-8825.svg"
                                                />
                                                <div className="wold-exporting-platform-wrapper">
                                                    <div className="wold-exporting-platform">{`Wold exporting platform `}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="value-content-parent">
                                            <div className="value-content">
                                                <img
                                                    className="value-icon"
                                                    loading="lazy"
                                                    alt=""
                                                    src="/ownerdash/vector-7.svg"
                                                />
                                            </div>
                                            <b className="b">{totalInvestAmount}</b>
                                        </div>
                                    </div>
                                </div>
                                <div className="value-parent">
                                    <div className="value">Value</div>
                                    <div className="value-description-content-parent">
                                        <div className="value-description-content">
                                            <img
                                                className="value-description-icon"
                                                loading="lazy"
                                                alt=""
                                                src="/ownerdash/vector-8.svg"
                                            />
                                        </div>
                                        <b className="b1">{(existing10 / 1000) * (totalInvestAmount / 6006).toFixed(2)}</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="frame-parent2">
                            <div className="frame-wrapper2">
                                <div className="rectangle-container">
                                    <div className="frame-inner" />
                                    <div className="wold-owner-left">
                                        <img
                                            className="wold-owner-left-child"
                                            loading="lazy"
                                            alt=""
                                            src="/ownerdash/group-8801.svg"
                                        />
                                        <div className="woldowner-pitch-wrapper">
                                            <div className="woldowner-pitch">Wold.owner pitch</div>
                                        </div>
                                    </div>
                                    <div className="wold-owner-right">
                                        <div className="pdf-parent">
                                            <div className="pdf">PDF</div>
                                            <div className="p-d-f-icon-wrapper">
                                                <img
                                                    className="p-d-f-icon"
                                                    loading="lazy"
                                                    alt=""
                                                    src="/ownerdash/vector-6.svg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Link to="/compareinvest" className="group-div">
                                <div className="rectangle-div" />
                                <b className="compare-investment">Compare investment</b>
                                <div className="whatsapp-button">
                                    <img className="whatsapp-icon" alt="" src="/ownerdash/vector-6.svg" />
                                </div>
                            </Link>

                            <Link to="https://wa.me/+918714122257?text=I%20am%20looking%20to%20invest%20in%20wold" className="rectangle-parent1">
                                <div className="frame-child1" />
                                <div className="compare-icon-wrapper">
                                    <img
                                        className="compare-icon"
                                        loading="lazy"
                                        alt=""
                                        src="/ownerdash/vector-11.svg"
                                    />
                                </div>
                                <div className="whatsapp-us">Whatsapp us</div>
                                <img
                                    className="button-divider-icon"
                                    loading="lazy"
                                    alt=""
                                    src="/ownerdash/vector-6.svg"
                                />
                            </Link>
                        </div>
                    </div>
                </section>
                <img
                    className="vector-icon"
                    loading="lazy"
                    alt=""
                    src="/ownerdash/vector-13.svg"
                />
            </main >
            <footer className="invest-options-content-wrapper">
                <div className="invest-options-content">
                    {userData.role === 'verified' ? (
                        <Link to="/investcode" onClick={handleCardClick} className="group-button">
                            <div className="frame-child2" />
                            <b className="invest">{`Invest `}</b>
                        </Link>
                    ) : (
                        <div className="group-buttoning">
                            <div className="frame-child2" />

                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                                <path d="M 15 2 C 11.145666 2 8 5.1456661 8 9 L 8 11 L 6 11 C 4.895 11 4 11.895 4 13 L 4 25 C 4 26.105 4.895 27 6 27 L 24 27
                                 C 25.105 27 26 26.105 26 25 L 26 13 C 26 11.895 25.105 11 24 11 L 22 11 L 22 9 C 22 5.2715823 19.036581
                                 2.2685653 15.355469 2.0722656 A 1.0001 1.0001 0 0 0 15 2 z M 15 4 C 17.773666 4 20 6.2263339 20 9 L 20 11 L
                                 10 11 L 10 9 C 10 6.2263339 12.226334 4 15 4 z"></path>
                            </svg>
                            <b className="invests">{`Invest`}</b>
                        </div>
                    )}
                </div>
            </footer>
        </div >
    );
}

export default OwnerDash;
