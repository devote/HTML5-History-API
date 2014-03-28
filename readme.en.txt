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
                (function(eventInfo) {
                    // hang on the event, all references in this document
                    document[eventInfo[0]](eventInfo[1] + 'click', function(event) {
                        event = event || window.event;
                        var target = event.target || event.srcElement;
                        // looking for all the links with 'ajax' class found
                        if (target && target.nodeName === 'A' &&
                           (' ' + target.className + ' ').indexOf('ajax') >= 0)
                        {
                            // keep the link in the browser history
                            history.pushState(null, null, target.href);


                            // here can cause data loading, etc.


                            // do not give a default action
                            if (event.preventDefault) {
                                event.preventDefault();
                            } else {
                                event.returnValue = false;
                            }
                        }
                    }, false);

                    // hang on popstate event triggered by pressing back/forward in browser
                    window[eventInfo[0]](eventInfo[1] + 'popstate', function(event) {
                        // we get a normal Location object

                        /*
                         * Note, this is the only difference when using this library,
                         * because the object document.location cannot be overriden,
                         * so library the returns generated "location" object within
                         * an object window.history, so get it out of "history.location".
                         * For browsers supporting "history.pushState" get generated
                         * object "location" with the usual "document.location".
                         */
                        var returnLocation = history.location || document.location;


                        // here can cause data loading, etc.


                        // just post
                        alert("We returned to the page with a link: " + returnLocation.href);
                    }, false);
                })(window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on']);
            </script>
        </head>
        <body>
            <a class="ajax" href="/mylink.html">My Link</a>
            <a class="ajax" href="/otherlink.html">Other Link</a>
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
                    $(document).on('click', 'a.ajax', function() {
                        // keep the link in the browser history
                        history.pushState(null, null, this.href);


                        // here can cause data loading, etc.


                        // do not give a default action
                        return false;
                    });

                    // hang on popstate event triggered by pressing back/forward in browser
                    $(window).on('popstate', function(e) {

                        // we get a normal Location object

                        /*
                        * Note, this is the only difference when using this library,
                        * because the object document.location cannot be overriden,
                        * so library the returns generated "location" object within
                        * an object window.history, so get it out of "history.location".
                        * For browsers supporting "history.pushState" get generated
                        * object "location" with the usual "document.location".
                        */
                        var returnLocation = history.location || document.location;


                        // here can cause data loading, etc.


                        // just post
                        alert("We returned to the page with a link: " + returnLocation.href);
                    });
                });
            </script>
        </head>
        <body>
            <a class="ajax" href="/mylink.html">My Link</a>
            <a class="ajax" href="/otherlink.html">Other Link</a>
        </body>
    </html>

Using the event popstate the usual pure JS:

    window[window.addEventListener ? 'addEventListener' : 'attachEvent']('popstate', function(event) {

        // receiving location from the window.history object
        var loc = history.location || document.location;

        alert("return to: " + loc);

    }, false);


Using the popstate event in conjunction jQuery:

    $(window).on('popstate', function(e) {

        // receiving location from the window.history object
        var loc = history.location || document.location;

        alert("return to: " + loc);
    });


You can use the advanced configuration library:
    history.min.js?basepath=/pathtosite/ - the base path to the site defaults to the root "/".
    history.min.js?redirect=true - enable link translation.
    history.min.js?type=/ - substitute the string after the anchor, by default "/".

You can also combine options:
    history.min.js?type=/&redirect=true&basepath=/pathtosite/ - the order of options does not matter.

Or execute special method in JavaScript:
    history.redirect(/* type = */ '/', /* basepath = */ '/pathtosite/');

Demo Site: http://history.spb-piksel.ru/

GitHub Project: https://github.com/devote/HTML5-History-API

I'm on Twitter: https://twitter.com/DimaPakhtinov

-----------------------------
Want to thank you for my job?

PayPal: spb.piksel@gmail.com

WebMoney:
WMR: R258217300226
WMZ: Z314183434448

Yandex.Money: 41001414127851

Alfa-Bank Card # 5486732005875430 - 11/15
