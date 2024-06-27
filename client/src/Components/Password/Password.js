import React, { useEffect, useState } from 'react'
import './password.css'
import { useNavigate, useParams } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUser } from '../../Service/Apis';
function Password() {
    const { id } = useParams();
    const [password, setPassword] = useState('');
    const [toastError, setToastError] = useState(null);
    const navigate = useNavigate()
    const otpandname = new URLSearchParams(window.location.search).get('otp');
    const otp = otpandname.substring(0, 6);
    const name = otpandname.substring(12);
    const [loading, setLoading] = useState(false);


    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        const data = {
            email: id,
            password: password,
            otp: otp,
            fullName: name

        };
        try {
            setLoading(true);
            const response = await createUser(data);
            localStorage.setItem('authToken', response.data.token);
            if (response.status === 200) {
                toast.success("Account created successfully!");
                navigate('/home')
                window.location.reload();

            } else {
                toast.error(`Error creating account: ${response.data.error}`);
            }
        } catch (error) {
            if (error.response) {
                // Server responded with a non-2xx status code
                console.error('Error response:', error.response.data);
                toast.error(error.response.data.error || "Error validating OTP");
            } else if (error.request) {
                // Request was made but no response received
                console.error('Error request:', error.request);
                toast.error('No response from server');
            } else {
                // Something else happened (e.g., network error)
                console.error('Error:', error.message);
                toast.error('An unexpected error occurred. Please try again later.');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        // Handle potential initial rendering issue with otp
        if (toastError === null) { // Check if toast error hasn't been set yet
            const searchParams = new URLSearchParams(window.location.search);
            const otp = searchParams.get('otp');
            if (!otp) {
                setToastError('Missing OTP parameter in URL'); // Inform user about missing otp
            }
        }
    }, [toastError]);
    const handleNavigateBack = () => navigate(-1);

    return (
        <div className="password">
            <header className="rectangle-parent">
                <div className="frame-child" />
                <div className="vector-wrapper" onClick={handleNavigateBack}>
                    <img
                        className="vector-icon"
                        loading="lazy"
                        alt=""
                        src="/password/vector.svg"
                    />
                </div>
                <div className="create-an-account">Create an account</div>
            </header>
            <div className="android-large-7-inner">
                <div className="frame-item" />
            </div>
            <main className="android-large-7-child">
                <section className="frame-parent">
                    <div className="frame-wrapper">
                        <div className="frame-group">
                            <div className="frame-container">
                                <div className="frame-div">
                                    <div className="email-verified-successfully-parent">
                                        <div className="email-verified-successfully">{`Email verified successfully `}</div>
                                        <div className="vector-container">
                                            <img
                                                className="vector-icon1"
                                                loading="lazy"
                                                alt=""
                                                src="/password/vector-1.svg"
                                            />
                                        </div>
                                    </div>
                                    <div className="create-a-password-wrapper">
                                        <h1 className="create-a-password">Create a password</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="this-will-be">
                                This will be used for logging in to your account
                            </div>
                        </div>
                    </div>
                    <input
                        className="frame-inner"
                        type="password" // Use password type for security
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <div>Your password should:
                        <br />
                        Be minimum 8 charachters long</div>
                </section>
            </main>
            <footer className="frame-footer">
                <button className="rectangle-group" onClick={handleSubmit}>
                    <div className="rectangle-div" />
                    <div className="create-account">{loading ? 'Loading...' : 'Create Account'}</div>
                </button>
                <ToastContainer />
            </footer>
        </div>
    )
}

export default Password