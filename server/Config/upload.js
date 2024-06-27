const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { ObjectId } = require('mongodb');
const fs = require('fs'); // Ensure this is imported if not already
const db = require('../Config/Connection'); // Adjust the path as needed
const collection = require('../Config/Collection'); // Adjust the path as needed
require('dotenv').config();

const s3Client = new S3Client({
    endpoint: process.env.DO_SPACES_ENDPOINT, // Ensure this includes "https://"
    region: 'us-east-1', // Any valid AWS region; this is required by the AWS SDK but not used by DigitalOcean
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET
    }
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.DO_SPACES_BUCKET,
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        }
    })
});

module.exports = upload;
