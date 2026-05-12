import { useEffect, useState } from 'react';
import { fetchAccounts, fetchCategories, fetchTransactions, fetchDashboard, createTransaction } from './api';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dashboard, setDashboard] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, budgets: [] });
  const [form, setForm] = useState({ description: '', amount: '', type: 'EXPENSE', accountId: '', categoryId: '' });
  const [filters, setFilters] = useState({ q: '', accountId: '', categoryId: '', from: '', to: '' });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setAccounts(await fetchAccounts());
    setCategories(await fetchCategories());
    setTransactions(await fetchTransactions(filters));
    setDashboard(await fetchDashboard());
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      account: { id: parseInt(form.accountId, 10) },
      category: { id: parseInt(form.categoryId, 10) }
    };

    await createTransaction(payload);
    setForm({ description: '', amount: '', type: 'EXPENSE', accountId: '', categoryId: '' });
    loadData();
  };

  const applyFilters = async (event) => {
    event.preventDefault();
    setTransactions(await fetchTransactions(filters));
  };

  const resetFilters = async () => {
    const empty = { q: '', accountId: '', categoryId: '', from: '', to: '' };
    setFilters(empty);
    setTransactions(await fetchTransactions(empty));
  };

  return (
    <div className="app-shell">
      <header>
        <div className="header-row">
          <div>
            <h1>Finantz</h1>
            <p>Schneller Start: Einnahmen, Ausgaben und Budgetübersicht.</p>
          </div>
        </div>
      </header>

      <section className="grid summary-grid">
        <div className="panel summary-card">
          <h2>Monat</h2>
          <p>Einnahmen: <strong>{dashboard.totalIncome.toFixed(2)} €</strong></p>
          <p>Ausgaben: <strong>{dashboard.totalExpense.toFixed(2)} €</strong></p>
          <p>Saldo: <strong>{dashboard.balance.toFixed(2)} €</strong></p>
        </div>
        <div className="panel summary-card">
          <h2>Budgetstatus</h2>
          {dashboard.budgets.length === 0 ? (
            <p>Keine aktiven Budgets.</p>
          ) : (
            <ul>
              {dashboard.budgets.map((budget) => (
                <li key={budget.id} className={`budget-${budget.status.toLowerCase()}`}>
                  {budget.category}: {budget.spent.toFixed(2)} € / {budget.limit.toFixed(2)} €
                  <span className="budget-status">{budget.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Konten</h2>
          <ul>
            {accounts.map((account) => (
              <li key={account.id}>
                {account.name}: {account.balance.toFixed(2)} {account.currency}
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h2>Kategorien</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>{category.name}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel">
        <h2>Transaktionen</h2>
        <form onSubmit={applyFilters} className="filter-form">
          <div className="filter-row">
            <label>
              Suche
              <input type="text" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} placeholder="Beschreibung" />
            </label>
            <label>
              Konto
              <select value={filters.accountId} onChange={(e) => setFilters({ ...filters, accountId: e.target.value })}>
                <option value="">Alle</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </label>
            <label>
              Kategorie
              <select value={filters.categoryId} onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}>
                <option value="">Alle</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="filter-row">
            <label>
              Von
              <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
            </label>
            <label>
              Bis
              <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
            </label>
            <div className="filter-actions">
              <button type="submit">Anwenden</button>
              <button type="button" className="ghost-button" onClick={resetFilters}>Zurücksetzen</button>
            </div>
          </div>
        </form>
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Beschreibung</th>
              <th>Betrag</th>
              <th>Konto</th>
              <th>Kategorie</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td>{tx.description}</td>
                <td className={tx.amount < 0 ? 'negative' : 'positive'}>{tx.amount.toFixed(2)}</td>
                <td>{tx.account?.name}</td>
                <td>{tx.category?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel">
        <h2>Neue Transaktion</h2>
        <form onSubmit={handleSubmit} className="transaction-form">
          <label>
            Beschreibung
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </label>
          <label>
            Betrag
            <input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          </label>
          <label>
            Typ
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="EXPENSE">Ausgabe</option>
              <option value="INCOME">Einnahme</option>
            </select>
          </label>
          <label>
            Konto
            <select value={form.accountId} onChange={(e) => setForm({ ...form, accountId: e.target.value })} required>
              <option value="">Wähle ein Konto</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </label>
          <label>
            Kategorie
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
              <option value="">Wähle eine Kategorie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <button type="submit">Speichern</button>
        </form>
      </section>
    </div>
  );
}

export default App;
