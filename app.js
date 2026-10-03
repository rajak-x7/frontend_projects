const BASE_URL ="https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const dropdowns1 = document.querySelectorAll(".dropdown1 select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector('select[name="from"]');
const toCurr = document.querySelector('select[name="to"]');
const msg = document.querySelector(".msg");


// Add currencies to dropdown
for (let select of dropdowns1) {

    for (let currCode in countryList) {

        let newOption = document.createElement("option");

        newOption.innerText = currCode;
        newOption.value = currCode;

        // Default From currency = USD
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        }

        // Default To currency = INR
        if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.appendChild(newOption);
    }

    // Change flag when currency changes
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}


// Update flag
const updateFlag = (element) => {

    let currCode = element.value;

    let countryCode = countryList[currCode];

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    let flagImg = element.parentElement.querySelector("img");

    flagImg.src = newSrc;
};


// Get exchange rate
btn.addEventListener("click", async (evt) => {

    evt.preventDefault();

    let amount = document.querySelector(".amount input");

    let amtval = Number(amount.value);


    // Check amount
    if (amtval <= 0 || isNaN(amtval)) {

        amtval = 1;

        amount.value = "1";
    }


    // Currency codes
    let from = fromCurr.value.toLowerCase();

    let to = toCurr.value.toLowerCase();


    try {

        // API URL
        const url = `${BASE_URL}/${from}.json`;

        console.log("API URL:", url);


        // Fetch API
        let response = await fetch(url);


        if (!response.ok) {
            throw new Error("API request failed");
        }


        let data = await response.json();

        console.log("API Data:", data);


        // Get exchange rate
        let rate = data[from][to];


        if (rate === undefined) {
            throw new Error("Exchange rate not found");
        }


        // Calculate final amount
        let finalAmount = amtval * rate;


        // Show result
        msg.innerText =`${amtval} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

    }

    catch (error) {

        console.error("Error:", error);

        msg.innerText = "Unable to get exchange rate.";
    }

});
