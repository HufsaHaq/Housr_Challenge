"use client";
import React, { useState } from "react";
import PopupModal from "../Components/PopupModal"; // ✅ import path (uses alias @)

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-green-700"
      >
        Show Details
      </button>

      <PopupModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="More Details"
      >
        <p>This is your detailed information inside the popup!</p>
      </PopupModal>
    </div>
  );
}