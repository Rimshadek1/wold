import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { tradeProfit, viewTradeProfit } from '../../Service/Apis';

function Addprofit() {
    const { id } = useParams();
    const [tradeProfits, setTradeProfit] = useState('');
    const [existingTradeProfit, setExistingTradeProfit] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await viewTradeProfit(id);
                if (response.status === 200) {
                    setExistingTradeProfit(response.data.existingTradeProfit.tradeProfit);
                } else {
                    alert('Failed to fetch trade profit');
                }
            } catch (error) {
                console.error('Error fetching user role or trade profit:', error);
                alert('Please add trade profit');
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            productId: id,
            tradeProfit: tradeProfits
        };
        try {
            const response = await tradeProfit(data);
            if (response.status === 200) {
                alert('Trade profit updated successfully');
                navigate('/dashboard');
            } else {
                alert('Failed to update trade profit');
            }
        } catch (error) {
            console.error('Error updating trade profit:', error);
            alert('Failed to update trade profit');
        }
    };

    return (
        <div className="addtrade-container">
            <h2>Add Trade</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nameOfTrade">Name of Trade:</label>
                    <input
                        type="text"
                        id="nameOfTrade"
                        name="nameOfTrade"
                        placeholder={existingTradeProfit ? `You set your profit as ${existingTradeProfit}` : 'Set your profit'}
                        required
                        value={tradeProfits}
                        onChange={(e) => setTradeProfit(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
            </form >
        </div>
    )
}

export default Addprofit