function download(files) {
    $.each(files, function(key, value) {
        $('<iframe></iframe>')
            .hide()
            .attr('src', value)
            .appendTo($('body'))
            .on('load',function() {
                var that = this;
                setTimeout(function() {
                    $(that).remove();
                }, 100);
            });
    });
}

$("#download-form").on("submit", function () {
    var urls = [];

    $(this).find(":checked").each(function () {
        var $this = $(this);
        urls.push($this.data("url"));
    });
    download(urls);
    return false;
});

var dependent = {};
var dependent_default = {};

$(document).ready(()=>{
    $.getJSON('config.json', function(config) {
        config.versions.forEach((version)=>{
            if(!version.hidden) {
                // TAB HEADER
                $(`<a class="nav-item nav-link dynamic" id="nav-${version.id}-tab" data-toggle="tab" 
                href="#nav-${version.id}" role="tab" aria-controls="nav-${version.id}" 
                aria-selected="false">${version.title}</a>`).appendTo($('#nav-tab'));
                // TAB DIV
                var div = $(`<div class="tab-pane fade dynamic" id="nav-${version.id}" role="tabpanel"
                aria-labelledby="nav-${version.id}-tab"></div>`).appendTo($('#nav-tabContent'));
                
                version.files.forEach((file)=>{
                    if(!file.hidden) {
                        var card = $(`<div class="card" id="card-${file.id}" style="width: 18rem; display: inline-block; margin:10px;">
                            <img src="${config.image_url_base + file.image_url}" class="card-img-top" alt="Mod image" />
                            <div class="card-body">
                                <h5 class="card-title">${file.title}</h5>
                                <p class="card-text">${file.description}</p>
                            </div>
                            <div class="card-footer">
                                    <small>
                                        <a href="${file.download_url?config.download_url_base + file.download_url:""}" target="_blank">${file.download_text||"download"}</a> |
                                        <a href="${config.mod_url_base + file.mod_url}" target="_blank">${file.information_text||"informazioni"}</a>
                                    </small>   
                                    <div class="btn-group-toggle ${file.disabled?" disabled":""}" data-toggle="buttons">
                                        <label class="btn btn-secondary${file.default==false||file.disabled?"":" active"}${file.disabled?" disabled":""}">
                                            <input type="checkbox" data-url="${file.download_url?config.download_url_base + file.download_url:""}" checked autocomplete="off"> 
                                            <span class="aggiungi">Aggiungi</span>
                                            <span class="aggiunto">Aggiunto</span>
                                        </label>
                                    </div>
                                </div>
                        </div>`).appendTo(div);
                        if(file.dependencies) {
                            card.find('.card-footer input').on('change',(e)=>{
                                if($(e.target).prop("checked")){
                                    $.each(file.dependencies, (key, value)=>{
                                        var button = $(`#card-${value} .btn-secondary`);
                                        var list = dependent[value] || [];
                                        if(!list.length){
                                            dependent_default[value] = button.find('> input').prop("checked")
                                        }
                                        list.push(file.id);
                                        dependent[value] = list; 
                                        
                                        button.find('> input').prop("checked", true);
                                        button.addClass("active");
                                        button.parent().addClass("disabled");
                                    })
                                } else {
                                    $.each(file.dependencies, (key, value)=>{
                                        var list = dependent[value] || [];
                                        var index = list.indexOf(file.id);
                                        if(index != -1){
                                            list.splice(index, 1)
                                            dependent[value] = list;
                                        }
                                        if(list.length == 0) {
                                            var button = $(`#card-${value} .btn-secondary`);
                                            button.parent().removeClass("disabled");
                                            button.removeClass("disabled");
                                            if(!dependent_default[value]){
                                                button.find('> input').prop("checked", false);
                                                button.removeClass("active");
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                });
                $(`<div><i>[Link aggiornati il ${version.last_update}]</i></div>`).prependTo($('#result-area'));
            }
            $('#download-form .card-footer input').change();
        })
        // DOWNLOAD BUTTON
        $('#nav-tab .nav-link').on('click', (e)=>{
            if($(e.target).has('dynamic')) $('#result-area').show();
            else $('#result-area').hide();
        });
        if($('#nav-tab .nav-link.active.dynamic').length) $('#result-area').show();
    });
});



