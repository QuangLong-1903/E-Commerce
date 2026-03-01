const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const users = await User.find({}).select('name email role createdAt');
    console.log(`\n📊 Total users: ${users.length}`);
    console.log('👥 Users in database:');

    if (users.length === 0) {
      console.log('   No users found');
    } else {
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - Created: ${user.createdAt.toLocaleString()}`);
      });
    }

    // Check for admin users
    const adminUsers = users.filter(user => user.role === 'admin');
    if (adminUsers.length > 0) {
      console.log(`\n👑 Admin users: ${adminUsers.length}`);
      adminUsers.forEach(admin => {
        console.log(`   - ${admin.name} (${admin.email})`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

checkUsers();