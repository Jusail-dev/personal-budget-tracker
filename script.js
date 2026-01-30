const amountInp = document.getElementById("amount_inp");
const dateInp = document.getElementById("date_inp");
const addTransBtn = document.getElementById("addTransBtn");
const radioButtons = document.querySelectorAll('input[name="type"]');
const importFile = document.getElementById("import-file");

const income = document.getElementById("income");
const expense = document.getElementById("expense");
const balance = document.getElementById("balance");

const tableBody = document.getElementById("tablebody");

let transactionInputData = {};
let transInputDataArray = [];

// Build UI
function buildUI() {
    tableBody.innerHTML = "";
    transInputDataArray.forEach((item) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Date">${item.date}</td>
            <td data-label="Amount">$${item.amount}</td>
            <td data-label="Type">${item.type}</td>
        `
        tableBody.appendChild(tr);
    });
};

//Calculate Income Expense Balance
function calcIncomeExpenseBalance() {
    let incomeVal = 0, expenseVal = 0, balanceVal = 0;
    transInputDataArray.forEach(item => {
        if (item.type == "Income") {
            let amountVal = JSON.parse(item.amount);
            incomeVal += amountVal;

        } else if (item.type == "Expense") {
            let amountVal = JSON.parse(item.amount);
            expenseVal += amountVal;

        };
    });
    balanceVal = incomeVal - expenseVal;

    income.textContent = incomeVal;
    expense.textContent = expenseVal;
    balance.textContent = balanceVal;
};


// Add Button Event
addTransBtn.addEventListener("click", () => {
    let amount = amountInp.value.trim();
    let date = dateInp.value;
    let type = null;
    radioButtons.forEach(radio => {
        if (radio.checked) {
            type = radio.value;
        };
    });
    if (amount == "" || date == "" || type == null) {
        alert("Please Fill All");
    } else {
        transactionInputData = {
            amount: amount,
            date: date,
            type: type
        };
        transInputDataArray.push(transactionInputData);
        setDataToLocalStorage();

        amountInp.value = "";
        dateInp.value = "";
        radioButtons.forEach(radio => {
            radio.checked = false;
        });
        buildUI();
        calcIncomeExpenseBalance();
    };
});



//Set and Get Data From Local Storage
function setDataToLocalStorage() {
    localStorage.setItem("transaction", JSON.stringify(transInputDataArray));
};
function getDataFromLocalStorage() {
    if (localStorage.getItem("transaction")) {
        transInputDataArray = JSON.parse(localStorage.getItem("transaction"));
    };
};

//Export Data
function exportData() {
    const dataStr = JSON.stringify(transInputDataArray, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "budget-data.json";
    a.click();

    URL.revokeObjectURL(url);
}

// Import JSON file
importFile.addEventListener("click", function () {
    // Create a hidden file input dynamically
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    // When user selects a file
    fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                alert("JSON file imported successfully!");
                transInputDataArray = jsonData;
                setDataToLocalStorage();
                getDataFromLocalStorage();
                buildUI();
                calcIncomeExpenseBalance()

            } catch (err) {
                alert("Invalid JSON file!");
            }
        };

        reader.readAsText(file);
    };

    // Trigger click on the hidden input
    fileInput.click();
});


getDataFromLocalStorage();
buildUI();
calcIncomeExpenseBalance();