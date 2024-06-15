import React, { useContext, useState } from 'react'
import { UserContext } from '../../../UserContext/userContext';
import { useNavigate } from 'react-router';
import { withdrawRequest } from '../../../Service/Apis';
import { useWallet } from '../../../UserContext/WalletContext';

function Withdrawcashwallet() {
    const [amount, setAmount] = useState('');
    const { userData } = useContext(UserContext);
    const navigate = useNavigate();
    const { balance } = useWallet();
    const goBack = (e) => {
        e.preventDefault();
        navigate(-1);
    }
    const handlePayment = async () => {
        const isConfirmed = window.confirm(
            'Withdrawal request: It may take 2 working days for verification. Do you want to proceed?'
        );
        if (isConfirmed) {
            if (parseFloat(amount) <= parseFloat(balance)) {
                const data = {
                    amount: parseFloat(amount),
                    id: userData.id,
                    username: userData.email
                };
                const response = await withdrawRequest(data);

                if (response.status === 200) {
                    alert('Withdrawal request accepted. Please wait for the transaction.');
                    window.location.reload();

                    navigate('/wallet');
                } else {
                    alert('Withdrawal request failed. Try again after some time.');
                }
            } else {
                alert('Insufficient funds in your account.');
            }
        }
    };
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
                    <div className="withdraw">Withdraw</div>
                </header>
                <div className="layout-child" />
            </div>
            <main className="sidebar">
                <section className="balance-container">
                    <div className="balance-label">
                        <div className="wallet-balance">Wallet balance :- {balance}</div>
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
    )
}

export default Withdrawcashwallet