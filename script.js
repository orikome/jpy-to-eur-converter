let exchangeRate = 172;
let jpyActualValue = '';

async function fetchExchangeRate() {
    const url = 'https://api.frankfurter.app/latest?from=EUR&to=JPY';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        const data = await response.json();
        exchangeRate = data.rates.JPY;
        document.getElementById('jpyExchangeRate').textContent = `${exchangeRate.toFixed(2)} ¥`;
        console.log(`Fetched exchange rate: ${exchangeRate}`);
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
    }
}

document.getElementById("jpyInput").addEventListener("input", handleJpyInput);
document.getElementById("jpyInput").addEventListener("focus", handleJpyFocus);
document.getElementById("jpyInput").addEventListener("blur", handleJpyBlur);
document.getElementById("eurInput").addEventListener("input", convertEURtoJPY);

function formatJapaneseNumber(num) {
    if (num >= 10000) {
        return (num / 10000).toFixed(2) + '万';
    }
    return num.toString();
}

function handleJpyInput(e) {
    // Make sure we only accept numbers
    const value = e.target.value.replace(/[^0-9.]/g, '');
    jpyActualValue = value;
    convertJPYtoEUR();
}

function handleJpyFocus(e) {
    // Show raw value when focused
    if (jpyActualValue) {
        e.target.value = jpyActualValue;
    }
}

function handleJpyBlur(e) {
    // Format with Japanese notation when not focused
    if (jpyActualValue && parseFloat(jpyActualValue) >= 10000) {
        e.target.value = formatJapaneseNumber(parseFloat(jpyActualValue));
    }
}

function convertJPYtoEUR() {
    const jpy = jpyActualValue;
    const eurInput = document.getElementById("eurInput");
    eurInput.value = jpy ? (jpy / exchangeRate).toFixed(2) : '';
    
    // Format with Japanese notation when not focused
    const jpyInput = document.getElementById("jpyInput");
    if (jpy && parseFloat(jpy) >= 10000 && document.activeElement !== jpyInput) {
        jpyInput.value = formatJapaneseNumber(parseFloat(jpy));
    }
}

function convertEURtoJPY() {
    const eur = document.getElementById("eurInput").value;
    const jpyInput = document.getElementById("jpyInput");
    jpyActualValue = eur ? (eur * exchangeRate).toFixed(2) : '';
    
    // Format with Japanese notation when not focused
    if (jpyActualValue && parseFloat(jpyActualValue) >= 10000 && document.activeElement !== jpyInput) {
        jpyInput.value = formatJapaneseNumber(parseFloat(jpyActualValue));
    } else {
        jpyInput.value = jpyActualValue;
    }
}

fetchExchangeRate();