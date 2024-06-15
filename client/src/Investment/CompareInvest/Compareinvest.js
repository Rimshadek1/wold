import React from 'react'
import './compareinvest.css'
import { useNavigate } from 'react-router';
function Compareinvest() {
    const navigate = useNavigate();


    const goBack = (e) => {
        e.preventDefault();
        navigate(-1)

    }
    return (
        <div className="compareinvest">
            <main className="frame-parent">
                <header className="frame-wrapper">
                    <div className="frame-group">
                        <div className="vector-wrapper" onClick={goBack}>
                            <img
                                className="vector-icon"
                                loading="lazy"
                                alt=""
                                src="/compareinvest/vector.svg"
                            />
                        </div>
                        <div className="frame-container">
                            <div className="frame-div">
                                <div className="value-one-parent">
                                    <img className="value-one-icon" alt="" src="/compareinvest/vector-1.svg" />
                                    <img
                                        className="value-two-icon"
                                        loading="lazy"
                                        alt=""
                                        src="/compareinvest/vector-2.svg"
                                    />
                                    <img
                                        className="value-three-icon"
                                        loading="lazy"
                                        alt=""
                                        src="/compareinvest/vector-3.svg"
                                    />
                                    <img
                                        className="value-four-icon"
                                        loading="lazy"
                                        alt=""
                                        src="/compareinvest/vector-4.svg"
                                    />
                                    <img
                                        className="value-five-icon"
                                        loading="lazy"
                                        alt=""
                                        src="/compareinvest/vector-5.svg"
                                    />
                                    <img
                                        className="value-six-icon"
                                        loading="lazy"
                                        alt=""
                                        src="/compareinvest/vector-6.svg"
                                    />
                                </div>
                            </div>
                            <div className="owners">Owners</div>
                        </div>
                    </div>
                </header>
                <section className="investment-info-wrapper">
                    <div className="investment-info">
                        <b className="compare-investment">Compare investment</b>
                        <p className="if-you-invest-container">
                            <span>{`If you invest ₹8,000 now for share ownership in `}</span>
                            <span className="wold">Wold</span>
                            <span>
                                , imagine the potential value of your holdings when Wold reaches
                                a position similar to below alternative investment platform
                                companies. Check below for the expected value of your investment
                                based on their growth trajectories.
                            </span>
                        </p>
                    </div>
                </section>
                <section className="growth-visualization-parent">
                    <div className="growth-visualization">
                        <div className="growth-container">
                            <div className="companies-wrapper">
                                <div className="companies">Companies :</div>
                            </div>
                            <div className="your-investment-can-container">
                                <p className="your-investment">{`Your investment `}</p>
                                <p className="can-grow-like">can grow like :</p>
                            </div>
                        </div>
                        <div className="growth-visualization-inner">
                            <div className="rectangle-parent">
                                <div className="frame-child" />
                                <div className="as-ec4bb421-939a-4277-b152-e00-parent">
                                    <img
                                        className="as-ec4bb421-939a-4277-b152-e00-icon"
                                        loading="lazy"
                                        alt=""
                                        src="/compareinvest/as-ec4bb421939a4277b152e000bddc830e-1@2x.png"
                                    />
                                    <div className="chart-label">
                                        <div className="grip">Grip</div>
                                        <div className="founded-year-2020">Founded year 2020</div>
                                    </div>
                                </div>
                                <div className="frame-wrapper1">
                                    <div className="frame-parent1">
                                        <div className="vector-container">
                                            <img
                                                className="vector-icon1"
                                                loading="lazy"
                                                alt=""
                                                src="/compareinvest/vector-7.svg"
                                            />
                                        </div>
                                        <div className="div">5,36,431</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rectangle-group">
                        <div className="frame-item" />
                        <div className="company-info">
                            <img
                                className="screenshotofc-5000500b-d4a8-42-icon"
                                loading="lazy"
                                alt=""
                                src="/compareinvest/screenshotofc-5000500bd4a84290b3fb83b4d17a1535-1@2x.png"
                            />
                            <div className="sub-category">
                                <div className="sub-category-names">
                                    <div className="wint-wealth">Wint wealth</div>
                                </div>
                                <div className="founded-year-20201">Founded year 2020</div>
                            </div>
                        </div>
                        <div className="download-content-wrapper">
                            <div className="download-content">
                                <div className="download-elements">
                                    <img
                                        className="download-icons"
                                        loading="lazy"
                                        alt=""
                                        src="/compareinvest/vector-8.svg"
                                    />
                                </div>
                                <div className="div1">9,49,305</div>
                            </div>
                        </div>
                    </div>
                    <div className="rectangle-container">
                        <div className="frame-inner" />
                        <div className="jiraaf-1-parent">
                            <img
                                className="jiraaf-1-icon"
                                loading="lazy"
                                alt=""
                                src="/compareinvest/jiraaf-1@2x.png"
                            />
                            <div className="jiraaf-parent">
                                <div className="jiraaf">Jiraaf</div>
                                <div className="founded-year-2021">Founded year 2021</div>
                            </div>
                        </div>
                        <div className="frame-wrapper2">
                            <div className="frame-parent2">
                                <div className="vector-frame">
                                    <img
                                        className="vector-icon2"
                                        loading="lazy"
                                        alt=""
                                        src="/compareinvest/vector-9.svg"
                                    />
                                </div>
                                <div className="div2">8,01,896</div>
                            </div>
                        </div>
                    </div>
                    <div className="group-div">
                        <div className="rectangle-div" />
                        <div className="stablemoney-1-parent">
                            <img
                                className="stablemoney-1-icon"
                                loading="lazy"
                                alt=""
                                src="/compareinvest/stablemoney-1@2x.png"
                            />
                            <div className="stable-money-parent">
                                <div className="stable-money">Stable money</div>
                                <div className="founded-year-2022">Founded year 2022</div>
                            </div>
                        </div>
                        <div className="frame-wrapper3">
                            <div className="frame-parent3">
                                <div className="vector-wrapper1">
                                    <img
                                        className="vector-icon3"
                                        loading="lazy"
                                        alt=""
                                        src="/compareinvest/vector-10.svg"
                                    />
                                </div>
                                <div className="div3">2,31,135</div>
                            </div>
                        </div>
                    </div>
                    <div className="group-div">
                        <div className="rectangle-div" />
                        <div className="stablemoney-1-parent">
                            <img
                                className="stablemoney-1-icon"
                                loading="lazy"
                                alt=""
                                src="/compareinvest//download-1@2x.png"
                            />
                            <div className="stable-money-parent">
                                <div className="stable-money">Upstox</div>
                                <div className="founded-year-2022">Founded year 2009</div>
                            </div>
                        </div>
                        <div className="frame-wrapper3">
                            <div className="frame-parent3">
                                <div className="vector-wrapper1">
                                    <img
                                        className="vector-icon3"
                                        loading="lazy"
                                        alt=""
                                        src="/compareinvest/vector-12.svg"
                                    />
                                </div>
                                <div className="div3">37,900,976</div>
                            </div>
                        </div>
                    </div>

                </section>
            </main>
        </div>
    )
}

export default Compareinvest