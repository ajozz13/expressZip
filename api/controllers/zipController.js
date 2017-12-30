'use strict';

var mongoose = require( 'mongoose' ),
  ZipCode = mongoose.model( 'ZipCodes' );

// GET /v1/zipCodes
exports.list_all_zipcodes = function( req, res ){
  ZipCode.find( {}, function( err, entry ){
    handleAnswer( req, res, err, entry, 'OK','No List found.' );
  });
};

// POST /v1/zipCodes
exports.create_entry = function( req, res ){
  var new_entry = new ZipCode( req.body );
  new_entry.save( function( err, entry ){
    handleAnswer( req, res, err, entry, 'Created','Entry could not be created' );
  });
};

// GET /v1/zipcodes/:entry_id
exports.list_by_country_code = function( req, res ){
  ZipCode.find( { country_code: req.params.entry_id }, function( err, entry ){
    handleAnswer( req, res, err, entry, 'OK','No list found for country_code '+ req.params.entry_id );
  });
};

// GET /v1/zipcodes/:country_code/:zip_code
exports.list_by_zip_code = function( req, res ){
  ZipCode.find( { country_code: req.params.country_code, zip_start: req.params.zip_code },
    function( err, entry ){
      handleAnswer( req, res, err, entry, 'OK', 'Zip: '+ req.params.zip_code +' not found in country: '+ req.params.country_code );
  });
};

// PUT /v1/zipcodes/:entry_id
exports.update_zip_by_id = function( req, res ){
  ZipCode.findOneAndUpdate({ _id: req.params.entry_id }, req.body, { new: true },
    function( err, entry ){
      handleAnswer( req, res, err, entry, 'Entry Updated', 'Entry '+ req.params.entry_id +' not found.' );
  });
};

// DELETE /v1/zipcodes/:entry_id
exports.remove_zip_by_id = function( req, res ){
  try{
    ZipCode.findByIdAndRemove({ _id: req.params.entry_id }, function( err, entry ){
      handleAnswer( req, res, err, entry, 'Entry Removed', 'Entry '+ req.params.entry_id +' not found.' );
    });
  }catch( exception ){
    log( exception )
    sendResponse( res, 500, 2, 'Delete request could not be completed', req.originalUrl, null, exception );
  }
};

function handleAnswer( req, res, err, entry, positive_message, negative_message ){
  console.log( entry );
  if( err ){
    sendResponse( res, 500, 2, 'Request could not be completed', req.originalUrl, entry, err );
  }else{
    if( entry == null ){
      sendResponse( res, 400, 1, negative_message, req.originalUrl, entry, err );
    }else{
      if( entry.length == 0 ){
        sendResponse( res, 404, 1, negative_message, req.originalUrl, entry, err );
      }else{
        sendResponse( res, 200, 0, positive_message, req.originalUrl, entry, err );
      }
    }
  }
}

function sendResponse( res, http_code, response_code, response_message, url, entry, error ){
  try{
    if( http_code == 200 ){
      res.json( { response_code: response_code, response_message: response_message, request_url: url, entry: entry } );
    }else{
      res.status( http_code ).send( { response_code: response_code, response_message: response_message, request_url: url, entry: entry, error: error } );
    }
  }catch( exception ){
    console.log( exception );
  }
}
