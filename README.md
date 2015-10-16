ENGLISH
=============================================================================================================

This Javascript library provides an emulation of HTML5 History API for older browsers.

The library operates according to W3C specification, adding no new or incompatible methods. The library can be used exactly as described, for example, in Dive Into HTML5 book (http://diveintohtml5.info/history.html) or in the History API Specification (http://www.w3.org/TR/html5/browsers.html#the-history-interface).

### You may install this plugin with this command:
```shell
npm install html5-history-api
```

### Browser Support:

`history.js` - IE8+ and other browsers

`history.ielte7.js` - IE6+ and other browsers

### For library developers:

To enable support for HTML5-History-API polyfill in your library, you need to add one line of code: 
```js
var location = window.history.location || window.location;
```

code of library looks like this:
```js
(function(){
  // To enable support for HTML5-History-API polyfill in your library
  var location = window.history.location || window.location;

  // you library code here
  // ....
  // ....
  // ....
})();
```

### AMD Support:
```html
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="/require.js"></script>
    <script type="text/javascript">
      requirejs(['/history'], function() {
        if (history.emulate) {
          console.log('In your browser is emulated HTML5-History-API');
        } else {
          console.log('In your browser is natively support HTML5-History-API');
        }
      });
    </script>
  </head>
  <body>
  </body>
</html>
```

### Example of using the library in the pure JS context:
```html
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="history.js"></script>
    <script type="text/javascript">
      (function(eventInfo) {
        // we get a normal Location object

        /*
         * Note, this is the only difference when using this library,
         * because the object window.location cannot be overriden,
         * so library the returns generated "location" object within
         * an object window.history, so get it out of "history.location".
         * For browsers supporting "history.pushState" get generated
         * object "location" with the usual "window.location".
         */
        var location = window.history.location || window.location;

        // hang on the event, all references in this document
        document[eventInfo[0]](eventInfo[1] + 'click', function(event) {
          event = event || window.event;
          var target = event.target || event.srcElement;
          // looking for all the links with 'ajax' class found
          if (target && target.nodeName === 'A' &&
             (' ' + target.className + ' ').indexOf(' ajax ') >= 0)
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

          // here can cause data loading, etc.

          // just post
          alert("We returned to the page with a link: " + location.href);
        }, false);
      })(window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on']);
    </script>
  </head>
  <body>
    <a class="ajax" href="/mylink.html">My Link</a>
    <a class="ajax" href="/otherlink.html">Other Link</a>
  </body>
</html>
```

### Example of using the library along with JQuery:
```html
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="history.js"></script>
    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript">
      $(function() {
        // we get a normal Location object

        /*
         * Note, this is the only difference when using this library,
         * because the object window.location cannot be overriden,
         * so library the returns generated "location" object within
         * an object window.history, so get it out of "history.location".
         * For browsers supporting "history.pushState" get generated
         * object "location" with the usual "window.location".
         */
        var location = window.history.location || window.location;

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

          // here can cause data loading, etc.

          // just post
          alert("We returned to the page with a link: " + location.href);
        });
      });
    </script>
  </head>
  <body>
    <a class="ajax" href="/mylink.html">My Link</a>
    <a class="ajax" href="/otherlink.html">Other Link</a>
  </body>
</html>
```

### Advanced library configuration:

    history.js?basepath=/pathtosite/ - the base path to the site; defaults to the root "/".
    history.js?redirect=true - enable link translation.
    history.js?type=/ - substitute the string after the anchor; by default "/".

You can also combine options:

    history.js?type=/&redirect=true&basepath=/pathtosite/ - the order of options does not matter.

Or execute special method in JavaScript:
```js
history.redirect(/* type = */ '/', /* basepath = */ '/pathtosite/');
```
Demo Site: http://history.spb-piksel.ru/ or http://devote.github.io/demos/history/

Follow me on Twitter: https://twitter.com/DimaPakhtinov

-------------------------------------------------------------------------------------------------------------

РУССКИЙ
=============================================================================================================

Библиотека эмулирует HTML5 History API в старых браузерах.

Библиотека, которая не добавляет ненужные методы, заставляя их изучать, а оперирует по спецификации w3c, по интерфейсу History.

Для примера могу привести короткий код как с ней работать.

По принципу мы работаем с HTML5 History API так как описано, например, тут http://htmlbook.ru/html5/history или по спецификации http://www.w3.org/TR/html5/history.html#the-history-interface

### Вы можете установить плагин с помощью команды:
```shell
npm install html5-history-api
```

### Поддержка браузеров:

`history.js` - IE8+ и другие браузеры

`history.ielte7.js` - IE6+ и другие браузеры

### Для разработчиков библиотек:

Для включения поддержки плагина HTML5-History-API polyfill в своих библиотеках, добавьте строку кода:
```js
var location = window.history.location || window.location;
```

код будет выглядеть примерно так:
```js
(function(){
  // Включает поддержку плагина HTML5-History-API polyfill
  var location = window.history.location || window.location;

  // код вашей библиотеки
  // ....
  // ....
  // ....
})();
```

### Поддержка AMD:
```html
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="/require.js"></script>
    <script type="text/javascript">
      requirejs(['/history'], function() {
        if (history.emulate) {
          console.log('В вашем браузере эмулируется HTML5-History-API');
        } else {
          console.log('В вашем браузере есть поддержка HTML5-History-API');
        }
      });
    </script>
  </head>
  <body>
  </body>
</html>
```

### Коротенький пример на чистом JS:
```html
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="history.js"></script>
    <script type="text/javascript">
      (function(eventInfo) {
        // получаем нормальный объект Location

        /*
         * заметьте, это единственная разница при работе с данной библиотекой,
         * так как объект window.location нельзя перезагрузить, поэтому
         * библиотека history возвращает сформированный "location" объект внутри
         * объекта window.history, поэтому получаем его из "history.location".
         * Для браузеров поддерживающих "history.pushState" получаем
         * сформированный объект "location" с обычного "window.location".
         */
        var location = window.history.location || window.location;

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

          // тут можете вызвать подгрузку данных и т.п.

          // просто сообщение
          alert("We returned to the page with a link: " + location.href);
        }, false);
      })(window.addEventListener ? ['addEventListener', ''] : ['attachEvent', 'on']);
    </script>
  </head>
  <body>
    <a class="ajax" href="/mylink.html">My Link</a>
    <a class="ajax" href="/otherlink.html">Other Link</a>
  </body>
</html>
```

### А теперь показываю пример в связке с jQuery:

```html
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="history.js"></script>
    <script type="text/javascript" src="jquery.js"></script>
    <script type="text/javascript">
      $(function() {
        // получаем нормальный объект Location

        /*
         * заметьте, это единственная разница при работе с данной библиотекой,
         * так как объект window.location нельзя перезагрузить, поэтому
         * библиотека history возвращает сформированный "location" объект внутри
         * объекта window.history, поэтому получаем его из "history.location".
         * Для браузеров поддерживающих "history.pushState" получаем
         * сформированный объект "location" с обычного "window.location".
         */
        var location = window.history.location || window.location;

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

          // тут можете вызвать подгрузку данных и т.п.

          // просто сообщение
          alert("Мы вернулись на страницу со ссылкой: " + location.href);
        });
      });
    </script>
  </head>
  <body>
    <a class="ajax" href="/mylink.html">My Link</a>
    <a class="ajax" href="/otherlink.html">Other Link</a>
  </body>
</html>
```

### Вы можете использовать дополнительные параметры конфигурации библиотеки:

    history.js?basepath=/pathtosite/ - базовый путь к сайту, по умолчанию имеет значение корня "/".
    history.js?redirect=true - включить преобразование ссылок.
    history.js?type=/ - подставлять подстроку после якоря, по умолчанию имеет символ "/".

Также вы можете комбинировать опции:

    history.js?type=/&redirect=true&basepath=/pathtosite/ - порядок опций не имеет значение.

Или выполнить специальный метод в JavaScript:
```js
history.redirect(/* type = */ '/', /* basepath = */ '/pathtosite/');
```
Демо-сайт: http://history.spb-piksel.ru/ или http://devote.github.io/demos/history/

Я в Twitter: https://twitter.com/DimaPakhtinov
