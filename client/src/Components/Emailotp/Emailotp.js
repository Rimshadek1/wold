import React, { useState } from 'react'
import './emailotp.css'
import { useNavigate, useParams } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkOtp } from '../../Service/Apis';
function Emailotp() {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const { id } = useParams();
    const name = new URLSearchParams(window.location.search).get('name');

    const navigate = useNavigate();
    if (!id) {
        return <div>Error: Email address is missing from the URL, Please register again. </div>;
    }
    function handleChange(e, index) {
        if (isNaN(e.target.value)) return false;
        setOtp([
            ...otp.map((data, indx) => (indx === index ? e.target.value : data))
        ])
        if (e.target.value && e.target.nextSibling) {
            e.target.nextSibling.focus()
        }
    }
    const submit = async () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            toast.error('Error: OTP must be 6 digits long.');
        } else {

            const data = {
                otp: otp.join(''),
                email: id
            }
            try {
                const response = await checkOtp(data);

                if (response.status === 200) {
                    toast.success("Validated, please set your password");
                    navigate(`/password/${id}?otp=${otp.join('')}?name=${name}`);
                } else {
                    toast.error(response.data.error || "Error validating OTP");
                }
            } catch (error) {
                if (error.response) {
                    // Server responded with a status other than 2xx
                    console.error('Error response:', error.response.data);
                    toast.error(error.response.data.error || "Error validating OTP");
                } else if (error.request) {
                    // Request was made but no response received
                    console.error('Error request:', error.request);
                    toast.error('No response from server');
                } else {
                    // Something else happened
                    console.error('Error', error.message);
                    toast.error('An error occurred: ' + error.message);
                }
            }
        }
    }
    const handleNavigateBack = () => navigate(-1);


    return (
        <div className="emailotp">
            <header className="rectangle-parent">
                <div className="frame-child" />
                <div className="vector-wrapper" onClick={handleNavigateBack}>
                    <img
                        className="vector-icon"
                        loading="lazy"
                        alt=""
                        src="/emailotp/vector.svg"
                    />
                </div>
                <div className="create-an-account">Create an account</div>
            </header>
            <div className="android-large-6-inner">
                <div className="frame-item" />
            </div>
            <main className="otp-content-wrapper">
                <section className="otp-content">
                    <div className="otp-message-wrapper">
                        <div className="otp-message">
                            <img
                                className="img-20240513-wa0004-icon"
                                loading="lazy"
                                alt=""
                                src="/emailotp/IMG-20240513-WA0004.png"
                            />
                            <div className="an-otp-has-container">
                                <p className="an-otp-has">
                                    An OTP has been sent to your email.
                                </p>
                                <p className="please-type-the"> Please type the OTP below</p>
                            </div>
                        </div>
                    </div>
                    <div className="otp-input-label-parent">
                        <div className="otp-input-label">
                            <div className="enter-otp">Enter Otp</div>
                        </div>
                        <div className="otpArea">
                            {otp.map((data, i) => {
                                return <input type="text"
                                    value={data} maxLength={1} onChange={(e) => handleChange(e, i)}
                                />

                            })}

                        </div>
                    </div>
                </section>
            </main>
            <footer className="android-large-6-child">
                <button className="rectangle-group">
                    <div className="frame-child1" />
                    <div className="continue" onClick={submit}>Continue</div>
                </button>
                <ToastContainer />
            </footer>
        </div>
    )
}

export default Emailotp