import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { UserContext } from '../../../UserContext/userContext';
import { toast, ToastContainer } from 'react-toastify';
import { mobileotpveri } from '../../../Service/Apis';

function Mobileotp() {
    const { id } = useParams();
    const [minutes, setMinutes] = useState(2);
    const [seconds, setSeconds] = useState(44);
    const [otp, setOtp] = useState();
    const { userData } = useContext(UserContext);
    const navigate = useNavigate()
    useEffect(() => {
        const timerId = setInterval(() => {
            setSeconds(prevSeconds => {
                if (prevSeconds > 0) {
                    return prevSeconds - 1;
                } else if (minutes > 0) {
                    setMinutes(prevMinutes => prevMinutes - 1);
                    return 59; // Reset seconds when switching minutes
                } else {
                    clearInterval(timerId);
                    // Handle expired OTP (e.g., disable button, show error message)
                    return 0;
                }
            });
        }, 1000); // Update timer every second

        // Cleanup function to clear the timer on unmount
        return () => clearInterval(timerId);
    }, [minutes]);

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const submit = async () => {
        const data = {
            otp,
            mobile: id,
            user: userData.id
        }
        const response = await mobileotpveri(data);
        if (response.status === 200) {
            navigate(`/bankaccount/${id}`);
        } else {
            toast.error(response.data.error)
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
                            <div className="enter-your-mobile">Enter code</div>
                            <div className="well-text-you">
                                We send it to +91 {id}
                            </div>
                            <div className="well-text-you">
                                The OTP will expire in {formattedTime}
                            </div>
                        </div>
                    </div>
                    <div className="rectangle-group">
                        <div className="frame-inner" />
                        <input className="input" type="text"
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                </section>
            </main>
            <footer className="frame-footer">
                <button className="rectangle-container" onClick={submit}>
                    <div className="rectangle-div" />
                    <b className="send-code">Continue</b>
                </button>
            </footer>
            <ToastContainer />
        </div >
    )
}

export default Mobileotp