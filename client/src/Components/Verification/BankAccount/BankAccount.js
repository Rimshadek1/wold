import React, { useContext, useState } from 'react'
import './Bankaccount.css'
import { UserContext } from '../../../UserContext/userContext';
import { useNavigate, useParams } from 'react-router';
import { bankDetails } from '../../../Service/Apis';
import { toast } from 'react-toastify';
function BankAccount() {
    const [bank, setBank] = useState();
    const [rebank, setRebank] = useState();
    const [ifsc, setIfsc] = useState();
    const [upi, setUpi] = useState('');
    const { userData } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const submit = async () => {
        if (bank !== rebank) {
            toast.error('Bank account numbers do not match');
            return;
        }
        const data = {
            bank, rebank, ifsc, upi, user: userData.id, id
        };
        const response = await bankDetails(data);
        if (response.status === 200) {
            navigate('/adhaarverification');
        } else {
            toast.error(response.data.error);
        }
    };
    const goBack = (e) => {
        e.preventDefault();
        navigate(-1)

    }
    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') {
            // Remove the last character from the input value
            setIfsc((prevIfsc) => prevIfsc.slice(0, -1));
        } else {
            // Convert the entered key to uppercase and append it to the input value
            const uppercaseKey = e.key.toUpperCase();
            setIfsc((prevIfsc) => prevIfsc + uppercaseKey);
        }
    };
    return (
        <div className="bankaccount">
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
                            // onChange={(e) => setIfsc(e.target.value.toUpperCase())} 
                            value={ifsc}
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
                            onChange={(e) => setUpi(e.target.value)}
                        />
                    </div>
                </div>
            </section>
            <footer className="android-large-20-inner">
                <button className="rectangle-group" onClick={submit}>
                    <div className="rectangle-div" />
                    <div className="send-code-parent">
                        <div className="send-code">Send code</div>
                        <div className="frame-child1" />
                        <b className="continue">Continue</b>
                    </div>
                </button>
            </footer>
        </div>
    )
}

export default BankAccount