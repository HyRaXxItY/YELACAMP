const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelper')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(" Database connected");

});

const sample = function (array) {
    return array[Math.floor(Math.random() * array.length)];
}


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 30) + 1;
        const camp = new Campground({
            author: '624c281f87efd1702832301a',
            location: `${cities[random1000].city}  ${cities[random1000].state}`,
            title: `${sample(descriptors)}  ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste nostrum facilis dolores tempore consectetur minima laudantium provident possimus mollitia eaque, fuga iusto quos perferendis voluptas beatae inventore fugit quidem? Asperiores?',
            price: price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dwpxnfbhz/image/upload/v1649228635/YelpCamp/wxvvyqxdr5vf7mzxxfcl.webp',
                    filename: 'YelpCamp/wxvvyqxdr5vf7mzxxfcl'
                },
                {
                    url: 'https://res.cloudinary.com/dwpxnfbhz/image/upload/v1649228634/YelpCamp/pc4ugwbcyno9apuctryi.jpg',
                    filename: 'YelpCamp/pc4ugwbcyno9apuctryi',
                }
            ]

        })
        await camp.save();
    }

}


seedDB().then(() => {

    console.log("data seed complete");
    mongoose.connection.close();
}) // this closes the database