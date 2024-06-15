import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loadingpage from "./Components/Loadingpagr/Loadingpage";
import Logorsin from "./Components/LoginorSin/Logorsin";
import Signup from "./Components/Singnup/Signup";
import Emailotp from "./Components/Emailotp/Emailotp";
import Password from "./Components/Password/Password";
import Forgetpassword from "./Components/Forgetpassword/Forgetpassword";
import Resetpassword from "./Components/Forgetpassword/Resetpassword/Resetpassword";
import Newpassword from "./Components/Forgetpassword/Newpassword/Newpassword";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import Portfolio from "./Components/Portfolio/Portfolio";
import Wallet from "./Components/Wallet/Wallet";
import Profile from "./Components/Profile/Profile";
import Inprofile from "./Components/Profile/Inprofile/Inprofile";
import Tradedetails from "./Components/Tradedetails/Tradedetails";
import Invest from "./Components/Invest/Invest";
import axios from "axios";
import Funded from "./Components/Home/Funded/Funded";
import Exited from "./Components/Home/Exited/Exited";
import Dashbord from "./Adminpanel/Dashboard/Dashbord";
import Addtrade from "./Adminpanel/Addtrade/Addtrade";
import Addcashwallet from "./Components/Wallet/Addcash/Addcashwallet";
import UserContextProvider from "./UserContext/userContext";
import Withdrawcashwallet from "./Components/Wallet/Withdrawcashwallet/Withdrawcashwallet";
import { WalletProvider } from "./UserContext/WalletContext";
import Mobileverification from "./Components/Verification/MobileVerification/Mobileverification";
import Mobileotp from "./Components/Verification/MobileVerification/Mobileotp";
import BankAccount from "./Components/Verification/BankAccount/BankAccount";
import Adhaarveri from "./Components/Verification/Adhaarverificatoin/Adhaarveri";
import Adhaarpan from "./Components/Verification/Adhaarverificatoin/Adhaarpan";
import Addprofit from "./Adminpanel/Addprofit/Addprofit";
import Veriadhaar from "./Adminpanel/Verify/Veriadhaar";
import OwnerDash from "./Investment/OwnerDashboard/OwnerDash";
import Compareinvest from "./Investment/CompareInvest/Compareinvest";
import InvestCode from "./Investment/Investcode/InvestCode";
import Invested from "./Investment/Invested/Invested";
import Investcodes from "./Adminpanel/Investcodes/Investcodes";
import Editinvestprice from "./Adminpanel/Editinvestprice/Editinvestprice";
import WithdrawRequets from "./Adminpanel/WIthdrawRequest/WithdrawRequets";
function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = 'http://localhost:3001';
  return (
    <UserContextProvider>
      <WalletProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Loadingpage />} />
            <Route path="/logsin" element={<Logorsin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/emailotp/:id" element={<Emailotp />} />
            <Route path="/password/:id" element={<Password />} />
            <Route path="/forgetpassword" element={<Forgetpassword />} />
            <Route path="/resetpassword/:id" element={<Resetpassword />} />
            <Route path="/newpassword/:id" element={<Newpassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/funded" element={<Funded />} />
            <Route path="/exited" element={<Exited />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/inprofile" element={<Inprofile />} />
            <Route path="/tradedetails/:id" element={<Tradedetails />} />
            <Route path="/invest/:id" element={<Invest />} />
            <Route path="/dashboard" element={<Dashbord />} />
            <Route path="/addtrade" element={<Addtrade />} />
            <Route path="/addprofit/:id" element={<Addprofit />} />
            <Route path="/addcashwallet" element={<Addcashwallet />} />
            <Route path="/withdrawcashwallet" element={<Withdrawcashwallet />} />
            <Route path="/mobileverification" element={<Mobileverification />} />
            <Route path="/mobileotp/:id" element={<Mobileotp />} />
            <Route path="/bankaccount/:id" element={<BankAccount />} />
            <Route path="/adhaarverification" element={<Adhaarveri />} />
            <Route path="/adhaarpan" element={<Adhaarpan />} />
            <Route path="/verifyadhaar" element={<Veriadhaar />} />
            <Route path="/ownerdash" element={<OwnerDash />} />
            <Route path="/compareinvest" element={<Compareinvest />} />
            <Route path="/investcode" element={<InvestCode />} />
            <Route path="/editinvestprice" element={<Editinvestprice />} />
            <Route path="/invested" element={<Invested />} />
            <Route path="/investcodes" element={<Investcodes />} />
            <Route path="/withdrawrequest" element={<WithdrawRequets />} />

          </Routes>
        </BrowserRouter>
      </WalletProvider>
    </UserContextProvider>

  );
}

export default App;
