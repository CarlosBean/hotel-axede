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
    },
    amount: {
        type: Number,
        required: [true, 'amount is required']
    },
    sede: {
        type: Schema.Types.ObjectId,
        ref: 'sede'
    }
});

roomTypeSchema.plugin(mongooseHidden, { hidden: { _id: false } });

module.exports = mongoose.model('roomType', roomTypeSchema);