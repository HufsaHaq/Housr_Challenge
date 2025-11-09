"use client";
import React, { useEffect, useState, useRef } from "react";

export default function SpinningWheelWithPrizes() {
  const defaultPrizes = [
    { name: "£50 Voucher", img: "/images/voucher.png" },
    { name: "Extra Life", img: null },
    { name: "Free Coffee", img: "/images/coffee.png" },
    { name: "Try Again", img: null },
    { name: "Mystery Box", img: "/images/mysterybox.png" },
    { name: "Grand Prize", img: "/images/grandprize.png" },
    { name: "Bonus Points", img: null },
    { name: "Gift Card", img: "/images/giftcard.png" },
    { name: "Discount Code", img: null },
    { name: "Surprise Item", img: "/images/surprise.png" }
  ];

  const pickRandomPrizes = () => {
    const shuffled = [...defaultPrizes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  };

    const [prizes, setPrizes] = useState([]);
    useEffect(() => {
        setPrizes(pickRandomPrizes());
    }, []);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [showPrizeOverlay, setShowPrizeOverlay] = useState(false);
  const wheelRef = useRef(null);

  const slices = prizes.length;
  const sliceAngle = 360 / slices;

  const colors = [
    "#FFB6C1",
    "#FFD580",
    "#C1FFC1",
    "#C1E7FF",
    "#E6C1FF",
    "#FFF3C1",
  ];

  const handleSpin = () => {
    if (spinning) return;
    setResult(null);
    setShowPrizeOverlay(false);

    const chosenIndex = Math.floor(Math.random() * slices);
    const fullRotations = 4 + Math.floor(Math.random() * 4);
    const angleToCenter = (360 - (chosenIndex * sliceAngle + sliceAngle / 2)) % 360;
    const jitter = (Math.random() - 0.5) * (sliceAngle * 0.6);
    const finalAngle = angleToCenter + jitter;
    const targetRotation = rotation + fullRotations * 360 + finalAngle;

    setRotation(targetRotation);

    const durationMs = 4000;

    setTimeout(() => {
      setSpinning(false);
      const normalized = ((360 - (targetRotation % 360)) % 360 + 360) % 360;
      const index = Math.floor((normalized + 0.0001) / sliceAngle) % slices;
      setResult({ index, prize: prizes[index] });
      setShowPrizeOverlay(true);
    }, durationMs + 50);
  };

  const handleClaimPrize = () => {
    window.location.href = "/LoginPage";
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start p-6 transition-all duration-500 ${showPrizeOverlay ? 'bg-gray-900/80' : 'bg-green'}`}>
      {/* Title at the very top */}
      <h1 className="text-3xl font-bold mb-12 text-center text-gray-800">Spin the Wheel!</h1>

      <div className={`relative flex flex-col items-center ${showPrizeOverlay ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
        {/* Arrow at the top center */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-7 z-20 flex flex-col items-center">
            <div className="text-xs mb-1 font-semibold text-gray-800">COUPONS</div>
            <div   className="w-0 h-0 border-l-15 border-r-15 border-t-28 border-l-transparent border-r-transparent border-t-red-500"></div>
        </div>

        {/* Wheel container */}
        <div
          ref={wheelRef}
          onClick={handleSpin}
          className={`w-80 h-80 rounded-full shadow-xl cursor-pointer select-none relative transition-transform duration-4000 ease-out`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full rounded-full">
            <g transform="translate(100,100)">
              {prizes.map((p, i) => {
                const startAngle = (i * sliceAngle - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * sliceAngle - 90) * (Math.PI / 180);
                const x1 = Math.cos(startAngle) * 100;
                const y1 = Math.sin(startAngle) * 100;
                const x2 = Math.cos(endAngle) * 100;
                const y2 = Math.sin(endAngle) * 100;
                const largeArc = sliceAngle > 180 ? 1 : 0;
                const path = `M 0 0 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} z`;

                const midAngle = ((i + 0.5) * sliceAngle - 90) * (Math.PI / 180);
                const lx = Math.cos(midAngle) * 50;
                const ly = Math.sin(midAngle) * 50;

                return (
                  <g key={i}>
                    <path d={path} fill={colors[i % colors.length]} stroke="#ffffff" strokeWidth="0.5" />
                    <text
                      x={lx}
                      y={ly - (p.img ? 14 : 0)}
                      fontSize="9"
                      fill="#111827"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ pointerEvents: "none" }}
                    >
                      {p.name}
                    </text>
                    {p.img && (
                      <image
                        href={p.img}
                        x={lx - 12}
                        y={ly}
                        width={24}
                        height={24}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    )}
                  </g>
                );
              })}

                <circle cx="0" cy="0" r="24" fill="#111827"/>

            </g>
          </svg>
        </div>
      </div>

      {showPrizeOverlay && result && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-50 text-white">
          <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-xs animate-fadeIn">
            <h2 className="text-xl font-bold mb-2">Congratulations!</h2>
            <p className="text-lg mb-4">You won:</p>
            {result.prize.img && <img src={result.prize.img} alt={result.prize.name} className="mx-auto mb-3 w-16 h-16" />}
            <div className="text-2xl font-extrabold text-green-600 mb-6">{result.prize.name}</div>
            <button
              onClick={handleClaimPrize}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Claim Prize
            </button>
          </div>
        </div>
      )}
    </div>
  );
}