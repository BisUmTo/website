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

    $(this).find(":checked:visible").each(function () {
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
        if(config.versions) config.versions.forEach((version)=>{
            if(!version.hidden) {
                // TAB HEADER
                $(`<a class="nav-item nav-link dynamic" id="nav-${version.id}-tab" data-toggle="tab" 
                href="#nav-${version.id}" role="tab" aria-controls="nav-${version.id}" 
                aria-selected="false">${version.title}</a>`).appendTo($('#nav-tab')).on('click',(e)=>{
                    if($(e.target).hasClass('active')) 
                        $('.last-update').html(`<i>[Link aggiornati il ${version.last_update}]</i>`);
                });
                // TAB DIV
                var div = $(`<div class="tab-pane fade dynamic" id="nav-${version.id}" role="tabpanel"
                aria-labelledby="nav-${version.id}-tab"></div>`).appendTo($('#nav-tabContent'));
                
                if(version.files) version.files.forEach((file)=>{
                    if(!file.hidden) {
                        // CARD
                        var image_url = (file.image_absolute_url?'':config.image_url_base) + file.image_url;
                        var download_url = (file.download_absolute_url?'':config.download_url_base) + file.download_url;
                        var mod_url = (file.mod_absolute_url?'':config.mod_url_base) + file.mod_url;
                        var card = $(`<div class="card" id="card-${version.id}-${file.id}">
                            <img src="${image_url}" class="card-img-top" alt="Mod image" />
                            <div class="card-body">
                                <h5 class="card-title">${file.title || ''}</h5>
                                <p class="card-text">${file.description || ''}</p>
                            </div>
                            <div class="card-footer">
                                    <small>
                                        <a href="${file.download_url?download_url:"#/"}"
                                            ${file.download_url?'target="_blank"':''}>${!file.download_url?"download non disponibile":(file.download_text || "download")}</a> |
                                        <a href="${file.mod_url?mod_url:(file.mod_absolute_url?'':config.mod_url_base) + file.id}" target="_blank">${file.information_text||"informazioni"}</a>
                                    </small>   
                                    <div class="btn-group-toggle ${file.disabled?" disabled":""}" data-toggle="buttons">
                                        <label class="btn btn-secondary${file.default==false||file.disabled?"":" active"}${file.disabled?" disabled":""}">
                                            <input type="checkbox" data-url="${file.download_url?download_url:""}"
                                                ${file.default==false||file.disabled?"":"checked"} autocomplete="off"> 
                                            <span class="aggiungi">Aggiungi</span>
                                            <span class="aggiunto">Aggiunto</span>
                                        </label>
                                    </div>
                                </div>
                        </div>`).appendTo(div);
                        // DEPENDENCIES
                        if(file.dependencies) {
                            card.find('.card-footer input').on('change',(e)=>{
                                if($(e.target).prop("checked")){
                                    $.each(file.dependencies, (key, value)=>{
                                        var button = $(`#card-${version.id}-${value} .btn-secondary`);
                                        var list = dependent[version.id+'-'+value] || [];
                                        if(!list.length){
                                            dependent_default[version.id+'-'+value] = button.find('> input').prop("checked")
                                        }
                                        var index = list.indexOf(version.id+'-'+file.id);
                                        if(index == -1) list.push(version.id+'-'+file.id);
                                        dependent[version.id+'-'+value] = list; 
                                        
                                        button.find('> input').prop("checked", true);
                                        button.addClass("active");
                                        button.parent().addClass("disabled");
                                    })
                                } else {
                                    $.each(file.dependencies, (key, value)=>{
                                        var list = dependent[version.id+'-'+value] || [];
                                        var index = list.indexOf(version.id+'-'+file.id);
                                        if(index != -1){
                                            list.splice(index, 1)
                                            dependent[version.id+'-'+value] = list;
                                        }
                                        if(list.length == 0) {
                                            var button = $(`#card-${version.id}-${value} .btn-secondary`);
                                            button.parent().removeClass("disabled");
                                            button.removeClass("disabled");
                                            if(!dependent_default[version.id+'-'+value]){
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
            }
            // CHECK DEPENDENCIES
            $('#download-form .card-footer input').change();
        })
        // LAST UPDATE
        $(`<div class="last-update"></div>`).prependTo($('#result-area'));
        // ACTIVE PAGE
        $('#nav-tab > a').last().addClass('active').trigger('click');
        $('#nav-tabContent > div').last().addClass('active show');
        // DOWNLOAD BUTTON
        $('#nav-tab .nav-link').on('click', (e)=>{
            if($(e.target).hasClass('dynamic')) $('#result-area').show();
            else $('#result-area').hide();
        });
        if($('#nav-tab .nav-link.active.dynamic').length) $('#result-area').show();
        
    });
});



