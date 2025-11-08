"use client";
import { useState, useEffect } from "react";
import Navbar from "../navBar/page.jsx";

export default function RewardsPage() {
  const [perks, setPerks] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [selectedCategory, setSelectedCategory] = useState('All');

  const API_URL = 'http://localhost:5000';
  const USER_ID = 'student123';

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await Promise.all([loadPerks(), loadUserData()]);
    setLoading(false);
  }

  async function loadPerks() {
    try {
      const response = await fetch(`${API_URL}/api/perks`);
      const data = await response.json();
      setPerks(data);
    } catch (error) {
      console.error('Error loading perks:', error);
    }
  }

  async function loadUserData() {
    try {
      const response = await fetch(`${API_URL}/api/user/${USER_ID}`);
      const user = await response.json();
      setUserData(user);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async function handlePurchase(perk) {
    if (!userData || userData.wallet_balance < perk.cost) {
      showNotification('Insufficient wallet balance', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: USER_ID,
          perk_id: perk.id
        })
      });

      const result = await response.json();

      if (result.success) {
        showNotification(
          `Successfully purchased ${perk.name}! Your new tier: ${result.tier}`,
          'success'
        );
        loadUserData();
      } else {
        showNotification(result.error, 'error');
      }
    } catch (error) {
      console.error('Error purchasing:', error);
      showNotification('An error occurred. Please try again.', 'error');
    }
  }

  function showNotification(message, type) {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
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

  const categories = ['All', ...new Set(perks.map(p => p.category))];
  const filteredPerks = selectedCategory === 'All' 
    ? perks 
    : perks.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Spend Wallet Credits</h1>
          <p className="text-gray-600 mt-1">Use your credits on student activities and essentials</p>
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-sm font-medium text-gray-600">Your Wallet Balance</div>
              <div className="text-4xl font-bold text-green-600 mt-1">
                £{userData.wallet_balance.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-600">Current Tier</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{userData.tier}</div>
              <div className="text-xs text-gray-600 mt-1">
                £{userData.wallet_spent.toFixed(2)} spent
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPerks.map(perk => {
            const canAfford = userData.wallet_balance >= perk.cost;
            
            return (
              <div 
                key={perk.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{perk.name}</h3>
                      <div className="text-sm text-gray-600 mt-1">{perk.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        £{perk.cost.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(perk)}
                    disabled={!canAfford}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      canAfford
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Purchase' : 'Insufficient Balance'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPerks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No items found in this category</p>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Spending = Tier Progress
          </h3>
          <p className="text-sm text-blue-800">
            Every purchase from your wallet counts toward your tier progression. 
            Spend more to unlock better benefits and exclusive rewards!
          </p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3">
              <div className="font-semibold text-gray-900">Bronze</div>
              <div className="text-xs text-gray-600">£0 - £49</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="font-semibold text-gray-900">Silver</div>
              <div className="text-xs text-gray-600">£50 - £199</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="font-semibold text-gray-900">Gold</div>
              <div className="text-xs text-gray-600">£200 - £499</div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <div className="font-semibold text-gray-900">Platinum</div>
              <div className="text-xs text-gray-600">£500+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}