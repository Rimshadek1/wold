import React, { useState, useCallback, useContext } from 'react';
import './Addcashwallet.css';
import useRazorpay from "react-razorpay";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { postRequestAddMoney, verifyPayment } from '../../../Service/Apis';
import { UserContext } from '../../../UserContext/userContext';

function Addcashwallet() {
    const [amount, setAmount] = useState('');
    const [Razorpay, isLoaded] = useRazorpay();
    const { userData } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const goBack = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    const handlePayment = useCallback(async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (amount > 100000) {
            toast.error('Maximum deposit amount is Rs 100,000');
            return;
        } else if (amount < 1000) {
            toast.error('Minimum deposit amount is Rs 1000');
            return;
        }

        setLoading(true);

        try {
            const data = {
                amount,
                id: userData.id
            };

            const orders = await postRequestAddMoney(data);
            const order = orders.data;
            if (!order) {
                console.error('Error: Order is undefined');
                toast.error('Failed to create order. Please try again.');
                setLoading(false);
                return;
            }

            const options = {
                key: "rzp_test_u6AqTKt0lLlp8S",
                amount: order.amount,
                currency: order.currency,
                name: "WOLD",
                description: "Transaction",
                image: "/logo512.png",
                order_id: order.id,
                handler: async (res) => {
                    const data = {
                        res,
                        order
                    };

                    try {
                        const response = await verifyPayment(data);
                        if (response.status === 200) {
                            toast.success('Payment Success');
                            navigate('/wallet');
                        } else if (response.status === 400) {
                            toast.error('Payment failed: Invalid signature');
                        } else {
                            toast.error('Internal server error');
                        }
                        // window.location.reload();
                    } catch (verificationError) {
                        console.error('Error in payment verification:', verificationError);
                        toast.error('Payment verification failed. Please try again.');
                    }

                    setLoading(false);
                },
                prefill: {
                    name: userData.name,
                    email: userData.email,
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#31ba77",
                },
            };

            const rzpay = new Razorpay(options);
            rzpay.open();
        } catch (error) {
            console.error('Error in handlePayment:', error);
            toast.error('Payment process failed. Please try again.');
            setLoading(false);
        }
    }, [Razorpay, amount, navigate, userData]);
    if (userData.role !== "verified" && userData.role !== "verifying" && userData.role !== "unverified") {
        return (<>Please login</>);
    }
    return (
        <div className="deposit">
            <div className="layout">
                <header className="content">
                    <div className="content-child" />
                    <div className="content-container" onClick={goBack}>
                        <img
                            className="bookid-icon"
                            loading="lazy"
                            alt=""
                            src="/addcashwallet/vector.svg"
                        />
                    </div>
                    <div className="withdraw">Deposit</div>
                </header>
                <div className="layout-child" />
            </div>
            <main className="sidebar">
                <section className="balance-container">
                    <div className="balance-label">
                        <div className="wallet-balance">Enter amount above RS 1000</div>
                    </div>
                    <input
                        className="withdraw-container"
                        placeholder="Amount"
                        type="number"
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </section>
            </main>
            <footer className="button-container">
                <button className="rectangle-parent" onClick={handlePayment} >
                    <div className="frame-child" />
                    <div className="send-code-parent">
                        <div className="send-code">Send code</div>
                        <div className="frame-item" />
                        <b className="continue">{loading ? 'Loading...' : 'Continue'}</b>
                    </div>
                </button>
            </footer>
            <ToastContainer />
        </div>
    );
}

export default Addcashwallet;
