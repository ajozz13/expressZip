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
    required: 'Enter the start range of Zipcode.'
  },
  zip_end:{
    type: String,
    required: 'Enter the last range of Zipcode.'
  },
  state_code:{
    type: String,
    required: 'Enter the state code.'
  },
  airport_code:{
    type: String,
    required: 'Enter the default airport code for this zipcode.'
  },
  created_date:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model( 'ZipCodes', ZipSchema );
