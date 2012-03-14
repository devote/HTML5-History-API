Library emulates the HTML5 History API in older browsers.
---------------------------------------------------------

How to work with the HTML5 History API, you can learn from official sources.

Using the event popstate the usual pure JS:

    window[ window.addEventListener ? 'addEventListener' : 'attachEvent' ]( 'popstate', function( event ) {

        // receiving location of the event object
        var loc = event.location || document.location;

        alert( "return to: " + loc );

    }, false);


Using the popstate event in conjunction jQuery:

    $( window ).bind( 'popstate', function( event ) {

        // jQuery saving the original event in the property originalEvent
        var loc = event.location || ( event.originalEvent && event.originalEvent.location ) || document.location;

        alert( "return to: " + loc );
    });


You can use the advanced configuration library:

	history-1.2.6.min.js?basepath=/pathtosite/ - the base path to the site defaults to the root "/".
	history-1.2.6.min.js?redirect=false - disable link translation.
	history-1.2.6.min.js?type=/ - substitute the string after the anchor, by default, nothing substitutes.

You can also combine options:

	history-1.2.6.min.js?type=/&redirect=false&basepath=/pathtosite/ - the order of options does not matter.

Demo Site: (http://history.spb-piksel.ru/)
