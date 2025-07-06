const joi = require('joi');
const { appError } = require('./appError');

const validateCampData = (req, res, next) => {
    let newObj = {};
    newObj['body'] = req.body;
    const campgroundSchema = joi.object({
        body: joi.object({
            title: joi.string().required(),
            price: joi.number().required().min(0),
            image: joi.string().required(),
            location: joi.string().required(),
            description: joi.string().required()
        }).required()
    })
    const result = campgroundSchema.validate(newObj);
    const { error } = result;
    if (error) {
        const errMsg = error.details.map(er => er.message).join(',')
        throw new appError(errMsg, 400);
    } else {
        next();
    }
}

const validateReviewData = (req, res, next) => {
    let newObj = {};
    newObj['body'] = req.body;
    const reviewSchema = joi.object({
        body: joi.object({
            body: joi.string().required(),
            rating: joi.number().min(1).max(10).required()
        }).required()
    })

    const result = reviewSchema.validate(newObj);
    const { error } = result;
    if (error) {
        const errMsg = error.details.map(er => er.message).join(',')
        throw new appError(errMsg, 400);
    } else {
        next();
    }
}

module.exports = {
    validateCampData: validateCampData,
    validateReviewData: validateReviewData
}