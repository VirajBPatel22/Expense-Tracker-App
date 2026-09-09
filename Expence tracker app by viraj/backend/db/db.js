const mongoose = require('mongoose');

const db = async () => {
    try {
        mongoose.set('strictQuery', false);
        if (!process.env.MONGO_URL) {
            console.warn('⚠️  MONGO_URL is not defined in .env file!');
            return;
        }
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Db connected successfully');
    } catch (error) {
        console.error('❌ DB Connection Error:', error.message);
    }
};

module.exports = { db };