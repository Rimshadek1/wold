import React, { useState } from 'react';
import './resetpassword.css';
import { otpChecking } from '../../../Service/Apis';
import { useNavigate, useParams } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Resetpassword() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const data = {
                otp,
                id
            }
            const response = await otpChecking(data);
            if (response.status === 200) {
                toast.success('OTP verified successfully.');
                navigate(`/newpassword/${id}?otp=${otp}`);
            } else {
                toast.error('Invalid OTP. Please try again.');
            }
        } catch (err) {
            toast.error('Error verifying OTP. Please try again.');
        }
        setLoading(false);
    };
    const back = () => {
        navigate(-1)
    }
    return (
        <div className="forget-passwords">
            <ToastContainer />
            <div className="div">
                <img
                    className="vector"
                    alt="Vector"
                    src="/forgetpassword/forgetpassword.svg"
                    onClick={back}
                />
                <div className="text-wrapper">Enter OTP</div>
                <input
                    type="text"
                    className="rectangle"
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <p className="p">Enter the OTP you received and click continue.</p>
                {loading && <p className="loading">Verifying OTP...</p>}
                <div className="group">
                    <div className="overlap-group" onClick={handleSubmit}>
                        <div className="text-wrapper-2">Continue</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Resetpassword;
