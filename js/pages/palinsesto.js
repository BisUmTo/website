function set_live(element) {
    new Twitch.Player(element.attr('id'), {
        width: 560,
        height: 316,
        autoplay: "false",
        channel: element.attr('id'),
        parent: ["embed.example.com", "othersite.example.com"]
    });
}

function set_last_video(element) {
    $.getJSON('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3D' + element.attr('id'), function(data) {
        var link = data.items[0].link;
        var id = link.substr(link.indexOf('=')+1);
        $(element).attr('src',(localStorage.getItem('cookieconsent')? 'https://youtube.com/embed/': 'https://www.youtube-nocookie.com/embed/') + id + '?controls=0&showinfo=0&rel=0');
    });
}

$('.youtube-embed').each(function(i) {set_last_video($(this))})
$('.twitch-embed').each(function(i) {set_live($(this))})
