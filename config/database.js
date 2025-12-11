const mongoose = require('mongoose');

const mongoDBConfig = {
  development: {
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/tamamlayici-saglik-cms',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  production: {
    url: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ssl: true,
      retryWrites: true,
      w: 'majority'
    }
  },
  test: {
    url: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/tamamlayici-saglik-cms-test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  }
};

const connectDB = async (environment = 'development') => {
  try {
    const config = mongoDBConfig[environment];
    
    if (!config.url) {
      throw new Error(`MongoDB URI not configured for ${environment} environment`);
    }

    await mongoose.connect(config.url, config.options);
    
    console.log(`MongoDB connected successfully in ${environment} environment`);
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    return mongoose.connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('Failed to disconnect from MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  mongoDBConfig
};
