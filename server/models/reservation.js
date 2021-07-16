const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();

const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    dateStart: {
        type: Date,
        required: [true, 'name is required']
    },
    dateEnd: {
        type: Date,
        required: [true, 'price is required']
    },
    roomType: {
        type: Schema.Types.ObjectId,
        ref: 'roomType'
    },
    sede: {
        type: Schema.Types.ObjectId,
        ref: 'sede'
    }
});

reservationSchema.plugin(mongooseHidden, { hidden: { _id: false } });

module.exports = mongoose.model('reservation', reservationSchema);