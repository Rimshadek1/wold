import { useState } from 'react';
import './login.css'
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { loginUsers } from "../../Service/Apis";
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const login = async (e) => {
        e.preventDefault();
        if (email === "") {
            toast.error("Enter Your Email!");
        } else if (!email.includes("@")) {
            toast.error("Enter Valid Email!");
        } else {
            const data = {
                email: email,
                password: password
            };
            try {

                const response = await loginUsers(data);
                localStorage.setItem('authToken', response.data.token);
                if (response.data.role === "admin") {
                    navigate('/dashboard', { replace: true });
                } else {
                    navigate('/home', { replace: true });
                }
                window.location.reload();
            } catch (error) {
                console.error('Error during login:', error);
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error("Login failed. Please try again.");
                }

            }
        }
    };
    const goBack = () => {
        navigate(-1);
    }
    return (

        <form className="android-large-22">
            <header className="header">
                <div className="header-child" />
                <div className="vector-wrapper" onClick={goBack}>
                    <img
                        className="vector-icon"
                        loading="lazy"
                        alt=""
                        src="/login/vector.svg"
                    />
                </div>
                <div className="login">Login</div>
            </header>
            <div className="divider" />
            <div className="footer-login">
                <h2 className="login1">Login</h2>
            </div>
            <div className="email-field">
                <div className="email-address" >Email Address</div>
            </div>
            <section className="android-large-22-inner">
                <input className="frame-child" type="text" onChange={(e) => setEmail(e.target.value)} />
            </section>
            <div className="password-field">
                <div className="password">Password</div>
            </div>
            <section className="android-large-22-child">
                <input className="frame-child" type="password" onChange={(e) => setPassword(e.target.value)} />
            </section>
            <div className="frame-div">
                <button className="rectangle-parent" onClick={login}>
                    <div className="frame-inner" />
                    <div className="login2">Login</div>
                </button>
            </div>
            <div className="forget-password-wrapper">
                <Link to="/forgetpassword" className="forget-password">
                    Forget Password?
                </Link>
            </div>
            <div className="signup-link-wrapper">
                <p className="signup-link">
                    Don't have an account? <Link to='/signup' className="signups">Sign Up</Link>
                </p>
            </div>
            <ToastContainer />
        </form >

    )
}

export default Login