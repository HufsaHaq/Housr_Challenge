"use client";
import { useState } from "react";
import LogoLink from "../Components/LogoLink.jsx";

export default function HousrCherryPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-500">
      <div className="mt-12">
        <LogoLink scale={2} />
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Sign Up
          </button>
          <button className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  menuContainer: {
    display: "flex",
    padding: "10px 20px",
    borderBottom: "1px solid #ccc",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
  },
  button: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#0070f3",
    color: "#fff",
    fontWeight: "bold",
  },
};