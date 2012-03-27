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
                        * библиотека сформированный Location объект посылает через объект event
                        */
                        var returnLocation = e.location || document.location;


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
                        * библиотека history возвращает сформированный "location" объект внутри объекта Event
                        * поэтому получаем его из "e.location", объект "e.originalEvent" нужен в том случае
                        * если вы используете библиотеку jQuery так как она возвращает оригинальный объект
                        * именно в этой переменной. Для браузеров поддерживающих "history.pushState" получаем
                        * сформированный объект "location" с обычного "document.location".
                        */
                        var returnLocation = e.location || ( e.originalEvent && e.originalEvent.location ) || document.location;


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

        // получение location из объекта event
        var loc = event.location || document.location;

        alert( "return to: " + loc );

    }, false);


Использование события popstate в связке jQuery:

	$( window ).bind( 'popstate', function( event ) {

		// jQuery оригинальное событие хранит в свойстве originalEvent
		var loc = event.location || ( event.originalEvent && event.originalEvent.location ) || document.location;

        alert( "return to: " + loc );
	});


Вы можете использовать дополнительные параметры конфигурации библиотеки:
	history-1.2.6.min.js?basepath=/pathtosite/ - базовый путь к сайту, по умолчанию имеет значение корня "/".
	history-1.2.6.min.js?redirect=true - включить преобразование ссылок.
	history-1.2.6.min.js?type=/ - подставлять подстроку после якоря, по умолчанию ничего не подставляет.

Также вы можете комбинировать опции:
	history-1.2.6.min.js?type=/&redirect=true&basepath=/pathtosite/ - порядок опций не имеет значение.

Демо-сайт: http://history.spb-piksel.ru/

GitHub Проект: https://github.com/devote/HTML5-History-API

Я в Twitter: https://twitter.com/DimaPakhtinov
