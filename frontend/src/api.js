const API_BASE = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('finantz_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchAccounts() {
  const response = await fetch(`${API_BASE}/accounts`, {
    headers: getAuthHeaders()
  });
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_BASE}/categories`, {
    headers: getAuthHeaders()
  });
  return response.json();
}

export async function fetchTransactions() {
  const response = await fetch(`${API_BASE}/transactions`, {
    headers: getAuthHeaders()
  });
  return response.json();
}

export async function fetchDashboard() {
  const response = await fetch(`${API_BASE}/dashboard`, {
    headers: getAuthHeaders()
  });
  return response.json();
}

export async function createTransaction(transaction) {
  const response = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(transaction)
  });
  return response.json();
}

export async function login(credentials) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
}

export async function register(credentials) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
}
