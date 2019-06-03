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

        includeHTML()
    }

    if(document.getElementById('footerPush') != null && document.body.clientHeight - document.getElementById('mainNavbar').clientHeight - document.getElementById('mainFooter').clientHeight < $(window).height()) {
        document.getElementById('footerPush').style.height = ($(window).height() - document.body.clientHeight) + 'px';
    }
});
