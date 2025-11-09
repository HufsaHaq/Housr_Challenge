"use client";
import { useState } from "react";
import LogoLink from "../Components/LogoLink.jsx";

import SpinningWheel from "../Components/SpinningWheel";
import Navbar from "../navBar/page.jsx";
// import InfiniteCarousel from '../Components/InfiniteCarousel';

export default function HousrCherryPage() {
  return (
<div className="flex flex-col items-center min-h-screen bg-green-500">
    <Navbar />
   <SpinningWheel />;
  {/* <InfiniteCarousel height={200} speed={1}/> */}

</div>
  );
}
