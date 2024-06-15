import React, { useEffect, useState } from 'react'
import { adhaarDelete, adhaarveri, adhaarverification } from '../../Service/Apis';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function Veriadhaar() {
    const [usersdata, setusersdata] = useState([])
    useEffect(() => {
        datas();
    }, [])
    const datas = async () => {
        try {
            const response = await adhaarveri();
            if (response.status === 200) {
                setusersdata(response.data.result);
            }
        } catch (error) {
            toast.error('Failed to fetch data');
        }
    };

    const verifys = async (id) => {
        try {
            const response = await adhaarverification({ user: id });
            if (response.status === 200) {
                toast.success('User verified successfully');
                datas(); // Refresh data without reloading
            } else {
                toast.error('Failed to verify user');
            }
        } catch (error) {
            toast.error('Failed to verify user');
        }
    };

    const Deletes = async (id) => {
        try {
            const response = await adhaarDelete({ user: id });
            if (response.status === 200) {
                toast.success('User deleted successfully');
                datas(); // Refresh data without reloading
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    return (
        <div>
            <h1>Veriadhaar</h1>
            <table>
                <thead>
                    <tr>
                        <th>Aadhaar Front</th>
                        <th>Aadhaar Back</th>
                        <th>Date of Birth</th>
                        <th>PAN Number</th>
                        <th>User ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {usersdata.map(user => (
                        <tr key={user._id}>
                            <td>
                                <img src={`${axios.defaults.baseURL}/${user.aadhaarFront}`} alt="Aadhaar Front" width="100" />
                            </td>
                            <td>
                                <img src={`${axios.defaults.baseURL}/${user.aadhaarBack}`} alt="Aadhaar Back" width="100" />
                            </td>
                            <td>{user.dob}</td>
                            <td>{user.panNumber}</td>
                            <td>{user.user}</td>
                            <td>
                                <button onClick={() => verifys(user.user)}>Verify</button>
                                <button onClick={() => Deletes(user.user)}>Delete</button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>)
}

export default Veriadhaar