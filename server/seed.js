// seed.js
const mongoose = require('mongoose');
const User = require('./models/User');
const ShoppingList = require('./models/ShoppingList');

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/shoppinglistsdb', { useNewUrlParser: true });

    // Seed users
    const user1 = new User({
      username: 'user1',
      email: 'user1@example.com',
      password: 'password1',
    });
    await user1.save();

    const user2 = new User({
      username: 'user2',
      email: 'user2@example.com',
      password: 'password2',
    });
    await user2.save();

    // Seed shopping lists
    const shoppingList1 = new ShoppingList({
      name: 'Groceries',
      owner: user1._id,
      members: [user2._id],
      items: [{ name: 'Milk' }, { name: 'Bread' }],
    });
    await shoppingList1.save();

    const shoppingList2 = new ShoppingList({
      name: 'Electronics',
      owner: user2._id,
      members: [user1._id],
      items: [{ name: 'Laptop' }, { name: 'Phone' }],
    });
    await shoppingList2.save();

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
  }
}

// Run the seeding function
seedData();
