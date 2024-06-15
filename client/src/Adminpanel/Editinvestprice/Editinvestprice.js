import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { pupdate10, viewpupdate10 } from '../../Service/Apis';

function Editinvestprice() {
    const [p10, setP10] = useState('');
    const [existing10, setExisting10] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await viewpupdate10();
                if (response.status === 200 && response.data.tenpercentage.length > 0) {
                    const updated10percentage = response.data.tenpercentage[0].updated10percentage;
                    setExisting10(updated10percentage);
                } else {
                    setExisting10(''); // Set to empty string if no data available
                    alert('Failed to fetch trade profit or no data available');
                }
            } catch (error) {
                console.error('Error fetching user role or trade profit:', error);
                alert('Failed to fetch trade profit');
            }
        };

        fetchData();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            p10: p10
        };
        try {
            const response = await pupdate10(data);
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
                        placeholder={existing10 ? `You set your profit as ${existing10}` : 'Set your profit'}
                        required
                        value={p10}
                        onChange={(e) => setP10(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
            </form >
        </div>
    )
}

export default Editinvestprice