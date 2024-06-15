import React from 'react';
import './logsin.css';
import { Link } from 'react-router-dom';

function Logorsin() {
    return (
        <div className="android-larges">
            <div className="div">
                <div className="overlap">
                    <div className="rectangle" />
                    <div className="group">
                        <img className="img" alt="Rectangle" src="/logsin/rectangle.png" />
                        <img className="rectangle-2" alt="Rectangle" src="/logsin/Rectangle-4.png" />
                        <img className="rectangle-3" alt="Rectangle" src="/logsin/Rectangle-5.png" />
                    </div>
                    <div className="rectangle-4" />
                </div>
                <p className="the-modern-way-for">
                    The modern way for anyone to
                    <br />
                    invest in
                    <br /> Export &amp; Import trade
                </p>
                <Link to="/signup" className="overlap-group">
                    <div className="text-wrapper">Sign up</div>
                </Link>
                <Link to="/login" className="div-wrapper">
                    <div className="text-wrapper-2">Login</div>
                </Link>
                <div className="text-wrapper-3">Explore Trades</div>
            </div>
        </div>
    )
}

export default Logorsin;
