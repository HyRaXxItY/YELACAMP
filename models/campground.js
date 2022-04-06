const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,

});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

ImageSchema.virtual('thumbnail2').get(function () {
    return this.url.replace('/upload', '/upload/w_400');
});


const CampgroundSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

CampgroundSchema.post('findOneAndDelete', async function (del) {
    if (del) {
        await Review.deleteMany({
            _id: {
                $in: del.reviews   // specifying that, id is somewhere ''in'' del.reviews object 
                //(its array , we have defined reviews array here remember ? )
            }
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);