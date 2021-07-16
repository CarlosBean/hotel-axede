const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();

const Schema = mongoose.Schema;

const roomTypeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    price: {
        type: Number,
        required: [true, 'price is required']
    }
});

roomTypeSchema.plugin(mongooseHidden, { hidden: { _id: false } });

module.exports = mongoose.model('roomType', roomTypeSchema);