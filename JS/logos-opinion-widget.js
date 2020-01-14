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

 function truncateText(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
};

$(document).ready(function() {
    $.get('https://www.logoshn.com/feeds/posts/default/-/Opinion', function(data) {
        var $xml = $(data);
        $xml.find("entry").each(function() {
            var $this = $(this).closest('entry'),
                item = {
                    id: $this.find('id').text().match(/[0-9]+$/),
                    title: $this.find("title").text(),
                    date: $this.find("published").text(),
                    authorName: $this.find("author > name").text()
                },
                baseDate = item.date;
            parsedDate = dateParser(baseDate);
            $('#opinions').append('<a class="opinion-item" href="/p/la-columna.html#post-' + item.id + '"><h4>' + item.title + '</h4><span>' + parsedDate + '</span></a>')
        });
        if ( $('#opinions').find('.opinion.item').length > 3 ) {
            const servicesSlider = new Siema({
                selector: '#opinions',
                loop: true,
                perPage: {
                    300: 1,
                    740: 3
                },
                draggable: true,
                multipleDrag: true
            });
        } else {
            console.log('not enough opinons yet');
        }
        $('.opinion-item').each(function() {
            var $el = $(this).find('h4').first();
            var $text = $el.text();
            if ($text.length > 33) {
                var $truncated = truncateText($text, 35);
                $el.popup({
                    title: $text,
                    inline: true,
                    variation: 'flowing inverted mini',
                    position: 'top center'
                });
                $el.text($truncated);
            }
        });
        $('#Blog1').find('.item').each(function() {
            var $el = $(this).find('h2').children('a').first();
            var $text = $el.text();
            if ($text.length > 38) {
                var $truncated = truncateText($text, 40);
                $el.text($truncated);
            }
        });
        // document.querySelector('#s-prev').addEventListener('click', () => servicesSlider.prev());
        // document.querySelector('#s-next').addEventListener('click', () => servicesSlider.next());
    });
});
