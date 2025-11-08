"use client";
import { useState } from "react";
import LogoLink from "../Components/LogoLink.jsx";
import InfiniteCarousel from '../Components/InfiniteCarousel';

export default function HousrCherryPage() {
  return (
<div className="flex flex-col items-center min-h-screen bg-green-500">
  {/* Logo at the top */}
  <div className="mt-4">
    <LogoLink scale={2} />
  </div>

  <div>
    Housr Cherry
  </div>

  {/* Menu in the center */}
  <div className="flex gap-4 mt-10">
    <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
      Sign Up
    </button>
    <button className="px-6 py-2 bg-white text-green-500 rounded hover:bg-gray-100 transition">
      Log In
    </button>
  </div>

  <InfiniteCarousel height={200} speed={1}/>

</div>
  );
}
