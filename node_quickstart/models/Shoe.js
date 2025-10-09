/* Shoe.js */
/* This file creates the Shoe Schema, which every document (shoe) will use inside the Shoe collection in MongoDB */

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const shoeSchema = new Schema({

  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    maxlength: 1,
    enum: ['M', 'F']
  },
  color: {
    type: Array
  },
  condition: {
    type: String,
    enum: ['New', 'Used', 'Like New'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  description: {
    type: String,
  },
  images: {
    type: Array
  }

}, {
  timestamps: true
});


const Shoe = model('Shoe', shoeSchema);

export default Shoe;