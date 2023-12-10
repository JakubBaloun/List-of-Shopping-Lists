
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  resolved: { type: Boolean, default: false },
});

const ShoppingListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  items: [ItemSchema],
  archived: {type: Boolean, default: false}
});

const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);

module.exports = ShoppingList;
