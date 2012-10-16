var repeat = 3600 * 1000; // in miliseconds

//
var rdata;

$.fn.shuffleChildren = function() {
    $.each(this.get(), function(index, el) {
        var $el = $(el);
        var $find = $el.children();

        $find.sort(function() {
            return 0.5 - Math.random();
        });

        $el.empty();
        $find.appendTo($el);
    });
};

function extractlist(data) {
    var from = data.indexOf("This page lists best practices that came out during sprint retrospective meetings. It is not intended to be an exhaustive list, but rather as a support for better tracking, reviewing and updating these best practices.");
    var to = data.indexOf("Answer all emails from \"customer\" teams in a two day time frame.");
    to = data.indexOf("</ul>", to) + 10;

    data = data.substring(from, to);
    from = 0;
    to = 0;
    returned = "   ";
    do {
        from = data.indexOf("<ul>", to + 3);
        if (from == -1)
            break;
        // need to check for recursive ul
        var nextfrom = data.indexOf("<ul>", from + 3);;
        to = data.indexOf("</ul>", from + 3);
        if (nextfrom > 0 && to > nextfrom) {
            var level = 1;
            to = data.indexOf("</ul>", to + 3);
            while (level) {
                if (to < nextfrom) {
                    ++level;
                    to = data.indexOf("</ul>", to + 3);
                } else {
                    --level;
                    nextfrom = data.indexOf("<ul>", nextfrom + 3);
                }
            }
        }

        if (to == -1)
            break;
        returned += data.substring(from + 4, to);
    } while (1);
    return returned;
}

var stuff;

var loop;
function show(which) {
    var many = stuff.children().size();
    var next = which + 1;
    if (next == many)
        next = 0;
    loop = setTimeout(function() {
        show(next);
    }, repeat);
    var now = stuff.children().eq(which);
    $("div.cr").html(now.html());
}

var practices = $.ajax({
    url:"https://zerowing.corp.adobe.com/display/webkit/WEF+Team+Best+Practices",
    //dataType:"html",
    success: function(data, string, shr) {
        x = $("<ul/>");
        x.html(extractlist(data));
        //x.appendTo($("body"));
        // links are broken
        x.find("img").each(function() {
            var tt = $(this);
            tt.attr("src", "https://zerowing.corp.adobe.com" + tt.attr("src"));
        })

        x.shuffleChildren();

        stuff = x;
        show(0);
    }});


