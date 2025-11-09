"use client";
import { useState } from "react";
import Image from "next/image";
import LogoLink from "../Components/LogoLink.jsx";
import Navbar from "../navBar/page.jsx";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Username: ${username}\nPassword: ${password}`);
  };

  return (
    <div className="flex min-h-screen">
      {/* <Navbar/> */}


      {/* RIGHT SIDE */}
      <div className="w-1/2 flex justify-center items-center bg-green-200 bg-gray-200">
        <form
          onSubmit={handleLogin}
          className="bg-gray-100 p-10 rounded-2xl shadow-lg w-96"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
            Sign Up
          </h2>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-green-600 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 mb-2">Username</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-green-600 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-gray-600 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-green-600 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="text-center mb-3">
            <Link className="text-green-600 hover:text-green-800 underline" href="/LoginPage">Already Signed Up? Click Here</Link>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200">
            Sign Up  Now!
          </button>
        </form>
      </div>

                  {/* LEFT SIDE */}
      <div className="w-1/2 bg-green-900 text-white flex flex-col p-10">
        {/* Logo at the top */}
        <div className="mt-12">
          <LogoLink scale={2} />
        </div>

        {/* Heading and description centered vertically */}
        <div className="flex flex-col justify-center items-center flex-1">
          <h1 className="text-6xl font-bold mb-4 text-center">Welcome to</h1>
          <h1 className="text-6xl font-bold mb-4 text-center">Housr Cherry</h1>
          <p className="text-lg text-gray-200 max-w-md text-center">
            Get coupons off your favourite brands by renting a property
          </p>
        </div>
      </div>

    </div>
  );
}
