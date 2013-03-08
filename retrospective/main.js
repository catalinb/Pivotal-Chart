var repeat = 20 * 1000; // in miliseconds

//
var rdata;

globalData = {};

function extractlist(data) {
    var from = data.indexOf("<p>Action items");

    var to = data.indexOf("Sprint retrospective", from);
    //to = data.indexOf("</ul>", to) + 10;

    data = data.substring(from, to);
    to = data.lastIndexOf("</ul>") + 5;
    data = data.substring(0, to);

    globalData = data;
    from = 0;
    to = 0;
    var returned = "   ";
    do {
        from = data.indexOf("<li>", to + 3);
        if (from == -1)
            break;
        // need to check for recursive ul
        var nextfrom = data.indexOf("<li>", from + 3);;
        to = data.indexOf("</li>", from + 3);
        if (nextfrom > 0 && to > nextfrom) {
            var level = 1;
            to = data.indexOf("</li>", to + 3);
            while (level) {
                if (to < nextfrom) {
                    ++level;
                    to = data.indexOf("</li>", to + 3);
                } else {
                    --level;
                    nextfrom = data.indexOf("<li>", nextfrom + 3);
                }
            }
        }

        if (to == -1)
            break;
        output =  "<li>" + data.substring(from + 4, to) + "</li>";
        if (output.indexOf("AI") != -1)
          returned += output;


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
    parseActionItemType();

    // do some 
}

function parseImages(data) {
  data.find("img").each(function() {
    var t = $(this);
    if (t.attr("src") == "https://zerowing.corp.adobe.com/images/icons/emoticons/error.gif") {
      t.attr("src", "/images/Not_done.svg");
    }
    if (t.attr("src") == "https://zerowing.corp.adobe.com/images/icons/emoticons/check.gif") {
      t.attr("src", "/images/Yes_check.svg");
    }
  });
}

function parseActionItemType() {
  $("body").html($("body").html().replace(/\([Ii]n [Pp]rogress\)/g,'<img class="emoticon" src="/images/Work_in_progress.svg" height="16" width="16" align="absmiddle" alt border="0">'));
  $("body").html($("body").html().replace(/\([Nn]ot [Dd]one\)/g,'<img class="emoticon" src="/images/Not_done.svg" height="16" width="16" align="absmiddle" alt border="0">'));
  $("body").html($("body").html().replace(/\([Dd]one\)/g,'<img class="emoticon" src="/images/Yes_check.svg" height="16" width="16" align="absmiddle" alt border="0">'));
  $(".cr").css("background", "#222");
  $(".cr").css("color", "#aaa");
  $("img").each(function() {
    var t = $(this);
    if (t.attr("src") == "/images/Not_done.svg") {
      $(".cr").css("background", "#C85A17");
      $(".cr").css("color", "#ffffff");
    }

    if (t.attr("src") == "/images/Yes_check.svg") {
      $(".cr").css("background", "#009900");
      $(".cr").css("color", "#ffffff");
    }

    if (t.attr("src") == "/images/Work_in_progress.svg") {
      $(".cr").css("background", "#3399ff");
      $(".cr").css("color", "#ffffff");
    }
  });
}

var practices = $.ajax({
    url:"https://zerowing.corp.adobe.com/display/webkit/WEE+team+sprint+retrospective",
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

        // remove non AI from the list
        //
        parseImages(x);

        stuff = x;
        show(0);
    }});


