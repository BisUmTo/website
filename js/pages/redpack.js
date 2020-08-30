function resetMessage() {
    $("#result")
        .removeClass()
        .text("");
}

function showMessage(text) {
    resetMessage();
    $("#result")
        .addClass("alert alert-success")
        .text(text);
}

function showError(text) {
    resetMessage();
    $("#result")
        .addClass("alert alert-danger")
        .text(text);
}

function updatePercent(percent) {
    $("#progress_bar").removeClass("hide")
        .find(".progress-bar")
        .attr("aria-valuenow", percent)
        .css({
            width: percent + "%"
        });
}

if (!JSZip.support.blob) {
    showError("Purtroppo il tuo browser non è aggiornato... Prova ad accedere con un nuovo browser!");
}

var Promise = window.Promise;
if (!Promise) {
    Promise = JSZip.external.Promise;
}

function urlToPromise(url) {
    return new Promise(function (resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

$("#download_form").on("submit", function () {
    resetMessage();
    var zip = new JSZip();

    var promises = [];
    var ticks = [];
    var loads = [];

    $(this).find(":checked").each(function () {
        var $this = $(this);
        var url = $this.data("url");
        promises.push(
            new Promise((resolve, reject) => {
                var msg = "Download: " + url;
                showMessage(msg);
                new Promise((res, rej) => {
                        JSZipUtils.getBinaryContent(url, (err, data) => {
                            if (err) {
                                rej(err);
                            } else {
                                res(data);
                            }
                        })
                    }).then(JSZip.loadAsync)
                    .then((zipToMerge) => {
                        var subpromises = [];
                        zipToMerge.forEach((relativePath, file) => {
                            subpromises.push(
                                new Promise((res, rej) => {
                                    if (relativePath == 'data/minecraft/tags/functions/load.json') {
                                        zipToMerge.file(relativePath).async("string").then((value) => {
                                            JSON.parse(value).values.forEach((el) => {
                                                loads.push(el);
                                            });
                                            res();
                                        });
                                    } else if (relativePath == 'data/minecraft/tags/functions/tick.json') {
                                        zipToMerge.file(relativePath).async("string").then((value) => {
                                            JSON.parse(value).values.forEach((el) => {
                                                ticks.push(el);
                                            });
                                            res();
                                        });
                                    } else if (!file.dir) {
                                        strpromise = zipToMerge.file(relativePath).async("string");
                                        zip.file(relativePath, strpromise);
                                        strpromise.then(() => {
                                            res();
                                        });
                                    } else {
                                        res();
                                    }
                                })
                            );
                        });
                        Promise.all(subpromises).then(() => {
                            resolve()
                        });
                    })
            })
        )
    });

    Promise.all(promises).then(() => {
        if(ticks.length>0) zip.file('data/minecraft/tags/functions/tick.json', '{"values":' + JSON.stringify(ticks) + '}');
        if(loads.length>0) zip.file('data/minecraft/tags/functions/load.json', '{"values":' + JSON.stringify(loads) + '}');
    }).then(
        function () {
            zip.generateAsync({
                type: "blob"
            }, function updateCallback(metadata) {
                var msg = "Compressione : " + metadata.percent.toFixed(2) + " %";
                if (metadata.currentFile) {
                    msg += ", " + metadata.currentFile;
                }
                showMessage(msg);
                updatePercent(metadata.percent | 0);
            }).then((blob) => {
                saveAs(blob, "RedPack.zip");
                showMessage("RedPack generato con successo!");
            }, (e) => showError(e));
        }
    );

    return false;
});

function cambia_testo(checkbox) {
    checkbox.innerHTML = checkbox.checked?'Aggiunto':'Aggiungi';
}

$(document).ready(()=>{
    $.getJSON('config.json', function(config) {
        config.files.forEach((file)=>{
            var url = 'files/'+file;
            new Promise((res, rej) => {
                JSZipUtils.getBinaryContent(url, (err, data) => {
                    if (err) {
                        rej(err);
                    } else {
                        res(data);
                    }
                })
            }).then(JSZip.loadAsync).then((zipFile)=>{
                zipFile.file('pack.mcmeta').async("string").then((value) => {
                    var pack_mcmeta = JSON.parse(value);
                    var name = pack_mcmeta.pack.description.replace('RedPack by BisUmTo & Gnottero - ','').replace(/v\d+.\d+.\d+/g,'');
                    var version = pack_mcmeta.pack.description.match(/v\d+.\d+.\d+/g,'')[0];
                    //$('<li><label><input type="checkbox" data-url=files/"'+url+'" checked /> '+name+' - '+version+'</label></li>').appendTo($('#download_form ul'));


                    $( `<div class="card" style="width: 18rem; display: inline-block; margin:10px;">
                            <img src="${pack_mcmeta.redpack.image}" class="card-img-top" alt="Immagine non disponibile" />
                            <div class="card-body">
                                <h5 class="card-title">${name}</h5>
                                <p class="card-text">${pack_mcmeta.pack.description}</p>
                                <div class="btn-group-toggle" data-toggle="buttons">
                                    <label class="btn btn-secondary active">
                                        <input type="checkbox" data-url="${url}" checked autocomplete="off"> 
                                        <span class="aggiungi">Aggiungi</span>
                                        <span class="aggiunto">Aggiunto</span>
                                    </label>
                                </div>
                            </div>
                        </div>`
                    ).appendTo($('#download_form ul'));
                });
            });
        })
    });
});

