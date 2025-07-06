const mongoose = require('mongoose');

const start_db = async () => {
    return await mongoose.connect('mongodb://127.0.0.1:27017/blueCamp')
}

module.exports = {
    start_db: start_db
}