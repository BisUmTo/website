$(document).on('click', function() {
    $('.collapse').collapse('hide');
});

(function() {
    if (!localStorage.getItem('cookieconsent')) {
        document.body.innerHTML += '\
        <div id="cookieconsent">\
            <i class="fas fa-exclamation-triangle"></i>\
            Questo sito fa uso di cookie per migliorare l\'esperienza di navigazione degli utenti, per presentare annunci pubblicitari personalizzati e per raccogliere informazioni sull\'utilizzo del sito stesso. Usando il sito accetti questo utilizzo. Consulta l\'<a href="../legal/cookie-policy.html" target="_blank">Informativa sui cookie</a>. \
            <a href="#" id="cookieclose"><i class="fas fa-times"></i></a>\
        </div>\
        ';
        $('#cookieclose').on('click', function(e) {
            e.preventDefault();
            $('#cookieconsent').hide();
            localStorage.setItem('cookieconsent', true);
        });
    }
})();

let promises = [];
function includeHTML() {
    const z = document.getElementsByTagName("*");
    const loadPromise = (e, file) => new Promise(function(resolve, reject) {
        $(e).load(file, resolve);
    }); 
    for(let i=0; i<z.length; i++) {
        const e = z[i];
        let file = e.getAttribute("include-html");
        if(file) {
            promises.push(loadPromise(e, file));
            e.removeAttribute("include-html");
            includeHTML();
            return;
        }
    }

    Promise.all(promises).then(() => {
        console.log("All promises resolved!");
        const pathname = window.location.pathname.split("/");
        const pagina = pathname[pathname.length - 2] || 'home';
        const navLink = document.getElementById("nav-link-" + pagina);
        if (navLink != null) navLink.classList.add("active");
        console.log(navLink,pagina)
        
        if(document.getElementById('footerPush') != null && document.body.clientHeight - document.getElementById('mainNavbar').clientHeight - document.getElementById('mainFooter').clientHeight < $(window).height()) {
            document.getElementById('footerPush').style.height = ($(window).height() - document.body.clientHeight) + 'px';
        }

        const currentYear = new Date().getFullYear();
        let spanYear = document.getElementsByClassName("currentYear");
        for(let i = 0; i < spanYear.length; i++)
            spanYear[i].innerHTML = currentYear;
    });
};

window.addEventListener('load', includeHTML);
