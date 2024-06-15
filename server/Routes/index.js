const express = require("express");
const router = new express.Router();
const userHelper = require("../Helpers/userHelper")
const adminHelper = require("../Helpers/adminHelper")
const multer = require('multer');
const upload = require('../Config/upload');



router.post('/sendmail', userHelper.sendOtpMail);
router.post('/checkotp', userHelper.otpCheck);
router.post('/createuser', userHelper.createUser);
router.post('/loginuser', userHelper.loginUser);
router.get('/gettrade/:id', userHelper.gettrade);
router.post("/postRequestAddMoney", userHelper.postRequestAddMoney);
router.post("/verifyPayment", userHelper.verifyPayment);
router.post("/withdrawRequest", userHelper.withdrawRequest);
router.get("/usertransaction/:id", userHelper.userTransactions);
router.post("/purchase", userHelper.purchase);
router.get("/portfolioValue/:id", userHelper.portfolioValue);
router.post("/mobileOtpSent", userHelper.mobileOtpSent);
router.post("/mobileotpveri", userHelper.mobileotpveri);
router.post("/bankDetails", userHelper.bankDetails);
router.post("/detailsAdhaar", upload.fields([{ name: 'aadhaarFront' }, { name: 'aadhaarBack' }]), userHelper.detailsAdhaar);
router.post("/profileAdd", upload.fields([{ name: 'image' }]), userHelper.profileAdd);
router.get("/profileGet/:id", userHelper.profileGet);
router.post("/investing", userHelper.investing);
router.get("/ownerDashData/:id", userHelper.ownerDashData);
router.post("/forgetpasswords", userHelper.forgetpasswords);
router.post("/otpChecking", userHelper.otpChecking);
router.post("/changePass", userHelper.changePass);



//admins

router.post("/generateCode", userHelper.generateCode);
router.post('/addtrades', upload.fields([{ name: 'productImage' }, { name: 'investorMemoPort' }, { name: 'logochange' }]), adminHelper.addTrades);
router.get('/gettrades', adminHelper.gettrades);
router.get('/viewTradeProfit/:id', adminHelper.viewTradeProfit);
router.post('/tradeProfit', adminHelper.tradeProfit);
router.post('/pupdate10', adminHelper.pupdate10);
router.get('/viewpupdate10', adminHelper.viewpupdate10);
router.get('/adhaarveri', adminHelper.adhaarveri);
router.post('/adhaarverification', adminHelper.adhaarverification);
router.post('/adhaarDelete', adminHelper.adhaarDelete);
router.get('/getWithdrwalRequests', adminHelper.getWithdrwalRequestss);
router.post('/acceptWithdrawals', adminHelper.acceptWithdrawalss);
router.post('/deleteWithdrawal', adminHelper.deleteWithdrawal);


module.exports = router;    