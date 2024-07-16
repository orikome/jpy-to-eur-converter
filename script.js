document.getElementById("jpyInput").addEventListener("input", convertJPYtoEUR);
document.getElementById("eurInput").addEventListener("input", convertEURtoJPY);

function convertJPYtoEUR() {
    const jpy = document.getElementById("jpyInput").value;
    const eurInput = document.getElementById("eurInput");
    eurInput.value = jpy ? (jpy / 172).toFixed(2) : '';
}

function convertEURtoJPY() {
    const eur = document.getElementById("eurInput").value;
    const jpyInput = document.getElementById("jpyInput");
    jpyInput.value = eur ? (eur * 172).toFixed(2) : '';
}
