import React, { useContext, useState } from 'react'
import './investcode.css'
import { UserContext } from '../../UserContext/userContext';
import { investing } from '../../Service/Apis';
import { useNavigate } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
function InvestCode() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const { userData } = useContext(UserContext);
    const navigate = useNavigate();

    function handleChange(e, index) {
        if (isNaN(e.target.value)) return false;
        setOtp([
            ...otp.map((data, indx) => (indx === index ? e.target.value : data))
        ])
        if (e.target.value && e.target.nextSibling) {
            e.target.nextSibling.focus()
        }
    }
    const invest = async () => {
        const data = {
            userEmail: userData.email,
            otp: otp.join('')
        }
        try {
            const response = await investing(data);
            if (response) {
                navigate('/invested');
            }
        } catch (error) {
            // Display error message in toast
            toast.error(error.response.data.error);
        }
    }
    const goBack = () => {
        navigate(-1);
    }
    if (userData.role !== "verified" && userData.role !== "verifying" && userData.role !== "unverified") {
        return (<>Please login</>);
    }
    return (
        <div className="investcode">
            <img className="vector-icon" loading="lazy" alt="" src="/Investcode/vector.svg" />
            <section className="content">
                <div className="container-wrapper">
                    <div className="container">
                        <div className="inner-container" onClick={goBack}>
                            <img
                                className="element-icon"
                                loading="lazy"
                                alt=""
                                src="/Investcode/vector-1.svg"
                            />
                        </div>
                        <div className="container1">
                            <div className="inner-container1">
                                <div className="items">
                                    <img className="vector-icon1" alt="" src="/Investcode/vector-2.svg" />
                                    <img
                                        className="vector-icon2"
                                        loading="lazy"
                                        alt=""
                                        src="/Investcode/vector-3.svg"
                                    />
                                    <img
                                        className="vector-icon3"
                                        loading="lazy"
                                        alt=""
                                        src="/Investcode/vector-4.svg"
                                    />
                                    <img
                                        className="vector-icon4"
                                        loading="lazy"
                                        alt=""
                                        src="/Investcode/vector-5.svg"
                                    />
                                    <img
                                        className="vector-icon5"
                                        loading="lazy"
                                        alt=""
                                        src="/Investcode/vector-6.svg"
                                    />
                                    <img
                                        className="vector-icon6"
                                        loading="lazy"
                                        alt=""
                                        src="/Investcode/vector-7.svg"
                                    />
                                </div>
                            </div>
                            <div className="owners">Owners</div>
                        </div>
                    </div>
                </div>
                <div className="info">
                    <div className="invest-info">
                        <b className="invest">Invest</b>
                        <p className="invest-by-entering-container">
                            <span className="invest-by-entering-the-6-digit">
                                <span>{`Invest by entering the 6-digit e-payment code below. If you don't have an e-payment code, contact admin at `}</span>
                                <span className="span">+91 8714122257</span>
                                <span className="or-email">{` or email `}</span>
                                <span className="infoporteximin">info@portexim.in</span>
                                <span>{` to get your `}</span>
                            </span>
                            <span className="e-payment-code">
                                <span>e-payment code.</span>
                            </span>
                        </p>
                    </div>
                </div>
                <div className="input-container-parent">
                    <div className="instruction">
                        <div className="type-e-payment-code">
                            Type e-payment code below
                        </div>
                    </div>
                    <div className="input-container">
                        {otp.map((data, i) => {
                            return <input type="text"
                                value={data} maxLength={1} onChange={(e) => handleChange(e, i)}
                            />

                        })}



                    </div>
                    <b className="b">6,006</b>
                    <img
                        className="vector-icon7"
                        loading="lazy"
                        alt=""
                        src="/Investcode/vector-8.svg"
                    />
                </div>
            </section>
            <footer className="action-container-wrapper">
                <div className="action-container">
                    <button className="rectangle-parent" onClick={invest}>
                        <div className="frame-inner" />
                        <b className="invest1">{`Invest `}</b>
                    </button>
                </div>
            </footer>
            <ToastContainer />
        </div>
    )
}

export default InvestCode