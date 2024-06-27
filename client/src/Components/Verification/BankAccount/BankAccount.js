import React, { useContext, useState } from 'react';
import './Bankaccount.css';
import { UserContext } from '../../../UserContext/userContext';
import { useNavigate, useParams } from 'react-router';
import { bankDetails } from '../../../Service/Apis';
import { toast, ToastContainer } from 'react-toastify';

function BankAccount() {
    const [bank, setBank] = useState('');
    const [rebank, setRebank] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [upi, setUpi] = useState('');
    const { userData } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    const submit = async () => {
        if (bank !== rebank) {
            toast.error('Bank account numbers do not match');
            return;
        }

        if (!bank || !rebank || !ifsc) {
            toast.error('All fields except UPI ID are required');
            return;
        }

        // Start loading
        setIsLoading(true);

        const data = {
            bank, rebank, ifsc, upi, user: userData.id, id
        };

        try {
            const response = await bankDetails(data);
            if (response.status === 200) {
                navigate('/adhaarverification');
            } else {
                toast.error(response.data.error);
            }
        } catch (error) {
            console.error('Error adding bank details:', error);
            toast.error('Failed to add bank details. Please try again.');
        } finally {
            // Stop loading
            setIsLoading(false);
        }
    };

    const goBack = (e) => {
        e.preventDefault();
        navigate(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') {
            setIfsc((prevIfsc) => prevIfsc.slice(0, -1));
        } else {
            const uppercaseKey = e.key.toUpperCase();
            setIfsc((prevIfsc) => prevIfsc + uppercaseKey);
        }
    };
    if (userData.role !== "verified" && userData.role !== "verifying" && userData.role !== "unverified") {
        return (<>Please login</>);
    }

    return (
        <div className="bankaccount">
            <ToastContainer />
            <section className="content">
                <header className="rectangle-parent">
                    <div className="frame-child" />
                    <div className="vector-wrapper" onClick={goBack}>
                        <img
                            className="vector-icon"
                            loading="lazy"
                            alt=""
                            src="/Bankaccount/vector.svg"
                        />
                    </div>
                    <div className="add-bank-account">Add bank account</div>
                </header>
                <div className="content-child" />
            </section>
            <section className="account-details">
                <div className="input-fields">
                    <div className="field-labels1">
                        <div className="re-enter-bank-account-no-wrapper">
                            <div className="re-enter-bank-account">
                                Bank account no
                            </div>
                        </div>
                        <input
                            className="field-labels-child"
                            type="password"
                            value={bank}
                            required
                            onChange={(e) => setBank(e.target.value)}
                        />
                    </div>
                    <div className="field-labels1">
                        <div className="re-enter-bank-account-no-wrapper">
                            <div className="re-enter-bank-account">
                                Re-enter Bank account no
                            </div>
                        </div>
                        <input
                            className="field-labels-child"
                            type="text"
                            value={rebank}
                            required
                            onChange={(e) => setRebank(e.target.value)}
                        />
                    </div>
                    <div className="field-labels1">
                        <div className="re-enter-bank-account-no-wrapper">
                            <div className="re-enter-bank-account">
                                IFSC
                            </div>
                        </div>
                        <input
                            className="field-labels-child"
                            type="text"
                            value={ifsc}
                            required
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    <div className="field-labels1">
                        <div className="re-enter-bank-account-no-wrapper">
                            <div className="re-enter-bank-account">
                                UPI ID (optional)
                            </div>
                        </div>
                        <input className="field-labels-child"
                            type="text"
                            value={upi}
                            onChange={(e) => setUpi(e.target.value)}
                        />
                    </div>
                </div>
            </section>
            <footer className="android-large-20-inner">
                <button className="rectangle-group" onClick={submit}>
                    <div className="rectangle-div" />
                    <div className="send-code-parent">
                        {isLoading ? (
                            <span className="loading-text">Loading...</span>
                        ) : (
                            <>
                                <b className="continue">Continue</b>
                            </>
                        )}
                    </div>
                </button>
            </footer>
        </div>
    );
}

export default BankAccount;
