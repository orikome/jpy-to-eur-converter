let exchangeRate = 172;

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

document.getElementById("jpyInput").addEventListener("input", convertJPYtoEUR);
document.getElementById("eurInput").addEventListener("input", convertEURtoJPY);

function convertJPYtoEUR() {
    const jpy = document.getElementById("jpyInput").value;
    const eurInput = document.getElementById("eurInput");
    eurInput.value = jpy ? (jpy / exchangeRate).toFixed(2) : '';
}

function convertEURtoJPY() {
    const eur = document.getElementById("eurInput").value;
    const jpyInput = document.getElementById("jpyInput");
    jpyInput.value = eur ? (eur * exchangeRate).toFixed(2) : '';
}

fetchExchangeRate();