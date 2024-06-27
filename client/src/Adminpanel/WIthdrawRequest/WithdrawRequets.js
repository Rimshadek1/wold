import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
// import { UserContext } from '../../UserContext/userContext';
import { acceptWithdrawal, deleteWithdrawal, getWithdrwalRequest } from '../../Service/Apis';
import { toast } from 'react-toastify';
import { UserContext } from '../../UserContext/userContext';

function WithdrawRequets() {
    const [withdraw, setWithdraw] = useState();
    const navigate = useNavigate();
    // const { userData } = useContext(UserContext);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await getWithdrwalRequest();
            if (response.status === 200) {
                const withdrawArray = Array.isArray(response.data?.data)
                    ? response.data.data
                    : [response.data?.data];
                setWithdraw(withdrawArray);
            } else {
                toast.error('Request failed');
            }
        } catch (error) {
            console.error('Error fetching withdrawal requests:', error);
            toast.error('An error occurred while fetching withdrawal requests');
        }
    };

    const handleAccept = async (trade) => {
        try {
            const data = {
                trade
            };
            const response = await acceptWithdrawal(data);

            if (response.status === 200) {
                toast.success('Withdrawal request processed successfully!');
                fetchData(); // Fetch withdrawal requests again after successful acceptance
            } else {
                toast.error('Acceptance failed');
            }
        } catch (error) {
            console.error('Error accepting withdrawal request:', error);
            toast.error('An error occurred while accepting withdrawal request');
        }
    };
    const handleDelete = async (trade) => {
        try {
            const data = {
                trade
            };
            const response = await deleteWithdrawal(data);

            if (response.status === 200) {
                toast.success('Withdrawal deleted successfully!');
                fetchData(); // Fetch withdrawal requests again after successful acceptance
            } else {
                toast.error('Acceptance failed');
            }
        } catch (error) {
            console.error('Error accepting withdrawal request:', error);
            toast.error('An error occurred while accepting withdrawal request');
        }
    };
    const { userData } = useContext(UserContext);

    if (userData.role !== "admin") { return (<>You are not admin </>) }
    return (
        <div>
            <h1>WithdrawRequets</h1>
            <table>
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">Username</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Request</th>
                        <th scope="col">A/c Number</th>
                        <th scope="col">IFSC Code</th>
                        <th scope="col">UPI</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(withdraw) && withdraw.length > 0 ? (
                        withdraw.map((trade, index) => (
                            <tr key={trade._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{trade.username}</td>
                                <td>{trade.amount}</td>
                                <td>{trade.request}</td>
                                <td>{trade.bankAccountNumber}</td>
                                <td>{trade.ifscCode}</td>
                                <td>{trade.upi}</td>

                                <td>
                                    <button className="btn btn-primary" onClick={() => handleAccept(trade)}>
                                        Accept
                                    </button>
                                    &nbsp;&nbsp;
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(trade)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No Wiithdrawal request available</td>
                        </tr>
                    )}

                </tbody>
            </table>
        </div>
    )
}

export default WithdrawRequets