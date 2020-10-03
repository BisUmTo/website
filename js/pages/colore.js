function calculate() {
    var color = document.getElementById('colorpicker').value;
    document.getElementById('coloreHEX').innerHTML = color;
    document.getElementById('coloreDEC').innerHTML = parseInt(color.replace('#','0x'));

    document.getElementById('coloreFLOAT_R').innerHTML = parseFloat((parseInt(color.replace('#','0x')) & 16711680)/(255*65536)).toFixed(5);
    document.getElementById('coloreFLOAT_G').innerHTML = parseFloat((parseInt(color.replace('#','0x')) & 65280)/(255*256)).toFixed(5);
    document.getElementById('coloreFLOAT_B').innerHTML = parseFloat((parseInt(color.replace('#','0x')) & 255)/255).toFixed(5);
}

calculate()
