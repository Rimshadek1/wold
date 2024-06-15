import React, { useState } from 'react'
import { generateCode } from '../../Service/Apis';
import { useNavigate } from 'react-router';

function Investcodes() {
    const [investcode, setInvsetCode] = useState();
    const [email, setEmail] = useState();
    const navigate = useNavigate();


    const handleSubmit = async () => {
        const data = {
            investcode,
            email
        }
        const response = await generateCode(data);
        if (response.status === 200) {
            navigate('/dashboard');
        }
    }
    return (
        <div className="addtrade-container">
            <h2>Set Code</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nameOfTrade">Email to access the code</label>
                    <input
                        type="text"
                        id="nameOfTrade"
                        name="nameOfTrade"
                        placeholder="Email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nameOfTrade">Set your code (six-digit number)</label>
                    <input
                        type="number"
                        id="nameOfTrade"
                        name="nameOfTrade"
                        placeholder="Set your code"
                        pattern="\d{6}" // This enforces the input to be a six-digit number
                        title="Please enter a six-digit number" // This provides a message if the input doesn't match the pattern
                        maxLength="6" // This limits the input length to 6 characters
                        required
                        onChange={(e) => setInvsetCode(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Set code for invest</button>
            </form >

        </div>
    )
}

export default Investcodes