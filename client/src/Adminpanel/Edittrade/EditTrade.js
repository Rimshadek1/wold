import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getThisTrade, updateTrade } from '../../Service/Apis';
import { toast, ToastContainer } from 'react-toastify';
import './EditTrade.css'
import { UserContext } from '../../UserContext/userContext';
function EditTrade() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    //forms
    const [nameOfTrade, setNameOftrade] = useState("");
    const [departurePortCountry, setDeparturePortCountry] = useState("");
    const [arrivalPortCountry, setArrivalPortCountry] = useState("");
    const [orderNumber, setOrderNumber] = useState("");
    const [containerFoot, setContainerFoot] = useState("");
    const [companyemail, setCompanyemail] = useState("");
    const [nameOfCompany, setNameOfCompany] = useState("");
    const [companytrust, setCompanytrust] = useState("");
    const [expectedDateOfIncome, setExpectedDateOfIncome] = useState("");
    const [returnOnInvestment, setReturnOnInvestment] = useState("");
    const [lastFundingDate, setLastFundingDate] = useState("");
    const [expectedFreightDeparture, setExpectedFreightDeparture] = useState("");
    const [expectedArrival, setExpectedArrival] = useState("");
    const [depositOfProfit, setDepositOfProfit] = useState("");
    const [totalCIFPrice, setTotalCIFPrice] = useState("");
    const [totalShares, setTotalShares] = useState("");
    const [sharesAvailable, setSharesAvailable] = useState("");
    const [productImage, setProductImage] = useState(null);
    const [investorMemoPort, setInvestorMemoPort] = useState(null);
    const [logochange, setLogoChange] = useState(null);




    useEffect(() => {
        fetchTradeData();
        fetchCountries();
    }, []);

    const fetchTradeData = async () => {
        try {
            const response = await getThisTrade(id);
            if (response.status === 200) {
                const trade = response.data.existingTrade;
                setNameOftrade(trade.nameOfTrade);
                setDeparturePortCountry(trade.departurePortCountry);
                setArrivalPortCountry(trade.arrivalPortCountry);
                setOrderNumber(trade.orderNumber);
                setContainerFoot(trade.containerFoot);
                setCompanyemail(trade.companyemail);
                setNameOfCompany(trade.nameOfCompany);
                setCompanytrust(trade.companytrust);
                setExpectedDateOfIncome(trade.expectedDateOfIncome);
                setReturnOnInvestment(trade.returnOnInvestment);
                setLastFundingDate(trade.lastFundingDate);
                setExpectedFreightDeparture(trade.expectedFreightDeparture);
                setExpectedArrival(trade.expectedArrival);
                setDepositOfProfit(trade.depositOfProfit);
                setTotalCIFPrice(trade.totalCIFPrice);
                setTotalShares(trade.totalShares);
                setSharesAvailable(trade.sharesAvailable);
            } else {
                toast.error('Failed to fetch trade data');
            }
        } catch (error) {
            console.error('Error fetching trade:', error);
            toast.error('Error fetching trade data');
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await fetch('https://restcountries.com/v2/all');
            if (!response.ok) {
                throw new Error(`Failed to fetch countries: ${response.status}`);
            }
            const data = await response.json();
            setCountries(data.map((country) => country.alpha2Code));
        } catch (error) {
            console.error('Error fetching countries:', error);
            setError('Failed to fetch countries. Please check your internet connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProductImage(file);
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        setInvestorMemoPort(file);
    };
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogoChange(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('id', id);
        formData.append('nameOfTrade', nameOfTrade);
        formData.append('departurePortCountry', departurePortCountry);
        formData.append('arrivalPortCountry', arrivalPortCountry);
        formData.append('orderNumber', orderNumber);
        formData.append('containerFoot', containerFoot);
        formData.append('companytrust', companytrust);
        formData.append('companyemail', companyemail);
        formData.append('nameOfCompany', nameOfCompany);
        formData.append('expectedDateOfIncome', expectedDateOfIncome);
        formData.append('returnOnInvestment', returnOnInvestment);
        formData.append('lastFundingDate', lastFundingDate);
        formData.append('expectedFreightDeparture', expectedFreightDeparture);
        formData.append('expectedArrival', expectedArrival);
        formData.append('depositOfProfit', depositOfProfit);
        formData.append('totalCIFPrice', totalCIFPrice);
        formData.append('totalShares', totalShares);
        formData.append('sharesAvailable', sharesAvailable);
        if (productImage) {
            formData.append('productImage', productImage);
        }
        if (investorMemoPort) {
            formData.append('investorMemoPort', investorMemoPort);
        }
        if (logochange) {
            formData.append('logochange', logochange);
        }
        try {
            const response = await updateTrade(formData);
            if (response.status === 200) {
                toast.success('Trade updated successfully');
                navigate('/dashboard');
            } else {
                toast.error('Failed to update trade');
            }
        } catch (error) {
            console.error('Error updating trade:', error);
            toast.error('Error updating trade');
        }
    };
    const { userData } = useContext(UserContext);

    if (userData.role !== "admin") { return (<>You are not admin </>) }
    return (
        <div className="edittrade-container">
            <h2>Edit Trade</h2>
            {isLoading && <p>Loading countries...</p>}
            {error && <p className="error-message">{error}</p>}
            {countries.length > 0 && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nameOfTrade">Name of Trade:</label>
                        <input
                            type="text"
                            id="nameOfTrade"
                            name="nameOfTrade"
                            value={nameOfTrade || ''}
                            onChange={(e) => setNameOftrade(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nameOfCompany">Name of Company:</label>
                        <input
                            type="text"
                            id="nameOfCompany"
                            name="nameOfCompany"
                            value={nameOfCompany || ''}
                            onChange={(e) => setNameOfCompany(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="companyemail">Company Email</label>
                        <input
                            type="text"
                            id="companyemail"
                            name="companyemail"
                            value={companyemail || ''}
                            onChange={(e) => setCompanyemail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="companytrust">Company trust</label>
                        <select
                            id="companytrust"
                            name="companytrust"
                            value={companytrust || ''}
                            onChange={(e) => setCompanytrust(e.target.value)}
                            required
                        >
                            <option value="">Select</option>
                            <option value="20">Trusted</option>
                            <option value="40">Not trusted</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="departurePortCountry">Departure Port Country:</label>
                        <select
                            id="departurePortCountry"
                            name="departurePortCountry"
                            value={departurePortCountry || ''}
                            onChange={(e) => setDeparturePortCountry(e.target.value)}
                            required
                        >
                            <option value="">Select</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="arrivalPortCountry">Arrival Port Country:</label>
                        <select
                            id="arrivalPortCountry"
                            name="arrivalPortCountry"
                            value={arrivalPortCountry || ''}
                            onChange={(e) => setArrivalPortCountry(e.target.value)}
                            required
                        >
                            <option value="">Select</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="orderNumber">Order Number:</label>
                        <input
                            type="text"
                            id="orderNumber"
                            name="orderNumber"
                            value={orderNumber || ''}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="containerFoot">Container Foot (20 or 40):</label>
                        <select
                            id="containerFoot"
                            name="containerFoot"
                            value={containerFoot || ''}
                            onChange={(e) => setContainerFoot(e.target.value)}
                            required
                        >
                            <option value="">Select</option>
                            <option value="20">20</option>
                            <option value="40">40</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="expectedDateOfIncome">Expected Date of Income:</label>
                        <input
                            type="date"
                            id="expectedDateOfIncome"
                            name="expectedDateOfIncome"
                            value={expectedDateOfIncome || ''}
                            onChange={(e) => setExpectedDateOfIncome(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="returnOnInvestment">Return on Investment:</label>
                        <input
                            type="number"
                            id="returnOnInvestment"
                            name="returnOnInvestment"
                            value={returnOnInvestment || ''}
                            onChange={(e) => setReturnOnInvestment(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastFundingDate">Last Funding Date:</label>
                        <input
                            type="date"
                            id="lastFundingDate"
                            name="lastFundingDate"
                            value={lastFundingDate || ''}
                            onChange={(e) => setLastFundingDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expectedFreightDeparture">Expected Freight Departure:</label>
                        <input
                            type="date"
                            id="expectedFreightDeparture"
                            name="expectedFreightDeparture"
                            value={expectedFreightDeparture || ''}
                            onChange={(e) => setExpectedFreightDeparture(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expectedArrival">Expected Arrival:</label>
                        <input
                            type="date"
                            id="expectedArrival"
                            name="expectedArrival"
                            value={expectedArrival || ''}
                            onChange={(e) => setExpectedArrival(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="depositOfProfit">Deposit of Profit:</label>
                        <input
                            type="date"
                            id="depositOfProfit"
                            name="depositOfProfit"
                            value={depositOfProfit || ''}
                            onChange={(e) => setDepositOfProfit(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="totalCIFPrice">Total CIF Price of Container:</label>
                        <input
                            type="number"
                            id="totalCIFPrice"
                            name="totalCIFPrice"
                            value={totalCIFPrice || ''}
                            onChange={(e) => setTotalCIFPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="totalShares">Total Shares:</label>
                        <input
                            type="number"
                            id="totalShares"
                            name="totalShares"
                            value={totalShares || ''}
                            onChange={(e) => setTotalShares(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="sharesAvailable">Shares Available:</label>
                        <input
                            type="number"
                            id="sharesAvailable"
                            name="sharesAvailable"
                            value={sharesAvailable || ''}
                            onChange={(e) => setSharesAvailable(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="productImage">Image of Product:</label>
                        <input
                            type="file"
                            id="productImage"
                            name="productImage"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="investorMemoPort">Investor Memo Port (PDF):</label>
                        <input
                            type="file"
                            id="investorMemoPort"
                            name="investorMemoPort"
                            accept="application/pdf"
                            onChange={handlePdfChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="companyLogo">Company Logo</label>
                        <input
                            type="file"
                            id="companyLogo"
                            name="companyLogo"
                            accept="image/*"
                            onChange={handleLogoChange}
                        />
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            )}
            <ToastContainer />
        </div>
    );
}

export default EditTrade;
