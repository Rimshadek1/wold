import React, { useState } from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendEmail } from '../../Service/Apis';

function Signup() {
    const [fullNameInput, setFullNameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const handleFullNameChange = (event) => setFullNameInput(event.target.value);
    const handleEmailChange = (event) => setEmailInput(event.target.value);

    const handleNavigateBack = () => navigate(-1);

    const validateEmail = (email) => {
        const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(String(email).toLowerCase());
    };

    const submit = async () => {
        if (fullNameInput.trim() === '') {
            toast.error('Please enter your full name.');
            return;
        }

        if (!validateEmail(emailInput)) {
            toast.error('Please enter a valid email address (e.g., example@domain.com).');
            return;
        }

        const data = { fullName: fullNameInput, email: emailInput };

        try {
            setLoading(true);
            const response = await sendEmail(data);
            if (response.status === 200) {
                toast.success('Success! Please check your email for further instructions.');
                navigate(`/emailotp/${emailInput}?name=${data.fullName}`);
            } else if (response.status === 400) {
                toast.error(response.data.error);
                console.error('Error sending email:', response.data.error);
            } else {
                toast.error('An error occurred. Please try again later.');
                console.error('Error sending email:', response);
            }

        } catch (error) {
            toast.error(error.response.data.error);
            console.error('Unexpected error during email sending:', error.response.data.error);
        }
        setLoading(false);
    };

    return (
        <div className="signup">
            <div className="container">
                <header className="rectangle-parent">
                    <div className="frame-child" />
                    <div className="item-wrapper" onClick={handleNavigateBack}>
                        <img
                            className="item-icon"
                            loading="lazy"
                            alt=""
                            src="/signup/vector.svg"
                        />
                    </div>
                    <h3 className="create-an-account">Create an account</h3>
                </header>
                <div className="separator" />
            </div>
            <main className="full-name-input-wrapper">
                <section className="full-name-input">
                    <div className="join-wold-button">
                        <h1 className="join-wold">Join Wold.</h1>
                    </div>
                    <div className="input-labels">
                        <div className="full-name">Full Name</div>
                        <input
                            className={`input-labels-child ${fullNameInput ? 'selected' : ''}`}
                            type="text"
                            value={fullNameInput}
                            onChange={handleFullNameChange}
                        />
                        <div className="input-hints">
                            <div className="please-enter-your">
                                Please enter your full name.
                            </div>
                        </div>
                    </div>
                    <div className="input-labels1">
                        <div className="email-address">Email Address</div>
                        <input
                            className={`input-labels-item ${emailInput ? 'selected' : ''}`}
                            type="text"
                            value={emailInput}
                            onChange={handleEmailChange}
                        />
                        <div className="we-will-send-you-an-otp-to-thi-wrapper">
                            <div className="we-will-send">
                                We will send you an OTP to this email to create an account.
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="android-large-5-inner">
                <ToastContainer />
                <button className="rectangle-group" onClick={submit}>
                    <div className="frame-item" />
                    <div className="continue">{loading ? 'Loading...' : 'Continue'}</div>
                </button>
            </footer>
        </div>
    );
}

export default Signup;
