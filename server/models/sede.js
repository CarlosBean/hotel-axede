const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();

const Schema = mongoose.Schema;

const sedeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    maxAmountRoom: {
        type: Number,
        required: [true, 'max amount room is required']
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },

});

sedeSchema.plugin(mongooseHidden, { hidden: { _id: false } });

module.exports = mongoose.model('sede', sedeSchema);