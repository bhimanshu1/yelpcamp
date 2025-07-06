const { required } = require('joi');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;


// this is the schema of the review, that means in the collections
// in the collections this is what data is going to be stored
const reviewSchema = new Schema({
    body: {
        type: String
    },
    rating: {
        type: Number
    }   
})

// create a collection of reviews in the database using the schema reviewSchema
// and bring a link here
const Review = model("Review", reviewSchema);

module.exports = {
    Review: Review
}

