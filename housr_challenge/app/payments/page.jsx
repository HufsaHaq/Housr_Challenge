"use client";
import { useState, useEffect } from "react";
import Navbar from "../navBar/page.jsx";

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    amount: '',
    type: 'rent',
    description: ''
  });

  const API_URL = 'http://localhost:5000';
  const USER_ID = 'student123';

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const response = await fetch(`${API_URL}/api/transactions/${USER_ID}`);
      const data = await response.json();
      setTransactions(data.reverse());
      setLoading(false);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setLoading(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: USER_ID,
          amount: parseFloat(formData.amount),
          type: formData.type
        })
      });

      const result = await response.json();

      if (result.success) {
        showNotification(
          `Payment processed successfully! You earned £${result.credits_earned.toFixed(2)} in credits.`,
          'success'
        );
        setFormData({ amount: '', type: 'rent', description: '' });
        loadTransactions();
      } else {
        showNotification('Payment failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      showNotification('An error occurred. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function showNotification(message, type) {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  }

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Manage your rent and bill payments</p>
        </div>

        {notification.show && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Payment</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="rent">Rent</option>
                    <option value="bills">Bills</option>
                    <option value="utilities">Utilities</option>
                    <option value="internet">Internet</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (£)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="500.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-gray-900 mb-1">Rewards Summary</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Base cashback (5%): £{(parseFloat(formData.amount || 0) * 0.05).toFixed(2)}</div>
                      <div className="text-green-700 font-medium">
                        You'll earn credits when payment is processed
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !formData.amount}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Process Payment'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {transactions.length} total {transactions.length === 1 ? 'transaction' : 'transactions'}
                </p>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading transactions...
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="mb-2">No payment history yet</div>
                  <div className="text-sm">Make your first payment to start earning rewards</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Credits Earned
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(transaction.timestamp)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              transaction.type === 'payment' 
                                ? 'bg-blue-100 text-blue-800'
                                : transaction.type === 'redemption'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                            {transaction.amount > 0 ? `£${transaction.amount.toFixed(2)}` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                            {transaction.credits_earned > 0 ? (
                              <span className="text-green-600">
                                +£{transaction.credits_earned.toFixed(2)}
                              </span>
                            ) : transaction.amount < 0 ? (
                              <span className="text-red-600">
                                -£{Math.abs(transaction.amount).toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How Rewards Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">5% Cashback</div>
                <div className="text-sm text-gray-600 mt-1">Earn 5% back on every payment you make</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Streak Bonuses</div>
                <div className="text-sm text-gray-600 mt-1">Get 10% extra credits after 3 consecutive payments</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <div className="font-medium text-gray-900">Redeem Anytime</div>
                <div className="text-sm text-gray-600 mt-1">Use credits for rent discounts or student perks</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}