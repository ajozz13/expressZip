'use strict';

var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var ZipSchema = new Schema({
  country_code: {
    type: String,
    required: 'USO 2 digit country code is required.'
  },
  zip_start:{
    type: String,
    required: 'Enter the start range of Zipcode.',
    unique: true
  },
  zip_end:{
    type: String,
    required: 'Enter the end range of Zipcode.',
    unique: true
  },
  state_code:{
    type: String,
    required: 'Enter the state code.'
  },
  airport_code:{
    type: String,
    required: 'Enter the default airport code for this zipcode.'
  },
  city_name:{
    type: String,
    required: 'Enter the name of the city.'
  },
  created_date:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model( 'ZipCodes', ZipSchema );
