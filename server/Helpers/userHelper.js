const db = require('../Config/Connection');
var collection = require('../Config/Collection');
require('dotenv').config();
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const Razorpay = require('razorpay');
const jwtsecret = process.env.JWTSECRET;
const razorpayKey = process.env.RazorpaySecret;
const twilio = require('twilio');
const accountSid = process.env.TWILIOACCOUNTSID;
const authToken = process.env.TWILIOAUTHTOKEN;
const twilioPhoneNumber = process.env.TWILIOPHONENUMBER;
const path = require('path');
const fs = require('fs');
const emails = process.env.EMAIL
const password = process.env.PASSWORD

var instance = new Razorpay({
    key_id: 'rzp_test_u6AqTKt0lLlp8S',
    key_secret: razorpayKey,
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emails,
        pass: password
    }
});


exports.sendOtpMail = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: "Please Enter Your Email" });
    }

    try {
        const presuer = await db.get().collection(collection.userCollection).findOne({ email });

        if (!presuer) {
            const OTP = Math.floor(100000 + Math.random() * 900000);
            const existEmail = await db.get().collection(collection.otpCollection).findOne({ email });

            if (existEmail) {
                await db.get().collection(collection.otpCollection).findOneAndUpdate(
                    { _id: existEmail._id },
                    { $set: { otp: OTP } },
                    { returnOriginal: false }
                );
            } else {
                await db.get().collection(collection.otpCollection).insertOne({ email, otp: OTP });
            }
            const mailOptions = {
                from: emails,
                to: email,
                subject: "Sending Email For OTP Validation",
                text: `Dear User,

    Thank you for choosing Wold, your trusted partner in international trade and investment. As part of our commitment to security and transparency, we are sending you this One Time Password (OTP) for email validation.

    OTP: ${OTP}

    Wold is an esteemed investment company specializing in facilitating import and export transactions of goods worldwide. With our dedication to excellence and integrity, we strive to provide seamless solutions for businesses looking to expand their global presence.

    We understand the importance of secure communication in international trade, which is why we employ stringent measures such as OTP validation to safeguard your information and ensure the reliability of our services.

    For any inquiries or assistance, please don't hesitate to contact us at woldinvests@gmail.com.

    Thank you for choosing Wold.

    Best Regards,
    wold
    `
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("error", error);
                    res.status(400).json({ error: "Email not sent" });
                } else {
                    console.log("Email sent", info.response);
                    res.status(200).json({ message: "Email sent successfully" });
                }
            });
        } else {
            res.status(400).json({ error: "Email already registered" });
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", details: error.message });
    }
};




exports.otpCheck = async (req, res) => {
    try {
        const { otp, email } = req.body;

        if (!otp || !email) {
            return res.status(400).json({ error: "Missing required fields (otp, email)" });
        }

        const otps = parseInt(otp);

        const dbInstance = db.get().collection(collection.otpCollection);

        const finding = await dbInstance.findOne({ otp: otps, email: email });

        if (finding) {
            return res.status(200).json({ message: "OTP validated" });
        } else {
            return res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (error) {
        console.error('Error validating OTP:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.createUser = async (req, res) => {
    try {
        const userDetails = req.body;
        const userEmail = userDetails.email.toLowerCase();

        const existingUser = await db.get().collection(collection.userCollection).findOne({ email: userEmail });

        if (existingUser) {
            return res.status(400).json({ error: "Email address already exists, Please login" });
        }

        const otps = parseInt(userDetails.otp);
        const dbInstance = db.get().collection(collection.otpCollection);

        const finding = await dbInstance.findOne({ otp: otps, email: userEmail });

        if (finding) {
            userDetails.password = await bcrypt.hash(userDetails.password, 10);
            const userData = {
                email: userDetails.email,
                password: userDetails.password,
                role: "unverified",
                fullName: userDetails.fullName,
                mobile: userDetails.mobile ? userDetails.mobile : "000 000 0000"
            }

            const result = await db.get().collection(collection.userCollection).insertOne(userData);
            const user = result.insertedId;

            jwt.sign(
                {
                    email: userDetails.email,
                    id: user,
                    role: userData.role,
                    name: userData.fullName
                },
                jwtsecret,
                {},
                (err, token) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Error generating token' });
                    }
                    return res.status(200).json({ message: "User created successfully", token });
                }
            );
        } else {
            return res.status(400).json({ error: "Invalid OTP or email" });
        }
    } catch (error) {
        console.error('Error', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { password, email } = req.body;

        if (!password || !email) {
            return res.status(400).json({ error: "Missing required fields (password, email)" });
        }

        const dbInstance = db.get().collection(collection.userCollection);

        const finding = await dbInstance.findOne({ email: email });
        if (!finding) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const passwordMatch = await bcrypt.compare(password, finding.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        jwt.sign(
            {
                email: finding.email,
                id: finding._id,
                role: finding.role,
                name: finding.fullName,
                mobile: finding.mobile ? finding.mobile : "000 000 0000"
            },
            jwtsecret,
            {},
            (err, token) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error generating token' });
                }
                return res.status(200).json({ message: "User logged in", token, role: finding.role });
            }
        );
    } catch (error) {
        console.error('Error validating email or password:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


exports.gettrade = async (req, res) => {
    try {
        const id = req.params.id;
        const trade = await db.get().collection(collection.tradeCollection).findOne({ _id: new ObjectId(id) });
        const profit = await db.get().collection(collection.profitCollection).findOne({ productId: id });

        if (profit) {
            trade.profit = profit;
        }
        res.status(200).json({ message: 'Trade and profit fetched successfully!', trade });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch trade' }); // Updated response message
    }
};
exports.postRequestAddMoney = async (req, res) => {
    const status = 'rejected';

    const userId = req.body.id;
    const amount = req.body.amount;

    // Check if amount is not empty
    if (!amount || amount.trim() === "") {
        return res.status(400).json({ error: 'Amount is required' });
    }

    const order = {
        userId: new ObjectId(userId),
        amount: amount,
        status: status,
        type: 'Deposit',
        date: new Date(),
    };
    try {
        const response = await db.get().collection(collection.orderedCollection).insertOne(order);
        await generateRazorpay(res, response.insertedId, amount);
    } catch (error) {
        console.error('Error inserting order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const generateRazorpay = (res, orderId, amount) => {
    try {
        if (!amount) {
            return res.status(400).json({ error: 'Amount is required.' });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: '' + orderId
        };

        instance.orders.create(options, function (err, order) {
            if (err) {
                console.error('Error generating Razorpay order:', err);
                return res.status(500).json({ error: 'Error generating Razorpay order' });
            } else {
                return res.json(order);
            }
        });
    } catch (error) {
        console.error('Error in generateRazorpay:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.verifyPayment = async (req, res) => {
    const crypto = require('crypto');
    let hmac = crypto.createHmac('sha256', razorpayKey);

    try {
        const responseDetails = req.body.res; // Use a different variable name
        hmac.update(responseDetails.razorpay_order_id + '|' + responseDetails.razorpay_payment_id);
        const calculatedSignature = hmac.digest('hex');
        if (calculatedSignature === responseDetails.razorpay_signature) {
            const orderIdFromReceipt = req.body.order.receipt;
            const finded = await db.get().collection(collection.orderedCollection).findOne({
                _id: new ObjectId(orderIdFromReceipt)
            });
            if (finded) {
                const finds = {
                    _id: finded._id,
                    userId: finded.userId,
                    amount: finded.amount,
                    status: 'placed',
                    type: finded.type,
                    date: finded.date,
                }
                const deposit = await db.get().collection(collection.depositCollection).insertOne(finds)
                if (deposit.insertedId) {
                    await db.get().collection(collection.orderedCollection).deleteOne({
                        _id: new ObjectId(orderIdFromReceipt)
                    });
                    res.status(200).json({ status: 'Payment success' });
                } else {
                    res.status(400).json({ status: 'Payment failed: Invalid signature' });
                }
            } else {
                res.status(400).json({ status: 'Payment failed: Invalid signature' });
            }
        } else {
            res.status(400).json({ status: 'Payment failed: Invalid signature' });
        }
    } catch (error) {
        console.error('Error in verifyPayment:', error);
        res.status(500).json({ status: 'Internal server error' });
    }
};
exports.withdrawRequest = async (req, res) => {
    try {
        userId = req.body.id
        amount = req.body.amount
        request = 'pending'
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString();
        let withdraw = {
            userId: userId,
            amount: parseInt(amount),
            request: request,
            username: req.body.username,
            type: 'Withdrawn Request',
            date: formattedDate,

        }
        const withs = db.get().collection(collection.withdrawRequestCollection).insertOne(withdraw)
        if (withs) {
            res.status(200).json({ result: withs.insertedId })
        } else {
            res.status(400).json({ result: 'Payment request not accepted, Please check after sometime' })
        }

    } catch (error) {
        console.error('Error in verifyPayment:', error);
        res.status(500).json({ status: 'Internal server error' });
    }
};
exports.userTransactions = async (req, res) => {
    try {

        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "no id found" })
        }
        const userId = id;

        const deposit = await db.get().collection(collection.orderedCollection).find({ userId: new ObjectId(userId) }).toArray();
        const deposited = await db.get().collection(collection.depositCollection).find({ userId: new ObjectId(userId) }).toArray();
        const withdrawRequest = await db.get().collection(collection.withdrawRequestCollection).find({ userId: userId }).toArray();
        const accepted = await db.get().collection(collection.transactionCollection).find({ userId: userId }).toArray();
        const purchased = await db.get().collection(collection.purchasedCollection).find({ userId: userId }).toArray();

        let alltotal = 0;
        // Additional logic to fetch profits for purchased items
        const profitLookup = await db.get().collection(collection.profitCollection).find().toArray();
        const purchaseProfit = await Promise.all(
            purchased.map(async (purchase) => {
                const profitItem = profitLookup.find(profit => profit.productId.toString() === purchase.items.toString());
                if (profitItem) {
                    purchase.profit = profitItem.tradeProfit;
                    const trade = await db.get().collection(collection.tradeCollection).findOne({ _id: new ObjectId(profitItem.productId) });
                    const purchased = await db.get().collection(collection.purchasedCollection).findOne({
                        items: profitItem.productId
                    });

                    purchase.tradeProfit = parseFloat(profitItem.tradeProfit) / trade.totalShares * purchased.purchasedQuanity;
                    // purchase.totalProfitandshare = (parseFloat(profitItem.tradeProfit) / trade.totalShares * purchased.purchasedQuanity) + purchased.totalPrice;
                    purchase.type = "Profit"
                    purchase.totalPrice = (parseFloat(profitItem.tradeProfit) / trade.totalShares * purchased.purchasedQuanity) + purchased.totalPrice;
                    purchase.date = profitItem.createdAt;
                    purchase.status = "profit"
                    alltotal += purchase.tradeProfit;
                }
                return purchase;
            })
        );
        // Filter out purchases without the profit field
        const purchasesWithProfit = purchaseProfit.filter(purchase => purchase.profit !== undefined);

        const purchasing = await db.get().collection(collection.purchasedCollection).find({ userId: userId }).toArray();


        const allTransactions = [...deposit, ...withdrawRequest, ...accepted, ...deposited, ...purchasing, ...purchasesWithProfit];
        const totalDepositedAmount = deposited.reduce((total, transaction) => {
            return total + parseFloat(transaction.amount);
        }, 0);
        const totalWithdrawRequestAmount = withdrawRequest.reduce((total, transaction) => {
            return total + parseFloat(transaction.amount);
        }, 0);
        const totalacceptedAmount = accepted.reduce((total, transaction) => {
            return total + parseFloat(transaction.amount);
        }, 0);
        const totalpurchasedAmount = purchased.reduce((total, transaction) => {
            return total + parseFloat(transaction.totalPrice);
        }, 0);
        const totalProfitAmount = purchasesWithProfit.reduce((total, purchase) => {
            return total + parseFloat(purchase.totalPrice);
        }, 0);
        const balance = totalDepositedAmount - totalWithdrawRequestAmount - totalacceptedAmount - totalpurchasedAmount + totalProfitAmount + alltotal;
        res.status(200).json({ transactions: allTransactions, balance });

    } catch (error) {
        console.error('Error in', error);
        res.status(500).json({ status: 'Internal server error' });
    }
};

exports.purchase = async (req, res) => {
    try {
        // Extract request data with validation
        const { totalPrice, items, id, purchasedQuanity } = req.body;
        // Create purchase details with clear naming
        const purchase = {
            userId: id,
            totalPrice: parseFloat(totalPrice),
            items,
            date: new Date(),
            status: 'done',
            type: 'purchased',
            purchasedQuanity: purchasedQuanity, // Consistent naming
        };

        // Fetch trade details efficiently
        const tradeDetails = await db.get().collection(collection.tradeCollection).findOne({ _id: new ObjectId(items) });

        if (tradeDetails) {
            // Check if sharesAvailable is more than or equal to purchasedQuantity
            if (tradeDetails.sharesAvailable >= purchasedQuanity) {
                // Update trade quantity atomically
                const updateResult = await db.get().collection(collection.tradeCollection).updateOne(
                    { _id: new ObjectId(items) },
                    {
                        $inc: {
                            sharesAvailable: - purchasedQuanity
                        }
                    } // Use $inc for efficient decrement
                );

                if (updateResult.modifiedCount === 1) {
                    // Insert purchase details only if trade update succeeds
                    const insertResult = await db.get().collection(collection.purchasedCollection).insertOne(purchase);
                    if (insertResult.insertedId) {
                        res.status(200).json({ status: 'success purchase' });
                        return; // Exit the function after successful purchase
                    }
                }
            } else {
                // Not enough shares available
                res.status(400).json({ status: 'Not enough shares available' });
                return;
            }
        }

        // Handle errors gracefully
        res.status(500).json({ status: 'Failed to process purchase' });
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).json({ status: 'Internal Server Error' }); // Generic error for client
    }
};

exports.portfolioValue = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = id;

        // Fetch all purchases for the user
        const purchases = await db.get().collection(collection.purchasedCollection)
            .find({ userId })
            .toArray();

        // Fetch all profits
        const profits = await db.get().collection(collection.profitCollection).find().toArray();
        const profitMap = new Map(profits.map(profit => [profit.productId.toString(), profit]));

        // Get detailed purchase information
        const purchaseDetails = await Promise.all(purchases.map(async purchase => {
            const trade = await db.get().collection(collection.tradeCollection)
                .findOne({ _id: new ObjectId(purchase.items) });
            if (trade) {
                const profit = profitMap.has(trade._id.toString()) ? profitMap.get(trade._id.toString()) : null;
                return {
                    ...purchase,
                    trade,
                    profit
                };
            }
            return null;
        }));

        // Filter out null values
        const filteredPurchaseDetails = purchaseDetails.filter(detail => detail !== null);
        res.status(200).json(filteredPurchaseDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the portfolio value.' });
    }
};


const client = new twilio(accountSid, authToken);

exports.mobileOtpSent = async (req, res) => {
    const { mobile, userId } = req.body;

    // Input validation
    if (!mobile || !userId) {
        return res.status(400).send({ message: 'Mobile number and user ID are required' });
    }

    const sanitizedMobile = mobile.replace(/\D/g, ''); // Remove non-numeric characters
    if (sanitizedMobile.length !== 10) {
        return res.status(400).send({ message: 'Invalid mobile number format' });
    }

    const mobileNumber = `+91${sanitizedMobile}`;

    try {
        // Fetch user data
        const user = await db.get().collection(collection.userCollection).findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Send OTP using Twilio (assuming Twilio is properly configured)
        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: twilioPhoneNumber,
            to: mobileNumber
        });

        // Store or update OTP record (consider security for storage)
        let existingOtpRecord = await db.get().collection(collection.mobileOtpCollection).findOne({ userId: new ObjectId(userId) });
        if (existingOtpRecord) {
            await db.get().collection(collection.mobileOtpCollection).updateOne({ userId: new ObjectId(userId) }, { $set: { mobile: sanitizedMobile, otp, createdAt: new Date() } });
        } else {
            await db.get().collection(collection.mobileOtpCollection).insertOne({ userId: new ObjectId(userId), mobile: sanitizedMobile, otp, createdAt: new Date() });
        }

        // Send successful response to frontend
        res.status(200).send({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        if (error.code === 21211) {
            return res.status(400).send({ message: 'Invalid phone number' });
        }
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
exports.mobileotpveri = async (req, res) => {
    try {
        const { otp, mobile, user } = req.body;

        // Validate request parameters
        if (!otp || !mobile || !user) {
            return res.status(400).json({ message: "Invalid request parameters" });
        }

        // Find the user in the user collection
        const User = await db.get().collection(collection.userCollection).findOne({ _id: new ObjectId(user) });

        if (!User) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user role is unverified
        if (User.role === "unverified") {
            // Find the OTP entry for the user in the mobileOtpCollection
            const otpUser = await db.get().collection(collection.mobileOtpCollection).findOne({ userId: new ObjectId(user) });

            if (!otpUser) {
                res.status(404).json({ message: "OTP not found for user" });
            }

            // Check if the provided OTP matches the stored OTP
            const match = await db.get().collection(collection.mobileOtpCollection).findOne({ otp: otp, userId: new ObjectId(user) });

            if (match) {
                // OTP matches, respond with success
                res.status(200).json({ message: "OTP verified" });
            } else {
                // OTP does not match
                res.status(400).json({ message: "Invalid OTP" });
            }
        } else {
            res.status(400).json({ message: "User is already verified" });
        }
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.bankDetails = async (req, res) => {
    const { bank, rebank, ifsc, upi, user, id } = req.body;

    try {
        // Validate user existence
        const veri = await db.get().collection(collection.userCollection).findOne({ _id: new ObjectId(user) });

        if (veri) {
            // Update the user document with the bank details
            await db.get().collection(collection.userCollection).updateOne(
                { _id: new ObjectId(user) },
                {
                    $set: {
                        bank,
                        rebank,
                        ifsc,
                        upi,
                        mobile: id
                    }
                }
            );

            res.status(200).json({ success: true, message: 'Bank details updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred', error: error.message });
    }
};
exports.detailsAdhaar = async (req, res) => {
    try {
        const tradeData = {
            ...req.body,
            aadhaarFront: req.files.aadhaarFront ? req.files.aadhaarFront[0].path : null,
            aadhaarBack: req.files.aadhaarBack ? req.files.aadhaarBack[0].path : null,
        };

        const filter = { user: new ObjectId(req.body.user) };
        const update = { $set: tradeData };
        const options = { upsert: true };

        const result = await db.get().collection(collection.adhaarveriCollection).updateOne(filter, update, options);

        if (result.upsertedCount > 0 || result.modifiedCount > 0) {
            const user = await db.get().collection(collection.userCollection).findOne({ _id: new ObjectId(req.body.user) });

            if (user) {
                await db.get().collection(collection.userCollection).updateOne(
                    { _id: new ObjectId(req.body.user) },
                    { $set: { role: 'verifying' } }
                );
            }

            res.status(200).json({ message: 'Trade added or updated and user role updated to verifying successfully!' });
        } else {
            res.status(400).json({ message: 'Failed to add or update trade' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to add or update trade' });
    }
};

exports.profileAdd = async (req, res) => {
    try {
        const { user } = req.body;
        const newImagePath = req.files.image ? req.files.image[0].path : null;

        // Fetch the current profile picture path from the database
        const userRecord = await db.get().collection(collection.userCollection).findOne({ _id: new ObjectId(user) });

        if (userRecord && userRecord.profilepicture && userRecord.profilepicture.image) {
            const oldImagePath = userRecord.profilepicture.image;
            const fullOldImagePath = path.join(__dirname, '..', oldImagePath);
            // Delete the existing image file
            fs.unlink(fullOldImagePath, (err) => {
                if (err) {
                    console.error('Error deleting old profile picture:', err);
                } else {
                    console.log('Old profile picture deleted successfully');
                }
            });
        }

        const profilepicture = { image: newImagePath };

        // Update the database with the new image path
        const update = await db.get().collection(collection.userCollection).updateOne(
            { _id: new ObjectId(user) },
            { $set: { profilepicture } }
        );

        if (update.modifiedCount > 0) {
            res.status(200).json({ message: 'Profile picture changed successfully' });
        } else {
            res.status(400).json({ error: 'Failed to update profile picture' });
        }
    } catch (error) {
        console.error('Error updating profile picture:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.profileGet = async (req, res) => {
    const user = req.params.id;
    try {
        const find = await db.get().collection(collection.userCollection).findOne({ _id: new ObjectId(user) });
        if (find) {
            const profilepicture = find.profilepicture;
            res.status(200).json({ profilepicture: profilepicture.image });
        } else {
            // Handle case when user is not found
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        // Handle any errors that occur during the database operation
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.generateCode = async (req, res) => {
    const data = req.body;
    try {
        const invest = await db.get().collection(collection.investCollection).insertOne(data);
        if (invest.insertedId) {
            res.status(200).json({ message: "Data inserted successfully", insertedId: invest.insertedId });
        } else {
            res.status(500).json({ error: "Failed to insert data" });
        }
    } catch (error) {
        // Handle any errors that occur during the database operation
        console.error("Error inserting data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.investing = async (req, res) => {
    const { userEmail, otp } = req.body;
    try {
        const user = await db.get().collection(collection.investCollection).findOne({ email: userEmail });
        if (!user) {
            throw new Error("User not found");
        }

        const match = await db.get().collection(collection.investCollection).findOne({ investcode: otp });
        if (!match) {
            throw new Error("Invalid OTP");
        }

        const investment = {
            userEmail,
            investAmount: parseInt(6006),
            date: new Date()
        };

        const deleting = await db.get().collection(collection.investCollection).deleteOne({ email: userEmail });
        if (!deleting.deletedCount) {
            throw new Error("Failed to delete user data");
        }

        const insertResult = await db.get().collection(collection.investFundCollection).insertOne(investment);
        if (insertResult.insertedId) {
            return res.status(200).json({ message: "Data inserted successfully" });
        } else {
            throw new Error("Failed to insert data into investment fund collection: Inserted count does not match 1");
        }
    } catch (error) {
        // Handle any errors that occur during the database operation
        console.error("Error inserting data:", error);
        res.status(500).json({ error: error.message }); // Sending the specific error message
    }
};


exports.ownerDashData = async (req, res) => {
    const email = req.params.id;
    try {
        const myInvest = await db.get().collection(collection.investFundCollection).find({ userEmail: email }).toArray();
        if (myInvest) {

            res.status(200).json({ myInvest });
        } else {
            res.status(404).json({ error: "No investment found for the provided email" });
        }
    } catch (error) {
        // Handle any errors that occur during the database operation
        // Handle any errors that occur during the database operation
        console.error("Error retrieving data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.forgetpasswords = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await db.get().collection(collection.userCollection).findOne({ email: email });
        if (user) {
            const OTP = Math.floor(100000 + Math.random() * 900000);
            const existEmail = await db.get().collection(collection.otpCollection).findOne({ email });
            if (existEmail) {
                await db.get().collection(collection.otpCollection).findOneAndUpdate(
                    { _id: existEmail._id },
                    { $set: { otp: OTP } },
                    { returnDocument: 'after' }
                );
            } else {
                await db.get().collection(collection.otpCollection).insertOne({ email, otp: OTP });
            }

            const mailOptions = {
                from: emails,
                to: email,
                subject: "Forget password",
                text: `Dear User,

Thank you for choosing Wold, your trusted partner in international trade and investment. As part of our commitment to security and transparency, we are sending you this One Time Password (OTP) for email validation.

OTP: ${OTP}

Wold is an esteemed investment company specializing in facilitating import and export transactions of goods worldwide. With our dedication to excellence and integrity, we strive to provide seamless solutions for businesses looking to expand their global presence.

We understand the importance of secure communication in international trade, which is why we employ stringent measures such as OTP validation to safeguard your information and ensure the reliability of our services.

For any inquiries or assistance, please don't hesitate to contact us at woldinvests@gmail.com.

Thank you for choosing Wold.

Best Regards,
Wold`
            };

            // Send the email and handle errors
            transporter.sendMail(mailOptions)
                .then(info => {
                    console.log("Email sent", info.response);
                    res.status(200).json({ message: "Email sent successfully" });
                })
                .catch(error => {
                    console.log("Error sending email", error);
                    res.status(400).json({ error: "Email not sent" });
                });
        } else {
            res.status(400).json({ error: "Email not registered" });
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.otpChecking = async (req, res) => {
    const otp = req.body.otp;
    const id = req.body.id;

    try {
        // Find the OTP record by user email
        const findotp = await db.get().collection(collection.otpCollection).findOne({ email: id });

        if (findotp) {
            // Check if the OTP matches for the user
            const checkotp = await db.get().collection(collection.otpCollection).findOne({ otp: parseInt(otp), email: id });

            if (checkotp) {
                // OTP is valid
                res.status(200).json({ message: "OTP verified successfully" });
            } else {
                // OTP does not match
                res.status(400).json({ error: "Invalid OTP. Please try again." });
            }
        } else {
            // No OTP record found for the provided email
            res.status(404).json({ error: "No OTP found for the provided email" });
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.changePass = async (req, res) => {
    const otp = req.body.otp;
    const id = req.body.id;
    const password = req.body.password;

    try {
        // Find the OTP record by user email
        const findotp = await db.get().collection(collection.otpCollection).findOne({ email: id });

        if (findotp) {
            // Check if the OTP matches for the user
            const checkotp = await db.get().collection(collection.otpCollection).findOne({ otp: parseInt(otp), email: id });

            if (checkotp) {
                // Hash the new password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Update the user's password in userCollection
                const updateResult = await db.get().collection(collection.userCollection).updateOne(
                    { email: id },
                    { $set: { password: hashedPassword } }
                );

                if (updateResult.modifiedCount > 0) {
                    res.status(200).json({ message: "Password updated successfully" });
                } else {
                    res.status(500).json({ error: "Failed to update password" });
                }
            } else {
                // OTP does not match
                res.status(400).json({ error: "Invalid OTP" });
            }
        } else {
            // No OTP record found for the provided email
            res.status(404).json({ error: "OTP not found" });
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};