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
  },

  // MuShoes Unique Custom ID, called by the schema itself when new listing is being made.
  mushoes_custom_id: {
    type: String,
    unique: true,
    default: function() {
      let mushoesUniqueId = "";
      // create brandPart of uniqueID
      let mushoesIDBrand = this.brand.toLowerCase().replace(/\s+/g, '');

      // create name part of unique id
      let mushoesIDName = "";
      if (this.name.length >= 5) {
        mushoesIDName = this.name.substring(0, 5).toLowerCase().replace(/\s+/g, '');
      }
      else {
        mushoesIDName = this.name.toLowerCase().replace(/\s+/g, '');
      }

      let mushoesIDSize = this.size;

      let mushoesIDColors = "";
      if (this.color && this.color.length > 0) {
        // Sort colors for consistency, then join with hyphen or comma
        mushoesIDColors = this.color.map(c => c.toLowerCase().replace(/\s+/g, '')).sort().join("-");
      }

      let mushoesIDCondition = this.condition.trim().toLowerCase().replace(/\s+/g, '');
      let mushoesIDGender = this.gender.toLowerCase().replace(/\s+/g, '');

      mushoesUniqueId = `${mushoesIDBrand}-${mushoesIDName}-${mushoesIDCondition}-${mushoesIDColors}-${mushoesIDSize}-${mushoesIDGender}`;

      // store this value;
      return mushoesUniqueId;
    }
  }

}, {
  timestamps: true
});


const Shoe = model('Shoe', shoeSchema);

export default Shoe;