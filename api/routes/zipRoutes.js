'use strict';

module.exports = function( app ){
  var manager = require( '../controllers/zipController' );

  app.route( '/v1/zipcodes' )
    .get( manager.list_all_zipcodes )
    .post( manager.create_entry );

  app.route( '/v1/zipcodes/:request_id' )
    .get( manager.list_by_country_code )
    .put( manager.update_zip_by_id )
    .delete( manager.remove_zip_by_id );

  app.route( '/v1/zipcodes/:country_code/:zip_code' )
    .get( manager.list_by_zip_code );

}
