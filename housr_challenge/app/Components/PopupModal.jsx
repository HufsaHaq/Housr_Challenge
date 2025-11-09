"use client";
import React from "react";

export default function PopupModal({
  show,
  onClose,
  title,
  children,
  onPurchase, // callback for purchase
}) {
  if (!show) return null;

  return (
    <>
      {/* Background dimmer - light gray instead of black */}
      <div
        className="fixed inset-0 bg-gray-300 bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Popup window - bigger box */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="bg-white rounded-2xl shadow-lg p-8 w-96 max-h-[80vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-semibold mb-6 text-green-600">{title}</h2>
          <div className="text-gray-700 mb-6">{children}</div>

          {/* Two buttons side by side */}
          <div className="flex justify-between space-x-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={onPurchase}
              className="flex-1 py-3 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Purchase
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
