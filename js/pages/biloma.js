const gravity=0.04;
const damping=0.98;

function calculate() {
    if(document.getElementById('block').value !== '') document.getElementById('outBlock').innerHTML = document.getElementById('block').value;
    const originX = document.getElementById('originX').value;
    const originY = document.getElementById('originY').value;
    const originZ = document.getElementById('originZ').value;
    const destinationX = document.getElementById('destinationX').value;
    const destinationY = document.getElementById('destinationY').value;
    const destinationZ = document.getElementById('destinationZ').value;
    const ticks = document.getElementById('ticks').value;

    const outMotionX = (1 - damping) / (1 - Math.pow(damping, ticks)) * (destinationX - originX);
    const outMotionY = (1 - damping) / (1 - Math.pow(damping, ticks)) * ((destinationY - originY) + (ticks - (1 - Math.pow(damping, ticks)) / (1 - damping)) * damping / (1 - damping) * gravity);
    const outMotionZ = (1 - damping) / (1 - Math.pow(damping, ticks)) * (destinationZ - originZ);

    document.getElementById('outMotionX').innerHTML = '' + outMotionX;
    document.getElementById('outMotionY').innerHTML = '' + outMotionY;
    document.getElementById('outMotionZ').innerHTML = '' + outMotionZ;

    if(document.getElementById('relative').checked) {
        document.getElementById('outOriginX').innerHTML = '~';
        document.getElementById('outOriginY').innerHTML = '~';
        document.getElementById('outOriginZ').innerHTML = '~';
    } else {
        document.getElementById('outOriginX').innerHTML = '' + originX;
        document.getElementById('outOriginY').innerHTML = '' + originY;
        document.getElementById('outOriginZ').innerHTML = '' + originZ;
    }
}
function update(){
    if(document.getElementById('ticks').value != '' && document.getElementById('ticks').value < 1) {
        document.getElementById('ticks').classList.add('is-invalid');
    } else {
        document.getElementById('ticks').classList.remove('is-invalid');
    }
    if(
        document.getElementById('originX').value != '' &&
        document.getElementById('originY').value != '' &&
        document.getElementById('originZ').value != '' &&
        document.getElementById('destinationX').value != '' &&
        document.getElementById('destinationY').value != '' &&
        document.getElementById('destinationZ').value != '' &&
        document.getElementById('ticks').value != '') {
        calculate();
        document.getElementById('bilomaOutput').style.display = 'block';
    } else {
        document.getElementById('bilomaOutput').style.display = 'none';
    }
}