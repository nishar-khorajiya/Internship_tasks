const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

module.exports = mongoose.model("Dish", dishSchema);
