const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:2244/api';

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
