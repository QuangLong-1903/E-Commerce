const mongoose = require('mongoose');
require('dotenv').config();

async function checkDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Get current database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`📊 Current Database: ${dbName}`);

    // List all databases
    const adminDb = mongoose.connection.db.admin();
    const databases = await adminDb.listDatabases();
    console.log('\n🗂️  Available Databases:');
    databases.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    // Check collections in current database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📁 Collections in "${dbName}":`);
    if (collections.length === 0) {
      console.log('   No collections found');
    } else {
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    }

    // Check users collection specifically
    const usersCollection = mongoose.connection.db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`\n👥 Users in "${dbName}.users": ${userCount}`);

    if (userCount > 0) {
      const users = await usersCollection.find({}).limit(5).toArray();
      console.log('Sample users:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role || 'user'}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();