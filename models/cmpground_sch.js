const { ref } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const blueCmpSchema = Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
})

const BlueCmp = mongoose.model("BlueCmp", blueCmpSchema);

module.exports = {
    BlueCmp: BlueCmp
}