const mongoose = require('mongoose');
const { BlueCmp } = require('../models/cmpground_sch');
const { places, descriptors, campDescriptions } = require('./seedHelpers');
const { createSpinner } = require("nanospinner");
const ChalkAnimation = require('chalk-animation');
const city = require('./cities');

const randomNo = function (arr){
    return (Math.floor(Math.random()*arr.length));
}

// Clearing of the database
const clearDb = async() => {
    const spinner = createSpinner("Clearing Database").start();
    await BlueCmp.deleteMany({});
    spinner.success({text: "Database Cleared", color: "red"});
}

// Seeding of the database
const seedDb = async() =>{
    const spinner = createSpinner("Database Seeding...").start({ color: 'yellow' });
    for (let i = 0; i < 10; i++){
        const idx = Math.floor(Math.random() * 1000); // to select the city and state
        const price = Math.floor(Math.random()*100) + 10;
        let obj = {};
        obj["location"] = `${city[idx].city}, ${city[idx].state}`;
        obj["title"] = `${descriptors[randomNo(descriptors)]} ${places[randomNo(places)]}`
        obj["price"] = price;
        obj["description"] = campDescriptions[randomNo(campDescriptions)];
        obj["image"] = `https://picsum.photos/400?random=${Math.floor(Math.random()*1000 + 1)}`
        await BlueCmp.insertOne(obj);
    }
    spinner.success({ text: "Seeding Done", color: "Green"});
}

const startDb = async function (){
    const anm = ChalkAnimation.default.rainbow("Connecting to Database...");
    const prom = await mongoose.connect('mongodb://127.0.0.1:27017/blueCamp');
    anm.stop();
    await clearDb();
    await seedDb();

}

startDb().then(() => {
    mongoose.connection.close();
})