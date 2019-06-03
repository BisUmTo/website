$(document).on('click', function() {
    $('.collapse').collapse('hide');
});

$(window).on("load", function() {
    var pathname = window.location.pathname;

    if(pathname === "/") {
        pathname = "home";
    } else {
        pathname = pathname.substring(1);
    }

    var element = document.getElementById("nav-link-" + pathname);
    if(element !== null) {
        element.classList.add("active");

        for (i = 0; i < element.classList.length; i++) {
            var clazz = element.classList.item(i);
            if (clazz.startsWith("drop-")) {
                pathname = clazz.substring(5);
            }
        }

        element = document.getElementById("nav-link-" + pathname);
        element.classList.add("active");
    }

    if(document.getElementById('footerPush') != null && document.body.clientHeight - document.getElementById('mainNavbar').clientHeight - document.getElementById('mainFooter').clientHeight < $(window).height()) {
        document.getElementById('footerPush').style.height = ($(window).height() - document.body.clientHeight) + 'px';
    }
});

function includeHTML() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
            }
        }      
        xhttp.open("GET", file, true);
        xhttp.send();
        return;
        }
    }
};
