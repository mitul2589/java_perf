var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var counterSchema = new Schema({
   _id : { type: String, required: true },
   sequence_value : { type: Number, required: true }
});

module.exports = mongoose.model('Counter', counterSchema, 'counters');