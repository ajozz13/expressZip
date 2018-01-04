var request = require( 'request' );
var base_url = 'http://localhost:3000';

describe( 'expressZip server', function(){

  //READ requests
  describe( 'GET /v1/zipcodes', function(){

    var items = { country_code: 'BR', city_name: 'TURIUBA', state_code: 'SP', airport_code: 'SAO', zip_start: '15280-000', zip_end: '15284-999' };
    var created_id;

    it( 'should return error response when requesting empty lists', function(done){
      request.get( base_url+'/v1/zipcodes', { json: true }, function( error, response, body ){
        try{
          expect( body ).not.toBe( null );
          expect( response.statusCode ).toBe( 404 );
          expect( body.response_code ).toBe( 1 );
          expect( body.response_message ).toBe( "No List found" );
          expect( body.request_url ).toBe( "/v1/zipcodes" );
          expect( body.entry ).not.toBe( null );
          expect( body.entry.length ).toBe( 0 );
          expect( body.error ).toBe( "No List found" );
          done();
        }catch( exc ){
          console.log( exc );
          expect().fail();
        }
      });
    });

    it( 'can post a simple test via json', function(done){
      //Post as JSON input
      request.post( base_url+'/v1/zipcodes', { json: items, headers: { 'Content-Type' : 'application/json' } }, function( error, response, body ){
        try{
          expect( body ).not.toBe( null );
          expect( response.statusCode ).toBe( 201 );
          expect( body.response_code ).toBe( 0 );
          expect( body.response_message ).toBe( "Created" );
          expect( body.request_url ).toBe( "/v1/zipcodes" );
          expect( body.entry ).not.toBe( null );
          expect( body.entry.airport_code ).toBe( "SAO" );
          expect( body.entry.state_code ).toBe( "SP" );
          created_id = body.entry._id;
          done();
        }catch( exc ){
          console.log( exc );
          expect().fail();
        }
      });

    });

    it( 'retrieves the full list of zip codes', function(done){
      request.get( base_url+'/v1/zipcodes', { json: true }, function( error, response, body ){
        try{
          expect( body ).not.toBe( null );
          expect( response.statusCode ).toBe( 200 );
          expect( body.response_code ).toBe( 0 );
          expect( body.response_message ).toBe( "OK" );
          expect( body.request_url ).toBe( "/v1/zipcodes" );
          expect( body.entry ).not.toBe( null );
          expect( body.entry.length ).toBeGreaterThan( 0 );
          done();
        }catch( exc ){
          console.log( exc );
          expect().fail();
        }
      });
    });

    it( 'retrieves zip by country_code', function(done){
      request.get( base_url+'/v1/zipcodes/BR', { json: true }, function( error, response, body ){
        try{
          expect( body ).not.toBe( null );
          expect( response.statusCode ).toBe( 200 );
          expect( body.response_code ).toBe( 0 );
          expect( body.response_message ).toBe( "OK" );
          expect( body.request_url ).toBe( "/v1/zipcodes/BR" );
          expect( body.entry ).not.toBe( null );
          expect( body.entry.length ).toBeGreaterThan( 0 );
          done();
        }catch( exc ){
          console.log( exc );
          expect().fail();
        }
      });
    });

    it( 'retrieves zip by single_zip request', function(done){
      request.get( base_url+'/v1/zipcodes/BR/15280-500', { json: true }, function( error, response, body ){
          try{
            expect( body ).not.toBe( null );
            expect( response.statusCode ).toBe( 200 );
            expect( body.response_code ).toBe( 0 );
            expect( body.response_message ).toBe( "OK" );
            expect( body.request_url ).toBe( "/v1/zipcodes/BR/15280-500" );
            expect( body.entry ).not.toBe( null );
            expect( body.entry.length ).toBe( 1 );
            expect( body.entry[0].airport_code ).toBe( "SAO" );
            expect( body.entry[0].city_name ).toBe( "TURIUBA" );
            done();
          }catch( exc ){
            console.log( exc );
            expect().fail();
          }
      });
    });

    it( 'returns correctly from bad zipcodes request', function(done){
      request.get( base_url+'/v1/zipcodes/BR/33126', { json: true }, function( error, response, body ){
          try{
            expect( body ).not.toBe( null );
            expect( response.statusCode ).toBe( 404 );
            expect( body.response_code ).toBe( 1 );
            expect( body.response_message ).toMatch( /33126 not found/ );
            expect( body.error ).toMatch( /33126 not found/ );
            expect( body.request_url ).toBe( "/v1/zipcodes/BR/33126" );
            expect( body.entry ).not.toBe( null );
            expect( body.entry.length ).toBe( 0 );
            done();
          }catch( exc ){
            console.log( exc );
            expect().fail();
          }
      });
    });

    it( 'responds correctly to bad URL requests', function(done){
      request.get( base_url+'/v2/notdefinedurl', { json: true }, function( error, response, body ){
        try{
          expect( body ).not.toBe( null );
          expect( response.statusCode ).toBe( 400 );
          expect( body.response_code ).toBe( 3 );
          expect( body.response_message ).toMatch( /not defined/ );
          expect( body.request_url ).toBe( "/v2/notdefinedurl" );
          done();
        }catch( exc ){
          console.log( exc );
          expect().fail();
        }
      });
    });

    it( 'deletes the GET test entry', function(done){
        request.delete( base_url+'/v1/zipcodes/'+created_id, function( error, response, body ){
          try{
            expect( body ).not.toBe( null );
            var ans = JSON.parse( body );
            expect( response.statusCode ).toBe( 200 );
            expect( ans.response_code ).toBe( 0 );
            expect( ans.response_message ).toBe( "Entry Removed" );
            expect( ans.request_url ).toBe( "/v1/zipcodes/"+created_id );
            expect( ans.entry ).not.toBe( null );
            expect( ans.entry.airport_code ).toBe( "SAO" );
            done();
          }catch( exc ){
            console.log( exc );
            expect().fail();
          }
        });
    }); //END GET

    //CREATE UPDATE AND DELETE A REQUEST
    describe( 'POST-PUT-DELETE /v1/zipcodes', function(){
      var items = { country_code: 'BR', city_name: 'RIO DE JANEIRO', state_code: 'RJ', airport_code: 'RIO', zip_start: '29999-011', zip_end: '29999-270' };
      var created_id;
      //via application/x-www-form-urlencoded form submission
      it( 'responds correctly to form submission', function(done){
        request.post( base_url+'/v1/zipcodes', { form: items }, function( error, response, body ){

          try{
            expect( body ).not.toBe( null );
            var ans = JSON.parse( body );
            expect( response.statusCode ).toBe( 201 );
            expect( ans.response_code ).toBe( 0 );
            expect( ans.response_message ).toBe( "Created" );
            expect( ans.request_url ).toBe( "/v1/zipcodes" );
            expect( ans.entry ).not.toBe( null );
            expect( ans.entry.airport_code ).toBe( "RIO" );
            created_id = ans.entry._id;
            done();
          }catch( exc ){
            console.log( exc );
            expect().fail();
          }
        });
      });

      it( 'should prevent duplicate submissions', function(done){
        request.post( base_url+'/v1/zipcodes', { form: items }, function( error, response, body ){

          try{
            expect( body ).not.toBe( null );
            var ans = JSON.parse( body );
            expect( response.statusCode ).toBe( 500 );
            expect( ans.response_code ).toBe( 2 );
            expect( ans.response_message ).toBe( "Request could not be completed" );
            expect( ans.request_url ).toBe( "/v1/zipcodes" );
            expect( ans.error ).not.toBe( null );
            expect( ans.error.code ).toBe( 11000 );
            expect( ans.error.errmsg ).toMatch( /duplicate key error/ );
            done();
          }catch( exc ){
            console.log( exc );
            expect().fail();
          }
        });
      });

      it( 'should prevent incomplete requests', function(done){
        delete items.zip_start;
        request.post( base_url+'/v1/zipcodes', { form: items }, function( error, response, body ){
          try{
            expect( body ).not.toBe( null );
            var ans = JSON.parse( body );
            expect( response.statusCode ).toBe( 400 );
            expect( ans.response_code ).toBe( 2 );
            expect( ans.response_message ).toBe( "Request could not be completed" );
            expect( ans.request_url ).toBe( "/v1/zipcodes" );
            expect( ans.error ).not.toBe( null );
            expect( ans.error.errors ).not.toBe( null );
            expect( ans.error.errors.zip_start ).not.toBe( null );
            expect( ans.error.errors.zip_start.message ).toMatch( /Enter the start range/ );
            done();
          }catch( exc ){
            console.log( exc );
            expect().fail();
          }
        });
      });

      //PUT UDATE REQUEST
      //Set the airport code of this entry to SAO  --<< Is incorrect but it is for easy testing
      it( 'updates an entry request', function(done){
        request.put( base_url+'/v1/zipcodes/'+created_id, { form: { airport_code: "SAO" } }, function( error, response, body ){

          try{
            expect( body ).not.toBe( null );
            var ans = JSON.parse( body );
            expect( response.statusCode ).toBe( 200 );
            expect( ans.response_code ).toBe( 0 );
            expect( ans.response_message ).toBe( "Entry Updated" );
            expect( ans.request_url ).toBe( "/v1/zipcodes/"+created_id );
            expect( ans.entry ).not.toBe( null );
            expect( ans.entry.airport_code ).toBe( "SAO" );
            done();
          }catch( exc ){
            console.log( exc );
            expect().fail();
          }
        });
      });

      //DELETE REQUEST TEST
      it( 'deletes an entry request', function(done){
        request.delete( base_url+'/v1/zipcodes/'+created_id, function( error, response, body ){

          try{
            expect( body ).not.toBe( null );
            var ans = JSON.parse( body );
            expect( response.statusCode ).toBe( 200 );
            expect( ans.response_code ).toBe( 0 );
            expect( ans.response_message ).toBe( "Entry Removed" );
            expect( ans.request_url ).toBe( "/v1/zipcodes/"+created_id );
            expect( ans.entry ).not.toBe( null );
            expect( ans.entry.airport_code ).toBe( "SAO" );
            done();
          }catch( exc ){
            console.log( exc );
            expect().fail();
          }
        });
      });

    }); //END POST-PUT-DELETE

  });
});
