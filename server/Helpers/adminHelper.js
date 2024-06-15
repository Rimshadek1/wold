const db = require('../Config/Connection');
var collection = require('../Config/Collection');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const upload = multer({ dest: 'uploads/' });
const nodemailer = require("nodemailer");
const emails = process.env.EMAIL
const password = process.env.PASSWORD
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emails,
        pass: password,
    }
});
exports.addTrades = async (req, res) => {
    try {
        const sharesAvailable = parseInt(req.body.sharesAvailable);
        const tradeData = {
            ...req.body,
            sharesAvailable,
            productImage: req.files.productImage ? req.files.productImage[0].path : null,
            investorMemoPort: req.files.investorMemoPort ? req.files.investorMemoPort[0].path : null,
            logochange: req.files.logochange ? req.files.logochange[0].path : null
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
        res.status(200).json({ result });
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
        const { user } = req.body; // Changed variable name to `user` for clarity

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

        const veri = await db.get().collection(collection.userCollection).updateOne(
            { _id: new ObjectId(user) },
            { $set: { role: 'unverified' } }
        );
        if (veri) {
            await db.get().collection(collection.adhaarveriCollection).deleteOne({ user: user })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve data' });
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