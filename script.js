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
document.getElementById("eurInput").addEventListener("input", handleEurInput);
document.getElementById("eurInput").addEventListener("focus", handleEurFocus);
document.getElementById("eurInput").addEventListener("blur", handleEurBlur);

function formatJapaneseNumber(num) {
    if (num >= 100000000) {
        const oku = Math.floor(num / 100000000);
        const man = Math.floor((num % 100000000) / 10000);
        return man > 0 ? `${oku}億${man}万` : `${oku}億`;
    }
    if (num >= 10000) {
        return (num / 10000).toFixed(2) + '万';
    }
    return num.toString();
}

function formatEuroNumber(num) {
    // Format with thousand separators, only show decimals if needed
    const hasDecimals = num % 1 !== 0;
    return num.toLocaleString('en-US', {
        minimumFractionDigits: hasDecimals ? 2 : 0,
        maximumFractionDigits: 2
    });
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
    eurActualValue = jpy ? (jpy / exchangeRate).toFixed(2) : '';
    
    // Format EUR with thousand separators when not focused
    if (eurActualValue && parseFloat(eurActualValue) >= 1000 && document.activeElement !== eurInput) {
        eurInput.value = formatEuroNumber(parseFloat(eurActualValue));
    } else {
        eurInput.value = eurActualValue;
    }
    
    // Format JPY with Japanese notation when not focused
    const jpyInput = document.getElementById("jpyInput");
    if (jpy && parseFloat(jpy) >= 10000 && document.activeElement !== jpyInput) {
        jpyInput.value = formatJapaneseNumber(parseFloat(jpy));
    }
}

let eurActualValue = '';

function handleEurInput(e) {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    eurActualValue = value;
    convertEURtoJPY();
}

function handleEurFocus(e) {
    if (eurActualValue) {
        e.target.value = eurActualValue;
    }
}

function handleEurBlur(e) {
    if (eurActualValue && parseFloat(eurActualValue) >= 1000) {
        e.target.value = formatEuroNumber(parseFloat(eurActualValue));
    }
}

function convertEURtoJPY() {
    const eur = eurActualValue;
    const jpyInput = document.getElementById("jpyInput");
    const eurInput = document.getElementById("eurInput");
    jpyActualValue = eur ? (eur * exchangeRate).toFixed(2) : '';
    
    // Format JPY with Japanese notation when not focused
    if (jpyActualValue && parseFloat(jpyActualValue) >= 10000 && document.activeElement !== jpyInput) {
        jpyInput.value = formatJapaneseNumber(parseFloat(jpyActualValue));
    } else {
        jpyInput.value = jpyActualValue;
    }
    
    // Format EUR when not focused
    if (eur && parseFloat(eur) >= 1000 && document.activeElement !== eurInput) {
        eurInput.value = formatEuroNumber(parseFloat(eur));
    }
}

fetchExchangeRate();