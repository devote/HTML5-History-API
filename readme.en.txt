Library emulates the HTML5 History API in older browsers.

Library that does not add unnecessary methods forcing them to study, and operates under the specification of w3c, the interface History.

For example I can give a short code to work with her.

In principle we are working with HTML5 History API as described for example here http://diveintohtml5.info/history.html or on the specification http://www.w3.org/TR/html5/history.html#the-history-interface

That is a very brief example:

on pure JS:

    <!DOCTYPE html>
    <html>
        <head>
            <script type="text/javascript" src="history.js"></script>
            <script type="text/javascript">
                window.onload = function() {
    
                    // function for the reference is processed when you click on the link
                    function handlerAnchors() {
                        // keep the link in the browser history
                        history.pushState( null, null, this.href );
    
    
                        // here can cause data loading, etc.
    
    
                        // do not give a default action
                        return false;
                    }
    
                    // looking for all the links
                    var anchors = document.getElementsByTagName( 'a' );
    
                    // hang on the event, all references in this document
                    for( var i = 0; i < anchors.length; i++ ) {
                        anchors[ i ].onclick = handlerAnchors;
                    }
    
                    // hang on popstate event triggered by pressing back/forward in browser
                    window.onpopstate = function( e ) {
    
                        // we get a normal Location object
    
                        /*
                        * Note, this is the only difference when using this library,
                        * because the object document.location don't overwritten,
                        * so library the returns generated "location" object within
                        * an object window.history, so get it out of "history.location".
                        * For browsers supporting "history.pushState" get shaped
                        * object "location" with the usual "document.location".
						*/
                        var returnLocation = history.location || document.location;
    
    
                        // here can cause data loading, etc.
    
    
                        // just post
                        alert( "We returned to the page with a link: " + returnLocation.href );
                    }
                }
            </script>
        </head>
        <body>
            <a href="/mylink.html">My Link</a>
            <a href="/otherlink.html">Other Link</a>
        </body>
    </html>

And now show an example in conjunction with jQuery:

    <!DOCTYPE html>
    <html>
        <head>
            <script type="text/javascript" src="history.js"></script>
            <script type="text/javascript" src="jquery.js"></script>
            <script type="text/javascript">
                $(function() {
    
                    // looking for all the links and hang on the event, all references in this document
                    $("a").click(function() {
                        // keep the link in the browser history
                        history.pushState( null, null, this.href );
    
    
                        // here can cause data loading, etc.
    
    
                        // do not give a default action
                        return false;
                    });
    
                    // hang on popstate event triggered by pressing back/forward in browser
                    $( window ).bind( "popstate", function( e ) {
    
                        // we get a normal Location object
    
                        /*
                        * Note, this is the only difference when using this library,
                        * because the object document.location don't overwritten,
                        * so library the returns generated "location" object within
                        * an object window.history, so get it out of "history.location".
                        * For browsers supporting "history.pushState" get shaped
                        * object "location" with the usual "document.location".
						*/
                        var returnLocation = history.location || document.location;
    
    
                        // here can cause data loading, etc.
    
    
                        // just post
                        alert( "We returned to the page with a link: " + returnLocation.href );
                    });
                });
            </script>
        </head>
        <body>
            <a href="/mylink.html">My Link</a>
            <a href="/otherlink.html">Other Link</a>
        </body>
    </html>

Using the event popstate the usual pure JS:

    window[ window.addEventListener ? 'addEventListener' : 'attachEvent' ]( 'popstate', function( event ) {

        // receiving location from the window.history object
        var loc = history.location || document.location;

        alert( "return to: " + loc );

    }, false);


Using the popstate event in conjunction jQuery:

	$( window ).bind( 'popstate', function( event ) {

        // receiving location from the window.history object
		var loc = history.location || document.location;

        alert( "return to: " + loc );
	});


You can use the advanced configuration library:
	history.min.js?basepath=/pathtosite/ - the base path to the site defaults to the root "/".
	history.min.js?redirect=true - enable link translation.
	history.min.js?type=/ - substitute the string after the anchor, by default, nothing substitutes.

You can also combine options:
	history.min.js?type=/&redirect=true&basepath=/pathtosite/ - the order of options does not matter.

Or execute special method in JavaScript:
    history.redirect( /* type = */ '/', /* basepath = */ '/pathtosite/' );

Demo Site: http://history.spb-piksel.ru/

GitHub Project: https://github.com/devote/HTML5-History-API

I'm on Twitter: https://twitter.com/DimaPakhtinov
