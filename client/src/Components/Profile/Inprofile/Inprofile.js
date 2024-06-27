import { useNavigate } from 'react-router';
import './inprofile.css'
import { useContext, useEffect, useState } from 'react';
import { profileAdd, profileGet } from '../../../Service/Apis';
import { UserContext } from '../../../UserContext/userContext';
import { toast, ToastContainer } from 'react-toastify';
import LoadingSpinner from '../../Loadingpagr/LoadingSpinner';
function Inprofile() {

    const navigate = useNavigate();
    const { userData } = useContext(UserContext);
    const [dp, setDp] = useState({});
    const [loading, setLoading] = useState(false);

    const goBack = (e) => {
        e.preventDefault();
        setLoading(true);
        navigate(-1);
        setLoading(false);
    }
    const handleImageClick = () => {
        // Trigger file input click when the display picture is clicked
        document.getElementById('fileInput').click();
    };

    const handleFileChange = (e) => {
        // Handle file selection and update the state
        const file = e.target.files[0];
        uploadImage(file);
    };
    const uploadImage = async (imageFile) => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('user', userData.id);

            const response = await profileAdd(formData);
            if (response.status === 200) {
                dps();
            } else {
                console.error('Failed to upload profile picture:', response.data.error);
                toast.error(response.data.error);
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error.message);
            toast.error(error.message);
        }
    }
    useEffect(() => {
        dps()
    }, []);
    const dps = async () => {
        try {
            setLoading(true)
            const response = await profileGet(userData.id);
            if (response.status === 200) {
                setDp(response.data);
                dps()
            } else {
                alert("dp not loaded");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
        setLoading(false)
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="inprofile">

            <section className="frame-parent">
                <div className="rectangle-parent">
                    <div className="frame-child" />
                    <div className="frame-wrapper">
                        <div className="frame-group">
                            <div className="vector-wrapper" onClick={goBack}>
                                <img
                                    className="vector-icon"
                                    loading="lazy"
                                    alt=""
                                    src="/inprofile/vector.svg"

                                />
                            </div>
                            <h3 className="profile">Profile</h3>
                        </div>
                    </div>
                    <div className="frame-container">
                        <div className="ellipse-parent" onClick={handleImageClick}>
                            {dp && dp.profilepicture ? (
                                <img
                                    className="frame-item"
                                    loading="lazy"
                                    alt=""
                                    src={dp.profilepicture}
                                />
                            ) : (
                                <img
                                    className="frame-item"
                                    loading="lazy"
                                    alt=""
                                    src="/inprofile/ellipse-187@2x.png"
                                />
                            )}


                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <div className="frame-div">
                                <div className="sinan-abdulatif-parent">
                                    <div className="sinan-abdulatif">{userData.name}</div>
                                    <div className="wolder-since-may">
                                        Wolder since may 12, 2024
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="frame-wrapper1">
                    <div className="rectangle-group">
                        <div className="frame-inner" />
                        <div className="frame-child1" />
                        <div className="frame-parent1">
                            <div className="vector-frame">
                                <img
                                    className="vector-icon2"
                                    loading="lazy"
                                    alt=""
                                    src="/inprofile/vector-2.svg"
                                />
                            </div>
                            <div className="sinanhithmathgmailcom-parent">
                                <div className="sinanhithmathgmailcom">
                                    {userData.email}
                                </div>
                            </div>
                            <div className="vector-wrapper1">
                                <img
                                    className="vector-icon3"
                                    loading="lazy"
                                    alt=""
                                    src="/inprofile/vector-3.svg"
                                />
                            </div>
                        </div>
                        <div className="frame-parent2">
                            <div className="frame-parent3">
                                <div className="layer-2-wrapper">
                                    <img
                                        className="layer-2-icon"
                                        loading="lazy"
                                        alt=""
                                        src="/inprofile/layer-2.svg"
                                    />
                                </div>
                                <div className="div">+91 {userData.mobile ? userData.mobile : "0000000000"}</div>
                            </div>
                            <div className="vector-wrapper2">
                                <img
                                    className="vector-icon4"
                                    loading="lazy"
                                    alt=""
                                    src="/inprofile/vector-3.svg"
                                />
                            </div>
                        </div>
                        <div className="frame-parent4">
                            <div className="star-icon-parent">
                                <img
                                    className="star-icon"
                                    loading="lazy"
                                    alt=""
                                    src="/inprofile/star-1.svg"
                                />
                                <div className="bank-details">Bank details</div>
                            </div>
                            <div className="vector-wrapper3">
                                <img
                                    className="vector-icon5"
                                    loading="lazy"
                                    alt=""
                                    src="/inprofile/vector-3.svg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </div >
    )
}

export default Inprofile