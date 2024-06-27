import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../UserContext/userContext';
import { useNavigate } from 'react-router';
import { userTransaction, withdrawRequest } from '../../../Service/Apis';
import { toast, ToastContainer } from 'react-toastify';
import LoadingSpinner from '../../Loadingpagr/LoadingSpinner';

function Withdrawcashwallet() {
    const [amount, setAmount] = useState('');
    const { userData } = useContext(UserContext);
    const navigate = useNavigate();
    const [balances, setBalances] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);
    const goBack = (e) => {
        e.preventDefault();
        setLoading(true);
        navigate(-1);
        setLoading(false);
    };
    const fetchData = async () => {
        try {
            setLoading(true);
            if (!userData || !userData.id) {
                toast.error('User data is missing.');
                return;
            }

            const response = await userTransaction(userData.id);
            if (response.status === 200) {
                setBalances(response.data.balance)
            }
        } catch (error) {
            toast.error('An error occurred while fetching requests');
        }
        setLoading(false)
    }
    const handlePayment = async () => {
        if (amount === '') {
            toast.error("please enter the amount")
        } else {

            const isConfirmed = window.confirm(
                'Withdrawal request: It may take 2 working days for verification. Do you want to proceed?'
            );

            if (isConfirmed) {
                if (parseFloat(amount) <= parseFloat(balances)) {
                    const data = {
                        amount: parseFloat(amount),
                        id: userData.id,
                        username: userData.email
                    };

                    try {
                        setLoading(true);
                        const response = await withdrawRequest(data);

                        if (response.status === 200) {
                            alert('Withdrawal request accepted. Please wait for the transaction.');
                            navigate('/wallet');

                        } else {
                            alert('Withdrawal request failed. Try again after some time.');
                        }
                    } catch (error) {
                        console.error('Withdrawal request error:', error);
                        alert('Withdrawal request failed. Please try again later.');
                    }
                } else {
                    toast.error('Insufficient funds in your account.');
                }
                setLoading(false);
            }
        }
    };
    if (userData.role !== "verified" && userData.role !== "verifying" && userData.role !== "unverified") {
        return (<>Please login</>);
    }
    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="deposit">
            <ToastContainer />
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
                    <div className="withdraw">Withdraw</div>
                </header>
                <div className="layout-child" />
            </div>
            <main className="sidebar">
                <section className="balance-container">
                    <div className="balance-label">
                        <div className="wallet-balance">Wallet balance :- {balances}</div>
                    </div>
                    <input
                        className="withdraw-container"
                        placeholder="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </section>
            </main>
            <footer className="button-container">
                <button className="rectangle-parent" onClick={handlePayment}>
                    <div className="frame-child" />
                    <div className="send-code-parent">
                        <div className="send-code">Send code</div>
                        <div className="frame-item" />
                        <b className="continue">Continue</b>
                    </div>
                </button>
            </footer>
        </div>
    );
}

export default Withdrawcashwallet;
