// src/utils/db-connector.js
const mongoose = require('mongoose');

module.exports.connect = async (uri, cachedConnection, options) => {
  if (cachedConnection) {
    console.log('=> using cached database instance')
    return Promise.resolve(cachedConnection)
  }

  cachedConnection = await mongoose.createConnection(uri, options)
  console.log('=> new database instance')
  return cachedConnection
}