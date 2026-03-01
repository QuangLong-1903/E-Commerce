const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
const host = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

async function run() {
  console.log('=== fix-image-urls.js starting ===');
  console.log('Node version:', process.version);
  console.log('CWD:', process.cwd());
  console.log('MONGODB_URI:', MONGODB_URI);
  console.log('BACKEND_URL(host):', host);

  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const products = await Product.find({});
  let updatedCount = 0;

  for (const product of products) {
    let changed = false;

    for (const img of product.images) {
      const url = img.url || '';

      // Detect Windows absolute paths or backslash paths
      if (/^[A-Za-z]:\\|\\\\/.test(url) || url.includes('\\')) {
        const filename = img.publicId || path.basename(url);

        // Prefer uploads/products then uploads
        const localPaths = [
          path.join(__dirname, '..', 'uploads', 'products', filename),
          path.join(__dirname, '..', 'uploads', filename),
        ];

        let chosen = null;
        for (const p of localPaths) {
          if (fs.existsSync(p)) {
            chosen = p;
            break;
          }
        }

        if (chosen) {
          const rel = path.relative(path.join(__dirname, '..'), chosen).replace(/\\/g, '/');
          const newUrl = `${host}/${rel}`;
          console.log(`Updating product ${product._id} image ${img._id} -> ${newUrl}`);
          img.url = newUrl;
          changed = true;
        } else {
          // File not found locally; still convert to uploads/products filename URL
          const newUrl = `${host}/uploads/products/${filename}`;
          console.warn(`File not found locally for ${filename}. Setting URL to ${newUrl}`);
          img.url = newUrl;
          changed = true;
        }
      }
    }

    if (changed) {
      await product.save();
      updatedCount++;
    }
  }

  console.log(`Done. Updated ${updatedCount} products.`);
  mongoose.disconnect();
}

run().catch((err) => {
  console.error('Script error:', err);
  mongoose.disconnect();
});
