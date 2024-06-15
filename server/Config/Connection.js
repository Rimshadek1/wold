const { MongoClient } = require('mongodb');

const state = {
    db: null,
    isConnected: false,
};


const client = new MongoClient("mongodb+srv://porteximventurespvtltd:FUDqEeGmCIlEn7Mg@cluster0.nmx1oul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const connect = async () => {
    try {
        await client.connect();
        const db = client.db('Wold');
        state.db = db;
        state.isConnected = true;
        console.log('connection');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

const get = () => state.db;

const isConnected = () => state.isConnected;

module.exports = {
    connect,
    get,
    isConnected,
};
