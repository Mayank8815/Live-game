import React, { useState, useEffect } from 'react';

export default function Splash() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    // Array of objects representing Indian currency colors and symbols
    const indianCurrencies = [
      { symbol: '₹', color: '#db2777' }, // Pink for ₹2000
      { symbol: '₹', color: '#65a30d' }, // Greenish for ₹500
      { symbol: '₹', color: '#f97316' }, // Orange for ₹200
      { symbol: '₹', color: '#8b5cf6' }, // Purple for ₹100
      { symbol: '🪙', color: '#eab308' }, // Gold Coin
      { symbol: '💰', color: '#ca8a04' }, // Gold Money Bag
    ];

    // Generate 35 random money elements for the falling animation
    const generatedCoins = Array.from({ length: 35 }).map((_, i) => {
      const randomMoney = indianCurrencies[Math.floor(Math.random() * indianCurrencies.length)];
      return {
        id: i,
        left: Math.random() * 100, // Random horizontal position (0 to 100vw)
        delay: Math.random() * 2,  // Random start delay (0 to 2 seconds)
        duration: 2 + Math.random() * 4, // Random fall speed (2 to 6 seconds)
        symbol: randomMoney.symbol,
        color: randomMoney.color,
        size: 1.5 + Math.random() * 2 // Random font size (1.5rem to 3.5rem)
      };
    });
    setCoins(generatedCoins);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center bg-gradient-to-b from-orange-200 via-orange-100 to-pink-200 overflow-hidden select-none">
      
      {/* Injecting CSS Keyframes for the falling/flying money animation */}
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
          }
          .falling-money {
            position: absolute;
            top: -10%;
            animation-name: fall;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            text-shadow: 0 4px 6px rgba(0,0,0,0.15);
          }
        `}
      </style>

      {/* Falling Indian Money Container */}
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="falling-money font-extrabold drop-shadow-lg"
          style={{
            left: `${coin.left}vw`,
            animationDelay: `${coin.delay}s`,
            animationDuration: `${coin.duration}s`,
            fontSize: `${coin.size}rem`,
            color: coin.color, // Apply the realistic note color
          }}
        >
          {coin.symbol}
        </div>
      ))}

      {/* Center Logo and Text Card */}
      <div className="z-10 flex flex-col items-center p-10 rounded-3xl text-center">
        
        {/* Logo Image */}
        <div className="relative mb-4">
          {/* Glowing effect behind the logo */}
          <div className="absolute inset-0 bg-gray-500 blur-2xl opacity-40 rounded-full animate-pulse"></div>
          
          <img
            src="Logo.png" 
            alt="Leela Bazar Logo"
            className="relative w-42 h-42 md:w-44 md:h-44 rounded-full shadow-lg object-contain bg-white animate-bounce"
          />
        </div>
      <div className='w-full fixed bottom-3'>
      
        {/* Animated Gradient Text */}
        <h1 className="mt-4 text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-pink-600 to-blue-900 bg-[length:200%_auto] animate-pulse tracking-wide drop-shadow-md">
          Leela Bazar
        </h1>
        
        <p className="mt-2 text-md font-bold text-gray-700 uppercase tracking-widest">
          India's Fastest Updates
        </p>

        {/* Loading Indicator */}
        <div className="mt-4 md:hidden flex items-center gap-3 w-[50%] mx-auto text-lg font-bold text-blue-900 bg-white/10 px-6 py-3 rounded-full shadow-inner">
          <i className="fa-solid fa-spinner animate-spin text-pink-600 text-xl"></i>
          Loading Data...
        </div>
      </div>
      </div>
    </div>
  );
}