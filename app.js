let expenses = [];
let initialBalance = 0;

// Update the balance based on initial balance input
function updateBalance() {
    initialBalance = parseFloat(document.getElementById('initial-balance').value) || 0;
    renderExpenses();
}

// Add a new expense to the list
function addExpense() {
    const date = document.getElementById("expense-date").value;
    const item = document.getElementById("expense-item").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const category = document.getElementById("expense-category").value;

    if (!date || !item || isNaN(amount)) {
        alert("Please fill out all fields.");
        return;
    }

    const expense = { date, item, amount, category };
    expenses.push(expense);
    saveExpenses();
    renderExpenses();
    calculateMonthlyTotals();
}

// Save expenses to local storage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Load expenses from local storage
function loadExpenses() {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        renderExpenses();
        calculateMonthlyTotals();
    }
}

// Render expenses in the table and update the balance
function renderExpenses(filter = "All") {
    const expenseBody = document.getElementById('expense-body');
    expenseBody.innerHTML = '';

    let totalExpenses = 0;
    const filteredExpenses = expenses.filter(exp => filter === "All" || exp.category === filter);

    filteredExpenses.forEach((expense, index) => {
        totalExpenses += expense.amount;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.date}</td>
            <td>${expense.item}</td>
            <td>${expense.category}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteExpense(${index})">Delete</button></td>
        `;
        expenseBody.appendChild(row);
    });

    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('remaining-balance').textContent = (initialBalance - totalExpenses).toFixed(2);
}

// Delete an expense from the list
function deleteExpense(index) {
    expenses.splice(index, 1);
    saveExpenses();
    renderExpenses();
    calculateMonthlyTotals();
}

// Filter expenses by category
function filterExpenses() {
    const category = document.getElementById('category-filter').value;
    renderExpenses(category);
}

// Calculate total expenses by month
function calculateMonthlyTotals() {
    const monthlyTotals = {};

    expenses.forEach(expense => {
        const date = new Date(expense.date);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        
        if (monthlyTotals[monthYear]) {
            monthlyTotals[monthYear] += expense.amount;
        } else {
            monthlyTotals[monthYear] = expense.amount;
        }
    });

    renderMonthlyTotals(monthlyTotals);
}

// Render monthly totals in the summary table
function renderMonthlyTotals(monthlyTotals) {
    const monthlySummaryBody = document.getElementById("monthly-summary-body");
    monthlySummaryBody.innerHTML = ""; // Clear existing content

    Object.keys(monthlyTotals).forEach(monthYear => {
        const row = document.createElement("tr");

        const monthCell = document.createElement("td");
        monthCell.textContent = monthYear;

        const amountCell = document.createElement("td");
        amountCell.textContent = `₹${monthlyTotals[monthYear].toFixed(2)}`;

        row.appendChild(monthCell);
        row.appendChild(amountCell);
        monthlySummaryBody.appendChild(row);
    });
}

// Download expense data as a PDF
function downloadPDF() {
    const element = document.getElementById('expense-content');
    const options = {
        margin:       0.5,
        filename:     'Expense_Report.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(options).from(element).save();
}

// Initialize by loading any saved expenses
window.onload = loadExpenses;
