ENGLISH
=============================================================================================================

Library emulates the HTML5 History API in older browsers.

Library that does not add unnecessary methods forcing them to study, and operates under the specification of w3c, the interface History.

For example I can give a short code to work with her.

In principle we are working with HTML5 History API as described for example here http://diveintohtml5.info/history.html or on the specification http://www.w3.org/TR/html5/history.html#the-history-interface

That is a very brief example:

on pure JS:

    <!DOCTYPE html>
    <html>
        <head>
            <script type="text/javascript" src="history-2.0.2.js"></script>
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
                        * because the object document.location cannot be overriden,
                        * so library the returns generated "location" object within
                        * an object window.history, so get it out of "history.location".
                        * For browsers supporting "history.pushState" get generated
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
            <script type="text/javascript" src="history-2.0.2.js"></script>
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
                        * because the object document.location cannot be overriden,
                        * so library the returns generated "location" object within
                        * an object window.history, so get it out of "history.location".
                        * For browsers supporting "history.pushState" get generated
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

    history.js?basepath=/pathtosite/ - the base path to the site defaults to the root "/".
    history.js?redirect=true - enable link translation.
    history.js?type=/ - substitute the string after the anchor, by default, nothing substitutes.

You can also combine options:

    history.js?type=/&redirect=true&basepath=/pathtosite/ - the order of options does not matter.

Demo Site: http://history.spb-piksel.ru/

I'm on Twitter: https://twitter.com/DimaPakhtinov


-------------------------------------------------------------------------------------------------------------

РУССКИЙ
=============================================================================================================

Библиотека эмулирует HTML5 History API в старых браузерах.

Библиотека которая не добавляет ненужные методы заставляя их изучать, а оперирует по спецификации w3c, по интерфейсу History.

Для примера могу привести короткий код как с ней работать.

По принципу мы работаем с HTML5 History API так как описано например тут http://htmlbook.ru/html5/history или по спецификации http://www.w3.org/TR/html5/history.html#the-history-interface

То-есть коротенький пример:

на чистом JS:

    <!DOCTYPE html>
    <html>
        <head>
            <script type="text/javascript" src="history-2.0.2.js"></script>
            <script type="text/javascript">
                window.onload = function() {

                    // функция для ссылок обрабатывается при клике на ссылку
                    function handlerAnchors() {
                        // заносим ссылку в историю
                        history.pushState( null, null, this.href );


                        // тут можете вызвать подгруздку данных и т.п.


                        // не даем выполнить действие по умолчанию
                        return false;
                    }

                    // ищем все ссылки
                    var anchors = document.getElementsByTagName( 'a' );

                    // вешаем события на все ссылки в нашем документе
                    for( var i = 0; i < anchors.length; i++ ) {
                        anchors[ i ].onclick = handlerAnchors;
                    }

                    // вешаем событие на popstate которое срабатывает при нажатии back/forward в браузере
                    window.onpopstate = function( e ) {

                        // получаем нормальный объект Location

                        /*
                        * заметьте, это единственная разница при работе с данной библиотекой,
                        * так как объект document.location нельзя перезагрузить, поэтому
                        * библиотека history возвращает сформированный "location" объект внутри
                        * объекта window.history, поэтому получаем его из "history.location".
                        * Для браузеров поддерживающих "history.pushState" получаем
                        * сформированный объект "location" с обычного "document.location".
                        */
                        var returnLocation = history.location || document.location;


                        // тут можете вызвать подгруздку данных и т.п.


                        // просто сообщение
                        alert( "Мы вернулись на страницу со ссылкой: " + returnLocation.href );
                    }
                }
            </script>
        </head>
        <body>
            <a href="/mylink.html">My Link</a>
            <a href="/otherlink.html">Other Link</a>
        </body>
    </html>

А тепер показываю пример в связке с jQuery:

    <!DOCTYPE html>
    <html>
        <head>
            <script type="text/javascript" src="history-2.0.2.js"></script>
            <script type="text/javascript" src="jquery.js"></script>
            <script type="text/javascript">
                $(function() {

                    // ищем все ссылки и вешаем события на все ссылки в нашем документе
                    $("a").click(function() {
                        // заносим ссылку в историю
                        history.pushState( null, null, this.href );


                        // тут можете вызвать подгруздку данных и т.п.


                        // не даем выполнить действие по умолчанию
                        return false;
                    });

                    // вешаем событие на popstate которое срабатывает при нажатии back/forward в браузере
                    $( window ).bind( "popstate", function( e ) {

                        // получаем нормальный объект Location

                        /*
                        * заметьте, это единственная разница при работе с данной библиотекой,
                        * так как объект document.location нельзя перезагрузить, поэтому
                        * библиотека history возвращает сформированный "location" объект внутри
                        * объекта window.history, поэтому получаем его из "history.location".
                        * Для браузеров поддерживающих "history.pushState" получаем
                        * сформированный объект "location" с обычного "document.location".
                        */
                        var returnLocation = history.location || document.location;


                        // тут можете вызвать подгруздку данных и т.п.


                        // просто сообщение
                        alert( "Мы вернулись на страницу со ссылкой: " + returnLocation.href );
                    });
                });
            </script>
        </head>
        <body>
            <a href="/mylink.html">My Link</a>
            <a href="/otherlink.html">Other Link</a>
        </body>
    </html>

Использование события popstate при обычном чистом JS:

    window[ window.addEventListener ? 'addEventListener' : 'attachEvent' ]( 'popstate', function( event ) {

        // получение location из объекта window.history
        var loc = history.location || document.location;

        alert( "return to: " + loc );

    }, false);


Использование события popstate в связке jQuery:

    $( window ).bind( 'popstate', function( event ) {

        // получение location из объекта window.history
        var loc = history.location || document.location;

        alert( "return to: " + loc );
    });


Вы можете использовать дополнительные параметры конфигурации библиотеки:

    history.js?basepath=/pathtosite/ - базовый путь к сайту, по умолчанию имеет значение корня "/".
    history.js?redirect=true - включить преобразование ссылок.
    history.js?type=/ - подставлять подстроку после якоря, по умолчанию ничего не подставляет.

Также вы можете комбинировать опции:

    history.js?type=/&redirect=true&basepath=/pathtosite/ - порядок опций не имеет значение.

Демо-сайт: http://history.spb-piksel.ru/

Я в Twitter: https://twitter.com/DimaPakhtinov
