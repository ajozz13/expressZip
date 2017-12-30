var db_server = process.env.DBSERVER || '192.168.17.238'

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require( 'mongoose' ),
  Task = require( './api/models/zipModel.js' ),
  bodyParser = require( 'body-parser' );

//db setup
mongoose.Promise = global.Promise;
mongoose.connect( 'mongodb://'+ db_server +'/zipcodes_db' )

//body-parser setup
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

//setup routes
var routes = require( './api/routes/zipRoutes.js' );
routes( app );

//Handle bad requests
app.use( function( req, res ){
  //res.json( { response_code: 0, response_message: 'Upload completed.', response_description: null } );
  res.status( 400 ).send({ response_code: 3, request_url: req.originalUrl, response_message: 'URL is not defined / does not exist.' })
});


app.listen( port );
console.log( 'ExpressZip API started on port '+port+ ' DBServer: '+ db_server );
