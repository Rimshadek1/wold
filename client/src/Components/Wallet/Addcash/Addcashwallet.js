import React, { useState, useCallback, useContext } from 'react';
import './Addcashwallet.css';
import useRazorpay from "react-razorpay";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postRequestAddMoney, verifyPayment } from '../../../Service/Apis';
import { UserContext } from '../../../UserContext/userContext';

function Addcashwallet() {
    const [amount, setAmount] = useState('');
    const [Razorpay, isLoaded] = useRazorpay();
    const { userData } = useContext(UserContext);
    const navigate = useNavigate();

    const goBack = (e) => {
        e.preventDefault();
        navigate(-1);
    }
    const handlePayment = useCallback(async () => {
        try {
            if (amount > 100000) {
                toast.error('Maximum deposit amount is Rs 100,000');
                return;
            }
            else if (amount < 1000) {
                toast.error('Minimum deposit amount is Rs 1000');
                return;
            }

            const data = {
                amount,
                id: userData.id
            };
            const orders = await postRequestAddMoney(data);
            const order = orders.data;
            if (!order) {
                console.error('Error: Order is undefined');
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
                        res, order
                    };
                    const response = await verifyPayment(data);
                    if (response.status === 200) {
                        toast.success('Payment Success');
                        window.location.reload();
                        navigate('/wallet');
                    } else if (response.status === 400) {
                        toast.error('Payment failed: Invalid signature');
                    } else {
                        toast.error('Internal server error');
                    }
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
        }
    }, [Razorpay, amount, navigate, userData]);

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

export default Addcashwallet;



// import React, { useContext, useState } from 'react';
// import './Addcashwallet.css'
// import { useNavigate } from 'react-router-dom';
// import { UserContext } from '../../../UserContext/userContext';
// function Addcashwallet() {
//     const navigate = useNavigate();
//     const [amount, setAmount] = useState('');
//     const { userData } = useContext(UserContext);;
//     const goBack = (e) => {
//         e.preventDefault();
//         navigate(-1)

//     }
//     console.log(userData);
//     return (
//         <div className="deposit">
//             <div className="layout">
//                 <header className="content">
//                     <div className="content-child" />
//                     <div className="content-container" onClick={goBack}>
//                         <img
//                             className="bookid-icon"
//                             loading="lazy"
//                             alt=""
//                             src="/addcashwallet/vector.svg"
//                         />
//                     </div>
//                     <div className="withdraw">Deposit</div>
//                 </header>
//                 <div className="layout-child" />
//             </div>
//             <main className="sidebar">
//                 <section className="balance-container">
//                     <div className="balance-label">
//                         <div className="wallet-balance">Enter amount above RS 1000</div>
//                     </div>
//                     <input
//                         className="withdraw-container"
//                         placeholder="Amount"
//                         value={amount}
//                         onChange={(e) => setAmount(e.target.value)}
//                     />
//                 </section>
//             </main>
//             <footer className="button-container">
//                 <button className="rectangle-parent">
//                     <div className="frame-child" />
//                     <div className="send-code-parent">
//                         <div className="send-code">Send code</div>
//                         <div className="frame-item" />
//                         <b className="continue">Continue</b>
//                     </div>
//                 </button>
//             </footer>
//         </div >
//     )
// }

// export default Addcashwallet