import React from 'react'
import './invested.css'
import { useNavigate } from 'react-router'
function Invested() {
    const navigate = useNavigate();
    const goBack = () => {
        navigate("/ownerdash")
    }
    return (
        <div className="result">
            <div className="android-large-29-inner">
                <div className="vector-parent" onClick={goBack}>
                    <img
                        className="vector-icon"
                        loading="lazy"
                        alt=""
                        src="/invested/vector.svg"
                    />
                    <div className="frame-wrapper">
                        <div className="frame-parent">
                            <div className="frame-container">
                                <div className="vector-group">
                                    <img className="vector-icon1" alt="" src="/invested/vector-1.svg" />
                                    <img
                                        className="vector-icon2"
                                        loading="lazy"
                                        alt=""
                                        src="/invested/vector-2.svg"
                                    />
                                    <img
                                        className="vector-icon3"
                                        loading="lazy"
                                        alt=""
                                        src="/invested/vector-3.svg"
                                    />
                                    <img
                                        className="vector-icon4"
                                        loading="lazy"
                                        alt=""
                                        src="/invested/vector-4.svg"
                                    />
                                    <img
                                        className="vector-icon5"
                                        loading="lazy"
                                        alt=""
                                        src="/invested/vector-5.svg"
                                    />
                                    <img
                                        className="vector-icon6"
                                        loading="lazy"
                                        alt=""
                                        src="/vector-6.svg"
                                    />
                                </div>
                            </div>
                            <div className="owners">Owners</div>
                        </div>
                    </div>
                </div>
            </div>
            <main className="frame-group">
                <div className="hooray-welcome-to-wold-wrapper">
                    <div className="hooray-welcome-to">Hooray, welcome to Wold!</div>
                </div>
                <section className="depositphotos-609568184-stock-wrapper">
                    <img
                        className="depositphotos-609568184-stock-icon"
                        loading="lazy"
                        alt=""
                        src="/invested/depositphotos-609568184stockillustrationhandshakeiconvectorillustration-1@2x.png"
                    />
                </section>
                <p className="congratulations-on-becoming-container">
                    <span>
                        <span className="congratulations">Congratulations</span>
                        <span>{` on becoming a valued `}</span>
                    </span>
                    <span className="partner">partner</span>
                    <span>
                        {" "}
                        in Wold. Your investment marks the beginning of an exciting journey
                        together. We are delighted to have you on board and look forward to
                        achieving great success with your support. Thank you for your trust
                        in our vision. Let's revolutionize global trade investments!
                    </span>
                </p>
                <img
                    className="vector-icon7"
                    loading="lazy"
                    alt=""
                    src="/invested/vector-7.svg"
                />
            </main>
        </div >
    )
}

export default Invested