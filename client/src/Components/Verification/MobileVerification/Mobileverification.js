import React, { useContext, useState } from 'react';
import './Mobileverification.css';
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import { UserContext } from '../../../UserContext/userContext';

function Mobileverification() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [isValid, setIsValid] = useState(true);
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);

    const goBack = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    const handleMobileNumberChange = (e) => {
        const value = e.target.value;
        const regex = /^[0-9]{10}$/;
        if (regex.test(value)) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
        setMobileNumber(value);
    };

    const handleSendCodeClick = (e) => {
        if (!isValid) {
            e.preventDefault();
            toast.error('Please enter a valid 10-digit mobile number.');
        }
    };
    if (userData.role !== "verified" && userData.role !== "verifying" && userData.role !== "unverified") {
        return (<>Please login</>);
    }

    return (
        <div className="numberveri">
            <header className="rectangle-parent">
                <div className="frame-child" />
                <div className="vector-wrapper" onClick={goBack}>
                    <img
                        className="vector-icon"
                        loading="lazy"
                        alt=""
                        src="/Bankaccount/vector.svg"
                    />
                </div>
                <div className="create-investment-account">
                    Create investment account
                </div>
            </header>
            <div className="android-large-8-inner">
                <div className="frame-item" />
            </div>
            <main className="android-large-8-child">
                <section className="welcome-to-wold-rimz-parent">
                    <h3 className="welcome-to-wold-container">
                        <span>{`Welcome to Wold, `}</span>
                        <span className="rimz">Rimz</span>
                        <span>!</span>
                    </h3>
                    <div className="frame-wrapper">
                        <div className="enter-your-mobile-number-parent">
                            <div className="enter-your-mobile">Enter your mobile number</div>
                            <div className="well-text-you">
                                We’ll text you a code so we can confirm it’s you
                            </div>
                        </div>
                    </div>
                    <div className="rectangle-group">
                        <div className="frame-inner" />
                        <div className="di">+91</div>
                        <input
                            className={`input ${isValid ? '' : 'invalid'}`}
                            placeholder=""
                            type="text"
                            onChange={handleMobileNumberChange}
                            value={mobileNumber}
                            required
                        />
                        {!isValid && <div className="error-messages" style={{ fontSize: "10px", width: "100%" }}>Please enter a valid 10-digit mobile number.</div>}
                    </div>
                </section>
            </main>
            <footer className="frame-footer">
                <Link
                    to={isValid ? `/bankaccount/${mobileNumber}` : '#'}
                    className="rectangle-container"
                    onClick={handleSendCodeClick}
                >
                    <div className="rectangle-div" />
                    <b className="send-code">Continue</b>
                </Link>
            </footer>
            <ToastContainer />
        </div>
    );
}

export default Mobileverification;
