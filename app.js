const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const { BlueCmp } = require('./models/cmpground_sch.js');
const { start_db } = require('./seeds/start_db.js');
const { appError } = require('./utils/appError.js');
const { validateCampData, validateReviewData } = require('./utils/validate.js');
const { Review } = require('./models/review.js');
const joi = require('joi');
const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views/campgrounds/layouts')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());

app.get("/", (req, res) => {
    res.render('home');
})

app.get('/campgrounds', async (req, res) => {
    // gets all the campgrounds from the database
    console.log("Request on the Homepage");
    const campgrounds = await BlueCmp.find({});
    res.render('campgrounds/index', { campgrounds });
})

app.get('/campgrounds/delete/:id', async (req, res) => {
    console.log("Request to Delete");
    const campground = await BlueCmp.findById(req.params.id);
    console.log(campground);
    const reviews = campground.reviews;
    for (let review of reviews) {
        await Review.findByIdAndDelete(review);
    }
    await BlueCmp.findByIdAndDelete(campground._id);
    res.redirect('/campgrounds');
})

app.get('/campgrounds/new', async (req, res) => {
    // this renders the page to add new
    console.log("Request to ADD");
    res.render('campgrounds/new');
})

app.post('/campgrounds/new', validateCampData, async (req, res) => {
    const newCamp = BlueCmp(req.body);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
})

app.get('/campgrounds/:id', async (req, res) => {
    console.log(req.params.id);
    if (!req.params.id) {
        console.log("haa bhai tune id nhi di");
        throw new appError('Provide an camp Id', 400);
    }
    const campground = await BlueCmp.findById(req.params.id).populate("reviews");
    res.render('campgrounds/show', { campground })
})

app.get('/campgrounds/edit/:id', async (req, res) => {
    // this lets you to open the editing page
    const id = req.params.id;
    const campground = await BlueCmp.findById(id);
    res.render('campgrounds/edit', { campground });
})

app.post('/campgrounds/edited/:id', validateCampData, async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    await BlueCmp.findByIdAndUpdate(id, body);
    res.redirect('/campgrounds');
})

app.post('/campgrounds/:id/reviews', validateReviewData, async (req, res) => {
    const cmpId = req.params.id;
    const { body, rating } = req.body;
    let campground = await BlueCmp.findById(cmpId);
    const nReview = Review({ body, rating });
    console.log(campground);
    campground.reviews.push(nReview);
    campground.save();
    nReview.save()
    res.redirect(`/campgrounds/${cmpId}`);
})

app.get('/campgrounds/:id/reviews/delete/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params;
    await BlueCmp.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
})

app.all(/(.*)/, (req, res, next) => {
    throw new appError("Page Not Found", 404);
})

app.use((err, req, res, next) => {
    try {
        err.statusCode = err.statusCode ? err.statusCode : 500;
        err.message = err.message ? err.message : "Something Went Wrong";
        res.status(err.statusCode).render(`error`, { err });
    } catch (err) {
        next(err);
    }
})

app.use((err, req, res, next) => {
    res.send(`<h1>${err}</h1>`);
})

app.listen(3000, () => {
    console.log("Serving on port: 3000");
    start_db().then(() => {
        console.log("Connected To Database...");
    })
})