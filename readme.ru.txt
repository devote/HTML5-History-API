Библиотека эмулирует HTML5 History API в старых браузерах.

Как работать с HTML5 History API вы можете узнать из официальных источников.

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
	history-1.2.6.min.js?redirect=false - отключить преобразование ссылок.
	history-1.2.6.min.js?type=/ - подставлять подстроку после якоря, по умолчанию ничего не подставляет.

Также вы можете комбинировать опции:
	history-1.2.6.min.js?type=/&redirect=false&basepath=/pathtosite/ - порядок опций не имеет значение.

Демо-сайт: http://history.spb-piksel.ru/
