var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProductSchema = new Schema({
  _id: { type: Number, required: true },
  productName: { type: String, required: true, trim: true },
  productCode: { type: String, required: true, trim: true },
  releaseDate: { type: Date, required: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  starRating: { type: Number, required: true },
  imageUrl: { type: String },

});

module.exports = mongoose.model('Product', ProductSchema, 'products');