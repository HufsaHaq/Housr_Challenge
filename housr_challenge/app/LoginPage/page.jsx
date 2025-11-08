"use client";
import { useState } from "react";
import Image from "next/image";
import LogoLink from "../Components/LogoLink.jsx";
import Navbar from "../navBar/page.jsx";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Username: ${username}\nPassword: ${password}`);
  };

  return (
    <div className="flex min-h-screen">
      <Navbar/>
      {/* LEFT SIDE */}
      <div className="w-1/2 bg-green-900 text-white flex flex-col justify-center items-center p-10">
        <div className="text-center">
          {LogoLink()}
          <h1 className="text-4xl font-bold mt-6 mb-4 text-center">Welcome to Housr</h1>
          <p className="text-lg text-gray-200 max-w-md mx-auto">
            Find your perfect student accommodation with Housr — where comfort,
            convenience, and community come together.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-2xl shadow-lg w-96"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">
            Login
          </h2>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
