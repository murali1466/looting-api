const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename:'app.log'}),
    new winston.transports.MongoDB({
      db: process.env.DATABASE_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      collection: 'logs', // Collection name in MongoDB
      level: 'silly' // Log level
    })
],
});


module.exports = logger;