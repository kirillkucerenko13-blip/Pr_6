document.addEventListener("DOMContentLoaded", () => {
  const dateSpan = document.getElementById("current-date");
  dateSpan.textContent = new Date().toLocaleDateString("uk-UA");

  let exchangeRates = [];

  fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json")
    .then((response) => response.json())
    .then((data) => {
      exchangeRates = data;
      renderCurrencyList(data);
      populateDatalist(data);
    })
    .catch((err) => console.error("Помилка завантаження даних:", err));

  // Функція рендерингу списку валют
  function renderCurrencyList(data) {
    const list = document.getElementById("currency-list");
    list.innerHTML = "";

    data.forEach((currency) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${currency.cc} - ${currency.txt}</span> <span>${currency.rate.toFixed(2)} грн</span>`;
      list.appendChild(li);
    });
  }

  function populateDatalist(data) {
    const datalist = document.getElementById("currency-select");
    datalist.innerHTML = "";

    data.forEach((currency) => {
      const option = document.createElement("option");
      option.value = `${currency.cc} - ${currency.txt}`;
      option.setAttribute("data-rate", currency.rate);
      datalist.appendChild(option);
    });
  }

  const amountForeignInput = document.getElementById("amount-foreign");
  const currencyInputForeign = document.getElementById(
    "currency-input-foreign",
  );
  const amountUahResult = document.getElementById("amount-uah-result");

  const amountUahInput = document.getElementById("amount-uah");
  const currencyInputLocal = document.getElementById("currency-input-local");
  const amountForeignResult = document.getElementById("amount-foreign-result");

  function getRateFromDatalist(inputValue) {
    const option = document.querySelector(
      `#currency-select option[value="${inputValue}"]`,
    );
    return option ? parseFloat(option.getAttribute("data-rate")) : null;
  }

  function convertToUah() {
    const amount = parseFloat(amountForeignInput.value);
    const rate = getRateFromDatalist(currencyInputForeign.value);

    if (!isNaN(amount) && rate) {
      const result = amount * rate;
      amountUahResult.value = result.toFixed(2);
    } else {
      amountUahResult.value = "";
    }
  }

  amountForeignInput.addEventListener("input", convertToUah);
  currencyInputForeign.addEventListener("change", convertToUah);

  function convertToForeign() {
    const amountUah = parseFloat(amountUahInput.value);
    const rate = getRateFromDatalist(currencyInputLocal.value);

    if (!isNaN(amountUah) && rate) {
      const result = amountUah / rate;
      amountForeignResult.value = result.toFixed(2);
    } else {
      amountForeignResult.value = "";
    }
  }

  amountUahInput.addEventListener("input", convertToForeign);
  currencyInputLocal.addEventListener("change", convertToForeign);
});
