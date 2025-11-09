"use client";
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../navBar/page.jsx";

export default function RewardsWheel() {
  const wheelPrizes = [
    { name: "£1 Credit", value: 1, color: "#10b981" },
    { name: "£2 Credit", value: 2, color: "#3b82f6" },
    { name: "£1 Credit", value: 1, color: "#8b5cf6" },
    { name: "£2 Credit", value: 2, color: "#f59e0b" },
    { name: "£1 Credit", value: 1, color: "#ef4444" },
    { name: "£5 Bonus", value: 5, color: "#ec4899" },
  ];

  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(3);
  const [userData, setUserData] = useState(null);
  const wheelRef = useRef(null);

  const API_URL = 'http://localhost:5000';
  const USER_ID = 'student123';

  useEffect(() => {
    loadUserData();
    const savedSpins = localStorage.getItem('spinsLeft');
    if (savedSpins) {
      setSpinsLeft(parseInt(savedSpins));
    }
  }, []);

  async function loadUserData() {
    try {
      const response = await fetch(`${API_URL}/api/user/${USER_ID}`);
      const user = await response.json();
      setUserData(user);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  const slices = wheelPrizes.length;
  const sliceAngle = 360 / slices;

  const handleSpin = () => {
    if (spinning || spinsLeft <= 0) return;
    
    setResult(null);
    setShowResult(false);
    setSpinning(true);

    const chosenIndex = Math.floor(Math.random() * slices);
    const fullRotations = 5 + Math.floor(Math.random() * 3);
    const angleToCenter = (360 - (chosenIndex * sliceAngle + sliceAngle / 2)) % 360;
    const targetRotation = rotation + fullRotations * 360 + angleToCenter;

    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      const normalized = ((360 - (targetRotation % 360)) % 360 + 360) % 360;
      const index = Math.floor((normalized + 0.0001) / sliceAngle) % slices;
      setResult(wheelPrizes[index]);
      setShowResult(true);
      
      const newSpinsLeft = spinsLeft - 1;
      setSpinsLeft(newSpinsLeft);
      localStorage.setItem('spinsLeft', newSpinsLeft.toString());
    }, 4000);
  };

  const handleClaimPrize = async () => {
    if (!result) return;

    try {
      const response = await fetch(`${API_URL}/api/wallet/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: USER_ID,
          amount: -result.value,
          item_name: `Spin Wheel Bonus: ${result.name}`
        })
      });

      if (response.ok) {
        window.location.href = '/account';
      }
    } catch (error) {
      console.error('Error claiming prize:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Rewards Wheel</h1>
          <p className="text-gray-600">Spin to win wallet credits and boost your balance!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Your Balance</div>
            <div className="text-3xl font-bold text-green-600">
              £{userData?.wallet_balance?.toFixed(2) || '0.00'}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Spins Remaining</div>
            <div className="text-3xl font-bold text-gray-900">{spinsLeft}</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">Current Tier</div>
            <div className="text-3xl font-bold text-gray-900">{userData?.tier || 'Bronze'}</div>
          </div>
        </div>

        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 transition-all duration-300 ${showResult ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 z-20">
                <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[35px] border-l-transparent border-r-transparent border-t-red-500"></div>
              </div>

              <div
                ref={wheelRef}
                className={`w-80 h-80 rounded-full shadow-xl relative transition-transform duration-[4000ms] ease-out ${spinning ? '' : 'cursor-pointer'}`}
                style={{ transform: `rotate(${rotation}deg)` }}
                onClick={!spinning && spinsLeft > 0 ? handleSpin : undefined}
              >
                <svg viewBox="0 0 200 200" className="w-full h-full rounded-full">
                  <g transform="translate(100,100)">
                    {wheelPrizes.map((prize, i) => {
                      const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
                      const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);
                      const x1 = Math.cos(startAngle) * 100;
                      const y1 = Math.sin(startAngle) * 100;
                      const x2 = Math.cos(endAngle) * 100;
                      const y2 = Math.sin(endAngle) * 100;
                      const largeArc = sliceAngle > 180 ? 1 : 0;
                      const path = `M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} z`;

                      const midAngle = ((i + 0.5) * sliceAngle - 90) * (Math.PI / 180);
                      const lx = Math.cos(midAngle) * 60;
                      const ly = Math.sin(midAngle) * 60;

                      return (
                        <g key={i}>
                          <path d={path} fill={prize.color} stroke="#ffffff" strokeWidth="2" />
                          <text
                            x={lx}
                            y={ly}
                            fontSize="12"
                            fontWeight="bold"
                            fill="#ffffff"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            style={{ pointerEvents: "none" }}
                          >
                            {prize.name}
                          </text>
                        </g>
                      );
                    })}
                    <circle cx="0" cy="0" r="20" fill="#1f2937"/>
                    <circle cx="0" cy="0" r="12" fill="#ffffff"/>
                  </g>
                </svg>
              </div>
            </div>

            <button
              onClick={handleSpin}
              disabled={spinning || spinsLeft <= 0}
              className={`mt-8 px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg ${
                spinning || spinsLeft <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {spinning ? 'Spinning...' : spinsLeft > 0 ? 'Spin the Wheel!' : 'No Spins Left'}
            </button>

            {spinsLeft === 0 && (
              <p className="mt-4 text-sm text-gray-600">
                Come back next week for more spins!
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How It Works</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Get 3 free spins weekly to win wallet credits</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Win between £1 to £5 in wallet credits</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Credits are instantly added to your wallet</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Use credits on student activities and perks</span>
            </li>
          </ul>
        </div>
      </div>

      {showResult && result && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center animate-fadeIn">
            <div className="mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
              <p className="text-gray-600 mb-4">You won:</p>
              <div className="text-4xl font-bold text-green-600 mb-6">{result.name}</div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleClaimPrize}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Add to Wallet
              </button>
              <button
                onClick={() => setShowResult(false)}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Spin Again ({spinsLeft} left)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}