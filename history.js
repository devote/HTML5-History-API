/*
 * history API JavaScript Library v3.0.1 beta
 *
 * Support: IE6+, FF3+, Opera 9+, Safari, Chrome
 *
 * Copyright 2011-2012, Dmitriy Pakhtinov ( spb.piksel@gmail.com )
 *
 * http://spb-piksel.ru/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Update: 18-05-2012
 */

(function( window, True, False, Null, undefined ){

	"use strict";

	var
		// original methods text links
		_a, _r, _d,
		// prefix to names of events
		eventPrefix = "",
		// Symlink for document
		document = window.document,
		// preserve original object of History
		windowHistory = window.history || {},
		// obtain a reference to the Location object
		windowLocation = window.location,
		// Check support HTML5 History API
		api = !!windowHistory.pushState,
		// If the first event is triggered when the page loads
		// This behavior is obvious for Chrome and Safari
		initialState = api && windowHistory.state === undefined,
		initialFire = windowLocation.href,
		// Just a reference to the methods
		historyPushState = windowHistory.pushState,
		historyReplaceState = windowHistory.replaceState,
		JSON = window.JSON || {},
		JSONparse = JSON.parse,
		JSONstringify = JSON.stringify,
		sessionStorage = window.sessionStorage,
		defineProp = Object.defineProperty,
		defineGetter = Object.prototype.__defineGetter__,
		defineSetter = Object.prototype.__defineSetter__,
		hasOwnProperty = Object.prototype.hasOwnProperty,
		toString = Object.prototype.toString,
		// saving originals event methods
		addEvent = ( _a = "addEventListener", window[ _a ] ) || ( _a = "attachEvent", eventPrefix = "on", window[ _a ] ),
		removeEvent = ( _r = "removeEventListener", window[ _r ] ) || ( _r = "detachEvent", window[ _r ] ),
		fireEvent = ( _d = "dispatchEvent", window[ _d ] ) || ( _d = "fireEvent", window[ _d ] ),
		// if we are in Internet Explorer
		msie = eval( "/*@cc_on (@_jscript_version+'').replace(/\\d\\./, '');@*/"),
		// unique ID of the library needed to run VBScript in IE
		libID = ( new Date() ).getTime(),
		// counter of created classes in VBScript
		VBInc = ( defineProp || defineGetter ) && ( !msie || msie > 8 ) ? 0 : 1,
		iframe = msie < 8 ? document.createElement( 'iframe' ) : 0,
		eventsListPopState = [],
		eventsListHashChange = [],
		skipHashChange = 0,

	eventsList = {
		"onpopstate": eventsListPopState,
		"popstate": eventsListPopState,
		"onhashchange": eventsListHashChange,
		"hashchange": eventsListHashChange
	},

	// Internal settings for this library
	sets = (function() {

		var
			i, m, s, config = { "basepath": '/', "redirect": 0, "type": '/' },
			el = document.getElementsByTagName("SCRIPT");

		// parse GET parameters for internal settings.
		for( i = 0; el[ i ]; i++ ) {
			if ( m = /(.*)\/(?:history|spike)(?:-\d\.\d(?:\.\d)?\w?)?(?:\.min)?.js\?(.*)$/i.exec( el[ i ].src ) ) {
				for( i = 0, s = m[ 2 ].split( "&" ); s[ i ]; ) {
					m = s[ i++ ].split( "=" );
					config[ m[ 0 ] ] = m[ 1 ] == 'true' ? 1 : m[ 1 ] == 'false' ? 0 : m[ 1 ] || '';
				}
				break;
			}
		}
		return config;
	})(),
	// link parsing
	normalizeUrl = function( url ) {

		var
			parts, relative,
			spl = windowLocation.href.split( "#" ),
			hash = ( spl.shift(), "#" + spl.join( "#" ) ),
			base = ( hash || "#" ).replace( new RegExp( "^#[\/]?(?:" + sets["type"] + ")?" ), "" ),
			nohash = (parts = base.split( "#" )).shift(),
			href = sets["basepath"] + base,
			pathname = ( relative = ( sets["basepath"] + nohash ).split( "?" ) ).shift(),
			search = relative.join( "?" ),
			hash = ( parts.length > 0 ? "#" : "" ) + parts.join( "#" ),
			firstChar = url && url.substring( 0, 1 ),
			host = windowLocation.protocol + "//" + windowLocation.host,
			special = host;

		if ( url ) {

			pathname = api ? windowLocation.pathname : pathname;

			if ( /[a-z]+\:\/\//.test( url ) ) {
				special = url;
			} else if ( firstChar === "/" ) {
				special += url;
			} else if ( firstChar === "?" ) {
				special += ( pathname.indexOf( "/" ) === 0 ? "" : "/" ) + pathname + url;
			} else if ( firstChar === "#" ) {
				special = ( api ? windowLocation.href : host + href ).split( "#" ).shift() + url;
			} else {
				special += ( pathname.indexOf( "/" ) === 0 ? "" : "/" ) + pathname.replace(/[^\/]+$/g, '') + url;
			}
		}

		relative = ( new RegExp( "^" + host + sets["basepath"] + "(.*)", "i" ) ).exec( url ? special : host + href );

		return {
			base: base,
			nohash: sets["type"] + nohash,
			href: href,
			pathname: pathname,
			search: search ? "?" + search : "",
			hash: hash,
			full: host + href,
			special: special,
			relative: relative && relative[ 1 ] || ""
		}
	},
	// modifiable object of History
	History = !VBInc ? windowHistory : {
		// properties to create an object in IE
		back: windowHistory.back,
		forward: windowHistory.forward,
		go: windowHistory.go,
		pushState: 0,
		replaceState: 0,
		"emulate": !api,
		toString: function() {
			return "[object History]";
		}
	},
	// Accessors for the object History
	HistoryAccessors = {
		state: {
			get: function() {
				return iframe && iframe["storage"] || historyStorage()[ History.location.href ] || Null;
			}
		},
		length: {
			get: function() {
				return windowHistory.length;
			}
		},
		location: {
			set: function( val ) {
				window.location = val;
			},
			get: function() {
				return api ? windowLocation : Location;
			}
		}
	},
	// The new Location object to add it to the object of History
	Location = {
		assign: function( url ) {
			windowLocation.assign( api || url.indexOf( "#" ) !== 0 ? url : "#" + normalizeUrl().nohash + url );
		},
		reload: windowLocation.reload,
		replace: function( url ) {
			windowLocation.replace( api || url.indexOf( "#" ) !== 0 ? url : "#" + normalizeUrl().nohash + url );
		},
		toString: function() {
			return this.href;
		}
	},
	// Accessors for the object Location
	LocationAccessors = {
		href: {
			set: function( val ) {
				windowLocation.href = val;
			},
			get: function() {
				return normalizeUrl().full;
			}
		},
		protocol: {
			set: function( val ) {
				windowLocation.protocol = val;
			},
			get: function() {
				return windowLocation.protocol;
			}
		},
		host: {
			set: function( val ) {
				windowLocation.host = val;
			},
			get: function() {
				return windowLocation.host;
			}
		},
		hostname: {
			set: function( val ) {
				windowLocation.hostname = val;
			},
			get: function() {
				return windowLocation.hostname;
			}
		},
		port: {
			set: function( val ) {
				windowLocation.port = val;
			},
			get: function() {
				return windowLocation.port;
			}
		},
		pathname: {
			set: function( val ) {
				windowLocation.pathname = val;
			},
			get: function() {
				return normalizeUrl().pathname;
			}
		},
		search: {
			set: function( val ) {
				windowLocation.search = val;
			},
			get: function() {
				return normalizeUrl().search;
			}
		},
		hash: {
			set: function( val ) {
				var hash = ( val.indexOf( "#" ) === 0 ? val : "#" + val ),
					urlObject = normalizeUrl();
				if ( iframe ) {
					if ( hash != urlObject.hash ) {
						History.pushState( 0, 0, urlObject.nohash + hash );
						hashChanged( { oldURL: urlObject.full } );
					}
				} else {
					windowLocation.hash = "#" + urlObject.nohash + hash;
				}
			},
			get: function() {
				return normalizeUrl().hash;
			}
		}
	},
	// defineProperties for static objects
	createObject = function( obj, props, novb ) {

		var tmp = obj, key, vb = 0;

		if ( defineProp || defineGetter ) {
			for( key in props ) {
				if ( hasOwnProperty.call( props, key ) ) {
					if ( defineGetter ) {
						props[ key ].get &&
							defineGetter.call( obj, key, props[ key ].get );
						props[ key ].set &&
							defineSetter.call( obj, key, props[ key ].set );
					} else if ( defineProp ) {
						try {
							defineProp( obj, key, props[ key ] );
						} catch( _e_ ) {
							if ( novb ) {
								return 0;
							}
							vb = 1;
							break;
						}
					}
				}
			}
		} else vb = 1;

		if ( vb && VBInc ) {

			var
				staticClass = "StaticClass" + libID + VBInc++,
				parts = [ "Class " + staticClass ],
				hasToString = 0;

			// functions for VBScript
			if ( !( "execVB" in window ) ) {
				// "Public history, onhashchange" needed for overridden global objects in IE
				execScript( 'Public history, onhashchange\nFunction execVB(c) ExecuteGlobal(c) End Function', 'VBScript' );
			}
			if ( !( "VBCVal" in window ) ) {
				execScript( 'Function VBCVal(o,r) If IsObject(o) Then Set r=o Else r=o End If End Function', 'VBScript' );
			}

			for( key in obj ) {
				if ( key === "toString" ) {
					hasToString = 1;
				}
				parts[ parts.length ] = "Public [" + key + "]";
			};

			if ( hasOwnProperty.call( obj, "toString" ) ) {
				if ( !hasToString ) {
					parts[ parts.length ] = "Public [toString]";
				}
				props["(toString)"] = {
					get: function() {
						return this.toString.call( this );
					}
				}
			}

			for( key in props ) {
				if ( hasOwnProperty.call( props, key ) ) {
					if ( props[ key ].get ) {
						obj["get " + key] = props[ key ].get;
						parts.push(
							"Public [get " + key + "]",
							"Public " + ( key === "(toString)" ? "Default " : "" ) + "Property Get [" + key + "]",
							"Call VBCVal(me.[get " + key + "].call(me),[" + key + "])\nEnd Property"
						);

					}
					if ( props[ key ].set ) {
						obj["set " + key] = props[ key ].set;
						hasToString = "Call me.[set " + key + "].call(me,v)\nEnd Property";
						parts.push(
							"Public [set " + key + "]",
							"Public Property Let [" + key + "](v)",
							hasToString,
							"Public Property Set [" + key + "](v)",
							hasToString
						);
					}
				}
			}

			parts.push(
				"End Class",
				"Function " + staticClass + "Factory()",
				"Set " + staticClass + "Factory=New " + staticClass,
				"End Function"
			);

			execVB( parts.join( "\n" ) );

			tmp = window[ staticClass + "Factory" ]();

			for( key in obj ) {
				tmp[ key ] = obj[ key ];
			}
			if ( hasOwnProperty.call( obj, "toString" ) ) {
				tmp.toString = obj.toString;
			}
		}

		return tmp;
	},

	JSONStringify = (function( undefined ) {

		if ( JSONstringify ) {
			return JSONstringify;
		}

		function quote( string ) {

			var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			    meta = {'\b': '\\b','\t': '\\t','\n': '\\n','\f': '\\f','\r': '\\r','"': '\\"','\\': '\\\\'};

			escapable.lastIndex = 0;

			return escapable.test( string ) ? '"' + string.replace( escapable, function( a ) {
				var c = meta[ a ];
				return typeof c === 'string' ? c : '\\u' + ( '0000' + a.charCodeAt( 0 ).toString( 16 ) ).slice( -4 );
			}) + '"' : '"' + string + '"';
		}

		function str( value ) {

			var isArray, result, k,
			    n = ( typeof value ).charCodeAt( 2 );

			       // string
			return n === 114 ? quote( value ) :
				// number
				n === 109 ? isFinite( value ) ? String( value ) : 'null' :
				// boolean, null
				n === 111 || n === 108 ? String( value ) :
				// object
				n === 106 ? function() {

					if ( !value ) return 'null';

					isArray = toString.apply( value ) === '[object Array]';

					result = isArray ? "[" : "{";

					if ( isArray ) {
						for( k = 0; k < value.length; k++ ) {
							result += ( k == 0 ? "" : "," ) + str( value[ k ] );
						}
					} else {
						for( k in value ) {
							if ( hasOwnProperty.call( value, k ) && value[ k ] !== undefined ) {
								result += ( result.length == 1 ? "" : "," ) + quote( k ) + ":" + str( value[ k ] );
							}
						}
					}

					return result + ( isArray ? "]" : "}" );

				}() : undefined;
		}

		return str;
	})(),

	JSONParse = function( source ) {
		return source ? JSONparse ? JSONparse( source ) : (new Function( "return " + source ))() : Null;
	},

	historyStorage = function( state ) {
		return sessionStorage ? state ? sessionStorage.setItem( '__hitoryapi__', JSONStringify( state ) ) :
				JSONParse( sessionStorage.getItem( '__hitoryapi__' ) ) || {} : {};
	},

	fireStateChange = function( type, oldURL, newURL ) {
		var
			winHndl = type === 2 ? window.onhashchange : window.onpopstate,
			name = type === 2 ? 'hashchange' : 'popstate',
			o, list = eventsList[ name ];

		if ( document.createEvent ) {
			o = document.createEvent( 'Events' );
			o.initEvent( name, False, False );
		} else {
			o = document.createEventObject();
			o.type = name;
		}

		o.state = History.state;
		o.oldURL = oldURL;
		o.newURL = newURL;

		if ( winHndl ) {
			winHndl.call( window, o );
		}

		for( var i = 0, len = list.length; i < len; i++ ) {
			list[ i ].call( window, o );
		}
	},

	hashChanged = (function() {

		var
			windowPopState = window.onpopstate || Null,
			windowHashChange = window.onhashchange || Null,
			popstateFired = 0,
			initialStateHandler = Null,
			oldURL = api ? windowLocation.href : normalizeUrl().full,
			oldHash = ( api ? windowLocation.hash : normalizeUrl().hash ).replace( /^#/, "" ),

		fireInitialState = function() {
			if ( initialFire && !( initialFire = 0 ) && normalizeUrl().href !== sets["basepath"] ) {
				clearInterval( initialStateHandler );
				setTimeout( fireStateChange, 10 );
			}
		},

		change = function( e ) {

			if ( skipHashChange ) {
				oldURL = normalizeUrl().full;
				return skipHashChange = 0;
			}

			var
				oldUrl = e.oldURL || oldURL,
				newUrl = oldURL = e.newURL || History.location.href,
				oldHash = oldUrl.replace( /^.*?(#|$)/, "" ),
				newHash = newUrl.replace( /^.*?(#|$)/, "" );

			if ( oldUrl != newUrl && !popstateFired ) {
				// fire popstate
				fireStateChange();
			}

			popstateFired = 0;
			initialFire = 0;

			if ( oldHash != newHash ) {
				// fire hashchange
				fireStateChange( 2, oldUrl, newUrl );
			}
		}

		addEvent( eventPrefix + "hashchange", change, False );

		addEvent( eventPrefix + "popstate", function() {

			// popstate ignore the event when the document is loaded
			if ( initialFire === windowLocation.href ) {
				return initialFire = 0;
			}

			initialFire = 0;

			fireStateChange( popstateFired = 1 );

		}, False );

		History = createObject( History, VBInc ? HistoryAccessors : windowHistory.state === undefined ? {
			// Safari does not support the built-in object state
			state: HistoryAccessors.state,
			// add a location object inside the object History
			location: HistoryAccessors.location
		} : {
			// for all other browsers that work correctly with the history
			location: HistoryAccessors.location
		});

		Location = createObject( Location, LocationAccessors );

		// overwrite addEventListener/attachEvent
		window[ _a ] = function( event, listener, capture, aWantsUntrusted ) {

			if ( eventsList[ event ] ) {
				eventsList[ event ].push( listener );
				if ( !api && eventsListPopState === eventsList[ event ] ) {
					fireInitialState();
				}
			} else {
				addEvent( event, listener, capture, aWantsUntrusted );
			}
		}

		// overwrite removeEventListener/detachEvent
		window[ _r ] = function( event, listener, capture ) {

			var list = eventsList[ event ];

			if ( list ) {
				for( var i = list.length; --i; ) {
					if ( list[ i ] === listener ) {
						list.splice( i, 1 );
						break;
					}
				}
			} else {
				removeEvent( event, listener, capture );
			}
		}

		// overwrite dispatchEvent/fireEvent
		window[ _d ] = function( event, eventObject ) {

			var
				type = event && event.type || event,
				list = eventsList[ event ],
				winHndl = list === eventsListPopState ? window.onpopstate : window.onhashchange;

			if ( list ) {
				eventObject = eventObject || ( typeof event == "string" ? window.event : event );
				try {
					eventObject && ( eventObject.target = window );
				} catch( _e_ ) {
					try {
						eventObject.srcElement = window;
					} catch( _e_ ) {}
				}
				if ( winHndl ) {
					winHndl.call( window, eventObject );
				}
				for( var i = 0, len = list.length; i < len; i++ ) {
					list[ i ].call( window, eventObject );
				}
				return True;
			} else {
				return fireEvent( event, eventObject );
			}
		}

		if ( ( ( !defineProp && !defineGetter ) || !createObject( window, {
			"onhashchange": {
				get: function() {
					return windowHashChange;
				},
				set: function( val ) {
					windowHashChange = val || Null;
				}
			},
			"onpopstate": {
				get: function() {
					return windowPopState;
				},
				set: function( val ) {
					if ( windowPopState = ( val || Null ) ) {
						!api && fireInitialState();
					}
				}
			}
		}, 1 ) ) && !api ) {
			initialStateHandler = setInterval(function() {
				if ( window.onpopstate ) {
					fireInitialState();
				}
			}, 100);
		}

		if ( sets["redirect"] && window.parent.frames.length === 0 ) {

			var
				urlObject = normalizeUrl(),
				search = windowLocation.search,
				path = windowLocation.pathname,
				basepath = sets["basepath"];

			if ( api ) {
				if ( urlObject.href != basepath && (new RegExp( "^" + basepath + "$", "i" )).test( path ) ) {
					windowLocation.href = urlObject.href;
				}
				if ( !(new RegExp( "^" + basepath, "i" )).test( path ) ) {
					windowLocation.href = path.replace(/^\//, basepath ) + search;
				}
			} else if ( path != basepath ) {
				windowLocation.href = basepath + '#' + path.
					replace( new RegExp( "^" + basepath, "i" ), sets["type"] ) + search + windowLocation.hash;
			}
		}

		if ( !JSONparse && !JSONstringify ) {
			JSON.parse = JSONParse;
			JSON.stringify = JSONStringify;
			window.JSON = JSON;
		}

		return change;
		
	})();

	History.pushState = function( state, title, url, replace ) {

		var
			stateObject = historyStorage(),
			currentHref = History.location.href,
			urlObject = url && normalizeUrl( url );

		initialFire = 0;
		url = urlObject ? urlObject.special : currentHref;

		if ( replace && stateObject[ currentHref ] ) {
			delete stateObject[ currentHref ];
		}

		if ( ( !api || initialState ) && sessionStorage && state ) {
			stateObject[ url ] = state;
			historyStorage( stateObject );
			state = Null;
		}

		if ( historyPushState && historyReplaceState ) {
			if ( replace ) {
				historyReplaceState.call( History, state, title, url );
			} else {
				historyPushState.call( History, state, title, url );
			}
		} else if ( urlObject && urlObject.relative != normalizeUrl().relative ) {
			skipHashChange = 1;
			if ( replace ) {
				windowLocation.replace( "#" + sets["type"] + urlObject.relative );
			} else {
				windowLocation.hash = sets["type"] + urlObject.relative;
			}
		}
	}

	History.replaceState = function( state, title, url ) {
		History.pushState( state, title, url, 1 );
	}

	if ( VBInc ) {
		// replace the original History object in IE
		window.history = History;

		// If IE version 7 or lower to the enable iframe navigation
		(function( cookie, currentHref ) {

			if ( !iframe ) return;

			var pushState, hashCheckerHandler,

			checker = function() {
				var href = normalizeUrl().full;
				if ( currentHref != href ) {
					hashChanged({
						oldURL: currentHref,
						newURL: currentHref = href
					});
				}
			}

			// starting interval for check hash
			hashCheckerHandler = setInterval( checker, 100 );

			iframe.src = "javascript:true;";
			iframe = document.documentElement.firstChild.appendChild( iframe ).contentWindow;

			History.pushState = pushState = function( state, title, url, replace, lfirst ) {

				var i = iframe.document,
					content = [ '<script>', 'lfirst=1;', ,'storage=' + JSONStringify( state ) + ';', '</script>' ],
					urlObject = url && normalizeUrl( url );

				if ( !urlObject || !urlObject.relative ) {
					iframe["storage"] = state;
					return;
				}

				if ( !lfirst ) {
					clearInterval( hashCheckerHandler );
				}

				if ( replace ) {
					if ( iframe["lfirst"] ) {
						history.back();
						pushState( state, title, urlObject.special, 0, 1 );
					} else {
						iframe["storage"] = state;
						windowLocation.replace( "#" + sets["type"] + urlObject.relative );
					}
				} else if ( urlObject.special != currentHref || lfirst ) {
					if ( !iframe["lfirst"] ) {
						iframe["lfirst"] = 1;
						pushState( iframe["storage"], title, currentHref, 0, 1 );
					}
					content[ 2 ] = 'parent.location.hash="' + ( sets["type"] + urlObject.relative ).replace( /"/g, '\\"' ) + '";';
					i.open(); i.write( content.join("") ); i.close();
				}

				if ( !lfirst ) {
					currentHref = normalizeUrl().full;
					hashCheckerHandler = setInterval( checker, 100 );
				}
			}

			addEvent( eventPrefix + "unload", function() {
				if ( iframe["storage"] ) {
					var state = {};
					state[ normalizeUrl().full ] = iframe["storage"];
					document.cookie = "_historyAPI=" + escape( JSONStringify( state ) );
				}
				clearInterval( hashCheckerHandler );
			}, False );

			if ( cookie.length > 1 ) {
				cookie = unescape( cookie.pop().split( ";" ).shift() );
				try {
					iframe["storage"] = JSONParse( cookie )[ normalizeUrl().full ];
				} catch( _e_ ) {}
			}

		})( document.cookie.split( "_historyAPI=" ), normalizeUrl().full );
	} else {
		// Add other browsers to emulate variable
		// The object of History, thus, we can learn
		// If the browser has native support for working with history
		window.history["emulate"] = !api;
	}

})( window, !0, !1, null );
