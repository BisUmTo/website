const url = 'https://api.github.com/repos/BisUmTo/DataPacks/commits';
getCommits();

function getCommits() {
    $.getJSON(url, function(result) {
        $.each(result, function(i, field) {
            let message = field['commit']['message'];
            if(message.startsWith("RedCraft 2 -")||message.startsWith("RedCraft2 -")){
                message = message.split('·')[0];
                document.getElementById('datapackVersion').innerText = 'v. ' +  message.match(/\d+\.\d+\.\d+/);
                return false;
            }
        })
    });
}