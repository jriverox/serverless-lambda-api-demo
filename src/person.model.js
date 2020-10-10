// src/person.model.js
const mongoose = require('mongoose');
const schema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    eyeColor: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    preferences: {
      hobby: {
        type: String,
        required: false,
      },
      color: {
        type: String,
        required: false,
      },
    },
  },
  {
    collection: 'people',
  },
)

const getModel = (connection) => {
  const model = connection.model('PersonModel', schema);
  return model;
}

module.exports = {
  getModel
}