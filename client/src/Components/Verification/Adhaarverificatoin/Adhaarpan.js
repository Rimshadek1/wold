import React, { useContext, useRef, useState } from 'react';
import './AdhaarPan.css';
import { detailsAdhaar } from '../../../Service/Apis';
import { UserContext } from '../../../UserContext/userContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Adhaarpan() {
    const navigate = useNavigate();

    const frontFileInputRef = useRef(null);
    const backFileInputRef = useRef(null);

    const [isFrontFileUploaded, setIsFrontFileUploaded] = useState(false);
    const [isBackFileUploaded, setIsBackFileUploaded] = useState(false);
    const [frontFile, setFrontFile] = useState(null);
    const [backFile, setBackFile] = useState(null);
    const [panNumber, setPanNumber] = useState('');
    const [dob, setDob] = useState('');
    const { userData } = useContext(UserContext);

    const handleDivClick = (inputRef) => {
        inputRef.current.click();
    };

    const handleFileChange = (event, setFile, setIsFileUploaded) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setFile(file);
            setIsFileUploaded(true);
        } else {
            toast.error('Only .jpg, .jpeg, and .png files are allowed.');
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!frontFile) {
            toast.error('Aadhaar front upload is required.');
            return;
        }
        if (!backFile) {
            toast.error('Aadhaar back upload is required.');
            return;
        }

        const formData = new FormData();
        formData.append('aadhaarFront', frontFile);
        formData.append('aadhaarBack', backFile);
        formData.append('panNumber', panNumber);
        formData.append('dob', dob);
        formData.append('user', userData.id);

        try {
            const response = await detailsAdhaar(formData);
            if (response.status === 200) {
                toast.success('Files uploaded successfully');
                localStorage.clear();
                navigate('/logsin');
            } else {
                toast.error('File upload failed');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while uploading files');
        }
    };
    if (userData.role !== "verified" && userData.role !== "verifying" && userData.role !== "unverified") {
        return (<>Please login</>);
    }

    return (
        <div className="adhaarpan">
            <ToastContainer />
            <div className="upload-your-aadhaar-wrapper">
                <div className="upload-your-aadhaar">Upload your Aadhaar</div>
            </div>
            <section className="frame-parent">
                <div className="rectangle-parent">
                    <div className="frame-child" />
                    <div className="frame-wrapper">
                        <div className="frame-group">
                            <img
                                className="frame-item"
                                loading="lazy"
                                alt=""
                                src="/Adhaarveri/group-8801.svg"
                            />
                            <div className="aadhaar-front-upload-wrapper">
                                <div className="aadhaar-front-upload">Aadhaar front upload</div>
                            </div>
                        </div>
                    </div>
                    <div className="div" onClick={() => handleDivClick(frontFileInputRef)}>
                        {isFrontFileUploaded ? <span style={{ color: 'green' }}>✔</span> : '+'}
                    </div>
                    <input
                        type="file"
                        ref={frontFileInputRef}
                        style={{ display: 'none', width: "100%" }}
                        accept="image/jpeg, image/png"
                        onChange={(event) => handleFileChange(event, setFrontFile, setIsFrontFileUploaded)}
                    />
                </div>

                <div className="frame-container">
                    <div className="rectangle-group">
                        <div className="frame-inner" />
                        <div className="frame-div">
                            <div className="frame-parent1">
                                <img
                                    className="group-icon"
                                    loading="lazy"
                                    alt=""
                                    src="/Adhaarveri/group-8801.svg"
                                />
                                <div className="aadhaar-back-upload-wrapper">
                                    <div className="aadhaar-back-upload">Aadhaar Back upload</div>
                                </div>
                            </div>
                        </div>
                        <div className="div1" onClick={() => handleDivClick(backFileInputRef)}>
                            {isBackFileUploaded ? <span style={{ color: 'green' }}>✔</span> : '+'}
                        </div>
                        <input
                            type="file"
                            ref={backFileInputRef}
                            style={{ display: 'none' }}
                            accept="image/jpeg, image/png"
                            onChange={(event) => handleFileChange(event, setBackFile, setIsBackFileUploaded)}
                        />
                    </div>
                </div>

                <div className="frame-parent2">
                    <div className="enter-your-dob-wrapper">
                        <div className="enter-your-dob">Enter your PAN number</div>
                    </div>
                    <input className="group-input" type="text" value={panNumber} onChange={(e) => setPanNumber(e.target.value)} />
                </div>
                <div className="frame-parent2">
                    <div className="enter-your-dob-wrapper">
                        <div className="enter-your-dob">Enter your DOB</div>
                    </div>
                    <input className="group-input" type="date" onChange={(e) => setDob(e.target.value)} />
                </div>
            </section>
            <div className="android-large-19-inner">
                <div className="frame-parent3">
                    <div className="frame-wrapper1">
                        <button className="rectangle-container" onClick={handleFormSubmit}>
                            <div className="rectangle-div" />
                            <b className="verify">Verify</b>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Adhaarpan;
