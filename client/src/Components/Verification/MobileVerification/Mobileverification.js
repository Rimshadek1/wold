import React, { useContext, useState } from 'react'
import './Mobileverification.css'
import { UserContext } from '../../../UserContext/userContext';
import { useNavigate } from 'react-router';
import { mobileOtpSent } from '../../../Service/Apis';
import { toast, ToastContainer } from 'react-toastify';
function Mobileverification() {
    const [mobileNumber, setMobileNumber] = useState();
    const { userData } = useContext(UserContext);
    const navigate = useNavigate();
    const submit = async () => {
        if (!mobileNumber) {
            toast.error('mobileNumber');
        } else if (!userData.id) {
            toast.error('userdata');
        }
        const data = {
            mobile: mobileNumber,
            userId: userData.id
        }
        const response = await mobileOtpSent(data);
        if (response.status === 200) {
            navigate(`/mobileotp/${mobileNumber}`)
        } else {
            toast.error('otp send failed');
        }
    }
    const goBack = (e) => {
        e.preventDefault();
        navigate(-1)

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
                            className="input"
                            placeholder=""
                            type="text"
                            onChange={(e) => setMobileNumber(e.target.value)}
                        />
                    </div>
                </section>
            </main>
            <footer className="frame-footer">
                <button className="rectangle-container" onClick={submit}>
                    <div className="rectangle-div" />
                    <b className="send-code">Send code</b>
                </button>
            </footer>
            <ToastContainer />
        </div>
    )
}

export default Mobileverification