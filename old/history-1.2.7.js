/*
 * history API JavaScript Library v1.2.7
 *
 * Copyright 2011-2012, Dmitriy Pakhtinov ( spb.piksel@gmail.com )
 *
 * http://history.spb-piksel.ru/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Update: 07-02-2012
 */

(function( window, undefined ){

		// has support history pushState
	var historyAPI = !!( window.history && history.pushState ),
		// short global document
		doc = window.document,
		// symlink to location
		loc = doc.location,
		// symlink to window.history
		his = null,
		// hash checker is busy
		hashCheckerBusy = false,
		// if hash changed from initialize, has need update
		hasNeedUpdate = true,
		// stack for saving listeners at this library
		eventsList = [],
		// last full url
		lastHash,

	// convert and return a current location.hash data
	hash = function( hash ) {
		return {
			url: ( hash || loc.hash || "#" ).replace( new RegExp( "^#[\/]?(?:" + config.type + ")?" ), "" ),
			full: function() {
				return config.basepath + this.url;
			}
		}
	},

	config = function() {

		var i, m, s, config = { basepath: '/', redirect: true, type: '' },
			el = doc.getElementsByTagName("SCRIPT");

		// parse GET parameters for internal settings.
		for( i = 0; el[ i ]; i++ ) {
			if ( m = /(.*)\/history(?:-\d\.\d(?:\.\d)?(?:\.min)?)?.js\?(.*)$/i.exec( el[ i ].src ) ) {
				for( i = 0, s = m[ 2 ].split( "&" ); s[ i ]; ) {
					m = s[ i++ ].split( "=" );
					config[ m[ 0 ] ] = m[ 1 ] == 'true' ? true : m[ 1 ] == 'false' ? false : m[ 1 ] || '';
				}
				break;
			}
		}

		// if not found history object to just create him
		if ( !window.history ) {
			window.history = {};
		}

		// make a symlink
		his = window.history;

		return config;
	}();

	lastHash = hash().full();

	// initializing core library
	function init() {

		var path = loc.pathname;

		if ( historyAPI ) {
			if ( lastHash != config.basepath && (new RegExp( "^" + config.basepath + "$" )).test( path ) ) {
				window.location = lastHash;
			}
			if ( !(new RegExp( "^" + config.basepath )).test( path ) ) {
				window.location = path.replace(/^\//, config.basepath ) + loc.search;
			}
		} else if ( path != config.basepath ) {
			window.location = config.basepath + '#' + path.
				replace( new RegExp( "^" + config.basepath ), config.type ) + loc.search + loc.hash;
		}

		return true;
	}

	// For browser unsupported history change state
	if ( ( !config.redirect || init() ) && !historyAPI ) {

		his.historyAPI = historyAPI;

		// checking the browser has IE and return him version
		var ieVersion = (function(){
				var v = 3,
					div = doc.createElement( 'div' ),
					all = div.getElementsByTagName( 'i' );
				while ( ( div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->' ) && all[0] ) {}
				return ( v > 4 ) ? v : false;
			})(),
			isIE = Boolean( ieVersion );

		// if IE < 8 version initialize iframe for work back/forward buttons
		if ( isIE && ieVersion < 8 ) {
			function json_encode( value ) {
				function quote( string ) {
					var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
					var meta = {'\b': '\\b','\t': '\\t','\n': '\\n','\f': '\\f','\r': '\\r','"': '\\"','\\': '\\\\'};
					escapable.lastIndex = 0;
					return escapable.test( string ) ? '"' + string.replace( escapable, function( a ) {
						var c = meta[ a ];
						return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt( 0 ).toString( 16 ) ).slice( -4 );
					}) + '"' : '"' + string + '"';
				}
				function str( value ) {
					var isArray, result;
					switch( typeof value ) {
					case 'string':
						return quote( value );
					case 'number':
						return isFinite( value ) ? String( value ) : 'null';
					case 'boolean':
					case 'null':
						return String( value );
					case 'object':
						if ( !value ) return 'null';
						isArray = Object.prototype.toString.apply( value ) === '[object Array]';
						result = isArray ? "[" : "{";
						for( var k in value ) {
							if ( ( isArray && ~~k != k ) || ( !Object.hasOwnProperty.call( value, k ) ) ) continue;
							result += ( result.length == 1 ? "" : "," ) + ( !isArray && quote( k ) + ":" || "" ) + str( value[ k ] );
						}
						return result + ( isArray ? "]" : "}" );
					}
					return null;
				}
				return str( value );
			}
			var iframe = (function() {
				doc.write( '<'+'iframe id="APIHistoryFrame" style="display:none;" src="javascript:true;"></iframe>' );
				return doc.getElementById( "APIHistoryFrame" ).contentWindow;
			})(),
			setIframeHash = function( hash, state ) {
				if ( hash == iframe.curHash ) return;
				iframe.document.open();
				iframe.document.write('<scr'+'ipt>window.curHash="'+hash+'";parent.location.hash="'+hash+'";window.storage='+json_encode(state)+';</scr'+'ipt>');
				iframe.document.close();
			},
			getIframeStorage = function() {
				return iframe.storage;
			}
			getIframeHash = function() {
				return ( iframe.curHash || "/" ).replace( new RegExp( "^" + config.basepath ), config.basepath );
			}
			iframe.curHash = hash().url;
			iframe.storage = null;
		}

		var defineProp = ( Object.defineProperty || function( obj, prop, sets ) {
			if ( obj.__defineSetter__ ) {
				obj.__defineGetter__( prop, sets.get );
				obj.__defineSetter__( prop, sets.set );
			} else {
				var cur = obj[ prop ] = sets.get();
				setInterval(function(){
					if ( obj[ prop ] !== cur ) {
						sets.set( cur = obj[ prop ] );
					}
				}, 1 );
			}
		} );

		// saving stantard method
		var om_addEvent = window.addEventListener ? window.addEventListener : window.attachEvent || function(){},
			om_removeEvent = window.removeEventListener ? window.removeEventListener : window.detachEvent || function(){},
			om_fireEvent = window.dispatchEvent ? window.dispatchEvent : window.fireEvent || function(){},

		// custom addEventListener or attachEvent
		addEvent = function( event, listener, capture ) {
			if ( event === 'popstate' || event === 'onpopstate' ) {
				eventsList.push( listener );
				if ( hasNeedUpdate && !( hasNeedUpdate = false ) && lastHash !== config.basepath && config.redirect ) {
					setTimeout(function(){
						firePopState.call( window, generateLocation( lastHash ) );
					}, 10);
				}
			} else {
				om_addEvent( event, listener, capture );
			}
		},
		// custom removeEventListener or detachEvent
		removeEvent = function( event, listener, capture ) {
			if ( event === 'popstate' || event === 'onpopstate' ) {
				for( var i = 0, len = eventsList.length; i < len; i++ ) {
					if ( eventsList[ i ] === listener ) {
						eventsList.splice( i, 1 );
						break;
					}
				}
			} else {
				om_removeEvent( event, listener, capture );
			}
		},
		// custom dispatchEvent or fireEvent
		fireEvent = function( event, eventObject ) {
			var type = !eventObject && event.type || event;
			if ( type === 'popstate' || type === 'onpopstate' ) {

				eventObject = eventObject || ( typeof event == "string" ? window.event : event );

				for( var i = 0, len = eventsList.length; i < len; i++ ) {
					if ( eventObject ) {
						try {
							eventObject.target = window;
						} catch( _ ) {
							try {
								eventObject.srcElement = window;
							} catch( _ ) {}
						}
					}
					eventsList[ i ].call( window, eventObject );
				}
			} else {
				return om_fireEvent( event, eventObject );
			}
		}

		// override standard functions
		if ( window.addEventListener ) {
			window.addEventListener = addEvent;
			window.removeEventListener = removeEvent;
			window.dispatchEvent = fireEvent;
		} else {
			window.attachEvent = addEvent;
			window.detachEvent = removeEvent;
			window.fireEvent = fireEvent;
		}

		// generate normal "location" object
		generateLocation = function( curhash ) {
			var search, hash, pathname;
				pathname = ( search = curhash.split( "?" ) ).shift();
				search = ( hash = search.join( "?" ).split( "#" ) ).shift();
				hash = hash.join( "#" );

			return {
				hash: hash ? "#" + hash : "",
				host: loc.host,
				hostname: loc.hostname,
				href: loc.protocol + "//" + loc.host + curhash,
				pathname: pathname,
				port: loc.port,
				protocol: loc.protocol,
				search: search ? "?" + search : "",
				toString: function() {
					return this.href;
				}
			}
		}

		// dispatch "popstate" event if location changed
		firePopState = function( location ) {

			his.state = null;
			if ( window.sessionStorage ) {

				var data = sessionStorage.getItem( lastHash );

				if ( window.JSON && JSON.parse ) {
					his.state = data && JSON.parse( data );
				} else {
					his.state = data && (new Function( "return " + data ))();
				}
			} else if ( isIE && ieVersion < 8 ) {
				his.state = iframe.storage;
			}

			his.title = his.state ? his.state.title : null;
			his.state = his.state ? his.state.state : null;
			if ( his.title != null ) {
				doc.title = his.title;
			}

			if ( doc.createEvent ) {
				var o = doc.createEvent( 'Events' );
				o.initEvent( 'popstate', false, false );
				o.location = location;
				o.state = his.state;
				o.title = his.title;
				o.srcElement = window;
				window.dispatchEvent( o );
			} else if( doc.createEventObject ) {
				var o = doc.createEventObject();
				o.srcElement = window;
				o.location = location;
				o.state = his.state;
				o.title = his.title;
				o.type = "popstate";
				window.fireEvent( 'popstate', o );
			}
		}

		// hash check, if browser not support "hashchange" event
		hashChecker = function() {
			if ( hashCheckerBusy ) {
				return false;
			}
			hashCheckerBusy = true;

			var currentHash = hash().full();

			if ( lastHash !== currentHash ) {
				lastHash = currentHash;
				firePopState( generateLocation( currentHash ) );
			}

			hashCheckerBusy = false;
			return true;
		}

		var winPopState = null;
		defineProp( window, 'onpopstate', {
			set: function( value ) {
				if ( value == null ) {
					winPopState && removeEvent( 'popstate', winPopState, false );
				} else if ( Object.prototype.toString.call( value ) === '[object Function]' ) {
					addEvent( 'popstate', winPopState = value, false );
				}
			},
			get: function() { return winPopState }
		});

		if ( isIE && ieVersion < 8) {
			// starting interval for check hash
			setInterval( hashChecker, 100 );
		} else {
			addEvent( ( window.addEventListener ? "" : "on" ) + "hashchange", hashChecker, false );
		}

		// emulate pushState method
		his.pushState = function( state, title, url, replace ) {

			url = url == undefined || url == null ? config.basepath : url;

			var storage = ( window.sessionStorage && window.JSON && JSON.stringify ),
				path, t = ( path = hash().url.split( '/' ) ).pop();

			his.state = state;
			his.title = title;
			state = { state: state, title: title };
			url = url.replace( new RegExp( "^" + loc.protocol + "//" + loc.host + "/" ), "/" );

			while( hashCheckerBusy ) {}
			hashCheckerBusy = true;

			if ( url.indexOf( '?' ) == 0 ) {
				url = config.type + hash().url.replace( /\?.*$/, "" ) + url;
			} else if ( url.indexOf( '/' ) != 0 ) {
				url = config.type + ( path.length === 0 ? url : path.join( "/" ) + "/" + url );
			} else if ( ( new RegExp( "^" + config.basepath ) ).test( url ) ) {
				url = url.replace( new RegExp( "^" + config.basepath ), config.type );
			} else {
				window.location = url;
			}

			if ( replace ) {
				window.location.replace( "#" + url );
				if ( isIE && ieVersion < 8 ) {
					iframe.curHash = url;
				}

				if ( storage ) {
					sessionStorage.removeItem( lastHash );
					sessionStorage.setItem( hash().full(), JSON.stringify( state ) );
				} else if ( isIE && ieVersion < 8 ) {
					iframe.storage = state;
				}
			} else {
				window.location.hash = url;
				if ( isIE && ieVersion < 8 ) {
					setIframeHash( url, state );
				}

				if ( storage ) {
					sessionStorage.setItem( hash().full(), JSON.stringify( state ) );
				}
			}

			if ( title != null ) {
				doc.title = title;
			}

			lastHash = hash().full();

			hashCheckerBusy = false;
		}

		// alias from pushState
		his.replaceState = function( state, title, url ) {
			his.pushState( state, title, url, true )
		}
	}

})( window );