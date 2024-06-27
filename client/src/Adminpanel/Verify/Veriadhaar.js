import React, { useContext, useEffect, useState } from 'react'
import { adhaarDelete, adhaarveri, adhaarverification } from '../../Service/Apis';
import { toast, ToastContainer } from 'react-toastify';
import { UserContext } from '../../UserContext/userContext';

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
                datas();
            }
        } catch (error) {
            toast.error('Failed to verify user');
            datas();
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
            toast.error('Failed to delete user', error.response.data.message);
        }
    };
    const { userData } = useContext(UserContext);

    if (userData.role !== "admin") { return (<>You are not admin </>) }
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
                        <th>Mobile Number</th>
                        <th>fullName</th>
                        <th>A/c no.</th>
                        <th>IFSC</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {usersdata.map(user => (
                        <tr key={user._id}>
                            <td>
                                <img src={user.aadhaarFront} alt="Aadhaar Front" width="100" />
                            </td>
                            <td>
                                <img src={user.aadhaarBack} alt="Aadhaar Back" width="100" />
                            </td>
                            <td>{user.dob ? user.dob : "not mention"}</td>
                            <td>{user.panNumber ? user.panNumber : "not mention"}</td>
                            <td>{user.mobile}</td>
                            <td>{user.fullName}</td>
                            <td>{user.bank}</td>
                            <td>{user.ifsc}</td>
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