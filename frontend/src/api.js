const API_BASE = 'http://localhost:2244/api';

export async function fetchAccounts() {
  const response = await fetch(`${API_BASE}/accounts`);
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE}/categories`);
  return response.json();
}

export async function fetchTransactions() {
  const response = await fetch(`${API_BASE}/transactions`);
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
