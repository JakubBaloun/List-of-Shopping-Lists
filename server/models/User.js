
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
    const user = this;
  
    if (!user.isModified('password')) {
      return next();
    }
  
    try {
      // Vytvoření soli a přidání k heslu
      const salt = await bcrypt.genSalt(10); // 10 je počet iterací pro generování soli
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
  
      next();
    } catch (error) {
      return next(error);
    }
  });
  
  // Přidání metody pro porovnání hesel
  userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;
