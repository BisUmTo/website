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
    $("#stop").val("Pause");
    $("#stop").prop("disabled", false);
    $("#start").prop("disabled", true);

    setTimeout(() => {
        curTime = context.currentTime;
        schedule();
    }, $('#attesa').val()*1000);
}

function stopClick(){
    if(stato == 1){ // PAUSE
        stato = 2;
        $("#stop").val("Stop");
        $("#start").val("Resume");
    } else if(stato == 2){ // STOP
        contatore = 0;
        $("#contatore").html(contatore);
        stato = 0;
        $("#stop").val("Pause");
        $("#stop").prop("disabled", true);
        $("#start").val("Start");
    }
    $("#start").prop("disabled", false);
    window.clearInterval(timer);
}

/*
Scheduling Help by: https://www.html5rocks.com/en/tutorials/audio/scheduling/
*/
function schedule() {
    while(curTime < context.currentTime + 0.1) {
        updateTime();
        playNote(curTime);
    }
    timer = window.setTimeout(schedule, 0.1);
}
    
function updateTime() {
    curTime += parseInt($("#intervallo").val(),10);
    contatore++;
    $("#contatore").html(contatore);
}

/* Play note on a delayed interval of t */
function playNote(t) {
    var note = context.createOscillator();
    note.frequency.value = 380;
    note.connect(context.destination);

    note.start(t);
    note.stop(t + 0.05);

    let speak = new SpeechSynthesisUtterance(contatore.toString());
    window.speechSynthesis.speak(speak);
}