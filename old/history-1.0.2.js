/*
 * history API JavaScript Library v1.0.2
 *
 * Copyright 2011, Dmitriy Pakhtinov
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Date: 25-08-2011
 */

(function( window, undefined ) {
		// has support history pushState
	var historyAPI = !!( window.history && history.pushState ),
		// symlink to window.history
		his = null,
		// short global document
		doc = window.document,
		// hash checker is busy
		hashCheckerBusy = false,
		// if hash changed from initialize, has need update
		hasNeedUpdate = true,
		// stack for saving listeners at this library
		eventsList = [],

	// parse GET parameters for internal settings.
	// !!!please don't rename script filename!!!
	config = function() {
		var out = {}, params, i, query = '',
			el = doc.getElementsByTagName("SCRIPT");
		for( i = 0; el[ i ]; i++ ) {
			if ( match = /(.*)\/history(?:-\d\.\d\.\d(?:\.min)?)?.js\?(.*)$/i.exec( el[ i ].src ) ) {
				out.scriptpath = match[ 1 ] + '/';
				query = match[ 2 ];
				break;
			}
		}
		query = query.split( "&" );
		for( i = 0; i < query.length; i++ ) {
			params = query[ i ].split( "=" );
			out[ params[ 0 ] ] = params[ 1 ] || '';
		}

		out.basepath = out.basepath || '/';
		out.redirect = out.redirect || 1;
		out.redirect = out.redirect == 'true' || out.redirect == 1 ? true : false;

		return out;
	}();

	// if not found history object to just create him
	if ( !window.history ) {
		window.history = {};
	}

	// make a symlink
	his = window.history;

	// convert and return a current location.hash data
	function curHash( hash ) {
		hash = hash || doc.location.hash;
		return hash ? String( hash ).
			replace(/^#\//, config.basepath ).
			replace(/^#/, config.basepath ) : config.basepath;
	}

	// initializing core library
	function init() {

		if ( historyAPI ) {
			if ( curHash() != config.basepath && (new RegExp( "^" + config.basepath + "$" )).test( doc.location.pathname ) ) {
				doc.location = curHash();
				return false;
			}

			if ( !(new RegExp( "^" + config.basepath )).test( doc.location.pathname ) ) {
				doc.location = String( doc.location.pathname ).replace(/^\//, config.basepath ) + doc.location.search;
				return false;
			}
		} else {
			if ( ( doc.location.pathname != config.basepath ) && config.redirect ) {
				doc.location = config.basepath + '#' + 
					String( doc.location.pathname ).
						replace( new RegExp( "^" + config.basepath ), '/' ) + doc.location.search + doc.location.hash;

				return false;
			}
		}

		return true;
	}

	// For browser unsupported history change state
	if ( init() && !historyAPI ) {

			// save current link
		var lastHash = curHash(),
			// checking the browser has IE and return him version
			ieVersion = (function(){
				var v = 3,
					div = doc.createElement( 'div' ),
					all = div.getElementsByTagName( 'i' );
				while ( ( div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->' ) && all[0] ) {}
				return ( v > 4 ) ? v : false;
			})(),
			isIE = Boolean( ieVersion );

		// if IE < 8 version initialize iframe for work back/forward buttons
		if ( isIE && ieVersion < 8 ) {
			var iframe = (function() {
				document.write( '<'+'iframe id="APIHistoryFrame" style="display:none;" src="javascript:true;"></iframe>' );
				return doc.getElementById( "APIHistoryFrame" );
			})(),
			setIframeHash = function( hash ){
				if ( hash == iframe.contentWindow.curHash ) return;
				iframe.contentWindow.document.open();
				iframe.contentWindow.document.write('<scr'+'ipt>window.curHash = "'+hash+'"; parent.location.hash = "'+hash+'"</scr'+'ipt>');
				iframe.contentWindow.document.close();
			},
			getIframeHash = function() {
				return ( iframe.contentWindow.curHash || "/" ).replace( /^\//, config.basepath );
			}
			setIframeHash( lastHash );
		}

		// saving stantard method
		var om_addEvent = window.attachEvent ? window.attachEvent : window.addEventListener || function(){},
			om_removeEvent = window.detachEvent ? window.detachEvent : window.removeEventListener || function(){},
			om_fireEvent = window.fireEvent ? window.fireEvent : window.dispatchEvent || function(){},

		// custom addEventListener or attachEvent
		addEvent = function( event, listener, capture ) {
			if ( event === 'popstate' || event === 'onpopstate' ) {
				eventsList.push( listener );
				if ( hasNeedUpdate ) {
					hasNeedUpdate = false;
					if ( ( curHash() !== config.basepath ) && config.redirect ) {
						setTimeout(function(){
							firePopState.call( window, generateLocation( curHash() ) );
						}, 10);
					}
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
				for( var i = 0, len = eventsList.length; i < len; i++ ) {
					if ( eventObject ) {
						eventObject.target = window;
					}
					return eventsList[ i ].call( window, eventObject );
				}
			} else {
				return om_fireEvent( event, eventObject );
			}
		}

		// override standard functions
		if ( window.attachEvent ) {
			window.attachEvent = addEvent;
			window.detachEvent = removeEvent;
			window.fireEvent = fireEvent;
		} else {
			window.addEventListener = addEvent;
			window.removeEventListener = removeEvent;
			window.dispatchEvent = fireEvent;
		}

		// generate normal "location" object
		generateLocation = function( curhash ) {
			var search, hash, pathname;
				pathname = ( search = curhash.split( "?" ) ).shift();
				search = ( hash = search.join( "?" ).split( "#" ) ).shift();
				hash = hash.join( "#" );

			return {
				hash: hash ? "#" + hash : "",
				host: doc.location.host,
				hostname: "his.sp",
				href: doc.location.protocol + "//" + doc.location.host + curhash,
				pathname: pathname,
				port: doc.location.port,
				protocol: doc.location.protocol,
				search: search ? "?" + search : "",
				toString: function() {
					return this.href;
				}
			}
		}

		// dispatch "popstate" event if location changed
		firePopState = function( location ) {
			if ( document.createEvent ) {
				var o = document.createEvent( 'Events' );
				o.initEvent( 'popstate', false, false );
				o.location = location;
				o.target = window;
				o.type = "popstate";
				window.dispatchEvent( o );
			} else if( document.createEventObject ) {
				var o = document.createEventObject();
				o.srcElement = window;
				o.location = location;
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

			var currentHash = curHash();

			if ( lastHash !== currentHash ) {
				lastHash = currentHash;

				firePopState( generateLocation( currentHash ) );
			} else if ( isIE && ieVersion < 8 ) {
				currentHash = getIframeHash();

				if ( lastHash !== currentHash ) {
					lastHash = currentHash;
					doc.location.hash = lastHash;

					firePopState( generateLocation( currentHash ) );
				}
			}

			hashCheckerBusy = false;
			return true;
		}

		if ( isIE && ieVersion < 8) {
			// starting interval for check hash
			setInterval( hashChecker, 100 );
		} else {
			addEvent( ( window.attachEvent ? "on" : "" ) + "hashchange", hashChecker, false );
		}

		// emulate pushState method
		his.pushState = function( state, title, url ) {
			var path, url, t = ( path = generateLocation( curHash() ).pathname.split( '/' ) ).pop();

			while( hashCheckerBusy ) {}
			hashCheckerBusy = true;

			url = url.replace( new RegExp( "^" + doc.location.protocol + "//" + doc.location.hostname + "/" ), "/" );

			path = path.join( '/' ) + '/';

			if ( url.indexOf( '/' ) < 0 ) {
				lastHash = curHash( path + url );
				doc.location.hash = path + url;
				if ( isIE && ieVersion < 8 ) {
					setIframeHash( path + url );
				}
			} else if ( ( new RegExp( "^" + config.basepath ) ).test( url ) ) {
				url = url.replace( new RegExp( "^" + config.basepath ), '/' );
				lastHash = curHash( url );
				doc.location.hash = url;
				if ( isIE && ieVersion < 8 ) {
					setIframeHash( url );
				}
			} else {
				doc.location = url;
			}

			lastHash = curHash();
			hashCheckerBusy = false;
		}

		// alias from pushState
		his.replaceState = his.pushState;
	}

})( window );