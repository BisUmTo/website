window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var curTime = 0.0;
let timer;
let contatore = 0;
// 0: stop
// 1: start
// 2: pause
let stato = 0;
const SpeechSynthesisUtterance =
  window.webkitSpeechSynthesisUtterance ||
  window.mozSpeechSynthesisUtterance ||
  window.msSpeechSynthesisUtterance ||
  window.oSpeechSynthesisUtterance ||
  window.SpeechSynthesisUtterance;

function startClick(){
    // START
    stato = 1;
    $("#start").val("Riprendi");
    $("#stop").val("Pausa");
    $("#start").prop("disabled", true);
    $("#stop").prop("disabled", true);
    
    setTimeout(() => {
        $("#stop").prop("disabled", false);
        curTime = context.currentTime;
        schedule();
    }, $('#attesa').val()*1000);
    $('#barra').width("100%");
    $('#barra').animate({width: 0}, $('#attesa').val()*1000, 'linear');
}

function stopClick(){
    if(stato == 1){ // PAUSE
        stato = 2;
        $("#stop").val("Stop");
        $("#start").val("Riprendi");
    } else if(stato == 2){ // STOP
        contatore = 0;
        $("#contatore").html(contatore);
        stato = 0;
        $("#stop").val("Pausa");
        $("#stop").prop("disabled", true);
        $("#start").val("Start");
    }
    $("#start").prop("disabled", false);
    $('#barra').stop();
    $('#barra').width("100%");
    window.clearInterval(timer);
}

/*
Scheduling Help by: https://www.html5rocks.com/en/tutorials/audio/scheduling/
*/
function schedule() {
    while(curTime < context.currentTime + 0.1) {
        playNote(curTime);
        updateTime();
    }
    timer = window.setTimeout(schedule, 0.1);
}
    
function updateTime() {
    let time = parseInt($("#intervallo").val(),10);
    curTime += time
    contatore++;
    $('#barra').animate({width: $(document).width()}, time*1000, 'linear', () => {$('#barra').width(0)});
    $("#contatore").html(contatore);
}

/* Play note on a delayed interval of t */
function playNote(t) {
    var note = context.createOscillator();
    note.frequency.value = 400;
    note.connect(context.destination);

    note.start(t);
    note.stop(t + 0.05);

    let speak = new SpeechSynthesisUtterance(`${contatore + 1}`);
    window.speechSynthesis.speak(speak);
}