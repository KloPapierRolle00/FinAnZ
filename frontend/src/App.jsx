import { useEffect, useState } from 'react';
import {
  fetchAccounts,
  fetchCategories,
  fetchTransactions,
  fetchDashboard,
  createTransaction,
  createAccount,
  createCategory,
  updateAccount,
  updateCategory,
  deleteTransaction,
  fetchRecurringTransactions,
  createRecurringTransaction,
  deleteRecurringTransaction,
  updateRecurringTransaction
} from './api';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [dashboard, setDashboard] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, budgets: [] });
  const [transactionForm, setTransactionForm] = useState({ description: '', amount: '', type: 'EXPENSE', accountId: '', categoryId: '' });
  const [accountForm, setAccountForm] = useState({ name: '', balance: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [recurringForm, setRecurringForm] = useState({ amount: '', type: 'EXPENSE', dayOfMonth: '1', accountId: '', categoryId: '' });
  const [activeModal, setActiveModal] = useState(null);
  const [currentEditAccount, setCurrentEditAccount] = useState(null);
  const [currentEditCategory, setCurrentEditCategory] = useState(null);
  const [currentEditRecurring, setCurrentEditRecurring] = useState(null);
  const [filters, setFilters] = useState({ q: '', accountId: '', categoryId: '', from: '', to: '' });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setAccounts(await fetchAccounts());
    setCategories(await fetchCategories());
    setTransactions(await fetchTransactions(filters));
    setRecurringTransactions(await fetchRecurringTransactions());
    setDashboard(await fetchDashboard());
  }

  const openNewAccountModal = () => {
    setCurrentEditAccount(null);
    setAccountForm({ name: '', balance: '' });
    setActiveModal('account');
  };

  const openEditAccountModal = (account) => {
    setCurrentEditAccount(account);
    setAccountForm({ name: account.name, balance: account.balance.toString() });
    setActiveModal('account');
  };

  const openNewCategoryModal = () => {
    setCurrentEditCategory(null);
    setCategoryForm({ name: '' });
    setActiveModal('category');
  };

  const openEditCategoryModal = (category) => {
    setCurrentEditCategory(category);
    setCategoryForm({ name: category.name });
    setActiveModal('category');
  };

  const openNewTransactionModal = () => {
    setTransactionForm({ description: '', amount: '', type: 'EXPENSE', accountId: '', categoryId: '' });
    setActiveModal('transaction');
  };

  const closeModal = () => {
    setActiveModal(null);
    setCurrentEditAccount(null);
    setCurrentEditCategory(null);
  };

  const saveAccount = async (event) => {
    event.preventDefault();
    const payload = {
      name: accountForm.name,
      balance: parseFloat(accountForm.balance) || 0
    };

    if (currentEditAccount) {
      await updateAccount(currentEditAccount.id, payload);
    } else {
      await createAccount(payload);
    }

    closeModal();
    loadData();
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    const payload = { name: categoryForm.name };

    if (currentEditCategory) {
      await updateCategory(currentEditCategory.id, payload);
    } else {
      await createCategory(payload);
    }

    closeModal();
    loadData();
  };

  const saveTransaction = async (event) => {
    event.preventDefault();
    const payload = {
      description: transactionForm.description,
      amount: parseFloat(transactionForm.amount),
      type: transactionForm.type,
      account: { id: parseInt(transactionForm.accountId, 10) },
      category: { id: parseInt(transactionForm.categoryId, 10) }
    };

    await createTransaction(payload);
    closeModal();
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

  const openNewRecurringModal = () => {
    setCurrentEditRecurring(null);
    setRecurringForm({ amount: '', type: 'EXPENSE', dayOfMonth: '1', accountId: '', categoryId: '' });
    setActiveModal('recurring');
  };

  const saveRecurring = async (event) => {
    event.preventDefault();
    const payload = {
      description: 'Recurring',
      amount: parseFloat(recurringForm.amount),
      type: recurringForm.type,
      dayOfMonth: parseInt(recurringForm.dayOfMonth, 10),
      account: { id: parseInt(recurringForm.accountId, 10) },
      category: { id: parseInt(recurringForm.categoryId, 10) }
    };

    if (currentEditRecurring) {
      await updateRecurringTransaction(currentEditRecurring.id, payload);
    } else {
      await createRecurringTransaction(payload);
    }

    setActiveModal(null);
    setCurrentEditRecurring(null);
    loadData();
  };

  const deleteTransactionHandler = async (id) => {
    if (confirm('Transaktion wirklich löschen?')) {
      await deleteTransaction(id);
      loadData();
    }
  };

  const deleteRecurringHandler = async (id) => {
    if (confirm('Wiederkehrende Transaktion wirklich löschen?')) {
      await deleteRecurringTransaction(id);
      loadData();
    }
  };

  return (
    <div className="app-shell">
      <header>
        <div className="header-row">
          <div>
            <h1>FinAnZ</h1>
            <p>Verwalte Konten, Kategorien und deine nächsten Buchungen.</p>
          </div>
          <div className="header-actions">
            <button type="button" className="ghost-button" onClick={openNewTransactionModal}>Neue Transaktion</button>
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

      <section className="grid panel-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>Konten</h2>
            <button type="button" className="ghost-button" onClick={openNewAccountModal}>Neues Konto</button>
          </div>
          <ul>
            {accounts.map((account) => (
              <li key={account.id} className="entity-row">
                <div className="entity-view-row">
                  <span>{account.name}: {account.balance.toFixed(2)} {account.currency}</span>
                  <button type="button" className="ghost-button" onClick={() => openEditAccountModal(account)}>Bearbeiten</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>Kategorien</h2>
            <button type="button" className="ghost-button" onClick={openNewCategoryModal}>Neue Kategorie</button>
          </div>
          <ul>
            {categories.map((category) => (
              <li key={category.id} className="entity-row">
                <div className="entity-view-row">
                  <span>{category.name}</span>
                  <button type="button" className="ghost-button" onClick={() => openEditCategoryModal(category)}>Bearbeiten</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Wiederkehrende Transaktionen</h2>
          <button type="button" className="ghost-button" onClick={openNewRecurringModal}>Neue wiederkehrende Transaktion</button>
        </div>
        <ul>
          {recurringTransactions.map((recurring) => (
            <li key={recurring.id} className="entity-row">
              <div className="entity-view-row">
                <span><strong>{recurring.category?.name}</strong> - {recurring.amount.toFixed(2)}€ am {recurring.dayOfMonth}. des Monats ({recurring.type})</span>
                <div className="entity-actions">
                  <button type="button" className="ghost-button" onClick={() => {
                    setCurrentEditRecurring(recurring);
                    setRecurringForm({
                      amount: recurring.amount,
                      type: recurring.type,
                      dayOfMonth: recurring.dayOfMonth,
                      accountId: recurring.account?.id || '',
                      categoryId: recurring.category?.id || ''
                    });
                    setActiveModal('recurring');
                  }}>Bearbeiten</button>
                  <button type="button" className="ghost-button" onClick={() => deleteRecurringHandler(recurring.id)}>Löschen</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Transaktionen</h2>
          <button type="button" className="ghost-button" onClick={openNewTransactionModal}>Neue Transaktion</button>
        </div>
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
              <th>Aktionen</th>
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
                <td>
                  <button type="button" className="ghost-button" onClick={() => deleteTransactionHandler(tx.id)} style={{ padding: '6px 12px', fontSize: '0.9rem' }}>Löschen</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {activeModal === 'account' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentEditAccount ? 'Konto bearbeiten' : 'Neues Konto'}</h2>
              <button type="button" className="close-button" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={saveAccount} className="transaction-form">
              <label>
                Name
                <input value={accountForm.name} onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })} required />
              </label>
              <label>
                Startsaldo
                <input type="number" step="0.01" value={accountForm.balance} onChange={(e) => setAccountForm({ ...accountForm, balance: e.target.value })} />
              </label>
              <div className="modal-actions">
                <button type="submit">Speichern</button>
                <button type="button" className="ghost-button" onClick={closeModal}>Abbrechen</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'category' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentEditCategory ? 'Kategorie bearbeiten' : 'Neue Kategorie'}</h2>
              <button type="button" className="close-button" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={saveCategory} className="transaction-form">
              <label>
                Name
                <input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
              </label>
              <div className="modal-actions">
                <button type="submit">Speichern</button>
                <button type="button" className="ghost-button" onClick={closeModal}>Abbrechen</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'transaction' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Neue Transaktion</h2>
              <button type="button" className="close-button" onClick={closeModal}>×</button>
            </div>
            <form onSubmit={saveTransaction} className="transaction-form">
              <label>
                Beschreibung
                <input value={transactionForm.description} onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })} required />
              </label>
              <label>
                Betrag
                <input type="number" step="0.01" value={transactionForm.amount} onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })} required />
              </label>
              <label>
                Typ
                <select value={transactionForm.type} onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}>
                  <option value="EXPENSE">Ausgabe</option>
                  <option value="INCOME">Einnahme</option>
                </select>
              </label>
              <label>
                Konto
                <select value={transactionForm.accountId} onChange={(e) => setTransactionForm({ ...transactionForm, accountId: e.target.value })} required>
                  <option value="">Wähle ein Konto</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Kategorie
                <select value={transactionForm.categoryId} onChange={(e) => setTransactionForm({ ...transactionForm, categoryId: e.target.value })} required>
                  <option value="">Wähle eine Kategorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <div className="modal-actions">
                <button type="submit">Speichern</button>
                <button type="button" className="ghost-button" onClick={closeModal}>Abbrechen</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'recurring' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{currentEditRecurring ? 'Wiederkehrende Transaktion bearbeiten' : 'Neue wiederkehrende Transaktion'}</h2>
              <button type="button" className="close-button" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <form onSubmit={saveRecurring} className="transaction-form">
              <label>
                Betrag
                <input type="number" step="0.01" value={recurringForm.amount} onChange={(e) => setRecurringForm({ ...recurringForm, amount: e.target.value })} required />
              </label>
              <label>
                Typ
                <select value={recurringForm.type} onChange={(e) => setRecurringForm({ ...recurringForm, type: e.target.value })}>
                  <option value="EXPENSE">Ausgabe</option>
                  <option value="INCOME">Einnahme</option>
                </select>
              </label>
              <label>
                Tag des Monats (1-31)
                <input type="number" min="1" max="31" value={recurringForm.dayOfMonth} onChange={(e) => setRecurringForm({ ...recurringForm, dayOfMonth: e.target.value })} required />
              </label>
              <label>
                Konto
                <select value={recurringForm.accountId} onChange={(e) => setRecurringForm({ ...recurringForm, accountId: e.target.value })} required>
                  <option value="">Wähle ein Konto</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>{account.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Kategorie
                <select value={recurringForm.categoryId} onChange={(e) => setRecurringForm({ ...recurringForm, categoryId: e.target.value })} required>
                  <option value="">Wähle eine Kategorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <div className="modal-actions">
                <button type="submit">Speichern</button>
                <button type="button" className="ghost-button" onClick={() => setActiveModal(null)}>Abbrechen</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
