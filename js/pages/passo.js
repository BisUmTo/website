function calculate() {
    var minuti = parseInt(document.getElementById('minuti').value) || 0;
    var secondi = parseInt(document.getElementById('secondi').value) || 0;
    var tempo = (secondi / 60 + minuti);
    var velocita = tempo == 0 ? "flash" : (60 / tempo).toFixed(2);
    document.getElementById('velocita').innerHTML = velocita;
}

calculate()
