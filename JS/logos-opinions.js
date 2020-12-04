// Special opinion page, developed by jdsd ups

function htmlDecode(input) {
	var e = document.createElement('textarea');
	e.innerHTML = input;
	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function isInArray(value, array) {
  	return array.indexOf(value) > -1;
}

function arraymove(arr, fromIndex, toIndex) {
	var element = arr[fromIndex];
	arr.splice(fromIndex, 1);
	arr.splice(toIndex, 0, element);
}

function dateParser(date) {
	var parsedDate = date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
	arraymove(parsedDate, 2, 3);
	arraymove(parsedDate, 1, 3);
	parsedDate.splice(0, 1);
	parsedDate = parsedDate.join('/');
	if (parsedDate.includes("1999")) {
		parsedDate = parsedDate.replace('1999', '2019');
	} else if (parsedDate.includes("2000")) {
		parsedDate = parsedDate.replace('2000', '2020');
	}
	return parsedDate;
}

var checkLength = 1;
var actualLength = 0;

function loadItems(finder, boolean) {
	if ( actualLength === checkLength ) {
		alert('No hay más elementos que cargar');
		return false;
	} else {
		$('.ui.dimmer').dimmer('toggle');
        $.get('https://www.logoshn.com/feeds/posts/default/-/Opinion', function(data) {
            var $xml = $(data);
            for (var i = 0; i < 3; i++) {
                if (finder > 2) {
                    finder = finder + i;
                } else {
                    finder = i;
                }
                checkLength = $xml.find('entry').length;
                actualLength = $('#opinionList').children('.opinion-item:not(".load-more")').length;
                if ( actualLength === checkLength ) {
                    console.log('los elementos cargados corresponden con los de la RSS, deteniendo el bucle');
		    $('.ui.dimmer').dimmer('hide');
                    return false;
                } else {
                    $xml.find("entry:eq(" + finder + ")").each(function() {
                        console.log('finder in each iteration is ' + finder + ' while i is ' + i);
                        var $this = $(this),
                            item = {
                                id: $this.find('id').text().match(/[0-9]+$/),
                                title: $this.find("title").text(),
                                date: $this.find("published").text()
                            };
                        baseDate = item.date;
                        parsedDate = dateParser(baseDate);
                        $('#opinionList').append("<div class='opinion-item' id='" + item.id + "'><h4>" + item.title + "</h4><span>" + parsedDate + "</span></div>");
                        $('.opinion-item.load-more').appendTo('#opinionList');
						$('.ui.dimmer').dimmer('toggle');
                        return false;
                    });
                }
            }
        }).done(function() {
			if ( boolean === true ) {
    			$.get('https://www.logoshn.com/feeds/posts/default/-/Opinion', function(data) {
                    var $hash;
                    var $ids = [];
                    var $listedIDs = [];
                    var $xml = $(data);
                    $xml.find("entry").each(function() {
                        var $this = $(this),
                            item = {
                                id: $this.find('id').text().match(/post-[0-9]+$/)
                            };
                        $ids.push(item.id);
                    });
                    $hash = window.location.hash;
                    $hash = $hash.replace("#", "");
                    $('#opinionList').children('.opinion-item:not(".load-more")').each(function(){
                        $listedIDs.push( 'post-' + $(this).attr('id') );
                    });
                    console.log('listed IDs are ' + $listedIDs);
					
                    if( isInArray($hash, $ids.toString()) && ! isInArray($hash, $listedIDs.toString()) ) {
                        console.log('el hash se encontraba en la lista de IDs del RSS y no se encontraba en la lista de IDs cargadas');
						$('#threadRoot').show();
                        loadSpecific($hash);
                        $('.ui.dimmer').dimmer('toggle');
                    } else if ( /#/.test(window.location.href) ) {
                        console.log('el hash se encontraba en la lista de IDs del RSS y sí se encontraba en la lista de IDs cargadas');
						$('#threadInit').show();
                        $hash = $hash.match(/([^-]*$)/);
                        $('#' + $hash).trigger( "click" );
                    } else {
						console.log('la página no contenía ningún hash');
						$('#threadInit').show();
						$('.ui.dimmer').dimmer('hide');
					}
                });
			}
		});
	}
}

function loadSpecific(parameter) {
	$.get('https://www.logoshn.com/feeds/posts/default/-/Opinion', function(data) {
		var $xml = $(data);
		$xml.find("entry id:contains('" + parameter + "')").each(function() {
			var $this = $(this).closest('entry'),
				item = {
					id: $this.find('id').text().match(/[0-9]+$/),
					title: $this.find("title").text(),
					date: $this.find("published").text()
				};
			baseDate = item.date;
			parsedDate = dateParser(baseDate);
			$('#opinionList').append("<div class='opinion-item' id='" + item.id + "'><h4>" + item.title + "</h4><span>" + parsedDate + "</span></div>");
			$('.opinion-item.load-more').appendTo('#opinionList');
			$('#' + item.id).trigger( "click" );
			return false;
		});
	});
}

$('.ui.dimmer').dimmer('toggle');

$(document).ready(function() {
	var disqus_shortname = 'iuslogos';
	$.ajax({
		type: "GET",
		url: "https://" + disqus_shortname + ".disqus.com/embed.js",
		dataType: "script",
		cache: true,
		success: function() {
			var $finder = $('#opinionList').children(".opinion-item:not('.load-more')").length;
			loadItems($finder, true);
			$('#opinionList').append('<div class="opinion-item load-more">Cargar más</div>');
		}
	});

	$('#opinionList').on('click', '.opinion-item.load-more', function() {
		var $finder = $('#opinionList').children(".opinion-item:not('.load-more')").length;
		loadItems($finder, false);
	});

	$('#opinionList').on('click', '.opinion-item:not(".load-more")', function() {
		var thisID = $(this).attr('id');
		var threadID = $('#threadView').attr('name');
		console.log('se están analizando las ids, el objeto clickeado es ' + thisID + ' elemento cargado ' + threadID);
		if ( thisID === threadID ) {
			console.log('las identidades coincidieron, no se cargará nada adicional');
		} else {
			$('.ui.dimmer').dimmer('toggle');
			if ( $('#threadRoot').is(":hidden") ) {
				$('#threadInit').hide();
				$('#threadRoot').show();
			}
			var $id = $(this).attr('id');
			window.location.hash = 'post-' + $id;
			$.get('https://www.logoshn.com/feeds/posts/default/-/Opinion', function(data) {
				var $xml = $(data);
				$xml.find("entry > id:contains(" + $id + ")").each(function() {
					var $this = $(this).closest('entry'),
						item = {
							id: $this.find('id').text().match(/[0-9]+$/),
							title: $this.find("title").text(),
							link: $this.find("link[rel='alternate']").attr('href'),
							body: $this.find("content").html(),
							date: $this.find("published").text(),
							authorName: $this.find("author > name").text(),
							authorLink: $this.find("author > uri").text()
						},
						baseDate = item.date;
					parsedDate = dateParser(baseDate);
					gtag('event', 'Opinión Vista', {
						'event_category': 'Artículos de Opiniones',
						'event_label': item.title
					});
					window.top.document.title = item.title + ' | Logos';
					$('#threadView').attr('name', item.id);
					$('.opinion-view').find("h2").text(item.title);
					$('.opinion-view').find(".body .opinion-content").html(htmlDecode(item.body));
					$('.opinion-view').find(".reference > .author > b").text(item.authorName);
					$('.opinion-view').find(".reference > .date").text(parsedDate);
					$('.opinion-share').find('a.button.facebook').attr('href', 'https://www.facebook.com/sharer.php?u=' + item.link);
					$('.opinion-share').find('a.button.twitter').attr('href', 'https://twitter.com/intent/tweet?text=Lee%20este%20art%C3%ADculo%20de%20Logos%3A%20&url=' + item.link);
					$('.opinion-share').find('a.button.whatsapp').attr('href', 'https://api.whatsapp.com/send?text=Te%20invito%20a%20leer%20este%20art%C3%ADculo%20de%20derecho%2C%20est%C3%A1%20interesante%3A%20' + item.link);
					var disqus_threadID = item.id;
					var disqus_threadURL = item.link;
					DISQUS.reset({
						reload: true,
						config: function() {
							this.page.identifier = disqus_threadID;
							this.page.url = disqus_threadURL;
							$('.ui.dimmer').dimmer('hide');
						}
					});
				});
			});
			$(this).addClass('active');
			$(this).siblings().removeClass('active');
		}
	});
});
