import React, { useState } from 'react';
import './forgetpassword.css';
import { useNavigate } from "react-router-dom";
import { forgetPasswords } from "../../Service/Apis";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Forgetpassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async () => {
        setLoading(true);
        try {
            const data = { email };
            const response = await forgetPasswords(data);
            if (response.status === 200) {
                toast.success('OTP sent successfully to your email.');
                navigate(`/resetpassword/${email}`);
            } else {
                toast.error('Failed to send OTP. Please try again.');
            }
        } catch (err) {
            toast.error('Error sending OTP. Please try again.');
        }
        setLoading(false);
    }

    const goback = () => {
        navigate(-1);
    }

    return (
        <div className="forget-password">
            <ToastContainer />
            <div className="div">
                <img className="vector"
                    alt="Vector"
                    onClick={goback}
                    src="/forgetpassword/forgetpassword.svg"
                />
                <div className="text-wrapper">Forget Password?</div>
                <input
                    type="text"
                    className="rectangle"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="text-wrapper-2">Email Address</div>
                <p className="p">You will receive an OTP in your inbox to reset your password</p>
                {loading && <p className="loading">Sending OTP...</p>}
                <div className="group">
                    <div className="overlap-group">
                        <div className="text-wrapper-3" onClick={submit}>Send OTP</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Forgetpassword;
