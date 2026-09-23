const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = mongoose.model('User', new mongoose.Schema({ email: String, password: String, role: String, fullName: String }, { _id: false }));
  const users = await User.find({}, 'email fullName').lean();
  console.log('Users in DB:', JSON.stringify(users, null, 2));
  await mongoose.disconnect();
})();
