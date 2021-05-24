function rn(from, to) {
    return ~~(Math.random() * (to - from + 1)) + from;
}

function rs(list) {
    return list[rn(1, list.length) - 1];
}

function boxShadows(max) {
    let ret = [];
    for (let i = 0; i < max; ++i) {
        ret.push(`
        ${ rn(1, 100) }vw ${ rn(1, 100) }vh ${ rn(20, 40) }vmin ${ rn(1, 20) }vmin
        ${ rs($(".color").map((i,e) => $(e).val())) }
      `)
    }
    return ret.join(',');
}

const cloud = document.querySelector('#cloud');

function update() {
    cloud.style.boxShadow = boxShadows(100);
}

window.addEventListener('load', update);

function add_color(element) {
    $('<span> </span><input type="color" class="color btn btn-primary" onchange="update()" value="#11cbd7">').insertAfter($(element))
}

function fullscreen() {
    $('.fullscreen').each((i,e)=>$(e).toggle());
    $('.navdiv').each((i,e)=>$(e).fadeToggle());
    $('.overclouds:not(form)').each((i,e)=>$(e).slideToggle('2000', "swing"));
    $('form').each((i,e)=>$(e).toggleClass('hide'));
}

function fullscreen_on() {
    fullscreen();
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
}
function fullscreen_off() {
    fullscreen();
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}