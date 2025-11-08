"use client";
import { useState, useEffect } from "react";
import Navbar from "../navBar/page.jsx";

export default function AccountPage() {
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const API_URL = 'http://localhost:5000';
  const USER_ID = 'student123';

  useEffect(() => {
    loadUserData();
    loadTransactions();
  }, []);

  async function loadUserData() {
    try {
      const response = await fetch(`${API_URL}/api/user/${USER_ID}`);
      const user = await response.json();
      setUserData(user);
      setLoading(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setLoading(false);
    }
  }

  async function loadTransactions() {
    try {
      const response = await fetch(`${API_URL}/api/transactions/${USER_ID}`);
      const data = await response.json();
      setTransactions(data.slice(-5).reverse());
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  }

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  const tierConfig = {
    "Bronze": { min: 0, max: 2000, next: "Silver" },
    "Silver": { min: 2000, max: 5000, next: "Gold" },
    "Gold": { min: 5000, max: 10000, next: "Platinum" },
    "Platinum": { min: 10000, max: Infinity, next: null }
  };

  const currentTier = tierConfig[userData.tier];
  const tierProgress = currentTier.max === Infinity ? 100 : 
    ((userData.total_spent - currentTier.min) / (currentTier.max - currentTier.min)) * 100;
  const remainingToNextTier = currentTier.max === Infinity ? 0 : 
    currentTier.max - userData.total_spent;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Overview</h1>
          <p className="text-gray-600 mt-1">Manage your rewards and track your progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Current Balance</div>
            <div className="text-3xl font-bold text-gray-900">£{userData.balance.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1">Available credits</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Total Earned</div>
            <div className="text-3xl font-bold text-gray-900">£{userData.total_earned.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1">Lifetime credits</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Payment Streak</div>
            <div className="text-3xl font-bold text-gray-900">{userData.payment_streak}</div>
            <div className="text-sm text-gray-500 mt-1">Consecutive payments</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="text-sm font-medium text-gray-600 mb-2">Total Spent</div>
            <div className="text-3xl font-bold text-gray-900">£{userData.total_spent.toFixed(0)}</div>
            <div className="text-sm text-gray-500 mt-1">All time</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Membership Status</h2>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{userData.tier} Tier</div>
                  <div className="text-sm text-gray-600 mt-1">
                    £{userData.total_spent.toFixed(0)} total spent
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Cashback Rate</div>
                  <div className="text-2xl font-bold text-green-600">5%</div>
                </div>
              </div>

              {currentTier.next && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress to {currentTier.next}</span>
                    <span className="text-sm text-gray-600">
                      £{remainingToNextTier.toFixed(0)} remaining
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-green-600 h-full transition-all duration-500"
                      style={{ width: `${Math.min(tierProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">5% Cashback</div>
                      <div className="text-xs text-gray-600">On all payments</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 h-5 rounded bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Streak Bonus</div>
                      <div className="text-xs text-gray-600">10% extra after 3 payments</div>
                    </div>
                  </div>
                  {userData.tier === "Gold" && (
                    <>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Priority Support</div>
                          <div className="text-xs text-gray-600">24/7 assistance</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-5 h-5 rounded bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Exclusive Rewards</div>
                          <div className="text-xs text-gray-600">Premium perks</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Stats</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Savings Rate</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {((userData.total_earned / userData.total_spent) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${Math.min((userData.total_earned / userData.total_spent) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Current Streak</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {userData.payment_streak} {userData.payment_streak === 1 ? 'payment' : 'payments'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-full rounded-full"
                      style={{ width: `${Math.min((userData.payment_streak / 10) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {userData.payment_streak >= 3 ? 'Streak bonus active!' : `${3 - userData.payment_streak} more for bonus`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map(transaction => {
                    const isPositive = transaction.credits_earned > 0;
                    const date = new Date(transaction.timestamp).toLocaleDateString();
                    
                    return (
                      <div key={transaction.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                          <div className="text-xs text-gray-600 mt-0.5">{date}</div>
                          {isPositive && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              +£{transaction.credits_earned.toFixed(2)} earned
                            </div>
                          )}
                        </div>
                        {transaction.amount !== 0 && (
                          <div className={`text-sm font-semibold ${transaction.amount > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                            {transaction.amount > 0 ? `£${transaction.amount}` : `£${Math.abs(transaction.amount).toFixed(2)}`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="/payments" className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors text-center">
                  Payment History
                </a>
                <a href="/rewards" className="block w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors text-center">
                  Browse Rewards
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}