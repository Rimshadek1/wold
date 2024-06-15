import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Style.css";
function Loadingpage() {
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Use history.push instead of window.location.replace for non-refreshing navigation
            navigate("/logsin");
            setRedirect(true); // Update state for conditional rendering (optional)
        }, 3000);

        return () => clearTimeout(timeoutId);
    }, []);

    // Conditional rendering to prevent unnecessary UI updates after redirect
    if (redirect) {
        return null; // Prevent rendering after redirect
    }
    return (
        <div className="loading">
            <div className="div">
                <div className="overlap">
                    <img className="vector" alt="Vector" src="img/vector.svg" />
                    <img className="img" alt="Vector" src="img/vector-2.svg" />
                </div>
                <img className="vector-3" alt="Vector" src="img/vector-3.svg" />
                <img className="vector-2" alt="Vector" src="img/vector-4.svg" />
                <div className="overlap-group">
                    <img className="vector-4" alt="Vector" src="img/vector-5.svg" />
                </div>
            </div>
        </div>
    )
}

export default Loadingpage