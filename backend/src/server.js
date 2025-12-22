require('module-alias/register');
const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// Node version check
const [major] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version to 20 or greater. 👌\n ');
  process.exit();
}

// Env variables load karna (Local testing ke liye)
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

// DATABASE Connection String check
// Agar process.env.DATABASE nahi mil raha, toh error dikhaye
if (!process.env.DATABASE) {
  console.error('❌ ERROR: DATABASE connection string is missing in Environment Variables!');
  process.exit(1);
}

// Mongoose connection logic
mongoose.connect(process.env.DATABASE)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch((err) => {
    console.log('❌ MongoDB connection error:');
    console.error(err.message);
  });

mongoose.connection.on('error', (error) => {
  console.log(`🔥 Database connection lost: ${error.message}`);
});

// Models load karna
const modelsFiles = globSync('./src/models/**/*.js');
for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

// Start our app!
const app = require('./app');

// RENDER FIX: Render automatically PORT environment variable deta hai
// Ise hamesha process.env.PORT par hi rakhein
const PORT = process.env.PORT || 8888;

app.set('port', PORT);
const server = app.listen(app.get('port'), () => {
  console.log(`🚀 Express running → On PORT : ${server.address().port}`);
});