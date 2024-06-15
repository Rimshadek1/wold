import { Link, useNavigate } from 'react-router-dom'
import './profile.css'
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext/userContext';
import { profileGet } from '../../Service/Apis';
import axios from 'axios';
function Profile() {
    const navigate = useNavigate();
    const { userData } = useContext(UserContext);
    const [dp, setDp] = useState({});
    const goBack = (e) => {
        e.preventDefault();
        navigate(-1)

    }
    const logOut = (e) => {
        e.preventDefault();
        localStorage.clear();
        navigate('/logsin');

    }
    useEffect(() => {
        dps()
    }, []);
    const dps = async () => {
        try {
            const response = await profileGet(userData.id);
            if (response.status === 200) {
                setDp(response.data);
                dps();
            } else {
                alert("dp not loaded");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            alert("Error fetching profile");
        }
    };

    return (
        <div className="profile">
            <main className="android-large-13">
                <section className="rectangle-parent">
                    <div className="frame-child" />
                    <div className="frame-parent">
                        <div className="vector-wrapper" onClick={goBack}>
                            <img
                                className="vector-icon"
                                loading="lazy"
                                alt=""
                                src="/profile/Vectorleft.svg"
                            />
                        </div>
                        <h3 className="profile">Profile</h3>
                    </div>
                    <div className="frame-wrapper">
                        <Link to='/inprofile' className="frame-group">
                            <div className="frame-container">
                                <div className="ellipse-wrapper">
                                    {dp && dp.profilepicture ? (
                                        <img
                                            className="frame-item"
                                            loading="lazy"
                                            alt=""
                                            src={`${axios.defaults.baseURL}/${dp.profilepicture}`}
                                        />
                                    ) : (
                                        <img
                                            className="frame-item"
                                            loading="lazy"
                                            alt=""
                                            src="/inprofile/ellipse-187@2x.png"
                                        />
                                    )}
                                </div>
                                <div className="sinan-abdulatif-parent">
                                    <div
                                        className="sinan-abdulatif"
                                    >
                                        {userData.name}
                                    </div>
                                    <div className="your-account-and-details-wrapper">
                                        <div className="your-account-and">
                                            Your account and details
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="vector-container">
                                <img
                                    className="vector-icon1"
                                    loading="lazy"
                                    alt="img"
                                    src="/profile/Ellipse-8.svg"
                                />
                            </div>
                        </Link>
                    </div>
                </section>
                <section className="android-large-13-inner">
                    <div className="frame-div">

                        <div className="frame-parent1">
                            <div className="frame-child2" />
                            <div className="frame-parent2">
                                <div className="frame-parent3">
                                    <div className="frame-parent4">
                                        <div className="vector-frame">
                                            <img
                                                className="vector-icon2"
                                                loading="lazy"
                                                alt=""
                                                src="/profile/settings.svg"
                                            />
                                        </div>
                                        <div className="settings">Settings</div>
                                    </div>
                                    <div className="frame-parent5">
                                        <div className="vector-wrapper1">
                                            <img
                                                className="vector-icon3"
                                                loading="lazy"
                                                alt=""
                                                src="/profile/terms.svg"
                                            />
                                        </div>
                                        <div className="term-conditions">{`Term & Conditions`}</div>
                                    </div>
                                </div>
                                <div className="frame-wrapper3">
                                    <div className="vector-parent">
                                        <img
                                            className="vector-icon4"
                                            loading="lazy"
                                            alt=""
                                            src="/profile/right.svg"
                                        />
                                        <img
                                            className="vector-icon5"
                                            loading="lazy"
                                            alt=""
                                            src="/profile/right.svg"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="android-large-13-child">
                    <div className="rectangle-container">
                        <div className="rectangle-div" />
                        <a href="mailto:woldinvests@gmail.com" className="frame-parent6">
                            <div className="frame-parent7">
                                <div className="vector-wrapper2">
                                    <img
                                        className="vector-icon6"
                                        loading="lazy"
                                        alt=""
                                        src="/profile/email.svg"
                                    />
                                </div>
                                <div className="email">Email</div>
                            </div>
                            <div className="vector-wrapper3">
                                <img
                                    className="vector-icon7"
                                    loading="lazy"
                                    alt=""
                                    src="/profile/right.svg"
                                />
                            </div>
                        </a>
                        <Link to="https://wa.me/+918714122257?text=I%20am%20looking%20to%20invest%20in%20world" className="frame-parent8">
                            <div className="frame-parent9">
                                <div className="vector-wrapper4">
                                    <img
                                        className="vector-icon8"
                                        loading="lazy"
                                        alt=""
                                        src="/profile/whatsapp.svg"
                                    />
                                </div>
                                <div className="whatsapp-us">Whatsapp us</div>
                            </div>
                            <div className="vector-wrapper5">
                                <img
                                    className="vector-icon9"
                                    loading="lazy"
                                    alt=""
                                    src="/profile/right.svg"
                                />
                            </div>
                </Link>
                    </div>
            </section >
            <section className="frame-section">
                <div className="frame-parent10">
                    <button className="frame-button">
                        <div className="frame-child3" />
                        <div className="frame-wrapper4">
                            <img className="group-icon" alt="" src="/profile/academy.svg" />
                        </div>
                        <div className="wold-academy-wrapper">
                            <div className="wold-academy">Wold academy</div>
                        </div>
                        <img className="vector-icon10" alt="" src="/profile/right.svg" />
                    </button>
                    <button className="rectangle-parent1">
                        <div className="frame-child4" />
                        <img className="icon-earth" alt="" src="/profile/earth.svg" />
                        <div className="exporter-portel-wrapper">
                            <div className="exporter-portel">Exporter Portel</div>
                        </div>
                        <img className="vector-icon11" alt="" src="/profile/right.svg" />
                    </button>
                    <Link to="/ownerdash" className="rectangle-parent2">
                        <div className="frame-child5" />
                        <div className="frame-parent11">
                            <div className="frame-wrapper5">
                                <div className="vector-group">
                                    <img
                                        className="vector-icon12"
                                        alt=""
                                        src="/profile/w.svg"
                                    />
                                    <img
                                        className="vector-icon13"
                                        loading="lazy"
                                        alt=""
                                        src="/profile/d.svg"
                                    />
                                    <img
                                        className="vector-icon14"
                                        loading="lazy"
                                        alt=""
                                        src="/profile/0.svg"
                                    />
                                    <img
                                        className="vector-icon15"
                                        loading="lazy"
                                        alt=""
                                        src="/profile/l.svg"
                                    />
                                    <img
                                        className="vector-icon16"
                                        loading="lazy"
                                        alt=""
                                        src="/profile/o.svg"
                                    />
                                    <img
                                        className="vector-icon17"
                                        loading="lazy"
                                        alt=""
                                        src="/profile/vector-17.svg"
                                    />
                                </div>
                            </div>
                            <div className="owners">Owners</div>
                        </div>
                        <div className="frame-wrapper6">
                            <img
                                className="frame-child6"
                                loading="lazy"
                                alt=""
                                src="/profile/right.svg"
                            />
                        </div>
                    </Link>
                    <button className="rectangle-parent1" onClick={logOut}>
                        <div className="frame-child4" />
                        <i class="fa-solid fa-right-from-bracket"></i>
                        <div className="exporter-portel-wrapper">
                            <div className="exporter-portel">Logout</div>
                        </div>
                        <img className="vector-icon11" alt="" src="/profile/right.svg" />
                    </button>
                </div>
            </section >
        </main >

        </div >
    )
}

export default Profile