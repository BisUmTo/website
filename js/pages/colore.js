const gravity=0.04;
const damping=0.98;

function calculate() {
    var color = document.getElementById('colorpicker').value;
    document.getElementById('coloreHEX').innerHTML = color;
    document.getElementById('coloreDEC').innerHTML = parseInt(color.replace('#','0x'));

}
