"use client";
import React from "react";

export default function PopupModal({
  show,
  onClose,
  title,
  children,
  onPurchase,
}) {
  if (!show) return null;

  return (
    <>
      {/* Transparent background */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Popup window */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-white rounded-2xl shadow-lg p-8 w-96 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-4 text-green-600">{title}</h2>
          <div className="text-gray-700 mb-6">{children}</div>

          {/* Two buttons */}
          <div className="flex justify-between space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={onPurchase}
              className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Purchase
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
