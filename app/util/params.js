/*	Copyright 2013 jQuery Foundation and other contributors
*	http://jquery.com/
*
*	Permission is hereby granted, free of charge, to any person obtaining
*	a copy of this software and associated documentation files (the
*	"Software"), to deal in the Software without restriction, including
*	without limitation the rights to use, copy, modify, merge, publish,
*	distribute, sublicense, and/or sell copies of the Software, and to
*	permit persons to whom the Software is furnished to do so, subject to
*	the following conditions:
*
*	The above copyright notice and this permission notice shall be
*	included in all copies or substantial portions of the Software.
*
*	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
*	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
*	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
*	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
*	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
*	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
*	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var r20 = /%20/g
  , rbracket = /\[\]$/
  ,	rCRLF = /\r?\n/g
  ,	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i
  ,	rsubmittable = /^(?:input|select|textarea|keygen)/i;

// Serialize an array of form elements or a set of
// key/values into a query string
function param( a ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = _.isFunction( value ) ? value() : ( value == null ? "" : value );

			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};


	if ( _.isArray( a ) )
		_.each( a, function(obj) {
			add( obj.name, obj.value );
		});
	else 
		for ( prefix in a )
			buildParams( prefix, a[ prefix ], add );
		
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, add ) {
	var name;

	if ( _.isArray( obj ) ) {
		// Serialize array item.
		_.each( obj, function( val, idx ) {
			if ( rbracket.test( prefix ) ) 
				add( prefix, val );
			else 
				buildParams( prefix + "[" + ( typeof val === "object" ? idx : "" ) + "]", val, add );
		});

	else if ( _.isPlainObject(obj) ) 
		for ( name in obj ) 
			buildParams( prefix + "[" + name + "]", obj[ name ], add );
		
	else 
		add( prefix, obj );	
}

