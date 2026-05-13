const API_BASE = import.meta.env.VITE_API_BASE || `${window.location.protocol}//${window.location.hostname}:2244/api`;

function buildQuery(params) {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

export async function fetchAccounts() {
  const response = await fetch(`${API_BASE}/accounts`);
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE}/categories`);
  return response.json();
}

export async function fetchTransactions(filters = {}) {
  const query = buildQuery(filters);
  const url = `${API_BASE}/transactions${query ? `/search?${query}` : ''}`;
  const response = await fetch(url);
  return response.json();
}

export async function fetchDashboard() {
  const response = await fetch(`${API_BASE}/dashboard`);
  return response.json();
}

export async function createTransaction(transaction) {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  });
  return response.json();
}

export async function createAccount(account) {
  const response = await fetch(`${API_BASE}/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account)
  });
  return response.json();
}

export async function createCategory(category) {
  const response = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  return response.json();
}

export async function updateAccount(id, account) {
  const response = await fetch(`${API_BASE}/accounts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account)
  });
  return response.json();
}

export async function updateCategory(id, category) {
  const response = await fetch(`${API_BASE}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });
  return response.json();
}

export async function deleteTransaction(id) {
  const response = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE'
  });
  return response.ok;
}

export async function fetchRecurringTransactions() {
  const response = await fetch(`${API_BASE}/recurring-transactions`);
  return response.json();
}

export async function createRecurringTransaction(transaction) {
  const response = await fetch(`${API_BASE}/recurring-transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  });
  return response.json();
}

export async function updateRecurringTransaction(id, transaction) {
  const response = await fetch(`${API_BASE}/recurring-transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  });
  return response.json();
}

export async function deleteRecurringTransaction(id) {
  const response = await fetch(`${API_BASE}/recurring-transactions/${id}`, {
    method: 'DELETE'
  });
  return response.ok;
}

export async function fetchBudgets() {
  const response = await fetch(`${API_BASE}/budgets`);
  return response.json();
}

export async function createBudget(budget) {
  const response = await fetch(`${API_BASE}/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget)
  });
  return response.json();
}

export async function updateBudget(id, budget) {
  const response = await fetch(`${API_BASE}/budgets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget)
  });
  return response.json();
}

export async function deleteBudget(id) {
  const response = await fetch(`${API_BASE}/budgets/${id}`, {
    method: 'DELETE'
  });
  return response.ok;
}

export async function transferMoney(fromAccountId, toAccountId, amount) {
  const response = await fetch(`${API_BASE}/transactions/transfer?fromAccountId=${fromAccountId}&toAccountId=${toAccountId}&amount=${amount}`, {
    method: 'POST'
  });
  return response.ok;
}
