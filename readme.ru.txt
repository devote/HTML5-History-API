Библиотека эмулирует HTML5 History API в старых браузерах.

Библиотека которая не добавляет ненужные методы заставляя их изучать, а оперирует по спецификации w3c, по интерфейсу History.

Для примера могу привести короткий код как с ней работать.

По принципу мы работаем с HTML5 History API так как описано например тут http://htmlbook.ru/html5/history или по спецификации http://www.w3.org/TR/html5/history.html#the-history-interface

То-есть коротенький пример:

на чистом JS:

    <!DOCTYPE html>
    <html>
        <head>
            <script type="text/javascript" src="history.js"></script>
            <script type="text/javascript">
                (function(eventInfo) {
                    // вешаем события на все ссылки в нашем документе
                    document[eventInfo[0]](eventInfo[1] + 'click', function(event) {
                        event = event || window.event;
                        var target = event.target || event.srcElement;
                        // ищем все ссылки с классом 'ajax'
                        if (target && target.nodeName === 'A' &&
                           (' ' + target.className + ' ').indexOf('ajax') >= 0)
                        {
                            // заносим ссылку в историю
                            history.pushState(null, null, target.href);


                            // тут можете вызвать подгрузку данных и т.п.


                            // не даем выполнить действие по умолчанию
                            if (event.preventDefault) {
                                event.preventDefault();
                            } else {
                                event.returnValue = false;
                            }
                        }
                    }, false);

                    // вешаем событие на popstate которое срабатывает при нажатии back/forward в браузере
                    window[eventInfo[0]](eventInfo[1] + 'popstate', function(event) {
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


                        // тут можете вызвать подгрузку данных и т.п.


                        // просто сообщение
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

А теперь показываю пример в связке с jQuery:

    <!DOCTYPE html>
    <html>
        <head>
            <script type="text/javascript" src="history.js"></script>
            <script type="text/javascript" src="jquery.js"></script>
            <script type="text/javascript">
                $(function() {

                    // ищем все ссылки и вешаем события на все ссылки в нашем документе
                    $(document).on('click', 'a.ajax', function() {
                        // заносим ссылку в историю
                        history.pushState(null, null, this.href);


                        // тут можете вызвать подгрузку данных и т.п.


                        // не даем выполнить действие по умолчанию
                        return false;
                    });

                    // вешаем событие на popstate которое срабатывает при нажатии back/forward в браузере
                    $(window).on('popstate', function(e) {

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


                        // тут можете вызвать подгрузку данных и т.п.


                        // просто сообщение
                        alert("Мы вернулись на страницу со ссылкой: " + returnLocation.href);
                    });
                });
            </script>
        </head>
        <body>
            <a class="ajax" href="/mylink.html">My Link</a>
            <a class="ajax" href="/otherlink.html">Other Link</a>
        </body>
    </html>

Использование события popstate при обычном чистом JS:

    window[window.addEventListener ? 'addEventListener' : 'attachEvent']('popstate', function(event) {

        // получение location из объекта window.history
        var loc = history.location || document.location;

        alert("return to: " + loc);

    }, false);


Использование события popstate в связке jQuery:

    $(window).on('popstate', function(e) {

        // получение location из объекта window.history
        var loc = history.location || document.location;

        alert("return to: " + loc);
    });


Вы можете использовать дополнительные параметры конфигурации библиотеки:
    history.min.js?basepath=/pathtosite/ - базовый путь к сайту, по умолчанию имеет значение корня "/".
    history.min.js?redirect=true - включить преобразование ссылок.
    history.min.js?type=/ - подставлять подстроку после якоря, по умолчанию имеет символ "/".

Также вы можете комбинировать опции:
    history.min.js?type=/&redirect=true&basepath=/pathtosite/ - порядок опций не имеет значение.

Или выполнить специальный метод в JavaScript:
    history.redirect(/* type = */ '/', /* basepath = */ '/pathtosite/');

Демо-сайт: http://history.spb-piksel.ru/

GitHub Проект: https://github.com/devote/HTML5-History-API

Я в Twitter: https://twitter.com/DimaPakhtinov
