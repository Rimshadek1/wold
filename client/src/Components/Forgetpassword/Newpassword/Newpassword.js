import React, { useEffect, useState } from 'react';
import './newpassword.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { changePass } from '../../../Service/Apis';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Newpassword() {
    const [password, setPassword] = useState("");
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const otpValue = queryParams.get('otp');
        setOtp(otpValue);
    }, [location.search]);

    const submit = async () => {
        if (!password || password.length < 8) {
            toast.error('Password should be at least 8 characters long');
            return;
        }
        const data = { id, otp, password };
        console.log(data);
        try {
            const response = await changePass(data);
            if (response.status === 200) {
                toast.success('Password updated successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000); // Redirect after 2 seconds
            } else {
                toast.error('Failed to update password');
            }
        } catch (error) {
            toast.error('An error occurred while updating password');
        }
    };
    const back = () => {
        navigate(-1)
    }
    return (
        <div className="android-l">
            <div className="div">
                <div className="overlap">
                    <img className="vector" alt="Vector" onClick={back} src="/newpassword/vector.svg" />
                    <div className="text-wrapper">New Password</div>
                </div>
                <img className="line" alt="Line" src="/newpassword/line-1.svg" />
                <div className="text-wrapper-2">Email verified successfully</div>
                <div className="text-wrapper-3">Create a new password</div>
                <p className="p">This will be used for logging in to your account</p>
                <input
                    type="password"
                    className="rectangle"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <p className="your-password-should">
                    Your password should:
                    <br />
                    &nbsp;&nbsp; Be minimum 8 characters long
                </p>
                <img className="img" alt="Vector" src="/newpassword/image.svg" />
                <div className="overlap-group-wrapper" onClick={submit}>
                    <div className="div-wrapper">
                        <div className="text-wrapper-4">Confirm</div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Newpassword;
