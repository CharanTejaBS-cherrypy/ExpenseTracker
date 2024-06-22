const balance = document.getElementById("balance-amount");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const categoryContainer = document.getElementById("category-container");

const categories = [
  { name: "Food", icon: "fas fa-utensils" },
  { name: "Transp", icon: "fas fa-bus" },
  { name: "Film", icon: "fas fa-film" },
  { name: "Shop", icon: "fas fa-shopping-bag" },
  { name: "Health", icon: "fas fa-heartbeat" },
  { name: "Edu", icon: "fas fa-book" },
  { name: "Utilities", icon: "fas fa-lightbulb" },
  { name: "Travel", icon: "fas fa-plane" },
  { name: "Dining", icon: "fas fa-wine-glass" },
  { name: "Grocery", icon: "fas fa-apple-alt" },
  { name: "Insurance", icon: "fas fa-shield-alt" },
  { name: "Rent", icon: "fas fa-home" },
  { name: "Taxes", icon: "fas fa-file-invoice-dollar" },
  { name: "Savings", icon: "fas fa-piggy-bank" },
  { name: "Invest", icon: "fas fa-chart-line" },
  { name: "Others", icon: "fas fa-ellipsis-h" },
];

// Generate category cards dynamically
categories.forEach((cat) => {
  const card = document.createElement("div");
  card.classList.add("category-card");
  card.innerHTML = `<i class="${cat.icon}"></i><span>${cat.name}</span>`;
  card.onclick = () => {
    category.value = cat.name;
    categoryContainer.style.display = "none";
  };
  categoryContainer.appendChild(card);
});

category.onclick = () => {
  categoryContainer.style.display = "flex";
};

const localStorageTransactions =
  JSON.parse(localStorage.getItem("transactions")) || [];
let transactions = localStorageTransactions;

function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `₹${total}`;
  money_plus.innerText = `+₹${income}`;
  money_minus.innerText = `-₹${expense}`;

  updateChart();
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
    ${transaction.text} <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${
      transaction.id
    })">x</button>
  `;
  list.appendChild(item);
}

// function updateChart() {
//   const categoryTotals = categories.reduce((acc, cat) => {
//     acc[cat.name] = 0;
//     return acc;
//   }, {});

//   transactions.forEach((transaction) => {
//     categoryTotals[transaction.category] += transaction.amount;
//   });

//   const chartData = {
//     labels: categories.map((cat) => cat.name),
//     datasets: [
//       {
//         data: categories.map((cat) => Math.abs(categoryTotals[cat.name])),
//         backgroundColor: [
//           "#ff6384",
//           "#36a2eb",
//           "#cc65fe",
//           "#ffce56",
//           "#2e7d32",
//           "#c2185b",
//           "#7e57c2",
//           "#26c6da",
//           "#ff7043",
//           "#66bb6a",
//           "#ffee58",
//           "#8d6e63",
//           "#9ccc65",
//           "#ffab40",
//           "#7e57c2",
//           "#78909c",
//         ],
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       tooltip: {
//         callbacks: {
//           label: function (context) {
//             let label = context.label || "";
//             if (label) {
//               label += ": ";
//             }
//             if (context.parsed !== null) {
//               label += new Intl.NumberFormat("en-US", {
//                 style: "currency",
//                 currency: "INR",
//               }).format(context.parsed);
//             }
//             return label;
//           },
//         },
//       },
//     },
//   };

//   if (window.categoryChart) {
//     window.categoryChart.data = chartData;
//     window.categoryChart.update();
//   } else {
//     const ctx = document.getElementById("category-chart").getContext("2d");
//     window.categoryChart = new Chart(ctx, {
//       type: "doughnut",
//       data: chartData,
//       options: chartOptions,
//     });
//   }
// }
function updateChart() {
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.amount < 0
  );

  const categoryTotals = categories.reduce((acc, cat) => {
    acc[cat.name] = 0;
    return acc;
  }, {});

  expenseTransactions.forEach((transaction) => {
    categoryTotals[transaction.category] += transaction.amount;
  });

  const chartData = {
    labels: categories.map((cat) => cat.name),
    datasets: [
      {
        data: categories.map((cat) => Math.abs(categoryTotals[cat.name])),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#cc65fe",
          "#ffce56",
          "#2e7d32",
          "#c2185b",
          "#7e57c2",
          "#26c6da",
          "#ff7043",
          "#66bb6a",
          "#ffee58",
          "#8d6e63",
          "#9ccc65",
          "#ffab40",
          "#7e57c2",
          "#78909c",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
              }).format(context.parsed);
            }
            return label;
          },
        },
      },
    },
  };

  if (window.categoryChart) {
    window.categoryChart.data = chartData;
    window.categoryChart.update();
  } else {
    const ctx = document.getElementById("category-chart").getContext("2d");
    window.categoryChart = new Chart(ctx, {
      type: "doughnut",
      data: chartData,
      options: chartOptions,
    });
  }
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
}

function addTransaction(e) {
  e.preventDefault();

  if (
    text.value.trim() === "" ||
    amount.value.trim() === "" ||
    category.value.trim() === ""
  ) {
    alert("Please fill in all fields");
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
    category: category.value,
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);

  updateValues();

  updateLocalStorage();

  text.value = "";
  amount.value = "";
  category.value = "";
}

document.addEventListener("DOMContentLoaded", function () {
  const listContainer = document.querySelector(".list-container");
  const list = document.getElementById("list");

  // Function to adjust list container height based on list content
  const adjustListHeight = () => {
    const listHeight = list.scrollHeight;
    listContainer.style.height = listHeight + "px";
  };

  // Event listener for when a new transaction is added
  document.addEventListener("transactionAdded", adjustListHeight);

  // Example of how to trigger the event (adjust this based on your Vue.js code)
  const emitTransactionAdded = () => {
    const event = new Event("transactionAdded");
    document.dispatchEvent(event);
  };

  emitTransactionAdded(); // Trigger the event initially
});

let transactionType = "expense";

function setTransactionType(type) {
  transactionType = type;
}

function addTransaction(e) {
  e.preventDefault();

  if (
    text.value.trim() === "" ||
    amount.value.trim() === "" ||
    category.value.trim() === ""
  ) {
    alert("Please fill in all fields");
    return;
  }

  const amountValue = +amount.value * (transactionType === "expense" ? -1 : 1);

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: amountValue,
    category: category.value,
  };

  transactions.push(transaction);

  addTransactionDOM(transaction);

  updateValues();

  updateLocalStorage();

  text.value = "";
  amount.value = "";
  category.value = "";
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initialize app
function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener("submit", addTransaction);
