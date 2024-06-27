const db = require('../Config/Connection');
var collection = require('../Config/Collection');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const upload = multer({ dest: 'uploads/' });
const nodemailer = require("nodemailer");
const emails = process.env.EMAIL;
const password = process.env.PASSWORD;
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const buckets = process.env.DO_SPACES_BUCKET;


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emails,
        pass: password,
    }
});

const s3Client = new S3Client({
    region: 'us-east-1', // Replace with your DigitalOcean Spaces region
    endpoint: process.env.DO_SPACES_ENDPOINT, // Endpoint for DigitalOcean Spaces
    credentials: {
        accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
    },
});
exports.addTrades = async (req, res) => {
    try {
        const sharesAvailable = parseInt(req.body.sharesAvailable);
        const tradeData = {
            ...req.body,
            sharesAvailable,
            productImage: req.files.productImage ? req.files.productImage[0].location : null,
            investorMemoPort: req.files.investorMemoPort ? req.files.investorMemoPort[0].location : null,
            logochange: req.files.logochange ? req.files.logochange[0].location : null
        };

        const inserted = await db.get().collection(collection.tradeCollection).insertOne(tradeData);

        if (inserted) {
            res.status(200).json({ message: 'Trade added successfully!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to add trade' });
    }
};


exports.gettrades = async (req, res) => {
    try {
        const trades = await db.get().collection(collection.tradeCollection).find().toArray();
        const profits = await db.get().collection(collection.profitCollection).find().toArray();

        // Map trades and profits by _id and productId respectively for easy lookup
        const profitMap = new Map(profits.map(profit => [profit.productId.toString(), profit]));

        const tradesWithProfits = trades.map(trade => {
            const tradeIdStr = trade._id.toString();
            if (profitMap.has(tradeIdStr)) {
                return { ...trade, profit: profitMap.get(tradeIdStr) };
            }
            return trade;
        });
        res.status(200).json({ message: 'Trades retrieved successfully!', trades: tradesWithProfits });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve trades' });
    }
};
exports.viewTradeProfit = async (req, res) => {
    try {
        const id = req.params.id;
        const existingTradeProfit = await db.get().collection(collection.profitCollection).findOne({ productId: id });
        res.status(200).json({ existingTradeProfit });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getThisTrade = async (req, res) => {
    try {
        const id = req.params.id;
        const existingTrade = await db.get().collection(collection.tradeCollection).findOne({ _id: new ObjectId(id) });
        res.status(200).json({ existingTrade });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deleteTrade = async (req, res) => {
    try {
        const id = req.params.id;

        const findTrade = await db.get().collection(collection.tradeCollection).findOne({ _id: new ObjectId(id) });
        if (findTrade) {
            // Prepare delete parameters for each image
            const deleteParams = [];

            if (findTrade.productImage) {
                const oldFileName = findTrade.productImage.split('/').pop();
                deleteParams.push({ Bucket: buckets, Key: oldFileName });
            }

            if (findTrade.investorMemoPort) {
                const oldFileName = findTrade.investorMemoPort.split('/').pop();
                deleteParams.push({ Bucket: buckets, Key: oldFileName });
            }

            if (findTrade.logochange) {
                const oldFileName = findTrade.logochange.split('/').pop();
                deleteParams.push({ Bucket: buckets, Key: oldFileName });
            }

            // Delete the trade from the database
            const deleting = await db.get().collection(collection.tradeCollection).deleteOne({ _id: new ObjectId(id) });
            if (deleting.deletedCount === 1) {
                try {
                    // Delete the images from DigitalOcean Spaces
                    if (deleteParams.length > 0) {
                        await Promise.all(deleteParams.map(param => s3Client.send(new DeleteObjectCommand(param))));
                        console.log('Pictures deleted successfully from DigitalOcean Spaces');
                    }

                    res.status(200).json({ status: "deleted" });
                } catch (err) {
                    console.error('Error deleting pictures from DigitalOcean Spaces:', err);
                    res.status(500).json({ message: 'Trade deleted, but error deleting pictures from DigitalOcean Spaces' });
                }
            } else {
                res.status(404).json({ message: 'Trade not found' });
            }
        } else {
            res.status(404).json({ message: 'Trade not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.updateTrade = async (req, res) => {
    try {
        const sharesAvailable = parseInt(req.body.sharesAvailable);
        const tradeData = {
            ...req.body,
            sharesAvailable,
            productImage: req.files.productImage ? req.files.productImage[0].location : null,
            investorMemoPort: req.files.investorMemoPort ? req.files.investorMemoPort[0].location : null,
            logochange: req.files.logochange ? req.files.logochange[0].location : null
        };

        const findupdateTrade = await db.get().collection(collection.tradeCollection).findOne({ _id: new ObjectId(req.body.id) });
        if (!findupdateTrade) {
            return res.status(404).json({ message: 'Trade not found' });
        }

        // Store old image locations to check if they need to be deleted
        const oldImages = {
            productImage: findupdateTrade.productImage,
            investorMemoPort: findupdateTrade.investorMemoPort,
            logochange: findupdateTrade.logochange
        };

        // Update the trade data by keeping old images if new ones are not provided
        const updateFields = {
            nameOfTrade: tradeData.nameOfTrade,
            departurePortCountry: tradeData.departurePortCountry,
            arrivalPortCountry: tradeData.arrivalPortCountry,
            orderNumber: tradeData.orderNumber,
            containerFoot: tradeData.containerFoot,
            companytrust: tradeData.companytrust,
            companyemail: tradeData.companyemail,
            nameOfCompany: tradeData.nameOfCompany,
            expectedDateOfIncome: tradeData.expectedDateOfIncome,
            returnOnInvestment: tradeData.returnOnInvestment,
            lastFundingDate: tradeData.lastFundingDate,
            expectedFreightDeparture: tradeData.expectedFreightDeparture,
            expectedArrival: tradeData.expectedArrival,
            depositOfProfit: tradeData.depositOfProfit,
            totalCIFPrice: tradeData.totalCIFPrice,
            totalShares: tradeData.totalShares,
            sharesAvailable: tradeData.sharesAvailable,
        };

        if (req.files.productImage) {
            updateFields.productImage = tradeData.productImage;
        } else {
            tradeData.productImage = oldImages.productImage;
        }

        if (req.files.investorMemoPort) {
            updateFields.investorMemoPort = tradeData.investorMemoPort;
        } else {
            tradeData.investorMemoPort = oldImages.investorMemoPort;
        }

        if (req.files.logochange) {
            updateFields.logochange = tradeData.logochange;
        } else {
            tradeData.logochange = oldImages.logochange;
        }

        // Remove old images from DigitalOcean Spaces if new images are provided
        const deleteParams = [];
        if (req.files.productImage && oldImages.productImage) {
            const oldFileName = oldImages.productImage.split('/').pop();
            deleteParams.push({ Bucket: buckets, Key: oldFileName });
        }

        if (req.files.investorMemoPort && oldImages.investorMemoPort) {
            const oldFileName = oldImages.investorMemoPort.split('/').pop();
            deleteParams.push({ Bucket: buckets, Key: oldFileName });
        }

        if (req.files.logochange && oldImages.logochange) {
            const oldFileName = oldImages.logochange.split('/').pop();
            deleteParams.push({ Bucket: buckets, Key: oldFileName });
        }

        try {
            if (deleteParams.length > 0) {
                await Promise.all(deleteParams.map(param => s3Client.send(new DeleteObjectCommand(param))));
                console.log('Old pictures deleted successfully from DigitalOcean Spaces');
            }

            await db.get().collection(collection.tradeCollection).updateOne(
                { _id: new ObjectId(req.body.id) },
                { $set: updateFields }
            );

            res.status(200).json({ message: 'Trade updated successfully!' });
        } catch (err) {
            console.error('Error deleting old pictures from DigitalOcean Spaces:', err);
            return res.status(500).json({ message: 'Error deleting old pictures' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.tradeProfit = async (req, res) => {
    try {
        const id = req.body.productId;
        const updatedTradeProfit = req.body.tradeProfit;
        const currentDate = new Date(); // Current date

        // Check if the product already exists in the profitCollection
        const existingTradeProfit = await db.get().collection(collection.profitCollection).findOne({ productId: id });

        if (existingTradeProfit) {
            // If the product exists, update its tradeProfit and date
            await db.get().collection(collection.profitCollection).updateOne(
                { productId: id },
                { $set: { tradeProfit: updatedTradeProfit, updatedAt: currentDate } }
            );
            res.status(200).json({ message: 'Trade profit updated successfully' });
        } else {
            // If the product doesn't exist, insert a new document with the tradeProfit and date
            const data = {
                productId: id,
                tradeProfit: updatedTradeProfit,
                createdAt: currentDate // Adding current date
            };
            await db.get().collection(collection.profitCollection).insertOne(data);
            res.status(200).json({ message: 'Trade details added successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.adhaarveri = async (req, res) => {
    try {
        const result = await db.get().collection(collection.adhaarveriCollection).find().toArray();

        // Assuming result is an array of objects with `user` field containing `_id`
        const userIds = result.map(item => new ObjectId(item.user));

        // Fetch user details from userCollection where _id matches
        const users = await db.get().collection(collection.userCollection)
            .find({ _id: { $in: userIds } })
            .toArray();

        // Map user _id to their firstName and mobile for quick lookup
        const userMap = {};
        users.forEach(user => {
            userMap[user._id.toString()] = {
                fullName: user.fullName,
                mobile: user.mobile,
                bank: user.bank,
                ifsc: user.ifsc,

            };
        });

        // Combine result with firstName and mobile from userCollection
        const enhancedResult = result.map(item => ({
            ...item,
            fullName: (userMap[item.user] && userMap[item.user].fullName) || 'Unknown', // Default to 'Unknown' if user not found
            mobile: (userMap[item.user] && userMap[item.user].mobile) || 'Unknown', // Default to 'Unknown' if user not found
            bank: (userMap[item.user] && userMap[item.user].bank) || 'Unknown', // Default to 'Unknown' if user not found
            ifsc: (userMap[item.user] && userMap[item.user].ifsc) || 'Unknown', // Default to 'Unknown' if user not found
        }));

        res.status(200).json({ result: enhancedResult });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve data' });
    }
};
exports.adhaarverification = async (req, res) => {
    try {
        const { user } = req.body;

        if (!user) {
            res.status(400).json({ message: 'User ID is required' });
        }

        const adhaarResult = await db.get().collection(collection.adhaarveriCollection).findOne({ user: user });

        if (!adhaarResult) {
            res.status(404).json({ message: 'Adhaar verification record not found' });
        }

        const userResult = await db.get().collection(collection.userCollection).findOne({ _id: new ObjectId(user) });

        if (!userResult) {
            res.status(404).json({ message: 'User not found' });
        }

        // Check if adhaarResult already exists in userCollection
        if (userResult.adhaarResult) {
            res.status(400).json({ message: 'Adhaar verification record already present in user collection' });
        }

        // Update user role to verified
        const update = await db.get().collection(collection.userCollection).updateOne(
            { _id: new ObjectId(user) },
            { $set: { role: 'verified', adhaarResult } }
        );
        if (update) {
            await db.get().collection(collection.adhaarveriCollection).deleteOne({ user: user });

            const mailOptions = {
                from: emails,
                to: userResult.email,
                subject: 'Verification Confirmation',
                html: `
                    <p>Dear User,</p>
                    <p>Your account has been successfully verified.</p>
                    <p>Thank you for choosing Wold.</p>
                    <p>Please logout and login again your account to continue</p>
                    <p>Best Regards,<br>Wold Team</p>
                `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    res.status(400).json({ error: "Email not sent" });
                } else {
                    console.log("Email sent", info.response);
                    res.status(200).json({ message: "Email sent successfully" });
                }
            });

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve data' });
    }
};


exports.adhaarDelete = async (req, res) => {
    try {
        const { user } = req.body;

        if (!user) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const adhaarResult = await db.get().collection(collection.adhaarveriCollection).findOne({ user: user });

        if (!adhaarResult) {
            return res.status(404).json({ message: 'Adhaar verification record not found' });
        }

        const userResult = await db.get().collection(collection.userCollection).findOne({ _id: new ObjectId(user) });

        if (!userResult) {
            return res.status(404).json({ message: 'User not found' });
        }

        const veri = await db.get().collection(collection.userCollection).updateOne(
            { _id: new ObjectId(user) },
            { $set: { role: 'unverified' } }
        );

        if (veri) {
            const oldfrontandback = await db.get().collection(collection.adhaarveriCollection).findOne({ user: user });
            if (oldfrontandback.aadhaarBack && oldfrontandback.aadhaarFront) {
                const oldFront = oldfrontandback.aadhaarFront;
                const oldBack = oldfrontandback.aadhaarBack;

                const oldFrontKey = oldFront.split('/').pop();
                const oldBackKey = oldBack.split('/').pop();

                const deleteFrontParams = {
                    Bucket: buckets,
                    Key: oldFrontKey,
                };

                const deleteBackParams = {
                    Bucket: buckets,
                    Key: oldBackKey,
                };

                try {
                    const deleteFrontCommand = new DeleteObjectCommand(deleteFrontParams);
                    const deleteBackCommand = new DeleteObjectCommand(deleteBackParams);

                    await s3Client.send(deleteFrontCommand);
                    await s3Client.send(deleteBackCommand);

                    console.log('Old Aadhaar front and back pictures deleted successfully from DigitalOcean Spaces');

                    await db.get().collection(collection.adhaarveriCollection).deleteOne({ user: user });

                    return res.status(200).json({ status: "success" });
                } catch (err) {
                    console.error('Error deleting old pictures from DigitalOcean Spaces:', err);
                    return res.status(500).json({ message: 'Error deleting old pictures' });
                }
            } else {
                return res.status(404).json({ message: 'Aadhaar pictures not found' });
            }
        } else {
            return res.status(500).json({ message: 'Failed to update user role' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to retrieve data' });
    }
};

exports.pupdate10 = async (req, res) => {
    try {
        const updated10percentage = req.body.p10;
        const currentDate = new Date();
        const data = {
            updated10percentage,
            updatedAt: currentDate
        };

        // Delete the old record
        await db.get().collection(collection.investStockCollection).deleteMany({});

        // Insert the new record
        const insert = await db.get().collection(collection.investStockCollection).insertOne(data);
        if (insert.insertedId) {
            res.status(200).json({ message: 'Trade profit updated successfully' });
        } else {
            res.status(400).json({ error: 'Failed to insert trade profit' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.viewpupdate10 = async (req, res) => {
    try {
        const tenpercentage = await db.get().collection(collection.investStockCollection).find().toArray();
        res.status(200).json({ tenpercentage });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getWithdrwalRequestss = async (req, res) => {
    try {
        const datas = await db.get().collection(collection.withdrawRequestCollection).find().toArray();
        const userIds = datas.map((withdrawalRequest) => new ObjectId(withdrawalRequest.userId));
        const acData = await db.get().collection(collection.userCollection)
            .find({ _id: { $in: userIds } })
            .toArray();
        const data = datas.map((withdrawalRequest) => {
            const correspondingAcData = acData.find(ac => ac._id.toString() === withdrawalRequest.userId.toString());
            return {
                username: withdrawalRequest.username,
                amount: withdrawalRequest.amount,
                userId: withdrawalRequest.userId,
                request: withdrawalRequest.request,
                bankAccountNumber: correspondingAcData ? correspondingAcData.bank : null,
                ifscCode: correspondingAcData ? correspondingAcData.ifsc : null,
                upi: correspondingAcData ? correspondingAcData.upi : null,
            };
        });
        res.status(200).json({ data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.acceptWithdrawalss = async (req, res) => {
    const trade = req.body.trade;
    try {
        const deleted = await db.get().collection(collection.withdrawRequestCollection).deleteOne({ userId: trade.userId });
        if (deleted.deletedCount === 1) {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString();
            const trades = {
                username: trade.username,
                userId: trade.userId,
                amount: trade.amount,
                request: 'accepted',
                bankAccountNumber: trade.bankAccountNumber,
                ifscCode: trade.ifscCode,
                type: 'Withdrawn',
                date: formattedDate,
            }
            await db.get().collection(collection.transactionCollection).insertOne(trades);
            res.status(200).json({ message: 'Withdrawal request processed successfully' });
        }
    } catch (error) {
        console.error('Error accepting withdrawal request:', error);
        res.status(500).json({ error: 'An error occurred while processing the withdrawal request' });
    }
};
exports.deleteWithdrawal = async (req, res) => {
    const trade = req.body.trade;
    try {
        const deleted = await db.get().collection(collection.withdrawRequestCollection).deleteOne({ userId: trade.userId });
        if (deleted.deletedCount === 1) {
            res.status(200).json({ message: 'Withdrawal deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting withdrawal request:', error);
        res.status(500).json({ error: 'An error occurred while processing the delete request' });
    }
};