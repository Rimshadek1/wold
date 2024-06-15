import React from 'react'
import './Adhaarveri.css'
import { Link } from 'react-router-dom'
function Adhaarveri() {
    return (
        <div className="adhaar">
            <section className="frame-parent">
                <div className="frame-wrapper">
                    <div className="upload-your-aadhaar-parent">
                        <div className="upload-your-aadhaar">Upload your Aadhaar</div>
                        <div className="in-order-to-register-you-as-th-wrapper">
                            <p className="in-order-to">{`In order to register you as the legal owner of each comodity, we require you to upload your aadhaar card for verification of your identity `}</p>
                        </div>
                    </div>
                </div>
                <img
                    className="aadhar-article-1"
                    loading="lazy"
                    alt=""
                    src="/Adhaarveri/aadhar-article-1@2x.png"
                />
            </section>
            <div className="android-large-15-inner">
                <div className="frame-group">
                    <div className="frame-container">
                        <Link to="/adhaarpan" className="rectangle-parent">
                            <div className="frame-child" />
                            <b className="upload-adhaar">Upload Adhaar</b>
                        </Link>
                    </div>
                </div>
            </div>
        </div>)
}

export default Adhaarveri